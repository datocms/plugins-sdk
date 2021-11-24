/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import s from './styles.module.css.json';

const baseUrl =
  'https://github.com/datocms/plugins-sdk/blob/v0.2/packages/sdk/src/types.ts';

function addFinalPeriod(text: string) {
  if (['!', '.'].includes(text[text.length - 1])) {
    return text;
  }

  return `${text}.`;
}

function findChildrenById(manifest: any, id: string) {
  return manifest.children.find((child: any) => child.id === id);
}

function findShortText(signature: any) {
  return (
    (signature.comment && addFinalPeriod(signature.comment.shortText)) || null
  );
}

function findFirstTag(signature: any, tagName: string): string | null {
  if (!signature.comment || !signature.comment.tags) {
    return null;
  }

  const tagNode = signature.comment.tags.find(
    (tag: any) => tag.tag === tagName,
  );

  if (!tagNode) {
    return null;
  }

  return tagNode.text;
}

function findExample(signature: any) {
  const example = findFirstTag(signature, 'example');

  if (!example) {
    return null;
  }

  const lines = example
    .split(/\n/)
    .filter((l, i, all) => l.length !== 0 || (i !== 0 && i !== all.length - 1));

  const spacesPerLine = lines.map((line) => {
    const spaces = line.match(/^\s*/);
    return spaces ? spaces[0].length : 0;
  });

  const commonIndentation = Math.min(...spacesPerLine);

  const result = lines
    .map((line) => line.substring(commonIndentation))
    .join('\n');

  return result;
}

function buildCtx(manifest: any, definition: any) {
  if (definition.type.type === 'intersection') {
    let result: any[] = [];

    definition.type.types.forEach((elementInIntersection: any) => {
      if (elementInIntersection.type === 'reference') {
        const innerDefinition = findChildrenById(
          manifest,
          elementInIntersection.id,
        );
        result = [...result, buildCtx(manifest, innerDefinition)];
      }
    });

    return result.flat().filter((x) => x);
  }

  if (definition.type.type === 'reflection') {
    const properties = definition.type.declaration.children.filter(
      (child: any) => !['mode', 'getSettings'].includes(child.name),
    );

    if (properties.length === 0) {
      return null;
    }

    return {
      name: definition.name,
      description: findShortText(definition),
      properties: properties.map((child: any) => {
        if (
          child.type &&
          child.type.declaration &&
          child.type.declaration.signatures
        ) {
          child.signatures = child.type.declaration.signatures;
        }

        if (child.signatures) {
          const signature = child.signatures[0];
          return {
            name: child.name,
            type: 'function',
            description: findShortText(signature),
            example: findExample(signature),
            group: definition.name,
            lineNumber: child.sources[0].line,
          };
        }

        return {
          name: child.name,
          type: 'property',
          description: findShortText(child),
          example: findExample(child),
          groupDescription: findShortText(definition),
          group: definition.name,
          lineNumber: child.sources[0].line,
        };
      }),
    };
  }

  throw new Error('fuck');
}

const ExpandablePane = ({ children, label }: any) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={s.panel}>
      <button
        className={s.panelHandle}
        onClick={() => setOpen((open) => !open)}
      >
        {label}
      </button>
      {open && <div className={s.panelBody}>{children}</div>}
    </div>
  );
};

export function ContextInspector({
  ctx,
}: {
  ctx: { mode: string };
}): JSX.Element {
  const [groups, setGroups] = useState<any[] | null>(null);

  useEffect(() => {
    const runner = async () => {
      const response = await fetch(
        'https://unpkg.com/datocms-plugins-sdk@next/types.json',
      );
      const manifest = await response.json();

      const connectParameters = manifest.children.find(
        (child: any) => child.name === 'FullConnectParameters',
      );

      const hook = connectParameters.type.declaration.children.find(
        (hook: any) => hook.signatures[0].name === ctx.mode,
      );

      const signature = hook.signatures[0];
      const ctxParameter = signature.parameters.find(
        (p: any) => p.name === 'ctx',
      );

      setGroups(
        buildCtx(
          manifest,
          findChildrenById(manifest, ctxParameter.type.id),
        ) as any[],
      );
    };

    runner();
  }, [setGroups]);

  return (
    <div className={s.inspector}>
      {groups &&
        groups.map((group) => {
          const name = group.name
            .replace('AdditionalMethods', 'Methods')
            .replace('AdditionalProperties', 'Properties')
            .replace('Methods', ' methods')
            .replace('Properties', ' properties');

          return (
            <ExpandablePane label={`${name}`} key={name}>
              <div className={s.groupDescription}>{group.description}</div>
              <div className={s.propertyGroup}>
                {(group.properties || []).map((item: any) => (
                  <div key={item.name} className={s.propertyOrMethod}>
                    <div className={s.propertyOrMethodBody}>
                      <a
                        className={s.propertyOrMethodName}
                        href={`${baseUrl}#L${item.lineNumber}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {item.name}
                        {item.type === 'function' ? '()' : ''}
                      </a>

                      <div>{item.description}</div>
                    </div>
                    {item.type === 'property' && (
                      <pre className={s.propertyOrMethodExample}>
                        {JSON.stringify((ctx as any)[item.name], null, 2)}
                      </pre>
                    )}
                    {item.example && (
                      <pre className={s.propertyOrMethodExample}>
                        {item.example}
                      </pre>
                    )}
                  </div>
                ))}
              </div>
            </ExpandablePane>
          );
        })}
    </div>
  );
}
