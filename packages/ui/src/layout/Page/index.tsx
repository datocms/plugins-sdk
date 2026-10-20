import { Page as BasePage } from './Page';
import { PageContent } from './PageContent';
import { PageGroup, PageGroupInset } from './PageGroup';
import {
  PageSection,
  PageSectionDescription,
  PageSectionTitle,
} from './PageSection';

export type { PageProps } from './Page';
export type { PageContentProps } from './PageContent';
export type { PageGroupInsetProps, PageGroupProps } from './PageGroup';
export type {
  PageCollapse,
  PageSectionDescriptionProps,
  PageSectionProps,
  PageSectionTitleProps,
} from './PageSection';

export const Page = Object.assign(BasePage, {
  Content: PageContent,
  Group: PageGroup,
  GroupInset: PageGroupInset,
  Section: PageSection,
  SectionTitle: PageSectionTitle,
  SectionDescription: PageSectionDescription,
});
