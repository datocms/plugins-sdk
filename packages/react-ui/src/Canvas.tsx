import type { SizingUtilities } from 'datocms-plugin-sdk';
import React, {
  type CSSProperties,
  type ReactNode,
  useEffect,
  useMemo,
} from 'react';
import { ActionsProvider } from 'ui-public/Actions';
import BundledTexts, { type BundledTextsProps } from 'ui-public/BundledTexts';
import { DateSettingsProvider } from 'ui-public/DateSettings';
import { HostServicesProvider } from 'ui-public/HostServicesProvider';
import { MenuSheetProvider } from 'ui-public/MenuSheet';
import {
  type NavigationAdapter,
  NavigationProvider,
} from 'ui-public/NavigationProvider';
import { PortalWrapperProvider } from 'ui-public/PortalWrapper';
import { TooltipDelayGroup } from 'ui-public/Tooltip';
import adapterTexts from '../locales/en.json';
import { type BaseCtx, CtxContext, useCtx } from './ctx';
import { ctxDateSettings } from './ctxDateSettings';
import { useCtxHostServices } from './ctxHostServices';
import { useCtxNavigation } from './ctxNavigation';

export type { BaseCtx, NavigationAdapter };
export { useCtx };

export type CanvasProps = {
  /** The `ctx` that the hook of the SDK gives to the plugin */
  ctx: BaseCtx;
  /**
   * Does not start the auto-resizer of the frame. Use it when the plugin
   * sets the height of the frame itself.
   * @default false
   */
  noAutoResizer?: boolean;
  /**
   * More texts, by key, in the ICU syntax: a key of ui-public or of react-ui gets a
   * new text (also an aria text), and a key of the plugin gets its text for
   * `{ id }` messages. Give a constant: a new object renders the plugin again.
   */
  texts?: BundledTextsProps['texts'];
  /**
   * The router of the plugin, for a plugin with a router of its own. By
   * default a `to` is a path of the cms: a click goes through
   * `ctx.navigateTo`. Give a stable object (`useMemo`).
   */
  navigation?: NavigationAdapter;
  /** The plugin */
  children: ReactNode;
};

/** The semantic color tokens of the host, as inline custom properties */
function tokenStyle(ctx: BaseCtx) {
  return ctx.cssDesignTokens as CSSProperties;
}

/**
 * The content of a portal (a menu, a tooltip, a dialog) is out of the
 * element of the Canvas, thus it gets the tokens again.
 */
function CanvasPortalWrapper({ children }: { children: ReactNode }) {
  const ctx = useCtx();

  return (
    <div
      className="Canvas Canvas--portal"
      data-color-scheme={ctx.colorScheme}
      style={tokenStyle(ctx)}
    >
      {children}
    </div>
  );
}

function useAutoResizer(ctx: BaseCtx, enabled: boolean) {
  const { mode } = ctx;

  // biome-ignore lint/correctness/useExhaustiveDependencies: the SDK gives a new ctx at each change; a new mode is a new frame
  useEffect(() => {
    if (!enabled || !('startAutoResizer' in ctx)) {
      return undefined;
    }

    const sizing = ctx as BaseCtx & SizingUtilities;
    sizing.startAutoResizer();

    return () => {
      sizing.stopAutoResizer();
    };
  }, [mode, enabled]);
}

/**
 * The tokens are on the Canvas element, thus the scrollbar of the page (on
 * `html`, out of the element) cannot read them. The scrollbar token goes to
 * the root of the document too.
 */
function useScrollbarToken(ctx: BaseCtx) {
  const property = '--color--scrollbar--fill';
  const value = ctx.cssDesignTokens[property];

  useEffect(() => {
    if (!value) {
      return undefined;
    }

    const root = document.documentElement;
    const previous = root.style.getPropertyValue(property);
    root.style.setProperty(property, value);

    return () => {
      if (previous) {
        root.style.setProperty(property, previous);
      } else {
        root.style.removeProperty(property);
      }
    };
  }, [value]);
}

/** The adapters of ui-public from `ctx`. They need the texts above them. */
function CtxAdapters({
  ctx,
  navigation,
  children,
}: Pick<CanvasProps, 'ctx' | 'navigation' | 'children'>) {
  const hostServices = useCtxHostServices(ctx);
  const ctxNavigation = useCtxNavigation(ctx);
  const { locale, dateFormat, timezone, twentyFourHour } = ctx.ui as Parameters<
    typeof ctxDateSettings
  >[0];
  const dateSettings = useMemo(
    () => ctxDateSettings({ locale, dateFormat, timezone, twentyFourHour }),
    [locale, dateFormat, timezone, twentyFourHour],
  );

  return (
    <NavigationProvider value={navigation ?? ctxNavigation}>
      <HostServicesProvider value={hostServices}>
        <DateSettingsProvider value={dateSettings}>
          <PortalWrapperProvider value={CanvasPortalWrapper}>
            <MenuSheetProvider enabled={false}>
              <ActionsProvider>
                <TooltipDelayGroup>{children}</TooltipDelayGroup>
              </ActionsProvider>
            </MenuSheetProvider>
          </PortalWrapperProvider>
        </DateSettingsProvider>
      </HostServicesProvider>
    </NavigationProvider>
  );
}

/**
 * The root of a plugin. Put it around the content of each hook that renders
 * in a frame, with the `ctx` of the hook. It gives the components of
 * react-ui what they need from the host:
 *
 * - the colors: the semantic tokens of `ctx.cssDesignTokens` on its element
 *   and around the content of each portal;
 * - the texts: the English texts of ui-public, the `texts` prop over them, and the
 *   language of `ctx.ui.locale`;
 * - the notifications and the confirm dialog of the host (`ctx.notice`,
 *   `ctx.alert`, `ctx.customToast`, `ctx.openConfirm`);
 * - the router: `ctx.navigateTo`, and `ctx.location` in a page and in an
 *   inspector;
 * - the date settings of the user, from `ctx.ui`;
 * - the hot keys, the actions of `useRegisterActions` and the delays of the
 *   tooltips.
 *
 * It also starts the auto-resizer of the frame, and gives `ctx` to
 * `useCtx`.
 */
export default function Canvas({
  ctx,
  noAutoResizer = false,
  texts,
  navigation,
  children,
}: CanvasProps) {
  useAutoResizer(ctx, !noAutoResizer);
  useScrollbarToken(ctx);

  // The texts of the adapter are under the texts of the plugin, thus a
  // plugin can change them too.
  const allTexts = useMemo(() => ({ ...adapterTexts, ...texts }), [texts]);

  const style = useMemo(
    () => ({
      ...tokenStyle(ctx),
      padding: ctx.bodyPadding.map((side) => `${side}px`).join(' '),
    }),
    [ctx],
  );

  return (
    <CtxContext.Provider value={ctx}>
      <BundledTexts locale={ctx.ui.locale} texts={allTexts}>
        <CtxAdapters ctx={ctx} navigation={navigation}>
          <div
            className="Canvas"
            data-color-scheme={ctx.colorScheme}
            style={style}
          >
            {children}
          </div>
        </CtxAdapters>
      </BundledTexts>
    </CtxContext.Provider>
  );
}
