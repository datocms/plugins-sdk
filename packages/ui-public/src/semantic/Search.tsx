import React from 'react';
import { useTranslation } from '../i18n';
import { type TextMessage } from '../Message';

export type SearchProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'aria-label' | 'aria-labelledby' | 'role'
> & {
  /**
   * The accessible name of the search. A page can have more than one, and a
   * screen reader user needs the name to tell them apart. Write what the
   * user searches, for example "Roles". Do not write the word "search": the
   * screen reader says the role itself.
   */
  ariaLabel: TextMessage;
};

/**
 * The controls that search or filter a collection: the field of the text
 * and the filters. It is a landmark of the page. The native search element
 * is not in the types of React 17, thus it is a div with the role.
 */
const Search = React.forwardRef<HTMLDivElement, SearchProps>(function Search(
  { ariaLabel, ...props },
  ref,
) {
  const { tm } = useTranslation();

  return <div {...props} role="search" aria-label={tm(ariaLabel)} ref={ref} />;
});

export default Search;
