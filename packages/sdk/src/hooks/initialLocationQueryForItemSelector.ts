import type { SchemaTypes } from '@datocms/cma-client';
import { Ctx, ItemListLocationQuery } from '../ctx/base';
import { isNullish, isNumber, isRecord } from '../guardUtils.js';
import { MaybePromise } from '../utils';

type Field = SchemaTypes.Field;
type ItemType = SchemaTypes.ItemType;

export type InitialLocationQueryForItemSelectorHook = {
  /**
   * Use this function to customize the initial filters when opening a record
   * selector via a "Single link" or "Multiple links" field
   *
   * @tag locationQuery
   */
  initialLocationQueryForItemSelector: (
    openerField: Field,
    itemType: ItemType,
    ctx: InitialLocationQueryForItemSelectorCtx,
  ) => MaybePromise<InitialLocationQueryForItemSelector | undefined>;
};

export type InitialLocationQueryForItemSelectorCtx = Ctx;

/**
 * An object expressing which filters should be applied to the record selector
 *
 * @see {isInitialLocationQueryForItemSelector}
 */
export type InitialLocationQueryForItemSelector = {
  locationQuery: ItemListLocationQuery;
  /**
   * If different plugins implement the `initialLocationQueryForItemSelector`
   * hook, the one with the lowest `rank` will be used. If you want to specify
   * an explicit value for `rank`, make sure to offer a way for final users to
   * customize it inside the plugin's settings form, otherwise the hardcoded
   * value you choose might clash with the one of another plugin!
   */
  rank?: number;
};

export function isInitialLocationQueryForItemSelector(
  value: unknown,
): value is InitialLocationQueryForItemSelector {
  return (
    isRecord(value) &&
    isRecord(value.locationQuery) &&
    (isNullish(value.rank) || isNumber(value.rank))
  );
}

export function isReturnTypeOfInitialLocationQueryForItemSelectorHook(
  value: unknown,
): value is InitialLocationQueryForItemSelector | undefined {
  return isNullish(value) || isInitialLocationQueryForItemSelector(value);
}
