import React, { useEffect, useRef } from 'react';
import { UI } from '../../icons/index';
import { useTranslation } from '../i18n';
import { isHtmlMessage, type Message } from '../Message';
import { useNavigation } from '../navigation/NavigationProvider';

function ConcreteHint({ hint }: { hint: Message }) {
  const { tc } = useTranslation();
  const { navigate } = useNavigation();
  const hintRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!hintRef.current) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Only intercept clicks on links with data-router-link attribute
      if (target.tagName === 'A' && target.hasAttribute('data-router-link')) {
        const href = target.getAttribute('href');
        if (href?.startsWith('/')) {
          e.preventDefault();
          navigate(href);
        }
      }
    };

    const element = hintRef.current;
    element.addEventListener('click', handleClick);

    return () => {
      element.removeEventListener('click', handleClick);
    };
  }, [hint, navigate]);

  // The HTML of a hint is not sanitized: the hint can have a link with the
  // `data-router-link` attribute, which the sanitizer removes.
  if (isHtmlMessage(hint)) {
    // biome-ignore lint/security: the caller gives trusted HTML
    return <p ref={hintRef} dangerouslySetInnerHTML={{ __html: hint.html }} />;
  }

  return <p ref={hintRef}>{tc(hint)}</p>;
}

export type FieldHintProps = {
  /**
   * The `id` of the hint. The input of the field points to it with
   * `aria-describedby`.
   */
  id?: string;
  /**
   * The text of the hint. A string is plain text. For markup, give
   * `{ html }`: unlike the other `Message` props, the component does NOT
   * sanitize this HTML (the sanitizer removes `data-router-link`), thus only
   * give HTML that you trust. A link with the `data-router-link` attribute
   * in it opens with the router of the app.
   */
  hint?: Message;
  /**
   * A link to the docs, with a book icon. `label` is the text of the link and
   * `to` is the URL. The link opens in a new tab.
   */
  docs?: { label: Message; to: string };
};

function FieldHint({ id, hint, docs }: FieldHintProps) {
  const { tc } = useTranslation();
  if (!(hint || docs)) {
    return null;
  }

  return (
    <div id={id} className="form__hint">
      {hint && <ConcreteHint hint={hint} />}
      {docs && (
        <a
          className="form__hint__docs"
          href={docs.to}
          target="_blank"
          rel="noopener noreferrer"
        >
          <UI.BookIcon />
          {tc(docs.label)}
        </a>
      )}
    </div>
  );
}

export default React.memo(FieldHint);
