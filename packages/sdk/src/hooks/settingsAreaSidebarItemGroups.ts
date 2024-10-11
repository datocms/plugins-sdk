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

export type SettingsAreaSidebarItemGroupsHook = {
  /**
   * Use this function to declare new navigation sections in the Settings Area
   * sidebar
   *
   * @tag pages
   */
  settingsAreaSidebarItemGroups: (
    ctx: SettingsAreaSidebarItemGroupsCtx,
  ) => SettingsAreaSidebarItemGroup[];
};

export type SettingsAreaSidebarItemGroupsCtx = Ctx;

/**
 * The sidebar in the Settings Area presents a number of pages grouped by topic.
 * This object represents a new group to be added in the sideebar to the
 * standard ones DatoCMS provides.
 */
export type SettingsAreaSidebarItemGroup = {
  /** Label to be shown. Must be unique. */
  label: string;
  /** The list of items it contains * */
  items: SettingsAreaSidebarItem[];
  /**
   * Expresses where you want the group to be placed inside the sidebar. If not
   * specified, the item will be placed after the standard items provided by
   * DatoCMS itself.
   */
  placement?: ['before' | 'after', 'properties' | 'permissions'];
  /**
   * If different plugins specify the same `placement` for their sections, they
   * will be displayed by ascending `rank`. If you want to specify an explicit
   * value for `rank`, make sure to offer a way for final users to customize it
   * inside the plugin's settings form, otherwise the hardcoded value you choose
   * might clash with the one of another plugin!
   */
  rank?: number;
};

/** An item contained in a Settings Area group */
export type SettingsAreaSidebarItem = {
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
};

export function isSettingsAreaSidebarItemGroup(
  value: unknown,
): value is SettingsAreaSidebarItemGroup {
  return (
    isRecord(value) &&
    isString(value.label) &&
    isArray(value.items, isSettingsAreaSidebarItem) &&
    (isNullish(value.placement) || isPlacement(value.placement)) &&
    (isNullish(value.rank) || isNumber(value.rank))
  );
}

export function isSettingsAreaSidebarItem(
  value: unknown,
): value is SettingsAreaSidebarItem {
  return (
    isRecord(value) &&
    isString(value.label) &&
    isIcon(value.icon) &&
    isRecord(value.pointsTo) &&
    isString(value.pointsTo.pageId)
  );
}

export function isReturnTypeOfSettingsAreaSidebarItemGroupsHook(
  value: unknown,
): value is SettingsAreaSidebarItemGroup[] {
  return isArray(value, isSettingsAreaSidebarItemGroup);
}
