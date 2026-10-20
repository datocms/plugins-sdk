import React from 'react';
import { useTranslation } from '../i18n';
import { type TextMessage } from '../Message';

export type AsideProps = Omit<
  React.HTMLAttributes<HTMLElement>,
  'aria-label' | 'aria-labelledby'
> & {
  /**
   * The accessible name of the complementary content. A page can have more
   * than one, and a screen reader user needs the name to tell them apart.
   * Write what the content is, for example "Additional record information".
   * Do not write the word "complementary": the screen reader says the role
   * itself.
   */
  ariaLabel: TextMessage;
};

/**
 * Content that is next to the main content of the page and is not part of
 * it: the information and the tools of a record, the details of a row. It is
 * a landmark of the page. Do not use it for a list of links (use Nav).
 */
const Aside = React.forwardRef<HTMLElement, AsideProps>(function Aside(
  { ariaLabel, ...props },
  ref,
) {
  const { tm } = useTranslation();

  return <aside {...props} aria-label={tm(ariaLabel)} ref={ref} />;
});

export default Aside;
