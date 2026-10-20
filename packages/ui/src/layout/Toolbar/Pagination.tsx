import React from 'react';
import { useTranslation } from '../../i18n';
import { type TextMessage } from '../../Message';
import { MenuChevron } from '../../navigation/Chevron';
import Pagination, { type PaginationProps } from '../Pagination';
import { usePaneAriaLabel } from '../Pane/PaneAriaLabel';

/** The select of the number of items of a page */
export type ToolbarPaginationPerPageSelect = {
  /** Runs when the user picks a number of items of a page */
  onChange: (newPerPage: number) => void;
  /**
   * The numbers of items of a page that the user can pick
   * @default [25, 50, 100, 200]
   */
  options?: number[];
};

export type ToolbarPaginationProps = Omit<
  PaginationProps,
  'maxPagesToBeShown' | 'ariaLabel'
> & {
  /** What the pages are of ("Roles"). Without it, the ariaLabel of the Pane. */
  ariaLabel?: TextMessage;
  /** Fewer page numbers, and no "Show" select (for a narrow pane) */
  compact?: boolean;
  /**
   * A "Show" select before the pages, to change the number of items of a
   * page. Without it, the number of items of a page is fixed.
   */
  perPageSelect?: ToolbarPaginationPerPageSelect;
};

const DEFAULT_PER_PAGE_OPTIONS = [25, 50, 100, 200];

/**
 * The pages of a list. The pages show when the list has more than one page.
 * The "Show" select shows when the list has more items than its smallest
 * option, thus the user can always go back to a smaller page.
 */
function ToolbarPagination({
  ariaLabel,
  totalEntries,
  compact,
  perPage,
  currentPage,
  onChange,
  disabled,
  perPageSelect,
}: ToolbarPaginationProps) {
  const paneAriaLabel = usePaneAriaLabel();
  const { t, tm } = useTranslation();

  const perPageOptions = perPageSelect?.options ?? DEFAULT_PER_PAGE_OPTIONS;
  const showPages = totalEntries > perPage;
  const showPerPageSelect =
    perPageSelect !== undefined &&
    !compact &&
    totalEntries > Math.min(...perPageOptions);

  if (!showPages && !showPerPageSelect) {
    return null;
  }

  return (
    <>
      {perPageSelect && showPerPageSelect && (
        <div className="Pagination__per-page">
          {t('pagination.show', { perPage })}
          <MenuChevron />
          <select
            aria-label={t('a11y.pagination.perPage')}
            value={perPage}
            disabled={disabled}
            onChange={(e) =>
              perPageSelect.onChange(parseInt(e.target.value, 10))
            }
          >
            {perPageOptions.map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </div>
      )}
      {showPages && (
        <Pagination
          ariaLabel={ariaLabel ? tm(ariaLabel) : paneAriaLabel}
          totalEntries={totalEntries}
          perPage={perPage}
          currentPage={currentPage}
          onChange={onChange}
          disabled={disabled}
          maxPagesToBeShown={compact ? 3 : 10}
        />
      )}
    </>
  );
}

export default ToolbarPagination;
