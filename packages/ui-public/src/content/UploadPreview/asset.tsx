import React, {
  forwardRef,
  type ReactNode,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { useElementLayout } from '../../hooks/useElementLayout';
import Image, { type ImageProps } from '../../semantic/Image';
import FileTypeIcon from '../FileTypeIcon';
import { type AudioPlayback, AudioPlayPause } from './audio';
import UploadPreviewBox from './box';
import {
  type BoxSize,
  DEFAULT_PADDING,
  fitInBox,
  nonImagePadding,
  type UploadPreviewPadding,
} from './fit';
import { ThumbhashCanvas } from './thumbhash';
import {
  type UploadPreviewUpload,
  uploadDefaultPosterTime,
  uploadFileUrl,
  uploadPreviewKind,
  videoFrameUrl,
} from './upload';

const MAX_DOCUMENT_ICON_HEIGHT = 100;

// 448x512 is the size of the drawing of FileTypeIcon
const DOCUMENT_ICON_SIZE: BoxSize = {
  width: (448 / 512) * MAX_DOCUMENT_ICON_HEIGHT,
  height: MAX_DOCUMENT_ICON_HEIGHT,
};

export type UploadAssetPreviewProps = {
  /**
   * The asset. `undefined` while it loads: the box is empty. `null` for an
   * asset that does not exist: the box shows a blank file icon.
   */
  upload: UploadPreviewUpload | null | undefined;
  /** The size of the box. Without it, the box measures its element. */
  box?: BoxSize;
  padding?: UploadPreviewPadding;
  transparent?: boolean;
  link?: { href: string; target?: string };
  /**
   * The frame of a video, in seconds. `undefined` reads the default of the
   * asset. `null` is the default frame of the video service.
   */
  posterTime?: number | null;
  children?: ReactNode;
  /**
   * Puts other content around the image, only for an image that the image
   * service transforms. The style gives the size of the image.
   */
  wrapImage?: (
    image: ReactNode,
    style: { width: string; height: string },
  ) => ReactNode;
  /**
   * For a sound file: the playback of a parent that has its own play
   * control. Then the waveform has no button.
   */
  audioPlayback?: AudioPlayback;
};

// When `src` changes, the old file stays on screen until the new file loads,
// thus the image does not go away when it changes its size.
const FadeInImage = ({ style, src, ...props }: ImageProps) => {
  const [loadedSrc, setLoadedSrc] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!src) {
      return;
    }

    const image = new window.Image();

    image.onload = () => {
      setLoadedSrc(src);
    };

    image.src = src;

    return () => {
      image.onload = null;
      image.src = '';
    };
  }, [src]);

  return (
    <Image
      {...props}
      src={loadedSrc}
      style={{
        ...style,
        transition: 'opacity 0.2s ease-in-out',
        opacity: loadedSrc ? 1 : 0,
      }}
    />
  );
};

type ThumbhashImageProps = {
  thumbhash: string;
  src: string;
  style: { width: string; height: string };
};

// The blurred picture of the thumbhash shows until the image loads
const ThumbhashImage = React.memo(function ThumbhashImage({
  thumbhash,
  src,
  style,
}: ThumbhashImageProps) {
  const [isLoaded, setLoaded] = useState(false);

  return (
    <div style={{ ...style, position: 'relative' }} className="checkboard-bg">
      <ThumbhashCanvas
        thumbhash={thumbhash}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
          opacity: isLoaded ? 0 : 1,
          transition: 'opacity 0.2s ease-in-out',
        }}
      />
      <FadeInImage
        src={src}
        style={{
          ...style,
          position: 'relative',
          display: 'block',
          zIndex: '1',
        }}
        onLoad={() => setLoaded(true)}
        alt=""
        draggable="false"
      />
    </div>
  );
});

// The asset loads only when the box is on the screen. Once it shows, it
// stays.
function useHasBeenVisible(ref: React.RefObject<HTMLElement | null>) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;

    if (visible || !element) {
      return;
    }

    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        observer.disconnect();
        setVisible(true);
      }
    });

    observer.observe(element);

    return () => observer.disconnect();
  }, [ref, visible]);

  return visible;
}

function pixelRatio() {
  return typeof window === 'undefined' ? 1 : window.devicePixelRatio || 1;
}

type AssetProps = Pick<
  UploadAssetPreviewProps,
  'padding' | 'posterTime' | 'wrapImage' | 'audioPlayback'
> & {
  upload: UploadPreviewUpload | null;
  box: BoxSize;
  padding: UploadPreviewPadding;
};

function renderAsset({
  upload,
  box,
  padding,
  posterTime,
  wrapImage,
  audioPlayback,
}: AssetProps): ReactNode {
  const iconPadding = nonImagePadding(padding);

  if (!upload) {
    const fit = fitInBox(box, iconPadding, DOCUMENT_ICON_SIZE, false);

    return <FileTypeIcon style={fit.style} extension="" />;
  }

  const { attributes } = upload;
  const kind = uploadPreviewKind(attributes);

  if (kind === 'audio') {
    return (
      <AudioPlayPause
        url={attributes.url}
        playback={audioPlayback}
        width={box.width}
        height={box.height}
      />
    );
  }

  if (kind === 'video-encoding') {
    return (
      <UploadPreviewBox.Progress
        percent={0}
        label={{ id: 'uploadPreview.encodingVideo' }}
      />
    );
  }

  if (kind === 'file' || !attributes.width || !attributes.height) {
    const fit = fitInBox(box, iconPadding, DOCUMENT_ICON_SIZE, false);

    return (
      <FileTypeIcon style={fit.style} extension={attributes.format ?? ''} />
    );
  }

  const content = { width: attributes.width, height: attributes.height };
  const upscale = attributes.format?.toLowerCase() === 'svg';
  const fit = fitInBox(box, padding, content, upscale);
  const downloadWidth = Math.round(pixelRatio() * fit.width);

  if (kind === 'video' && attributes.mux_playback_id) {
    const src = videoFrameUrl(
      attributes.mux_playback_id,
      downloadWidth,
      posterTime !== undefined ? posterTime : uploadDefaultPosterTime(upload),
    );

    if (attributes.thumbhash) {
      return (
        <ThumbhashImage
          key={attributes.mux_playback_id}
          thumbhash={attributes.thumbhash}
          src={src}
          style={fit.style}
        />
      );
    }

    return <UploadPreviewBox.Image src={src} {...content} alt="" />;
  }

  if (kind === 'image') {
    const src = uploadFileUrl(attributes, { auto: 'format', w: downloadWidth });
    const image = attributes.thumbhash ? (
      <ThumbhashImage
        key={attributes.thumbhash}
        thumbhash={attributes.thumbhash}
        src={src}
        style={fit.style}
      />
    ) : (
      <FadeInImage key={attributes.url} style={fit.style} src={src} alt="" />
    );

    return wrapImage ? wrapImage(image, fit.style) : image;
  }

  return (
    <UploadPreviewBox.Image
      src={uploadFileUrl(attributes)}
      {...content}
      upscale={upscale}
      alt=""
    />
  );
}

/**
 * The preview of an asset entity: the image, the frame of a video, the
 * waveform of a sound, or the icon of the format. The `UploadPreview` and
 * the `UploadCard` with `upload` render it.
 */
export const UploadAssetPreview = forwardRef<
  HTMLElement,
  UploadAssetPreviewProps
>(function UploadAssetPreview(
  {
    upload,
    box: fixedBox,
    padding = DEFAULT_PADDING,
    transparent,
    link,
    posterTime,
    children,
    wrapImage,
    audioPlayback,
  },
  ref,
) {
  const elementRef = useRef<HTMLElement>(null);
  useImperativeHandle(ref, () => elementRef.current as HTMLElement);

  const rect = useElementLayout(elementRef);
  const visible = useHasBeenVisible(elementRef);

  const box: BoxSize | null =
    fixedBox ??
    (rect.width && rect.height
      ? { width: rect.width, height: rect.height }
      : null);

  return (
    <UploadPreviewBox
      ref={elementRef}
      box={box}
      fixedSize={!!fixedBox}
      padding={padding}
      transparent={transparent}
      link={link}
    >
      {visible &&
        box &&
        upload !== undefined &&
        renderAsset({
          upload,
          box,
          padding,
          posterTime,
          wrapImage,
          audioPlayback,
        })}
      {children}
    </UploadPreviewBox>
  );
});
