import { manifest } from 'datocms-plugin-sdk';
import { PropertiesOrMethodsGroup } from 'datocms-plugin-sdk/dist/types/manifestTypes';
import React, { useState } from 'react';
import { Button, useCtx } from '..';
import s from './styles.module.css.json';

const baseUrl =
  'https://github.com/datocms/plugins-sdk/blob/master/packages/sdk/';

function copyTextToClipboard(text: string) {
  const textArea = document.createElement('textarea');
  textArea.style.position = 'fixed';
  textArea.style.top = '0';
  textArea.style.left = '0';
  textArea.style.width = '2em';
  textArea.style.height = '2em';
  textArea.style.padding = '0';
  textArea.style.border = 'none';
  textArea.style.outline = 'none';
  textArea.style.boxShadow = 'none';
  textArea.style.background = 'transparent';
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    document.execCommand('copy');
  } catch (err) {
    // NOP
  }

  document.body.removeChild(textArea);
}

function capitalize(input: string): string {
  const transformed = input
    .replace(/([A-Z])/g, ' $1')
    .trim()
    .toLowerCase();
  return transformed.charAt(0).toUpperCase() + transformed.slice(1);
}

const ExpandablePane = ({ children, label }: any) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={s.panel}>
      <button
        type="button"
        className={s.panelHandle}
        onClick={() => setOpen((open) => !open)}
      >
        {label}
      </button>
      {open && <div className={s.panelBody}>{children}</div>}
    </div>
  );
};

export function Group({
  group,
}: { group: PropertiesOrMethodsGroup }): JSX.Element {
  const ctx = useCtx();

  const handleCopy = (text: string) => {
    copyTextToClipboard(text);
    (ctx as any).notice('Copied to clipboard!');
  };

  const handleRun = (example: string) => {
    Function(
      `
        "use strict";
        return(
          async function(ctx) {
            try {
              ${example}
            } catch(e) {
              console.error(e);
              await ctx.alert('Execution failed! See console for errors!');
            }
          }
        )
      `,
    )()(ctx);
  };

  return (
    <ExpandablePane
      label={group.name ? capitalize(group.name) : 'Properties and methods'}
      key={group.name}
    >
      {group.comment?.markdownText && (
        <div className={s.groupDescription}>{group.comment?.markdownText}</div>
      )}
      <div className={s.propertyGroup}>
        {Object.entries(group.items).map(([name, info]) => (
          <div key={name} className={s.propertyOrMethod}>
            <div className={s.propertyOrMethodBody}>
              <a
                className={s.propertyOrMethodName}
                href={`${baseUrl}${info.location.filePath}#L${info.location.lineNumber}`}
                target="_blank"
                rel="noreferrer"
              >
                {name}
                {info.type.startsWith('(') ? info.type : `: ${info.type}`}
              </a>

              <div>{info.comment?.markdownText}</div>
            </div>
            {!info.type.startsWith('(') && (
              <div className={s.propertyOrMethodExample}>
                <pre>{JSON.stringify((ctx as any)[name], null, 2)}</pre>
                <div className={s.propertyOrMethodExampleActions}>
                  <Button
                    type="button"
                    buttonSize="xxs"
                    onClick={handleCopy.bind(
                      null,
                      JSON.stringify((ctx as any)[name], null, 2),
                    )}
                  >
                    Copy value
                  </Button>
                </div>
              </div>
            )}
            {info.comment?.example && (
              <div className={s.propertyOrMethodExample}>
                <pre>{info.comment.example}</pre>
                <div className={s.propertyOrMethodExampleActions}>
                  <Button
                    type="button"
                    buttonSize="xxs"
                    buttonType="primary"
                    onClick={handleRun.bind(null, info.comment.example)}
                  >
                    Run example
                  </Button>
                  <Button
                    type="button"
                    buttonSize="xxs"
                    onClick={handleCopy.bind(null, info.comment.example)}
                  >
                    Copy example
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </ExpandablePane>
  );
}

const sortByNameWithNullOnTop = (
  a: { name?: string },
  b: { name?: string },
): number => {
  // If both names are null, maintain their original order
  if (!a.name && !b.name) return 0;

  // If a's name is null, it should come first
  if (!a.name) return -1;

  // If b's name is null, it should come first
  if (!b.name) return 1;

  // If neither name is null, use localeCompare for alphabetical sorting
  return a.name.localeCompare(b.name);
};

export function ContextInspector(): JSX.Element | null {
  const ctx = useCtx();

  const hook = manifest.hooks[ctx.mode];

  if (!hook.ctxArgument) {
    return null;
  }

  const specific = [
    ...(hook.ctxArgument.additionalProperties || []),
    ...(hook.ctxArgument.additionalMethods || []),
  ].sort(sortByNameWithNullOnTop);

  const base = [
    ...manifest.baseCtx.properties,
    ...manifest.baseCtx.methods,
  ].sort(sortByNameWithNullOnTop);

  return (
    <div className={s.inspector}>
      {specific.length > 0 && (
        <ExpandablePane label="Hook-specific">
          {specific.map((group) => (
            <Group key={group.name} group={group} />
          ))}
        </ExpandablePane>
      )}
      <ExpandablePane label="Available on every hook">
        {base.map((group) => (
          <Group key={group.name} group={group} />
        ))}
      </ExpandablePane>
    </div>
  );
}
