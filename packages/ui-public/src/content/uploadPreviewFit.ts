/** A size in px */
export type BoxSize = {
  width: number;
  height: number;
};

/** The space around the asset, in px */
export type UploadPreviewPadding = [vertical: number, horizontal: number];

/**
 * The space around the asset when the caller gives no padding. Only an image
 * can have no space around it: when the caller gives zero padding, an icon
 * gets this space, because an icon without space touches the edges of the
 * box.
 */
export const DEFAULT_PADDING: UploadPreviewPadding = [10, 10];

/** The padding of an icon: an icon never touches the edges of the box. */
export function nonImagePadding(
  padding: UploadPreviewPadding,
): UploadPreviewPadding {
  return padding[0] > 0 ? padding : DEFAULT_PADDING;
}

/**
 * The size of `content` in `box`, less the padding. The content keeps its
 * aspect ratio. It becomes larger than its real size only with
 * `allowUpscale`.
 */
export function fitInBox(
  box: BoxSize,
  padding: UploadPreviewPadding,
  content: BoxSize,
  allowUpscale: boolean,
) {
  const availableWidth = Math.max(0, box.width - padding[1] * 2);
  const availableHeight = Math.max(0, box.height - padding[0] * 2);

  let scale = Math.min(
    availableWidth / content.width,
    availableHeight / content.height,
  );

  if (!allowUpscale) {
    scale = Math.min(scale, 1);
  }

  const width = content.width * scale;
  const height = content.height * scale;

  return {
    width,
    height,
    style: { width: `${width}px`, height: `${height}px` },
  };
}
