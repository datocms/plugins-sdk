import { ImposedSizePluginFrameCtx } from '../ctx/pluginFrame';

export type OnBootHook = {
  /**
   * This function will be called once at boot time and can be used to perform
   * ie. some initial integrity checks on the configuration.
   *
   * @tag boot
   */
  onBoot: (ctx: OnBootCtx) => void;
};

export type OnBootCtx = ImposedSizePluginFrameCtx<'onBoot'>;
