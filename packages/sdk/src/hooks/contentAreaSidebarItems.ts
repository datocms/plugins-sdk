import { Ctx } from '../ctx/base';
import {
  isArray,
  isNullish,
  isNumber,
  isPlacement,
  isRecord,
  isString,
} from '../guardUtils.js';
import { Icon, isIcon } from '../icon';

export type ContentAreaSidebarItemsHook = {
  /**
   * Use this function to declare new items in the content area sidebar
   *
   * @tag sidebarItems
   */
  contentAreaSidebarItems: (
    ctx: ContentAreaSidebarItemsCtx,
  ) => ContentAreaSidebarItem[];
};

export type ContentAreaSidebarItemsCtx = Ctx;

/**
 * An object expressing an item in the content area sidebar
 *
 * @see {isContentAreaSidebarItem}
 */
export type ContentAreaSidebarItem = {
  /** Label to be shown. Must be unique. */
  label: string;
  /**
   * Icon to be shown alongside the label. Can be a FontAwesome icon name (ie.
   * `"address-book"`) or a custom SVG definition. To maintain visual
   * consistency with the rest of the interface, try to use FontAwesome icons
   * whenever possible.
   */
  icon: Icon;
  /** ID of the page linked to the item */
  pointsTo: {
    pageId: string;
  };
  /**
   * Expresses where you want the item to be placed inside the sidebar. If not
   * specified, the item will be placed after the standard items provided by
   * DatoCMS itself.
   */
  placement?: ['before' | 'after', 'menuItems' | 'seoPreferences'];
  /**
   * If different plugins specify the same `placement` for their panels, they
   * will be displayed by ascending `rank`. If you want to specify an explicit
   * value for `rank`, make sure to offer a way for final users to customize it
   * inside the plugin's settings form, otherwise the hardcoded value you choose
   * might clash with the one of another plugin!
   */
  rank?: number;
};

export function isContentAreaSidebarItem(
  value: unknown,
): value is ContentAreaSidebarItem {
  return (
    isRecord(value) &&
    isString(value.label) &&
    isIcon(value.icon) &&
    isRecord(value.pointsTo) &&
    isString(value.pointsTo.pageId) &&
    (isNullish(value.placement) || isPlacement(value.placement)) &&
    (isNullish(value.rank) || isNumber(value.rank))
  );
}

export function isReturnTypeOfContentAreaSidebarItemsHook(
  value: unknown,
): value is ContentAreaSidebarItem[] {
  return isArray(value, isContentAreaSidebarItem);
}
