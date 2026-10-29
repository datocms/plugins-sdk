import classNames from 'classnames';
import React from 'react';
import { DisclosureChevron } from '../../navigation/Chevron';
import Heading from '../../semantic/Heading';
import RawButton from '../../semantic/RawButton';

export type PageSectionProps = {
  /** A Page.SectionTitle, an optional Page.SectionDescription and the content */
  children: React.ReactNode;
  className?: string;
  /** The ID of the element, for a link to the section */
  id?: string;
};

/** A part of a page with one piece of content, under a title with hairlines */
export function PageSection({ children, className, id }: PageSectionProps) {
  return (
    <div className={classNames('Page__content__section', className)} id={id}>
      {children}
    </div>
  );
}

export type PageSectionTitleProps = {
  children: React.ReactNode;
  className?: string;
  /** The `id` of the heading, for example the target of `aria-labelledby` */
  id?: string;
  /**
   * Only for a section that opens and closes. The title becomes a button
   * with a chevron, and the parent shows the content only when `open` is
   * true. Without `onToggle`, the section cannot close (for example, it
   * shows an error) and the chevron is disabled.
   */
  collapse?: PageCollapse;
};

/** The state of a title that opens and closes its content */
export type PageCollapse = {
  /** The content shows */
  open: boolean;
  /** Opens or closes the content. Without it, the chevron is disabled. */
  onToggle?: () => void;
};

/** The title of a Page.Section, between two hairlines */

export function PageSectionTitle({
  children,
  className,
  id,
  collapse,
}: PageSectionTitleProps) {
  return (
    <Heading
      level={2}
      id={id}
      className={classNames('Page__content__section__title', className)}
    >
      {collapse ? (
        <PageCollapseToggle collapse={collapse}>{children}</PageCollapseToggle>
      ) : (
        <span>{children}</span>
      )}
    </Heading>
  );
}

type PageCollapseToggleProps = {
  collapse: PageCollapse;
  children: React.ReactNode;
};

// The button of a title that opens and closes its content. Put it in the
// heading, thus the heading stays in the outline of the page.
export function PageCollapseToggle({
  collapse,
  children,
}: PageCollapseToggleProps) {
  return (
    <RawButton
      className="Page__collapseToggle"
      onClick={collapse.onToggle}
      expandable={{ open: collapse.open }}
      disabled={!collapse.onToggle}
    >
      <DisclosureChevron open={collapse.open} />
      {children}
    </RawButton>
  );
}

export type PageSectionDescriptionProps = {
  children: React.ReactNode;
  className?: string;
};

/**
 * The description under a Page.SectionTitle: what the section is for. For a
 * message about the current data, use Callout.
 */
export function PageSectionDescription({
  children,
  className,
}: PageSectionDescriptionProps) {
  return (
    <div
      className={classNames('Page__content__section__description', className)}
    >
      {children}
    </div>
  );
}
