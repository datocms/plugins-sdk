import type { SchemaTypes } from '@datocms/cma-client';
import { Ctx } from '../ctx/base';
import { ItemFormSidebarPanelPlacement } from '../shared';

type ItemType = SchemaTypes.ItemType;

export type ItemFormSidebarPanelsHook = {
  /**
   * Use this function to declare new sidebar panels to be shown when the user
   * edits records of a particular model
   *
   * @tag sidebarPanels
   */
  itemFormSidebarPanels: (
    itemType: ItemType,
    ctx: ItemFormSidebarPanelsCtx,
  ) => ItemFormSidebarPanel[];
};

export type ItemFormSidebarPanelsCtx = Ctx;

export type ItemFormSidebarPanel = {
  /**
   * ID of the panel. Will be the first argument for the
   * `renderItemFormSidebarPanel` function
   */
  id: string;
  /** Label to be shown on the collapsible sidebar panel handle */
  label: string;
  /**
   * An arbitrary configuration object that will be passed as the `parameters`
   * property of the second argument of the `renderItemFormSidebarPanel`
   * function
   */
  parameters?: Record<string, unknown>;
  /** Whether the sidebar panel will start open or collapsed */
  startOpen?: boolean;
  /**
   * Expresses where you want the item to be placed inside the sidebar. If not
   * specified, the item will be placed after the standard panels provided by
   * DatoCMS itself.
   */
  placement?: ItemFormSidebarPanelPlacement;
  /**
   * If multiple sidebar panels specify the same `placement`, they will be
   * sorted by ascending `rank`. If you want to specify an explicit value for
   * `rank`, make sure to offer a way for final users to customize it inside the
   * plugin's settings form, otherwise the hardcoded value you choose might
   * clash with the one of another plugin!
   */
  rank?: number;
  /** The initial height to set for the iframe that will render the sidebar panel */
  initialHeight?: number;
};
