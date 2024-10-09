import { SelfResizingPluginFrameCtx } from '../ctx/pluginFrame';
import { containedRenderModeBootstrapper } from '../utils';

export type RenderModalHook = {
  /**
   * This function will be called when the plugin requested to open a modal (see
   * the `openModal` hook)
   *
   * @tag modals
   */
  renderModal: (modalId: string, ctx: RenderModalCtx) => void;
};
export type RenderModalCtx = SelfResizingPluginFrameCtx<
  'renderModal',
  {
    /** The ID of the modal that needs to be rendered */
    modalId: string;
    /**
     * The arbitrary `parameters` of the modal declared in the `openModal`
     * function
     */
    parameters: Record<string, unknown>;
  },
  {
    /**
     * A function to be called by the plugin to close the modal. The `openModal`
     * call will be resolved with the passed return value
     *
     * @example
     *
     * ```js
     * const returnValue = prompt(
     *   'Please specify the value to return to the caller:',
     *   'success',
     * );
     *
     * await ctx.resolve(returnValue);
     * ```
     */
    resolve: (returnValue: unknown) => Promise<void>;
  }
>;

export const renderModalBootstrapper =
  containedRenderModeBootstrapper<RenderModalCtx>(
    'renderModal',
    (configuration, ctx) => {
      if (!configuration.renderModal) {
        return;
      }

      configuration.renderModal(ctx.modalId, ctx);
    },
  );
