import { ImposedSizePluginFrameCtx } from '../ctx/pluginFrame';
import { fullScreenRenderModeBootstrapper } from '../utils';

/**
 * Defines the different modes in which an inspector can be displayed
 */
export type InspectorMode =
  | {
      /** Display a list of records in the inspector */
      type: 'itemList';
    }
  | {
      /** Display a single record editor in the inspector */
      type: 'itemEditor';
      /** The ID of the record to edit */
      itemId: string;
      /** Optional field path to highlight/focus within the record editor */
      fieldPath?: string;
    }
  | {
      /** Display a custom panel in the inspector */
      type: 'customPanel';
      /** ID of the inspector panel to render */
      panelId: string;
      /**
       * An arbitrary configuration object that will be passed as the `parameters`
       * property of the second argument of the `renderInspectorPanel` function
       */
      parameters?: Record<string, unknown>;
    };

/**
 * Options for configuring inspector mode changes
 */
export type SetInspectorModeOptions = {
  /**
   * When true, the mode change will be ignored if there are unsaved changes
   * in the current inspector. Useful for "low intent" mode changes that
   * shouldn't interrupt active editing sessions.
   * @default false
   */
  ignoreIfUnsavedChanges?: boolean;
};

export type RenderInspectorHook = {
  /**
   * This function will be called when the plugin needs to render a specific
   * inspector. Inspectors provide a side panel interface for displaying and
   * interacting with content alongside a custom interface.
   *
   * @tag inspector
   *
   * @example
   *
   * ```js
   * connect({
   *   renderInspector(inspectorId, ctx) {
   *     render(
   *       <div>
   *         <h1>Inspector: {inspectorId}</h1>
   *         <button onClick={() => ctx.setInspectorMode({
   *           type: 'itemEditor',
   *           itemId: 'some-item-id'
   *         })}>
   *           Show Item Editor
   *         </button>
   *       </div>
   *     );
   *   }
   * });
   * ```
   */
  renderInspector: (inspectorId: string, ctx: RenderInspectorCtx) => void;
};

export type RenderInspectorCtx = ImposedSizePluginFrameCtx<
  'renderInspector',
  {
    /** The ID of the inspector that needs to be rendered */
    inspectorId: string;

    /** Current page location */
    location: {
      pathname: string;
      search: string;
      hash: string;
    };
  },
  {
    /**
     * Changes the current display mode of the inspector. This allows the plugin
     * to dynamically switch between showing a record list, record editor, or custom
     * panel within the inspector interface.
     *
     * @param mode - The inspector mode to switch to
     * @param options - Optional configuration for the mode change
     * @param options.ignoreIfUnsavedChanges - When true, the mode change request will be
     * ignored if the current inspector is in itemEditor mode and has unsaved changes.
     * This allows for "low intent" mode changes that shouldn't interrupt active editing.
     * Default is false, meaning mode changes will proceed regardless of unsaved changes.
     *
     * @example
     *
     * ```js
     * // Switch to record editor mode
     * await ctx.setInspectorMode({
     *   type: 'itemEditor',
     *   itemId: 'item-123',
     *   fieldPath: 'title'
     * });
     *
     * // Switch to record list mode
     * await ctx.setInspectorMode({ type: 'itemList' });
     * await ctx.setInspectorItemListData({
     *   title: 'Related Records',
     *   itemIds: ['item-1', 'item-2', 'item-3']
     * });
     *
     * // Switch to custom panel mode
     * await ctx.setInspectorMode({
     *   type: 'customPanel',
     *   panelId: 'my-custom-panel',
     *   parameters: { filter: 'active' }
     * });
     *
     * // Low intent mode change - won't interrupt editing with unsaved changes
     * await ctx.setInspectorMode(
     *   { type: 'itemList' },
     *   { ignoreIfUnsavedChanges: true }
     * );
     * ```
     */
    setInspectorMode: (
      mode: InspectorMode,
      options?: SetInspectorModeOptions,
    ) => Promise<void>;

    /**
     * Sets the data for the item list inspector mode.
     *
     * @example
     *
     * ```js
     * // Set the item list data
     * await ctx.setInspectorItemListData({
     *   title: 'Related Records',
     *   itemIds: ['item-1', 'item-2', 'item-3']
     * });
     *
     * // Switch to item list mode
     * await ctx.setInspectorMode({ type: 'itemList' });
     * ```
     */
    setInspectorItemListData: (data: {
      /** The title to show in the inspector header */
      title: string;
      /** Array of record IDs to display in the list */
      itemIds: string[];
    }) => Promise<void>;
  }
>;

export const renderInspectorBootstrapper =
  fullScreenRenderModeBootstrapper<RenderInspectorCtx>(
    'renderInspector',
    (configuration, ctx) => {
      if (!configuration.renderInspector) {
        return;
      }

      configuration.renderInspector(ctx.inspectorId, ctx);
    },
  );
