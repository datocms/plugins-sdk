import { FullConnectParameters } from '../connect';
import { BaseMethods, BaseProperties } from './base';
import { IframeMethods, SizingUtilities } from './commonExtras/sizing';

export type FullScreenPluginFrameCtx<
  Mode extends keyof FullConnectParameters,
  AdditionalProperties extends Record<string, unknown> = Record<string, never>,
  AdditionalMethods extends Record<string, unknown> = Record<string, never>,
> = BaseProperties &
  PluginFrameAdditionalProperties<Mode> &
  AdditionalProperties &
  BaseMethods &
  PluginFrameAdditionalMethods<
    BaseProperties &
      PluginFrameAdditionalProperties<Mode> &
      AdditionalProperties
  > &
  AdditionalMethods;

export type ContainedPluginFrameCtx<
  Mode extends keyof FullConnectParameters,
  AdditionalProperties extends Record<string, unknown> = Record<string, never>,
  AdditionalMethods extends Record<string, unknown> = Record<string, never>,
> = FullScreenPluginFrameCtx<Mode, AdditionalProperties, AdditionalMethods> &
  SizingUtilities &
  IframeMethods;

export type PluginFrameAdditionalProperties<
  Mode extends keyof FullConnectParameters,
> = {
  mode: Mode;
  bodyPadding: [number, number, number, number];
};

export type PluginFrameAdditionalMethods<
  Properties extends Record<string, unknown>,
> = {
  getSettings: () => Promise<Properties>;
};
