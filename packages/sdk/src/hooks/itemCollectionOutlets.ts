import type { SchemaTypes } from '@datocms/cma-client';
import { Ctx } from '../ctx/base';
import {
  isArray,
  isNullish,
  isNumber,
  isRecord,
  isString,
} from '../guardUtils.js';

type ItemType = SchemaTypes.ItemType;

export type ItemCollectionOutletsHook = {
  /**
   * Use this function to declare custom outlets to be shown at the top of a
   * collection of records of a particular model
   *
   * @tag outlets
   */
  itemCollectionOutlets: (
    itemType: ItemType,
    ctx: ItemCollectionOutletsCtx,
  ) => ItemCollectionOutlet[];
};

export type ItemCollectionOutletsCtx = Ctx;

/**
 * An object expressing an outlet to be shown at the top of a record's collection page
 *
 * @see {isItemCollectionOutlet}
 */
export type ItemCollectionOutlet = {
  /**
   * ID of the outlet. Will be the first argument for the `renderItemCollectionOutlet`
   * function
   */
  id: string;
  /**
   * Multiple outlets will be sorted by ascending `rank`. If you want to specify
   * an explicit value for `rank`, make sure to offer a way for final users to
   * customize it inside the plugin's settings form, otherwise the hardcoded
   * value you choose might clash with the one of another plugin!
   */
  rank?: number;
  /** The initial height to set for the iframe that will render the outlet */
  initialHeight?: number;
};

export function isItemCollectionOutlet(
  value: unknown,
): value is ItemCollectionOutlet {
  return (
    isRecord(value) &&
    isString(value.id) &&
    (isNullish(value.rank) || isNumber(value.rank)) &&
    (isNullish(value.initialHeight) || isNumber(value.initialHeight))
  );
}

export function isReturnTypeOfItemCollectionOutletsHook(
  value: unknown,
): value is ItemCollectionOutlet[] {
  return isArray(value, isItemCollectionOutlet);
}
