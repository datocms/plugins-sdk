import { Ctx } from '../ctx/base';
import {
  isArray,
  isNullish,
  isNumber,
  isRecord,
  isString,
} from '../guardUtils.js';
import { Icon, isIcon } from '../icon';

export type AssetSourcesHook = {
  /**
   * Use this function to declare additional sources to be shown when users want
   * to upload new assets
   *
   * @tag assetSources
   */
  assetSources: (ctx: AssetSourcesCtx) => AssetSource[] | undefined;
};

export type AssetSourcesCtx = Ctx;

/**
 * An object expressing an additional asset source
 *
 * @see {isAssetSource}
 */
export type AssetSource = {
  /**
   * ID of the asset source. Will be the first argument for the
   * `renderAssetSource` function
   */
  id: string;
  /** Name of the asset that will be shown to the user */
  name: string;
  /**
   * Icon to be shown alongside the name. Can be a FontAwesome icon name (ie.
   * `"address-book"`) or a custom SVG definition. To maintain visual
   * consistency with the rest of the interface, try to use FontAwesome icons
   * whenever possible.
   */
  icon: Icon;
  /**
   * Configuration options for the modal that will be opened to select a media
   * file from this source
   */
  modal?: {
    /** Width of the modal. Can be a number, or one of the predefined sizes */
    width?: 's' | 'm' | 'l' | 'xl' | number;
    /**
     * The initial height to set for the iframe that will render the modal
     * content
     */
    initialHeight?: number;
  };
};

export function isAssetSource(value: unknown): value is AssetSource {
  if (isNullish(value)) return false;
  if (!isRecord(value)) return false;

  const { id, name, icon, modal } = value;

  return (
    isString(id) &&
    isString(name) &&
    isIcon(icon) &&
    (isNullish(modal) ||
      (isRecord(modal) &&
        (isNullish(modal.width) ||
          (isString(modal.width) &&
            ['s', 'm', 'l', 'xl'].includes(modal.width)) ||
          isNumber(modal.width)) &&
        (isNullish(modal.initialHeight) || isNumber(modal.initialHeight))))
  );
}

export function isReturnTypeOfAssetSourcesHook(
  value: unknown,
): value is AssetSource[] | undefined {
  return isNullish(value) || isArray(value, isAssetSource);
}
