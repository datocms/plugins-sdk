import React from 'react';

type ModalLayerProps = {
  kind: 'dialog' | 'fullscreen';
  style?: React.CSSProperties;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  /** The panel of the dialog */
  children: React.ReactNode;
};

/**
 * The layer of a dialog over the page, with its backdrop. `Modal`,
 * `FullscreenModal` and their pictures at rest (`Static.tsx`) render it.
 */
export default function ModalLayer({
  kind,
  style,
  onClick,
  children,
}: ModalLayerProps) {
  return (
    <div className={`Modal Modal--${kind}`} style={style} onClick={onClick}>
      <div className="Modal__backdrop" />
      {children}
    </div>
  );
}
