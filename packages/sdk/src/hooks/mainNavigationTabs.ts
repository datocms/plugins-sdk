import { Ctx } from '../ctx/base';
import { Icon } from '../icon';

export type MainNavigationTabsHook = {
  /**
   * Use this function to declare new tabs you want to add in the top-bar of the
   * UI
   *
   * @tag pages
   */
  mainNavigationTabs: (ctx: Ctx) => MainNavigationTab[];
};

/** A tab to be displayed in the top-bar of the UI */
export type MainNavigationTab = {
  /** Label to be shown. Must be unique. */
  label: string;
  /**
   * Icon to be shown alongside the label. Can be a FontAwesome icon name (ie.
   * `"address-book"`) or a custom SVG definition. To maintain visual
   * consistency with the rest of the interface, try to use FontAwesome icons
   * whenever possible.
   */
  icon: Icon;
  /** ID of the page linked to the tab */
  pointsTo: {
    pageId: string;
  };
  /**
   * Expresses where you want to place the tab in the top-bar. If not specified,
   * the tab will be placed after the standard tabs provided by DatoCMS itself.
   */
  placement?: [
    'before' | 'after',
    'content' | 'media' | 'schema' | 'configuration' | 'cdaPlayground',
  ];
  /**
   * If different plugins specify the same `placement` for their tabs, they will
   * be displayed by ascending `rank`. If you want to specify an explicit value
   * for `rank`, make sure to offer a way for final users to customize it inside
   * the plugin's settings form, otherwise the hardcoded value you choose might
   * clash with the one of another plugin!
   */
  rank?: number;
};
