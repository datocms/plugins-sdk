import Overview from './Overview';
import Page, {
  getPaginatedListState,
  type ListDetailPageState,
  useOpenRowRoute,
  useReopenLastRow,
} from './Page';
import Panel from './Panel';
import Split, {
  getListDetailMaxWidth,
  type ListDetailPlacement,
  useIsListDetailOpen,
} from './Split';
import { ListDetailWidthsProvider } from './Widths';

export const ListDetail = { Page, Split, Panel, Overview };
export {
  getListDetailMaxWidth,
  getPaginatedListState,
  type ListDetailPageState,
  type ListDetailPlacement,
  ListDetailWidthsProvider,
  useIsListDetailOpen,
  useOpenRowRoute,
  useReopenLastRow,
};
