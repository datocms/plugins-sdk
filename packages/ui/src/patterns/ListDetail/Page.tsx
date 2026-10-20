import { escapeRegExp } from 'lodash-es';
import React, { ReactElement, ReactNode, useCallback } from 'react';
import { Generic } from '../../../icons';
import { HotKeyListener } from '../../actions/HotKey';
import BlankSlate from '../../feedback/BlankSlate';
import { useTranslation } from '../../i18n';
import ListOrOverview, {
  type ListOrOverviewContent,
} from '../../layout/ListOrOverview';
import Pane from '../../layout/Pane';
import Toolbar from '../../layout/Toolbar';
import { FILTER_LIST_HOT_KEY } from '../../layout/Toolbar/FilterToggle';
import ListArea from '../../lists/ListArea';
import { type Message, type TextMessage } from '../../Message';
import { useNavigation } from '../../navigation/NavigationProvider';
import Overview from './Overview';
import Split, { type ListDetailSplitDetail } from './Split';

/**
 * The state of the list:
 * - "loading": the first load did not end. The page shows a spinner.
 * - "empty": the list has no elements and no filter. The page shows only
 *   `overview` (see ListOrOverview).
 * - "no-results": the filter keeps no element. The body shows the shared
 *   "no results" state.
 * - "ready": the body shows the children (the table).
 */
export type ListDetailPageState = 'loading' | 'empty' | 'no-results' | 'ready';

/**
 * The state of a list that the server filters and paginates. `isEmpty` is
 * undefined until the first load ends (for example, see useSettledEmpty of
 * the cms).
 */
export function getPaginatedListState(
  isEmpty: boolean | undefined,
  isFiltering: boolean,
): ListDetailPageState {
  if (isEmpty === undefined) return 'loading';
  if (!isEmpty) return 'ready';
  return isFiltering ? 'no-results' : 'empty';
}

export type ListDetailPageProps = {
  /** The rows open a detail at the right (see ListDetail.Split) */
  detail?: ListDetailSplitDetail;
  /**
   * The Pane uses the title as the label of the filter form, thus it is a
   * TextMessage
   */
  title: TextMessage;
  /** A Toolbar.Help element */
  help?: ReactNode;
  /** The count of the list, after the title */
  subtitle?: Message;
  /**
   * The options of the "⋯" menu of the title bar (Dropdown Option elements)
   */
  menu?: ReactNode;
  /** The list loads in the background. The title bar shows a small spinner. */
  busy?: boolean;
  /**
   * The filter of the list: the result of useFilterToolbar (ui/Toolbar) and
   * the filter form. The form shows in a toolbar under the title bar while
   * the filter toolbar is open. A list without a filter does not set it.
   */
  filter?: {
    toolbar: { open: boolean; onOpen: () => void; onToggle: () => void };
    form: ReactNode;
  };
  /**
   * Controls at the end of the title bar, before the filter toggle (for
   * example, a status)
   */
  controls?: ReactNode;
  /**
   * The button at the end of the title bar, after the filter toggle (for
   * example, a "New" button)
   */
  button?: ReactNode;
  /** The bar under the list (for example, the pagination) */
  footer?: ReactNode;
  /** The table of the list */
  children: ReactNode;
} & ListDetailPageContent;

/**
 * The state and the overview. Only a list that can be empty has the "empty"
 * state, and then it must give the overview.
 */
type ListDetailPageContent =
  /** A list that can be empty */
  | {
      /** What the page shows (see getPaginatedListState) */
      state: ListDetailPageState;
      /** All the page when the list is empty: a BlankSlate with titleLevel={1} */
      overview: ReactElement;
    }
  /** A list that cannot be empty, for example the members */
  | {
      state: Exclude<ListDetailPageState, 'empty'>;
      overview?: never;
    };

/**
 * The page of a list with a panel for the open row: a title bar with the
 * filter toggle, the filter form, the list and the panel at the right. The
 * page gives the data, the filter form, the table and the panel. Put it in
 * the Main of the app.
 */
function ListDetailPage({
  detail,
  title,
  help,
  subtitle,
  menu,
  busy,
  filter,
  controls,
  button,
  footer,
  state,
  overview,
  children,
}: ListDetailPageProps) {
  const { t, tm, tc } = useTranslation();
  const titleText = tm(title);
  const listState = state === 'no-results' ? 'ready' : state;
  // The destructured props lose the link between state and overview: without
  // an overview, the state is never "empty".
  const content: ListOrOverviewContent = overview
    ? { state: listState, overview: <Overview>{overview}</Overview> }
    : { state: listState as Exclude<typeof listState, 'empty'> };

  return (
    <ListOrOverview {...content}>
      <Split detail={detail}>
        <Pane
          ariaLabel={titleText}
          header={
            <>
              <Pane.Header>
                <Pane.Header.Title level={1} help={help}>
                  {titleText}
                </Pane.Header.Title>
                <Pane.Header.Subtitle>
                  {subtitle && tc(subtitle)}
                </Pane.Header.Subtitle>
                <Pane.Header.Menu>{menu}</Pane.Header.Menu>
                {busy && <Pane.Header.Spinner />}
                <Pane.Header.Button>
                  {controls}
                  {filter && (
                    <HotKeyListener
                      hotKey={FILTER_LIST_HOT_KEY}
                      description={{ id: 'hotkeys.filterList' }}
                      trigger={filter.toolbar.onOpen}
                    >
                      <Toolbar.FilterToggle
                        pressed={filter.toolbar.open}
                        onClick={filter.toolbar.onToggle}
                        hotKey={true}
                      />
                    </HotKeyListener>
                  )}
                  {button}
                </Pane.Header.Button>
              </Pane.Header>
              {filter?.toolbar.open && (
                <Toolbar fields={true}>{filter.form}</Toolbar>
              )}
            </>
          }
          footer={footer}
        >
          <ListArea>
            {state === 'no-results' ? (
              <BlankSlate
                placement="area"
                icon={<Generic.SearchIcon />}
                title={t('activityLog.noResults.title')}
                description={t('activityLog.noResults.description')}
              />
            ) : (
              children
            )}
          </ListArea>
        </Pane>
      </Split>
    </ListOrOverview>
  );
}

export default React.memo(ListDetailPage);

// The match ignores the case and a slash at the end, as the routes of
// react-router do. The id is not decoded.
function matchOpenRowId(
  pathname: string,
  baseUrl: string,
  idPattern: string | undefined,
) {
  const id = idPattern ? `(?:${idPattern})` : '[^/]+?(?:/[^/]+?)*';
  const regexp = new RegExp(
    `^${escapeRegExp(baseUrl)}/(${id})(?:/(?=$))?(?=/|$)`,
    'i',
  );
  return regexp.exec(pathname)?.[1];
}

/**
 * The open row of a ListDetail.Page is in the URL: "<baseUrl>/<id>". The id
 * can have more segments (for example, "invitations/12"). The open and the
 * close keep the query of the URL, thus the list keeps its filter and its
 * page. When a row is open, the open of another row (for example with the
 * arrows) replaces the step in the history: the history does not keep each
 * row. Give `idPattern` (the source of a regular expression for the segment
 * of the id, for example "\\d+") when other routes are under the base URL:
 * then a route under the open row (for example "<baseUrl>/12/delete") keeps
 * the row open. It needs a host with a location (see NavigationProvider).
 */
export function useOpenRowRoute(baseUrl: string, idPattern?: string) {
  const { location, navigate } = useNavigation();
  const search = location?.search ?? '';
  const id = location
    ? matchOpenRowId(location.pathname, baseUrl, idPattern)
    : undefined;

  const open = useCallback(
    (rowOrId: string | { id: string }) => {
      const rowId = typeof rowOrId === 'string' ? rowOrId : rowOrId.id;
      navigate(`${baseUrl}/${rowId}${search}`, { replace: Boolean(id) });
    },
    [navigate, baseUrl, search, id],
  );

  const close = useCallback(() => {
    navigate(`${baseUrl}${search}`);
  }, [navigate, baseUrl, search]);

  return { id, open, close };
}
