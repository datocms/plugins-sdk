import type { SchemaTypes } from '@datocms/cma-client';
import { Ctx } from '../ctx/base';
import { isNullish, isNumber, isRecord, isString } from '../guardUtils.js';
import type { MaybePromise } from '../utils';

type Item = SchemaTypes.Item;

export type BuildItemPresentationInfoHook = {
  /**
   * Use this function to customize the presentation of a record in records
   * collections and "Single link" or "Multiple links" field
   *
   * @tag presentation
   */
  buildItemPresentationInfo: (
    item: Item,
    ctx: BuildItemPresentationInfoCtx,
  ) => MaybePromise<ItemPresentationInfo | undefined>;
};

export type BuildItemPresentationInfoCtx = Ctx;

/**
 * An object expressing how a record should be presented in the interface
 *
 * @see {isItemPresentationInfo}
 */
export type ItemPresentationInfo = {
  /** The title to present the record */
  title: string;
  /** An image representative of the record */
  imageUrl?: string;
  /**
   * If different plugins implement the `buildItemPresentationInfo` hook, the
   * one with the lowest `rank` will be used. If you want to specify an explicit
   * value for `rank`, make sure to offer a way for final users to customize it
   * inside the plugin's settings form, otherwise the hardcoded value you choose
   * might clash with the one of another plugin!
   */
  rank?: number;
};

export function isItemPresentationInfo(
  value: unknown,
): value is ItemPresentationInfo {
  return (
    isRecord(value) &&
    isString(value.title) &&
    (isNullish(value.imageUrl) || isString(value.imageUrl)) &&
    (isNullish(value.rank) || isNumber(value.rank))
  );
}

export function isReturnTypeOfBuildItemPresentationInfoHook(
  value: unknown,
): value is ItemPresentationInfo | undefined {
  return isNullish(value) || isItemPresentationInfo(value);
}
