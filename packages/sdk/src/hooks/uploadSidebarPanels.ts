import { Ctx } from '../ctx/base';
import {
  isArray,
  isBoolean,
  isNullish,
  isNumber,
  isPlacement,
  isRecord,
  isString,
} from '../guardUtils.js';

export type UploadSidebarPanelsHook = {
  /**
   * Use this function to declare new sidebar panels to be shown when the user
   * opens up an asset in the Media Area
   *
   * @tag sidebarPanels
   */
  uploadSidebarPanels: (ctx: UploadSidebarPanelsCtx) => UploadSidebarPanel[];
};

export type UploadSidebarPanelsCtx = Ctx;

/**
 * An object expressing a sidebar panel to be shown when the user
 * opens up an asset in the Media Area
 *
 * @see {isUploadSidebarPanel}
 */
export type UploadSidebarPanel = {
  /**
   * ID of the panel. Will be the first argument for the
   * `renderUploadSidebarPanel` function
   */
  id: string;
  /** Label to be shown on the collapsible sidebar panel handle */
  label: string;
  /**
   * An arbitrary configuration object that will be passed as the `parameters`
   * property of the second argument of the `renderUploadSidebarPanel`
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
  placement?: UploadSidebarPanelPlacement;
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

export type UploadSidebarPanelPlacement = [
  'before' | 'after',
  (
    | 'defaultMetadata'
    | 'categorization'
    | 'creator'
    | 'videoTracks'
    | 'links'
    | 'replace'
  ),
];

export function isUploadSidebarPanel(
  value: unknown,
): value is UploadSidebarPanel {
  return (
    isRecord(value) &&
    isString(value.id) &&
    isString(value.label) &&
    (isNullish(value.parameters) || isRecord(value.parameters)) &&
    (isNullish(value.startOpen) || isBoolean(value.startOpen)) &&
    (isNullish(value.placement) || isPlacement(value.placement)) &&
    (isNullish(value.rank) || isNumber(value.rank)) &&
    (isNullish(value.initialHeight) || isNumber(value.initialHeight))
  );
}

export function isReturnTypeOfUploadSidebarPanelsHook(
  value: unknown,
): value is UploadSidebarPanel[] {
  return isArray(value, isUploadSidebarPanel);
}
