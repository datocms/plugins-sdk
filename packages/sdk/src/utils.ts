import type { SchemaTypes } from '@datocms/cma-client';
import { FullConnectParameters } from './connect';
import { Ctx } from './ctx/base';
import { SizingUtilities } from './ctx/commonExtras/sizing';
import {
  ImposedSizePluginFrameCtx,
  SelfResizingPluginFrameCtx,
} from './ctx/pluginFrame';

type Field = SchemaTypes.Field;
type ItemType = SchemaTypes.ItemType;

export type AwaitedReturnType<T extends (...args: any) => any> = Awaited<
  ReturnType<T>
>;

type ModeForPluginFrameCtx<T> = T extends ImposedSizePluginFrameCtx<
  infer Mode,
  any,
  any
>
  ? Mode
  : never;

export type MaybePromise<T> = T | Promise<T>;

export function pick<T extends object, K extends keyof T>(
  obj: T,
  keys: readonly K[],
): Pick<T, K> {
  const result = {} as Pick<T, K>;
  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key];
    }
  }
  return result;
}

export function omit<T extends object, K extends keyof T>(
  obj: T,
  keys: readonly K[],
): Omit<T, K> {
  const result = { ...obj } as T;
  for (const key of keys) {
    delete result[key];
  }
  return result as Omit<T, K>;
}

export function fromOneFieldIntoMultipleAndResultsById<Result>(
  fn:
    | ((
        field: Field,
        ctx: Ctx<any, any> & {
          itemType: ItemType;
        },
      ) => Result)
    | undefined,
) {
  return (
    fields: Field[],
    ctx: Ctx<any, any>,
  ): Record<string, Result> | undefined => {
    if (!fn) {
      return undefined;
    }

    const result: Record<string, Result> = {};

    for (const field of fields) {
      const itemType = ctx.itemTypes[
        field.relationships.item_type.data.id
      ] as ItemType;
      result[field.id] = fn(field, { ...ctx, itemType });
    }

    return result;
  };
}

export type Methods = {
  getSettings: () => Promise<Properties>;
};

export type Properties<Mode extends string = string> = { mode: Mode };

type OnChangeListenerFn = (newSettings: any) => void;

export type ExtractRenderHooks<T extends Record<string, unknown>> = {
  [K in keyof T as K extends `render${string}` ? K : never]: T[K];
};

export type Bootstrapper<
  H extends keyof ExtractRenderHooks<FullConnectParameters>,
> = {
  (
    connectConfiguration: Partial<ExtractRenderHooks<FullConnectParameters>>,
    methods: Methods,
    initialProperties: Properties,
  ): undefined | OnChangeListenerFn;
  mode: H;
};

export function containedRenderModeBootstrapper<
  Ctx extends SelfResizingPluginFrameCtx<any, {}, {}>,
>(
  mode: ModeForPluginFrameCtx<Ctx>,
  callConfigurationMethod: (
    connectConfiguration: Partial<ExtractRenderHooks<FullConnectParameters>>,
    ctx: Ctx,
  ) => void,
): Bootstrapper<Ctx['mode']> {
  const bootstrapper: Bootstrapper<Ctx['mode']> = (
    connectConfiguration,
    methods,
    initialProperties,
  ) => {
    if (initialProperties.mode !== mode) {
      return undefined;
    }

    const sizingUtilities = buildSizingUtilities(methods);

    const render = (properties: Record<string, unknown>) => {
      callConfigurationMethod(connectConfiguration, {
        ...methods,
        ...properties,
        ...sizingUtilities,
      } as unknown as Ctx);
    };

    render(initialProperties);

    return render;
  };

  bootstrapper.mode = mode;

  return bootstrapper;
}

export function fullScreenRenderModeBootstrapper<
  Ctx extends ImposedSizePluginFrameCtx<any, {}, {}>,
>(
  mode: ModeForPluginFrameCtx<Ctx>,
  callConfigurationMethod: (
    connectConfiguration: Partial<ExtractRenderHooks<FullConnectParameters>>,
    ctx: Ctx,
  ) => void,
): Bootstrapper<Ctx['mode']> {
  const bootstrapper: Bootstrapper<Ctx['mode']> = (
    connectConfiguration,
    methods,
    initialProperties,
  ) => {
    if (initialProperties.mode !== mode) {
      return undefined;
    }

    const render = (properties: Record<string, unknown>) => {
      callConfigurationMethod(connectConfiguration, {
        ...methods,
        ...properties,
      } as unknown as Ctx);
    };

    render(initialProperties);

    return render;
  };

  bootstrapper.mode = mode;

  return bootstrapper;
}

function getMaxScrollHeight() {
  const elements = document.querySelectorAll('body *');
  let maxVal = 0;
  for (let i = 0; i < elements.length; i++) {
    maxVal = Math.max(elements[i].getBoundingClientRect().bottom, maxVal);
  }
  return maxVal;
}

const buildSizingUtilities = (
  methods: SelfResizingPluginFrameCtx<any, any, any>,
): SizingUtilities => {
  let oldHeight: null | number = null;

  const updateHeight = (height?: number) => {
    const realHeight =
      height === undefined
        ? Math.max(
            document.body.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.getBoundingClientRect().height,
            getMaxScrollHeight(),
          )
        : height;

    if (realHeight !== oldHeight) {
      methods.setHeight(realHeight);
      oldHeight = realHeight;
    }
  };

  let resizeObserver: ResizeObserver | null = null;
  let mutationObserver: MutationObserver | null = null;
  const onMutation = () => updateHeight();

  const startAutoResizer = () => {
    updateHeight();

    if (!resizeObserver) {
      resizeObserver = new ResizeObserver(onMutation);
      resizeObserver.observe(document.documentElement);
    }

    if (!mutationObserver) {
      mutationObserver = new MutationObserver(onMutation);

      mutationObserver.observe(window.document.body, {
        attributes: true,
        childList: true,
        subtree: true,
        characterData: true,
      });
    }
  };

  const stopAutoResizer = () => {
    if (resizeObserver) {
      resizeObserver.disconnect();
      resizeObserver = null;
    }

    if (mutationObserver) {
      mutationObserver.disconnect();
      mutationObserver = null;
    }
  };

  const isAutoResizerActive = () => Boolean(resizeObserver);

  return {
    updateHeight,
    startAutoResizer,
    stopAutoResizer,
    isAutoResizerActive,
  };
};
