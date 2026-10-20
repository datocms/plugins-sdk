import React from 'react';
import { buttonClassName } from '../actions/Button';
import { useTranslation } from '../i18n';
import { type TextMessage } from '../Message';
import Nav from '../semantic/Nav';
import RawButton from '../semantic/RawButton';
import times from '../utils/times';

export type PaginationProps = {
  /** What the pages are of, for example "Projects". Screen readers read it. */
  ariaLabel: TextMessage;
  /** The number of items in one page, for example 25 */
  perPage: number;
  /** The page that shows. The first page is 0. */
  currentPage: number;
  /**
   * The most page numbers that show
   * @default 7
   */
  maxPagesToBeShown?: number;
  /** The number of items in all the pages */
  totalEntries: number;
  /** Runs when the user picks a page. The first page is 0. */
  onChange: (newPage: number) => void;
  /**
   * The buttons do not respond, for example while the next page loads
   * @default false
   */
  disabled?: boolean;
};

/**
 * The pages that show as numbers: at most `max` pages, with the current page
 * in the middle when it is not near the first or the last page. All the
 * numbers start at 0.
 */
function visiblePages(pageCount: number, currentPage: number, max: number) {
  const size = Math.min(max, pageCount);
  const first = Math.max(
    0,
    Math.min(currentPage - Math.floor(size / 2), pageCount - size),
  );
  return times(size).map((i) => first + i);
}

const pageButtonClassName = `Pagination__button ${buttonClassName({
  tone: 'ghost',
  size: 'milli',
})}`;

/** The buttons of the pages of a list: "Previous", the numbers and "Next". */
const Pagination = ({
  ariaLabel,
  perPage,
  currentPage,
  totalEntries,
  onChange,
  disabled = false,
  maxPagesToBeShown = 7,
}: PaginationProps) => {
  const { t, tm } = useTranslation();
  const pageCount = Math.ceil(totalEntries / perPage);
  const pages = visiblePages(pageCount, currentPage, maxPagesToBeShown);

  return (
    <Nav
      className="Pagination"
      ariaLabel={t('a11y.pagination.label', { name: tm(ariaLabel) })}
    >
      <RawButton
        className={pageButtonClassName}
        disabled={disabled || currentPage <= 0}
        onClick={() => onChange(currentPage - 1)}
        ariaLabel={t('a11y.pagination.previous')}
      >
        &laquo; {t('pagination.previous')}
      </RawButton>
      <div className="Pagination__links">
        {pages.map((page) => {
          const isCurrentPage = page === currentPage;

          return (
            <RawButton
              key={page}
              className={pageButtonClassName}
              disabled={disabled}
              onClick={() => onChange(page)}
              ariaLabel={t('a11y.pagination.goToPage', { page: page + 1 })}
              current={isCurrentPage ? 'page' : undefined}
            >
              {page + 1}
            </RawButton>
          );
        })}
      </div>

      <RawButton
        disabled={disabled || currentPage >= pageCount - 1}
        className={pageButtonClassName}
        onClick={() => onChange(currentPage + 1)}
        ariaLabel={t('a11y.pagination.next')}
      >
        {t('pagination.next')} &raquo;
      </RawButton>
    </Nav>
  );
};

export default Pagination;
