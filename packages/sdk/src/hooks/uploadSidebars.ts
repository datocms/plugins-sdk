import { Ctx } from '../ctx/base';

export type UploadSidebarsHook = {
  /**
   * Use this function to declare new sidebar to be shown when the user opens
   * up an asset in the Media Area
   *
   * @tag sidebarPanels
   */
  uploadSidebars: (ctx: UploadSidebarsCtx) => UploadSidebar[];
};

export type UploadSidebarsCtx = Ctx;

export type UploadSidebar = {
  /**
   * ID of the sidebar. Will be the first argument for the
   * `renderUploadSidebar` function
   */
  id: string;
  /** Label to be shown on the collapsible sidebar handle */
  label: string;
  /**
   * An arbitrary configuration object that will be passed as the `parameters`
   * property of the second argument of the `renderUploadSidebar` function
   */
  parameters?: Record<string, unknown>;
  /**
   * If multiple sidebars specify the same `placement`, they will be sorted by
   * ascending `rank`. If you want to specify an explicit value for `rank`, make
   * sure to offer a way for final users to customize it inside the plugin's
   * settings form, otherwise the hardcoded value you choose might clash with
   * the one of another plugin!
   */
  rank?: number;
  /** The preferred width for the sidebar */
  preferredWidth?: number;
};
