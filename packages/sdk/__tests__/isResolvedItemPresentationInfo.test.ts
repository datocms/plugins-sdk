import { describe, expect, it } from 'vitest';
import { isResolvedItemPresentationInfo } from '../src';

const valid = {
  id: '1',
  title: 'Hello',
  image: { type: 'image', url: 'https://example.com/a.png' },
  itemTypeId: '2',
  status: 'draft',
  currentVersionValid: true,
  publishedVersionValid: false,
  editPath: '/editor/item_types/2/items/1/edit',
};

describe('isResolvedItemPresentationInfo()', () => {
  it('accepts each kind of image', () => {
    expect(isResolvedItemPresentationInfo(valid)).toBe(true);
    expect(
      isResolvedItemPresentationInfo({
        ...valid,
        image: { type: 'file', extension: 'pdf' },
      }),
    ).toBe(true);
    expect(
      isResolvedItemPresentationInfo({ ...valid, image: null, editPath: null }),
    ).toBe(true);
  });

  it('refuses a wrong value', () => {
    expect(isResolvedItemPresentationInfo(null)).toBe(false);
    expect(isResolvedItemPresentationInfo({ ...valid, status: 'new' })).toBe(
      false,
    );
    expect(
      isResolvedItemPresentationInfo({ ...valid, image: { type: 'file' } }),
    ).toBe(false);
    expect(
      isResolvedItemPresentationInfo({ ...valid, currentVersionValid: null }),
    ).toBe(false);
  });
});
