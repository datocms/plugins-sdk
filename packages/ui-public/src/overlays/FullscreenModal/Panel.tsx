import React from 'react';
import { Generic } from '../../../icons/index';
import Button from '../../actions/Button';

type FullscreenModalPanelProps = React.HTMLAttributes<HTMLDivElement> & {
  /** The cross shows when this prop is set */
  closeButton?: { onClick?: (event: React.MouseEvent) => void };
  /** The element with the name of the dialog, before the cross */
  name?: React.ReactNode;
};

const crossLook = {
  tone: 'ghost',
  size: 'large',
  iconOnly: true,
  icon: Generic.CloseIcon,
  label: { id: 'modal.close' },
  className: 'Modal__close',
} as const;

/**
 * The panel of a FullscreenModal: the cross and the content. The
 * `FullscreenModal` and its picture at rest (`Static.tsx`) render it.
 */
const FullscreenModalPanel = React.forwardRef<
  HTMLDivElement,
  FullscreenModalPanelProps
>(function FullscreenModalPanel({ closeButton, name, children, ...rest }, ref) {
  return (
    <div ref={ref} {...rest} className="Modal__content">
      {name}
      {closeButton &&
        (closeButton.onClick ? (
          <Button {...crossLook} onClick={closeButton.onClick} />
        ) : (
          <Button {...crossLook} />
        ))}
      <div className="Modal__content__inner">{children}</div>
    </div>
  );
});

export default FullscreenModalPanel;
