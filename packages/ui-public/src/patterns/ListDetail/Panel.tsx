import React from 'react';
import { Status } from '../../../icons';
import BlankSlate from '../../feedback/BlankSlate';
import { useTranslation } from '../../i18n';
import Pane from '../../layout/Pane';
import { TOGGLE_RIGHT_SIDEBAR_ACTION_ID } from '../../layout/SplitPane';
import Toolbar from '../../layout/Toolbar';
import { type Message, type TextMessage } from '../../Message';
import Aside from '../../semantic/Aside';
import { useListDetailOverlayClose } from './Split';

type ListDetailPanelState =
  /** The element is not available: the panel shows only the title */
  | {
      /**
       * "loading": the element is not available yet. "failed": the load of
       * the element failed, and the panel shows an error.
       */
      state: 'loading' | 'failed';
      fetching?: never;
      actions?: never;
      toolbarAction?: never;
      entity?: never;
      children?: never;
    }
  /** The element is available */
  | {
      /** @default "ready" */
      state?: 'ready';
      /**
       * A part of the element is loading. A spinner shows in the title bar,
       * as in the toolbar of the list.
       */
      fetching?: boolean;
      /**
       * The actions on the element, for example "Resend now". They are the
       * options (Option) of the dropdown menu with the three dots in the
       * title bar.
       */
      actions?: React.ReactNode;
      /**
       * The main action on the element, for example "Open project". It is a
       * button with the "primary" tone at the right end of the title bar.
       * Use the "milli" size, as for the other buttons of a toolbar.
       */
      toolbarAction?: React.ReactNode;
      /**
       * The element that the panel shows: its name and a line under it (for
       * example the email of a member), with an optional image at the left
       * (for example an avatar). Without it, the page writes its own
       * `ListDetailPanel__entity` block in the children.
       */
      entity?: {
        title: Message;
        subtitle?: Message;
        image?: React.ReactNode;
      };
      /** The facts of the element: SidebarPanels with an InfoList */
      children?: React.ReactNode;
    };

export type ListDetailPanelProps = {
  /**
   * The title of the panel. It is also the name of the panel for screen
   * readers: the panel is a complementary landmark of the page.
   */
  title: TextMessage;
} & ListDetailPanelState;

/** The panel at the right of a ListDetail.Page that shows the open row */
function ListDetailPanel({
  title,
  state = 'ready',
  fetching,
  actions,
  toolbarAction,
  entity,
  children,
}: ListDetailPanelProps) {
  const { t, tm, tc } = useTranslation();
  const closeOverlay = useListDetailOverlayClose();

  return (
    <Aside ariaLabel={tm(title)}>
      <Pane
        className="ListDetailPanel"
        header={
          <Toolbar>
            {closeOverlay && (
              <Toolbar.GoBack
                onClick={closeOverlay}
                ariaLabel={{ id: 'admin.listDetail.panel.close' }}
                action={TOGGLE_RIGHT_SIDEBAR_ACTION_ID}
              />
            )}
            <Toolbar.Title level={2}>{tc(title)}</Toolbar.Title>
            <Toolbar.Spinner show={!!fetching} />
            <Toolbar.DotsDropdown hidden={!actions}>
              {actions}
            </Toolbar.DotsDropdown>
            <Toolbar.Space />
            {toolbarAction}
          </Toolbar>
        }
      >
        <div className="ListDetailPanel__body">
          {entity && (
            <div className="ListDetailPanel__entity">
              {entity.image && (
                <div className="ListDetailPanel__entity__image">
                  {entity.image}
                </div>
              )}
              <div className="ListDetailPanel__entity__text">
                <div className="ListDetailPanel__entity__title">
                  {tc(entity.title)}
                </div>
                {entity.subtitle && (
                  <div className="ListDetailPanel__entity__subtitle">
                    {tc(entity.subtitle)}
                  </div>
                )}
              </div>
            </div>
          )}
          {state === 'failed' ? (
            <BlankSlate
              placement="area"
              error={true}
              icon={<Status.CircleExclamationIcon />}
              title={t('admin.listDetail.panel.failed.title')}
              description={t('admin.listDetail.panel.failed.text')}
            />
          ) : state === 'loading' ? (
            <BlankSlate
              placement="area"
              loading={true}
              title={t('admin.listDetail.panel.loading')}
            />
          ) : (
            children
          )}
        </div>
      </Pane>
    </Aside>
  );
}

export default React.memo(ListDetailPanel);
