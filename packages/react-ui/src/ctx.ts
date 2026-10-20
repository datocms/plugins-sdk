import type { ImposedSizePluginFrameCtx } from 'datocms-plugin-sdk';
import {
  createContext,
  type MutableRefObject,
  useContext,
  useLayoutEffect,
  useRef,
} from 'react';

/**
 * The `ctx` of any hook of the SDK that renders in a frame: a page, a
 * dialog, a field extension, a sidebar panel, a config screen.
 */
export type BaseCtx = ImposedSizePluginFrameCtx<
  // biome-ignore lint/suspicious/noExplicitAny: every mode of the SDK
  any,
  Record<never, never>,
  Record<never, never>
>;

export const CtxContext = createContext<BaseCtx | null>(null);

/**
 * The `ctx` of the nearest `Canvas`. Give the type of the `ctx` of your
 * hook, for example `useCtx<RenderPageCtx>()`.
 */
export function useCtx<T extends BaseCtx = BaseCtx>(): T {
  const ctx = useContext(CtxContext);

  if (!ctx) {
    throw new Error(
      'useCtx has no Canvas above it. Put a Canvas with the ctx of the hook at the root of the plugin.',
    );
  }

  return ctx as T;
}

/**
 * A ref to the last `ctx`. The SDK gives a new ctx at each change of the
 * host: a callback that reads the ref keeps its identity.
 */
export function useLatestCtx(ctx: BaseCtx): MutableRefObject<BaseCtx> {
  const ref = useRef(ctx);
  useLayoutEffect(() => {
    ref.current = ctx;
  });
  return ref;
}
