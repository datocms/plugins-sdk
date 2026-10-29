import React from 'react';
import { Generic } from '../../../icons/index';
import Button from '../../actions/Button';
import { useTranslation } from '../../i18n';
import ToolbarRoot from '../../layout/Toolbar/Root';
import ToolbarSpace from '../../layout/Toolbar/Space';
import ToolbarTitle from '../../layout/Toolbar/Title';
import { type Message } from '../../Message';

/** The names of the widths of a dialog */
export type ModalWidth = 's' | 'm' | 'l' | 'xl';

const widthShortcuts: Record<ModalWidth, number> = {
  s: 600,
  m: 700,
  l: 900,
  xl: 1010,
};

type ModalPanelProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> & {
  width: ModalWidth | number | undefined;
  /** The title of the header. Without it, the dialog has no header. */
  title?: Message;
  titleId?: string;
  /** The cross shows when this prop is set */
  closeButton?: { onClick?: (event: React.MouseEvent) => void };
  freeContent: boolean;
  /**
   * The content renders only when this is true (see `didMount` of
   * `useModalClose`)
   * @default true
   */
  showContent?: boolean;
  children?: React.ReactNode;
};

/**
 * The panel of a dialog: the header, the cross and the body. `Modal` and
 * its picture at rest (`Static.tsx`) render it.
 */
const ModalPanel = React.forwardRef<HTMLDivElement, ModalPanelProps>(
  function ModalPanel(
    {
      width,
      title,
      titleId,
      closeButton,
      freeContent,
      showContent = true,
      children,
      ...rest
    },
    ref,
  ) {
    const { tc } = useTranslation();
    const maxWidth =
      typeof width === 'number' ? width : widthShortcuts[width ?? 's'];

    const crossLook = {
      tone: 'ghost',
      size: 'micro',
      iconOnly: true,
      icon: Generic.CloseIcon,
      label: { id: 'modal.close' },
      className: title ? 'Modal__header__close' : 'Modal__floating-close',
    } as const;
    const cross =
      closeButton &&
      (closeButton.onClick ? (
        <Button {...crossLook} onClick={closeButton.onClick} />
      ) : (
        <Button {...crossLook} />
      ));

    return (
      <div
        ref={ref}
        {...rest}
        className="Modal__content"
        style={{ maxWidth: `${maxWidth}px` }}
      >
        <div className="Modal__content__inner">
          {title ? (
            <ToolbarRoot borderBottom={true} className="Modal__header">
              <ToolbarTitle level={1} id={titleId}>
                {tc(title)}
              </ToolbarTitle>
              <ToolbarSpace />
              {cross}
            </ToolbarRoot>
          ) : (
            cross
          )}
          {freeContent && showContent && children}
          {!freeContent && showContent && (
            <div className="Modal__body">{children}</div>
          )}
        </div>
      </div>
    );
  },
);

export default ModalPanel;
