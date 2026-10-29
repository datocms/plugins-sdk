import React, { useLayoutEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { ButtonSizeContext } from '../actions/Button';
import { InToolbarContext } from '../layout/Toolbar/context';
import { usePortalWrapper } from './PortalWrapper';

export type PortalProps = {
  /** The content to render at the end of the body. */
  children?: React.ReactNode;
};

/**
 * Renders its children in a new element at the end of the body. Dialogs,
 * menus and tooltips use it to escape the overflow and the stacking context
 * of their parents.
 */
const Portal = React.memo(function Portal({ children }: PortalProps) {
  const Wrapper = usePortalWrapper();
  const elRef = useRef<HTMLDivElement | null>(null);

  if (!elRef.current) {
    elRef.current = document.createElement('div');
  }

  // Attach the element in a layout effect, so it is in the document before
  // the passive effects of the children run (for example, a focus call)
  useLayoutEffect(() => {
    const el = elRef.current;
    if (el) {
      document.body.appendChild(el);
    }

    return () => {
      if (el) {
        document.body.removeChild(el);
      }
    };
  }, []);

  // The content of a portal (a menu, a dialog, a tooltip) is not in the
  // toolbar, also when a toolbar renders it. Thus its buttons get the size
  // of the buttons out of a toolbar (see useButtonSize).
  return ReactDOM.createPortal(
    <InToolbarContext.Provider value={false}>
      <ButtonSizeContext.Provider value="small">
        {Wrapper ? <Wrapper>{children}</Wrapper> : children}
      </ButtonSizeContext.Provider>
    </InToolbarContext.Provider>,
    elRef.current,
  );
});

export default Portal;
