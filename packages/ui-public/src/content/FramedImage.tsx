import React, { ReactNode, useCallback, useState } from 'react';
import { useTranslation } from '../i18n';
import { type Message, type TextMessage } from '../Message';
import Modal from '../overlays/Modal';
import Image from '../semantic/Image';
import RawButton from '../semantic/RawButton';

export type FramedImageProps = {
  /** The URL of the image in the frame. */
  src: string;
  /**
   * What the image shows. It is also the title of the dialog. For example
   * "The trigger of a GitLab pipeline".
   */
  alt: TextMessage;
  /** One line below the image, in the hint style. */
  caption?: Message;
  /**
   * The URL of the image that the dialog shows at full size. Use it when the
   * image in the frame is a small rendition of it. Without it, the dialog
   * shows `src`.
   */
  largeSrc?: string;
};

function FramedImage({ src, largeSrc, alt, caption }: FramedImageProps) {
  const [open, setOpen] = useState(false);
  const { tm, tc } = useTranslation();
  const altText = tm(alt);

  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);

  return (
    <figure className="FramedImage">
      <RawButton className="FramedImage__button" onClick={handleOpen}>
        <Image src={src} alt={alt} className="FramedImage__image" />
      </RawButton>
      {caption && (
        <figcaption className="FramedImage__caption">{tc(caption)}</figcaption>
      )}
      {open && (
        <Modal
          {...(altText
            ? { title: altText }
            : { ariaLabel: { id: 'framedImage.enlarged' } })}
          width="xl"
          onClose={handleClose}
        >
          <Image
            src={largeSrc ?? src}
            alt={alt}
            className="FramedImage__large"
          />
        </Modal>
      )}
    </figure>
  );
}

export default React.memo(FramedImage);
