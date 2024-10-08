import React, { useState } from 'react';
import { Button, useCtx } from '..';
import s from './styles.module.css.json';
import { manifest } from 'datocms-plugin-sdk';

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

export function ContextInspector(): JSX.Element | null {
  const ctx = useCtx();

  const hook = manifest.hooks[ctx.mode];

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

  if (!hook.ctxArgument) {
    return null;
  }

  const properties = {
    name: 'Available properties',
    type: 'properties',
    properties: {
      ...manifest.baseCtx.properties,
      ...hook.ctxArgument.additionalProperties,
    },
  };

  const methods = {
    name: 'Available methods',
    type: 'methods',
    properties: {
      ...manifest.baseCtx.methods,
      ...hook.ctxArgument.additionalMethods,
    },
  };

  return (
    <div className={s.inspector}>
      {[properties, methods].map((group) => {
        return (
          <ExpandablePane label={`${group.name}`} key={group.name}>
            <div className={s.propertyGroup}>
              {Object.entries(group.properties).map(([name, info]) => (
                <div key={name} className={s.propertyOrMethod}>
                  <div className={s.propertyOrMethodBody}>
                    <a
                      className={s.propertyOrMethodName}
                      href={`${baseUrl}${info.location.filePath}#L${info.location.lineNumber}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {name}
                      {group.type === 'methods' ? '()' : ''}
                    </a>

                    <div>{info.comment?.comment}</div>
                  </div>
                  {group.type === 'properties' && (
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
      })}
    </div>
  );
}
