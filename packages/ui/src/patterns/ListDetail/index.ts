import Overview from './Overview';
import Page, {
  getPaginatedListState,
  type ListDetailPageState,
  useOpenRowRoute,
} from './Page';
import Panel from './Panel';
import Split, { getListDetailMaxWidth, useIsListDetailOpen } from './Split';
import { ListDetailWidthsProvider } from './Widths';

export const ListDetail = { Page, Split, Panel, Overview };
export {
  getListDetailMaxWidth,
  getPaginatedListState,
  type ListDetailPageState,
  ListDetailWidthsProvider,
  useIsListDetailOpen,
  useOpenRowRoute,
};
