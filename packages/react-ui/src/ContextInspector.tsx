import { manifest } from 'datocms-plugin-sdk';
import React, { useCallback } from 'react';
import Button from 'ui/Button';
import CodeSnippet from 'ui/CodeSnippet';
import type { HeadingLevel } from 'ui/Heading';
import Heading from 'ui/Heading';
import { useHostServices } from 'ui/HostServicesProvider';
import { useTranslation } from 'ui/i18n';
import SidebarPanel from 'ui/SidebarPanel';
import { useCtx } from './ctx';

// The SDK exports the types of the manifest only from a path inside its
// `dist`. The type of `manifest` gives them without that path.
type PropertiesOrMethodsGroup =
  (typeof manifest)['baseCtx']['properties'][number];
type PropertyOrMethod = PropertiesOrMethodsGroup['items'][string];

const sourceBaseUrl =
  'https://github.com/datocms/plugins-sdk/blob/master/packages/sdk/';

// The height of the box of a value or of an example, before it scrolls
const SNIPPET_MAX_HEIGHT = 240;

export type ContextInspectorProps = {
  /**
   * The level of the two headings of the inspector, after the headings
   * around it. The title of each group is one level below.
   * @default 2
   */
  titleLevel?: Exclude<HeadingLevel, 6>;
};

/** "PluginProperties" gives "Plugin properties" */
function humanize(name: string): string {
  const words = name
    .replace(/([A-Z])/g, ' $1')
    .trim()
    .toLowerCase();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

function byNameWithUnnamedFirst(
  a: PropertiesOrMethodsGroup,
  b: PropertiesOrMethodsGroup,
): number {
  if (!a.name || !b.name) {
    return Number(Boolean(a.name)) - Number(Boolean(b.name));
  }
  return a.name.localeCompare(b.name);
}

// The type of a method of the manifest is its signature: "(…) => …", or
// "<T>(…) => …" for a generic method.
function isMethod(item: PropertyOrMethod): boolean {
  return item.type.startsWith('(') || item.type.startsWith('<');
}

/**
 * Runs an example of the manifest. An example is the body of an async
 * function that reads `ctx`, thus it runs with the `ctx` of the plugin.
 */
function useRunExample() {
  const ctx = useCtx();
  const { alert } = useHostServices();

  return useCallback(
    async (example: string) => {
      try {
        const run = new Function(
          'ctx',
          `"use strict"; return (async () => {\n${example}\n})();`,
        );
        await run(ctx);
      } catch (error) {
        console.error(error);
        alert({ id: 'contextInspector.runFailed' });
      }
    },
    [ctx, alert],
  );
}

function Item({ name, item }: { name: string; item: PropertyOrMethod }) {
  const ctx = useCtx() as unknown as Record<string, unknown>;
  const runExample = useRunExample();
  const method = isMethod(item);
  const example = item.comment?.example;

  return (
    <li className="ContextInspector__item">
      <a
        className="ContextInspector__signature"
        href={`${sourceBaseUrl}${item.location.filePath}#L${item.location.lineNumber}`}
        target="_blank"
        rel="noreferrer"
      >
        <span className="ContextInspector__name">{name}</span>
        <span className="ContextInspector__type">
          {method ? item.type : `: ${item.type}`}
        </span>
      </a>
      {item.comment?.markdownText && (
        <p className="ContextInspector__description">
          {item.comment.markdownText}
        </p>
      )}
      {!method && (
        <CodeSnippet
          code={JSON.stringify(ctx[name], null, 2) ?? 'undefined'}
          ariaLabel={{ id: 'contextInspector.value', values: { name } }}
          maxHeight={SNIPPET_MAX_HEIGHT}
        />
      )}
      {example && (
        <>
          <CodeSnippet
            code={example}
            ariaLabel={{ id: 'contextInspector.example', values: { name } }}
            maxHeight={SNIPPET_MAX_HEIGHT}
          />
          <Button
            className="ContextInspector__run"
            size="micro"
            label={{ id: 'contextInspector.runExample' }}
            onClick={() => runExample(example)}
          />
        </>
      )}
    </li>
  );
}

function Group({
  group,
  titleLevel,
}: {
  group: PropertiesOrMethodsGroup;
  titleLevel: HeadingLevel;
}) {
  return (
    <SidebarPanel
      title={
        group.name
          ? humanize(group.name)
          : { id: 'contextInspector.untitledGroup' }
      }
      titleLevel={titleLevel}
      startOpen={false}
    >
      {group.comment?.markdownText && (
        <p className="ContextInspector__description">
          {group.comment.markdownText}
        </p>
      )}
      <ul className="ContextInspector__items">
        {Object.entries(group.items).map(([name, item]) => (
          <Item key={name} name={name} item={item} />
        ))}
      </ul>
    </SidebarPanel>
  );
}

function Part({
  title,
  groups,
  titleLevel,
}: {
  title: string;
  groups: PropertiesOrMethodsGroup[];
  titleLevel: Exclude<HeadingLevel, 6>;
}) {
  return (
    <div className="ContextInspector__part">
      <Heading
        level={titleLevel}
        className="ContextInspector__title group-title"
      >
        {title}
      </Heading>
      {groups.map((group, index) => (
        <Group
          key={group.name ?? index}
          group={group}
          titleLevel={(titleLevel + 1) as HeadingLevel}
        />
      ))}
    </div>
  );
}

/**
 * Shows the `ctx` of the hook of the nearest `Canvas`: the properties with
 * their values and the methods, grouped as in the SDK, with a link to the
 * source of each one. A tool for the development of a plugin.
 */
export default function ContextInspector({
  titleLevel = 2,
}: ContextInspectorProps) {
  const ctx = useCtx();
  const { t } = useTranslation();

  // A host that is newer than the SDK of the plugin can have a hook that the
  // manifest does not know.
  const ctxArgument = manifest.hooks[ctx.mode]?.ctxArgument;

  if (!ctxArgument) {
    return null;
  }

  const specific = [
    ...(ctxArgument.additionalProperties ?? []),
    ...(ctxArgument.additionalMethods ?? []),
  ].sort(byNameWithUnnamedFirst);

  const base = [
    ...manifest.baseCtx.properties,
    ...manifest.baseCtx.methods,
  ].sort(byNameWithUnnamedFirst);

  return (
    <div className="ContextInspector">
      {specific.length > 0 && (
        <Part
          title={t('contextInspector.hookSpecific')}
          groups={specific}
          titleLevel={titleLevel}
        />
      )}
      <Part
        title={t('contextInspector.everyHook')}
        groups={base}
        titleLevel={titleLevel}
      />
    </div>
  );
}
