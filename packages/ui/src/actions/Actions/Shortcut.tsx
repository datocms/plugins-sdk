import React, { Fragment } from 'react';
import { useTranslation } from '../../i18n';
import { useAction } from './registry';
import { type ActionShortcut, isMac, strokeLabels, toList } from './shortcuts';

export type ShortcutProps =
  /** The keys of an action of the registry */
  | {
      /** The id of the action. Without keys, nothing shows. */
      action: string;
      keys?: never;
    }
  /** Keys with no action */
  | {
      /** The keys, or a list of alternatives */
      keys: ActionShortcut | ActionShortcut[];
      action?: never;
    };

/**
 * The keys of a shortcut, drawn as small keycaps: ⌘ ⇧ ⌥ on a Mac, Ctrl
 * Shift Alt on the other systems. "then" separates the keys of a sequence,
 * "or" the alternatives. A screen reader reads a sentence with the names
 * of the keys.
 */
export function Shortcut(props: ShortcutProps) {
  const { t } = useTranslation();
  const action = useAction(props.action);
  const shortcuts = props.keys ? toList(props.keys) : (action?.shortcuts ?? []);

  if (shortcuts.length === 0) {
    return null;
  }

  const mac = isMac();
  const alternatives = shortcuts.map((shortcut) => strokeLabels(shortcut, mac));
  const then = t('shortcut.then');
  const or = t('shortcut.or');
  const spoken = alternatives
    .map((strokes) =>
      strokes
        .map((keys) => keys.map((key) => key.spoken).join('+'))
        .join(` ${then} `),
    )
    .join(` ${or} `);

  // A kbd in a kbd is the HTML for a combination of keys. It is phrasing
  // content, thus it can be in a p or a span.
  return (
    <kbd className="Shortcut">
      <span className="Shortcut__keys" aria-hidden="true">
        {alternatives.map((strokes, alternativeIndex) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: the list does not change order
          <Fragment key={alternativeIndex}>
            {alternativeIndex > 0 && (
              <span className="Shortcut__word">{or}</span>
            )}
            {strokes.map((keys, strokeIndex) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: the same key can be twice in a shortcut
              <Fragment key={strokeIndex}>
                {strokeIndex > 0 && (
                  <span className="Shortcut__word">{then}</span>
                )}
                {keys.map((key, keyIndex) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: the same key can be twice in a shortcut
                  <kbd key={keyIndex} className="Shortcut__key">
                    {key.visible}
                  </kbd>
                ))}
              </Fragment>
            ))}
          </Fragment>
        ))}
      </span>
      <span className="visually-hidden">{spoken}</span>
    </kbd>
  );
}

export default Shortcut;
