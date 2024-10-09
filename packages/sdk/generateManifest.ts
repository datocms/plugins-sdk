import * as glob from 'glob';
import * as fs from 'node:fs';
import * as ts from 'typescript';
import type {
  CodeLocation,
  Comment,
  CtxArgument,
  HookInfo,
  Manifest,
  PropertiesOrMethodsGroup,
  PropertyOrMethod,
} from './src/manifestTypes';

type SharedCtxTypes = Partial<Record<string, PropertiesOrMethodsGroup>>;

/**
 * Extracts JSDoc comments and tags from a TypeScript node.
 * @param node - The TypeScript node to extract JSDoc from.
 * @returns An object containing the comment text and a tag if found.
 */
function extractCommentFromNode(
  node: ts.Node,
  sourceFile: ts.SourceFile,
): Comment | undefined {
  // Get all the JSDoc nodes associated with this node
  const jsDocNodes = node.getChildren(sourceFile).filter(ts.isJSDoc);

  if (jsDocNodes.length === 0) {
    return undefined;
  }

  const firstJsDocNode = jsDocNodes[0];

  const text = (firstJsDocNode.comment || '').toString();

  const comment: Comment = {
    markdownText: text.endsWith('.') ? text : `${text}.`,
  };

  if (firstJsDocNode.tags) {
    for (const tag of firstJsDocNode.tags) {
      if (tag.tagName.text === 'tag') {
        comment.tag = tag.comment?.toString();
      }
      if (tag.tagName.text === 'example') {
        comment.example = tag.comment
          ?.toString()
          .replace(/(^```[^\n]*\n)|(\n```$)/g, '');
      }
      if (tag.tagName.text === 'deprecated') {
        comment.deprecatedMarkdownText = tag.comment?.toString();
      }
    }
  }

  return comment;
}

function extractNodeLocation(
  node: ts.Node,
  sourceFile: ts.SourceFile,
): CodeLocation {
  return {
    filePath: sourceFile.fileName,
    lineNumber:
      sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line +
      1,
  };
}

/**
 * Extracts properties from a TypeLiteralNode and returns them as an object.
 *
 * @param typeLiteral - The TypeLiteralNode to extract properties from.
 * @param sourceFile - The source file being processed.
 * @returns An object representing the properties extracted from the TypeLiteralNode.
 */
function extractAnonymousGroupFromTypeLiteral(
  typeLiteral: ts.TypeLiteralNode,
  sourceFile: ts.SourceFile,
): PropertiesOrMethodsGroup {
  const items: Record<string, PropertyOrMethod> = {};

  for (const member of typeLiteral.members) {
    if (ts.isPropertySignature(member)) {
      const name = (member.name as ts.Identifier).text;
      const type = member.type?.getText(sourceFile) || 'unknown';
      const comment = extractCommentFromNode(member, sourceFile);
      const location = extractNodeLocation(member, sourceFile);
      items[name] = { comment, location, type };
    }
  }

  return { items };
}

function mergeUnnamedGroups(
  groups: PropertiesOrMethodsGroup[],
): PropertiesOrMethodsGroup[] {
  const mergedItems: Record<string, PropertyOrMethod> = {}; // To collect merged items

  const filteredGroups = groups.filter((group) => {
    // If group has no name and no comment, merge its items
    if (!group.name && !group.comment) {
      Object.assign(mergedItems, group.items); // Merge the items
      return false; // Exclude this group from the final array
    }
    return true; // Keep the group if it has a name or comment
  });

  // If there were any unnamed/uncommented groups, add the merged result as a new group
  if (Object.keys(mergedItems).length > 0) {
    filteredGroups.push({
      items: mergedItems, // Merged items from unnamed/uncommented groups
    });
  }

  return filteredGroups;
}

function extractGroupsFromType(
  node: ts.TypeNode,
  sourceFile: ts.SourceFile,
  sharedCtxTypes: SharedCtxTypes,
): PropertiesOrMethodsGroup[] {
  if (ts.isTypeLiteralNode(node)) {
    return [extractAnonymousGroupFromTypeLiteral(node, sourceFile)];
  }

  if (ts.isTypeReferenceNode(node)) {
    const referenceName = node.typeName.getText(sourceFile);

    const typeAliasDeclaration = findTypeAliasDeclaration(
      referenceName,
      sourceFile,
    );

    if (typeAliasDeclaration) {
      const groups = extractGroupsFromType(
        typeAliasDeclaration.type,
        sourceFile,
        sharedCtxTypes,
      );

      if (groups.length === 1) {
        const comment = extractCommentFromNode(
          typeAliasDeclaration,
          sourceFile,
        );

        return [{ name: referenceName, comment, ...groups[0] }];
      }

      return mergeUnnamedGroups(groups);
    }

    const additionalProperties = sharedCtxTypes[referenceName];

    if (!additionalProperties) {
      throw new Error(
        `Could not find reference to additional properties/methods of type ${referenceName}`,
      );
    }

    return [additionalProperties];
  }

  if (ts.isIntersectionTypeNode(node)) {
    return node.types.flatMap((type) =>
      extractGroupsFromType(type, sourceFile, sharedCtxTypes),
    );
  }

  throw new Error(
    'Expected argument to be either a literal or an intersection!',
  );
}

/**
 * Extracts additional parameters from a context type node.
 * @param ctxTypeNode - The context type node to analyze.
 * @param index - The index of the type argument to extract.
 * @param sourceFile - The source file being processed.
 * @returns A record of additional parameters extracted from the context type.
 *
 * Example:
 * - For a context type like `Ctx<MyParams>`, if `MyParams` contains `{ param1: string }`,
 *   this function would return `{ param1: { ... } }`.
 */
function extractGroupsFromNthTypeArgument(
  ctxTypeNode: ts.TypeNode,
  index: number,
  sourceFile: ts.SourceFile,
  sharedCtxTypes: SharedCtxTypes,
): PropertiesOrMethodsGroup[] {
  if (!ts.isTypeReferenceNode(ctxTypeNode)) {
    throw new Error('Expected a TypeReferenceNode');
  }

  const typeArgument = ctxTypeNode.typeArguments?.[index];

  if (!typeArgument) {
    return [];
  }

  try {
    return extractGroupsFromType(typeArgument, sourceFile, sharedCtxTypes);
  } catch (e) {
    throw new Error(`Parsing typed argument at index ${index}: ${e.message}`);
  }
}

function findTypeAliasDeclaration(
  typeName: string,
  sourceFile: ts.SourceFile,
): ts.TypeAliasDeclaration | null {
  let resolvedType: ts.TypeAliasDeclaration | null = null;

  function visit(node: ts.Node) {
    if (ts.isTypeAliasDeclaration(node) && node.name.text === typeName) {
      resolvedType = node;
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return resolvedType;
}

/**
 * Resolves a type alias to its corresponding type node.
 * @param typeName - The name of the type alias to resolve.
 * @param sourceFile - The source file being processed.
 * @returns The resolved type node or null if not found.
 */
function resolveTypeAlias(
  typeName: string,
  sourceFile: ts.SourceFile,
): ts.TypeNode | null {
  return findTypeAliasDeclaration(typeName, sourceFile)?.type ?? null;
}

/**
 * Extracts context argument details from the given type node.
 *
 * This function checks if the ctx argument is of type 'Ctx' or 'SelfResizingPluginFrameCtx'.
 * It returns the corresponding ctxArgument object with additional parameters and methods
 * if applicable.
 *
 * Example input:
 * - If the ctx type is `SelfResizingPluginFrameCtx`, it will extract its structure
 *   and provide relevant additional parameters.
 *
 * @param type - The TypeNode representing the ctx argument type.
 * @param typeName - The name of the type as a string.
 * @param sourceFile - The source file being analyzed.
 * @param filePath - The path of the file being processed for error reporting.
 * @returns An object representing the context argument or null if not applicable.
 */
function extractCtxArgument(
  type: ts.TypeNode,
  typeName: string,
  sourceFile: ts.SourceFile,
  sharedCtxTypes: SharedCtxTypes,
): CtxArgument | undefined {
  // Define mapping of context types to their parameter indices
  const ctxTypes: Record<string, [number, number]> = {
    Ctx: [0, 1],
    SelfResizingPluginFrameCtx: [1, 2],
    ImposedSizePluginFrameCtx: [1, 2],
  };

  for (const [ctxType, [paramsIndex, methodsIndex]] of Object.entries(
    ctxTypes,
  )) {
    if (!typeName.startsWith(ctxType)) {
      continue;
    }

    try {
      return {
        type: ctxType,
        // Extract additional parameters from the type arguments
        additionalProperties: extractGroupsFromNthTypeArgument(
          type,
          paramsIndex,
          sourceFile,
          sharedCtxTypes,
        ),
        // Extract additional methods from the type arguments
        additionalMethods: extractGroupsFromNthTypeArgument(
          type,
          methodsIndex,
          sourceFile,
          sharedCtxTypes,
        ),
      };
    } catch (e) {
      throw new Error(`Parsing ${typeName}: ${e.message}`);
    }
  }

  // Attempt to resolve the type alias
  const resolvedTypeNode = resolveTypeAlias(typeName, sourceFile);

  if (!resolvedTypeNode) {
    throw new Error(`Could not find type alias for ${typeName}`);
  }

  // Get the text of the resolved type
  const resolvedTypeName = resolvedTypeNode.getText(sourceFile);

  return extractCtxArgument(
    resolvedTypeNode,
    resolvedTypeName,
    sourceFile,
    sharedCtxTypes,
  );
}

/**
 * Extracts arguments from the provided parameters of a hook function.
 *
 * This function iterates through the parameters of a hook and determines which are
 * non-context arguments and which are the context argument (usually named 'ctx').
 *
 * Example input:
 * - For a hook with parameters like `(field: Field, ctx: Ctx)`, this will separate
 *   `field` as a non-context argument and identify `ctx` as the context argument.
 *
 * @param parameters - The list of parameters declared in a hook function.
 * @param sourceFile - The source file being analyzed.
 * @param filePath - The path of the file being processed for error reporting.
 * @returns An object containing the ctxArgument and an array of non-ctx arguments.
 */
function extractArguments(
  parameters: ts.NodeArray<ts.ParameterDeclaration>,
  sourceFile: ts.SourceFile,
  sharedCtxTypes: SharedCtxTypes,
): {
  ctxArgument?: CtxArgument;
  nonCtxArguments: Array<{ name: string; typeName: string }>;
} {
  const nonCtxArguments: Array<{ name: string; typeName: string }> = [];
  let ctxArgument: CtxArgument | undefined = undefined;

  for (const param of parameters) {
    const paramName = (param.name as ts.Identifier).text;
    const { type } = param;

    if (!type) {
      throw new Error(`Missing type for parameter "${paramName}" in hook`);
    }

    const typeName = type.getText(sourceFile) || 'unknown';

    if (paramName === 'ctx') {
      ctxArgument = extractCtxArgument(
        type,
        typeName,
        sourceFile,
        sharedCtxTypes,
      );
    } else {
      nonCtxArguments.push({ name: paramName, typeName });
    }
  }

  return { ctxArgument, nonCtxArguments };
}

/**
 * Processes a TypeScript file to extract hook information.
 * @param filePath - The path to the TypeScript file.
 * @returns An object containing hook information or null if no hook found.
 */
function processFile(
  filePath: string,
  sharedCtxTypes: SharedCtxTypes,
): HookInfo {
  const sourceFile = ts.createSourceFile(
    filePath,
    fs.readFileSync(filePath).toString(),
    ts.ScriptTarget.Latest,
  );

  let hookInfo: HookInfo | null = null;

  // Traverse the AST
  function visit(node: ts.Node) {
    if (ts.isTypeAliasDeclaration(node) && node.name.text.endsWith('Hook')) {
      const hookType = node.type as ts.TypeLiteralNode;

      for (const member of hookType.members) {
        if (
          ts.isPropertySignature(member) &&
          member.type &&
          ts.isFunctionTypeNode(member.type)
        ) {
          const comment = extractCommentFromNode(member, sourceFile);
          const functionName = (member.name as ts.Identifier).text;

          try {
            const { ctxArgument, nonCtxArguments } = extractArguments(
              member.type.parameters,
              sourceFile,
              sharedCtxTypes,
            );
            const returnType = member.type.type?.getText(sourceFile) || 'void';

            hookInfo = {
              name: functionName,
              comment,
              nonCtxArguments,
              ctxArgument,
              returnType,
              location: extractNodeLocation(member, sourceFile),
            };
          } catch (error) {
            throw new Error(
              `Error processing function "${functionName}": ${error.message}`,
            );
          }
        }
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  if (!hookInfo) {
    throw new Error(`Could not find a hook in ${filePath}`);
  }

  return hookInfo;
}

const extractGroupsFromTypeInFilePath = (
  filePath: string,
  typeName: string,
) => {
  const sourceFile = ts.createSourceFile(
    filePath,
    fs.readFileSync(filePath).toString(),
    ts.ScriptTarget.Latest,
  );

  const typeNode = resolveTypeAlias(typeName, sourceFile);

  if (!typeNode) {
    throw new Error(`Could not find type "${typeName}" in file ${filePath}`);
  }

  return extractGroupsFromType(typeNode as ts.TypeLiteralNode, sourceFile, {});
};

const extractGroupFromTypeInFilePath = (filePath: string, typeName: string) => {
  const sourceFile = ts.createSourceFile(
    filePath,
    fs.readFileSync(filePath).toString(),
    ts.ScriptTarget.Latest,
  );

  const typeAliasDeclaration = findTypeAliasDeclaration(typeName, sourceFile);

  if (!typeAliasDeclaration) {
    throw new Error(`Could not find type "${typeName}" in file ${filePath}`);
  }

  const groups = extractGroupsFromType(
    typeAliasDeclaration.type as ts.TypeLiteralNode,
    sourceFile,
    {},
  );

  if (groups.length !== 1) {
    throw new Error(
      `Expected exactly one group in type "${typeName}" in file ${filePath}`,
    );
  }

  const comment = extractCommentFromNode(typeAliasDeclaration, sourceFile);

  return { name: typeName, comment, ...groups[0] };
};

const sharedCtxTypes: SharedCtxTypes = {
  ItemFormAdditionalProperties: extractGroupFromTypeInFilePath(
    'src/ctx/commonExtras/itemForm.ts',
    'ItemFormAdditionalProperties',
  ),
  ItemFormAdditionalMethods: extractGroupFromTypeInFilePath(
    'src/ctx/commonExtras/itemForm.ts',
    'ItemFormAdditionalMethods',
  ),
  FieldAdditionalProperties: extractGroupFromTypeInFilePath(
    'src/ctx/commonExtras/field.ts',
    'FieldAdditionalProperties',
  ),
};

// Use glob to dynamically retrieve all .ts files from src/hooks/ folder
const hookFiles = glob.sync('src/hooks/*.ts');

// Process each file and extract hook info
const hooks = hookFiles.map((file) => processFile(file, sharedCtxTypes));

const manifest: Manifest = {
  hooks: Object.fromEntries(hooks.map((hook) => [hook.name, hook])),
  baseCtx: {
    properties: extractGroupsFromTypeInFilePath(
      'src/ctx/base.ts',
      'BaseProperties',
    ),
    methods: extractGroupsFromTypeInFilePath('src/ctx/base.ts', 'BaseMethods'),
  },
  selfResizingPluginFrameCtxSizingUtilities: extractGroupFromTypeInFilePath(
    'src/ctx/commonExtras/sizing.ts',
    'SizingUtilities',
  ),
};

fs.writeFileSync('manifest.json', JSON.stringify(manifest, null, 2), 'utf-8');

fs.writeFileSync(
  'src/manifest.ts',
  `import type { Manifest } from './manifestTypes';

export const manifest: Manifest = ${JSON.stringify(manifest, null, 2)};
`,
  'utf-8',
);
