import classNames from 'classnames';
import React, {
  createContext,
  PropsWithChildren,
  ReactNode,
  useContext,
} from 'react';
import { useTranslation } from '../../i18n';
import { type TextMessage } from '../../Message';
import Tooltip from '../../overlays/Tooltip';
import RawButton from '../../semantic/RawButton';

interface ButtonBaseProps {
  /**
   * The name of the button. It is the text of the tooltip and the
   * accessible name.
   */
  label: TextMessage;
  /** The keyboard shortcut of the editor, for the tooltip. For example `mod+b`. */
  shortcut?: string;
  /**
   * Runs the command of the button. The button keeps the focus and the
   * selection in the editor, thus do not call `preventDefault()`.
   */
  onClick?: (event: React.MouseEvent) => void;
}

export type EditorToolbarButtonProps = PropsWithChildren<
  {
    /** Tells if the format of the button is on at the cursor. */
    active: boolean;
    /**
     * Fades the button and stops the click.
     * @default false
     */
    disabled?: boolean;
  } & ButtonBaseProps
>;

const TooltipPlacementContext = createContext<'top' | 'bottom'>('top');

export type EditorToolbarTooltipPlacementProps = {
  /**
   * The side of the buttons where their tooltips show. Use `bottom` for a
   * toolbar that floats above the text, such as a balloon toolbar.
   */
  value: 'top' | 'bottom';
  children: ReactNode;
};

// Gives the side of the tooltips to all the buttons inside
export function EditorToolbarTooltipPlacement({
  value,
  children,
}: EditorToolbarTooltipPlacementProps) {
  return (
    <TooltipPlacementContext.Provider value={value}>
      {children}
    </TooltipPlacementContext.Provider>
  );
}

// Stops the default action of the pointer, thus the focus and the selection
// stay in the editor
function keepEditorFocus(event: React.MouseEvent) {
  event.preventDefault();
}

export const EditorToolbarButton = ({
  active,
  disabled = false,
  label,
  shortcut,
  onClick,
  children,
}: EditorToolbarButtonProps) => {
  const { tm } = useTranslation();
  const tooltipPlacement = useContext(TooltipPlacementContext);
  const labelText = tm(label);

  return (
    <Tooltip label={labelText} shortcut={shortcut} placement={tooltipPlacement}>
      <RawButton
        // EditorToolbar sets the Tab stop of the toolbar. Out of an
        // EditorToolbar (the balloon toolbar), the button is not in the Tab
        // order: the keyboard uses the shortcuts of the editor.
        tabIndex={-1}
        onMouseDown={keepEditorFocus}
        onClick={onClick}
        className={classNames('EditorToolbar__button', {
          'is-active': active,
          'is-disabled': disabled,
        })}
        ariaLabel={labelText}
        pressed={active}
        // A disabled control of a toolbar keeps the focus, thus the arrow
        // keys do not skip it
        disabled={disabled ? 'focusable' : undefined}
      >
        {children}
      </RawButton>
    </Tooltip>
  );
};
