import { Icon } from './icon';

export type DropdownAction = {
  /**
   * ID of action. Will be the first argument for the
   * execute function
   */
  id: string;

  /**
   * An arbitrary configuration object that will be passed as the `parameters`
   * property of the second argument of the execute function
   */
  parameters?: Record<string, unknown>;

  /** Label to be shown. Must be unique. */
  label: string;

  /**
   * Icon to be shown alongside the label. Can be a FontAwesome icon name (ie.
   * `"address-book"`) or a custom SVG definition. To maintain visual
   * consistency with the rest of the interface, try to use FontAwesome icons
   * whenever possible.
   */
  icon: Icon;

  active?: boolean;
  alert?: boolean;
  disabled?: boolean;
  closeMenuOnClick?: boolean;

  /**
   * Actions will be displayed by ascending `rank`. If you want to specify an
   * explicit value for `rank`, make sure to offer a way for final users to
   * customize it inside the plugin's settings form, otherwise the hardcoded
   * value you choose might clash with the one of another plugin!
   */
  rank?: number;
};

export type DropdownActionGroup = {
  /** Label to be shown. Must be unique. */
  label: string;

  /**
   * Icon to be shown alongside the label. Can be a FontAwesome icon name (ie.
   * `"address-book"`) or a custom SVG definition. To maintain visual
   * consistency with the rest of the interface, try to use FontAwesome icons
   * whenever possible.
   */
  icon: Icon;

  actions: DropdownAction[];

  /**
   * Actions will be displayed by ascending `rank`. If you want to specify an
   * explicit value for `rank`, make sure to offer a way for final users to
   * customize it inside the plugin's settings form, otherwise the hardcoded
   * value you choose might clash with the one of another plugin!
   */
  rank?: number;
};

export type ItemFormSidebarPanelPlacement = [
  'before' | 'after',
  'info' | 'publishedVersion' | 'schedule' | 'links' | 'history',
];
