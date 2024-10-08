import * as fs from 'fs';
import * as glob from 'glob';
import * as ts from 'typescript';
import type {
  AdditionalPropertiesOrMethods,
  Comment,
  CtxArgument,
  HookInfo,
  Manifest,
} from './src/manifestTypes';

/**
 * Extracts JSDoc comments and tags from a TypeScript node.
 * @param node - The TypeScript node to extract JSDoc from.
 * @returns An object containing the comment text and a tag if found.
 */
function getJSDocCommentAndTag(
  node: ts.Node,
  sourceFile: ts.SourceFile,
): Comment | null {
  // Get all the JSDoc nodes associated with this node
  const jsDocNodes = node.getChildren(sourceFile).filter(ts.isJSDoc);

  if (jsDocNodes.length === 0) {
    return null;
  }

  const firstJsDocNode = jsDocNodes[0];

  const comment: Comment = {
    comment: (firstJsDocNode.comment || '').toString(),
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
    }
  }

  return comment;
}

/**
 * Extracts properties from a TypeLiteralNode and returns them as an object.
 *
 * @param typeLiteral - The TypeLiteralNode to extract properties from.
 * @param sourceFile - The source file being processed.
 * @returns An object representing the properties extracted from the TypeLiteralNode.
 */
function extractPropertiesFromTypeLiteral(
  typeLiteral: ts.TypeLiteralNode,
  sourceFile: ts.SourceFile,
): AdditionalPropertiesOrMethods {
  const additionalProps: AdditionalPropertiesOrMethods = {};

  for (const member of typeLiteral.members) {
    if (ts.isPropertySignature(member)) {
      const name = (member.name as ts.Identifier).text;
      const type = member.type?.getText(sourceFile) || 'unknown';
      const comment = getJSDocCommentAndTag(member, sourceFile);
      const location = {
        filePath: sourceFile.fileName,
        lineNumber:
          sourceFile.getLineAndCharacterOfPosition(member.getStart(sourceFile))
            .line + 1,
      };
      additionalProps[name] = { comment, location, type };
    }
  }

  return additionalProps;
}

function extractProperties(
  node: ts.TypeNode,
  sourceFile: ts.SourceFile,
  sharedCtxTypes: Partial<Record<string, AdditionalPropertiesOrMethods>>,
): AdditionalPropertiesOrMethods {
  if (ts.isTypeLiteralNode(node)) {
    return extractPropertiesFromTypeLiteral(node, sourceFile);
  }

  if (ts.isTypeReferenceNode(node)) {
    const referenceName = node.typeName.getText(sourceFile);

    const typeAlias = resolveTypeAlias(referenceName, sourceFile);

    if (typeAlias) {
      return extractProperties(typeAlias, sourceFile, sharedCtxTypes);
    }

    const additionalProperties = sharedCtxTypes[referenceName];

    if (!additionalProperties) {
      throw new Error(
        `Could not find reference to additional properties/methods of type ${referenceName}`,
      );
    }

    return { ...additionalProperties };
  }

  if (ts.isIntersectionTypeNode(node)) {
    let accumulator: AdditionalPropertiesOrMethods = {};

    for (const type of node.types) {
      accumulator = {
        ...accumulator,
        ...extractProperties(type, sourceFile, sharedCtxTypes),
      };
    }

    return accumulator;
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
function extractCtxTypeArgument(
  ctxTypeNode: ts.TypeNode,
  index: number,
  sourceFile: ts.SourceFile,
  sharedCtxTypes: Partial<Record<string, AdditionalPropertiesOrMethods>>,
): AdditionalPropertiesOrMethods | null {
  if (!ts.isTypeReferenceNode(ctxTypeNode)) {
    throw new Error('Expected a TypeReferenceNode');
  }

  const typeArgument = ctxTypeNode.typeArguments?.[index];

  if (!typeArgument) {
    return null;
  }

  try {
    return extractProperties(typeArgument, sourceFile, sharedCtxTypes);
  } catch (e) {
    throw new Error(`Parsing typed argument at index ${index}: ${e.message}`);
  }
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
  let resolvedType: ts.TypeNode | null = null;

  function visit(node: ts.Node) {
    if (ts.isTypeAliasDeclaration(node) && node.name.text === typeName) {
      resolvedType = node.type;
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return resolvedType;
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
  sharedCtxTypes: Partial<Record<string, AdditionalPropertiesOrMethods>>,
): CtxArgument | null {
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
        additionalProperties: extractCtxTypeArgument(
          type,
          paramsIndex,
          sourceFile,
          sharedCtxTypes,
        ),
        // Extract additional methods from the type arguments
        additionalMethods: extractCtxTypeArgument(
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
  sharedCtxTypes: Partial<Record<string, AdditionalPropertiesOrMethods>>,
): {
  ctxArgument: CtxArgument | null;
  nonCtxArguments: Array<{ name: string; typeName: string }>;
} {
  const nonCtxArguments: Array<{ name: string; typeName: string }> = [];
  let ctxArgument: CtxArgument | null = null;

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
  sharedCtxTypes: Partial<Record<string, AdditionalPropertiesOrMethods>>,
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
          const comment = getJSDocCommentAndTag(member, sourceFile);
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
              location: {
                filePath: filePath,
                lineNumber:
                  sourceFile.getLineAndCharacterOfPosition(
                    member.getStart(sourceFile),
                  ).line + 1,
              },
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

const extractPropertiesOnTypeInFilePath = (
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

  return extractProperties(typeNode as ts.TypeLiteralNode, sourceFile, {});
};

const sharedCtxTypes = {
  ItemFormAdditionalProperties: extractPropertiesOnTypeInFilePath(
    'src/ctx/commonExtras/itemForm.ts',
    'ItemFormAdditionalProperties',
  ),
  ItemFormAdditionalMethods: extractPropertiesOnTypeInFilePath(
    'src/ctx/commonExtras/itemForm.ts',
    'ItemFormAdditionalMethods',
  ),
  FieldAdditionalProperties: extractPropertiesOnTypeInFilePath(
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
    properties: extractPropertiesOnTypeInFilePath(
      'src/ctx/base.ts',
      'BaseProperties',
    ),
    methods: extractPropertiesOnTypeInFilePath(
      'src/ctx/base.ts',
      'BaseMethods',
    ),
  },
  selfResizingPluginFrameCtxSizingUtilities: extractPropertiesOnTypeInFilePath(
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
