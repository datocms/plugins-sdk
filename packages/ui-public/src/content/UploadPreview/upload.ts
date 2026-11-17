/**
 * The metadata of an asset in one locale. An older plugin SDK gives
 * `default_field_metadata` keyed by locale (`{ en: { alt, title } }`); the
 * API and the newer SDKs give it keyed by field (`{ alt: { en } }`). The
 * helpers read the two shapes.
 */
type LocaleMetadata = {
  alt?: string | null;
  title?: string | null;
  poster_time?: number | null;
};

type FieldKeyedMetadata = {
  alt: { [locale: string]: string | null };
  title: { [locale: string]: string | null };
  poster_time?: number | null;
};

type LocaleKeyedMetadata = { [locale: string]: LocaleMetadata };

/**
 * An asset of the Media Area as the API and `ctx` give it (for example
 * `ctx.selectUpload()` or `ctx.loadUploads()`). The preview reads only these
 * fields.
 */
export type UploadPreviewUpload = {
  id?: string;
  attributes: {
    /** The full URL of the file */
    url: string;
    filename?: string;
    format: string | null;
    size: number;
    width: number | null;
    height: number | null;
    mime_type: string | null;
    md5?: string | null;
    thumbhash?: string | null;
    mux_playback_id?: string | null;
    default_field_metadata?: FieldKeyedMetadata | LocaleKeyedMetadata;
  };
  meta?: { antivirus?: { status?: string | null } | null };
};

type Attributes = UploadPreviewUpload['attributes'];

function isFieldKeyed(
  metadata: FieldKeyedMetadata | LocaleKeyedMetadata,
): metadata is FieldKeyedMetadata {
  return (
    typeof metadata.alt === 'object' &&
    metadata.alt !== null &&
    !('alt' in metadata.alt) &&
    !('title' in metadata.alt)
  );
}

/**
 * The metadata of an asset in the value of a file or gallery field. Each
 * value is null when the field uses the default of the asset.
 */
export type UploadFieldValue = {
  alt?: string | null;
  title?: string | null;
  /** The frame of a video, in seconds */
  poster_time?: number | null;
};

/**
 * The default alternate text and title of an asset, from the Media Area. Each
 * value is the one of the first locale of `locales` that is not null, as the
 * gallery field of DatoCMS reads it: an empty text does not fall back.
 */
export function uploadDefaultMetadata(
  upload: UploadPreviewUpload,
  locales: string[],
): { alt: string | null; title: string | null } {
  const metadata = upload.attributes.default_field_metadata;

  function first(field: 'alt' | 'title') {
    if (!metadata) {
      return null;
    }

    for (const locale of locales) {
      const value = isFieldKeyed(metadata)
        ? metadata[field][locale]
        : metadata[locale]?.[field];

      if (value != null) {
        return value;
      }
    }

    return null;
  }

  return { alt: first('alt'), title: first('title') };
}

/**
 * The default frame of a video, in seconds, from the Media Area. Null for the
 * default frame of the video service.
 */
export function uploadDefaultPosterTime(upload: UploadPreviewUpload) {
  const metadata = upload.attributes.default_field_metadata;

  if (!metadata) {
    return null;
  }

  if (isFieldKeyed(metadata)) {
    return metadata.poster_time ?? null;
  }

  // The poster time is the same in every locale
  return Object.values(metadata)[0]?.poster_time ?? null;
}

// The formats that the image service transforms (Upload::IMGIX_INPUT_FORMATS
// of the API)
const formatsWithTransformations = new Set([
  'ai',
  'avif',
  'bmp',
  'gif',
  'heic',
  'ico',
  'icns',
  'jpg',
  'jpeg',
  'pct',
  'png',
  'psd',
  'tif',
  'tiff',
  'webp',
]);

const formatsShownByBrowser = new Set([
  'bmp',
  'gif',
  'jpeg',
  'jpg',
  'png',
  'svg',
  'webp',
]);

// A one-pixel AVIF file
const AVIF_PROBE =
  'data:image/avif;base64,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';

let probeStarted = false;

// The browser decodes AVIF only in its newer versions. The probe runs at the
// first use in a browser, not when the module loads, thus a render on a
// server does not need the DOM.
function probeBrowserFormats() {
  if (probeStarted || typeof Image === 'undefined') {
    return;
  }

  probeStarted = true;

  const image = new Image();

  image.onload = () => {
    if (image.width === 1) {
      formatsShownByBrowser.add('avif');
    }
  };
  image.src = AVIF_PROBE;
}

/** The image service of DatoCMS transforms (crops, resizes) this format */
export function formatSupportsTransformations(format: string | null) {
  return !!format && formatsWithTransformations.has(format.toLowerCase());
}

/** The browser shows a file of this format in an image */
export function formatShownByBrowser(format: string | null) {
  probeBrowserFormats();
  return !!format && formatsShownByBrowser.has(format.toLowerCase());
}

// A file that the browser shows but that the image service does not resize
// shows as it is only when it is small
const MAX_SIZE_OF_FILE_SHOWN_AS_IT_IS = 350000;

export type UploadPreviewKind =
  /** A file that the image service resizes */
  | 'image'
  /** A small file that the browser shows as it is (an SVG) */
  | 'file-image'
  /** A video with its frame */
  | 'video'
  /** A video that the video service still encodes */
  | 'video-encoding'
  | 'audio'
  /** Any other file: the icon of its format */
  | 'file';

/** What the preview of an asset shows */
export function uploadPreviewKind(attributes: Attributes): UploadPreviewKind {
  const { format, width, height, size } = attributes;

  if (attributes.mime_type?.startsWith('audio')) {
    return 'audio';
  }

  if (attributes.mux_playback_id && width && height) {
    return 'video';
  }

  // A video without a size is still in the video service. A file with a
  // format shows the icon of its format.
  if (attributes.mux_playback_id && !format) {
    return 'video-encoding';
  }

  if (!width || !height) {
    return 'file';
  }

  if (formatSupportsTransformations(format)) {
    return 'image';
  }

  if (
    formatShownByBrowser(format) &&
    size &&
    size < MAX_SIZE_OF_FILE_SHOWN_AS_IT_IS
  ) {
    return 'file-image';
  }

  return 'file';
}

/**
 * The URL of the file, with a parameter that changes when the file changes:
 * the browser does not show an old copy from its cache. A change of the
 * metadata does not change it.
 */
export function uploadFileUrl(
  attributes: Attributes,
  params: Record<string, string | number> = {},
) {
  const url = new URL(attributes.url);

  if (attributes.md5) {
    url.searchParams.set('ts', attributes.md5.substring(0, 8));
  }

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, String(value));
  }

  return url.toString();
}

/**
 * The URL of a frame of a video, at this width in image pixels. Without
 * `posterTime`, the frame is the one of the video service.
 */
export function videoFrameUrl(
  muxPlaybackId: string,
  width: number,
  posterTime: number | null,
) {
  const time = posterTime != null ? `&time=${posterTime}` : '';

  return `https://image.mux.com/${muxPlaybackId}/thumbnail.jpg?width=${width}${time}`;
}
