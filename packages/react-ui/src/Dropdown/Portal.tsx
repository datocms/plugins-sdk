import classNames from 'classnames';
import React from 'react';
import { type ReactNode, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { useCtx } from '..';
import s from '../Canvas/styles.module.css.json';
import { generateStyleFromCtx } from '../generateStyleFromCtx';

export function Portal({
  children,
}: {
  children: ReactNode;
}): React.ReactPortal | null {
  const ctx = useCtx();

  const elRef = useRef(
    typeof document === 'undefined' ? null : document.createElement('div'),
  );

  useEffect(() => {
    if (!elRef.current || !document.body) {
      return;
    }

    document.body.appendChild(elRef.current);

    return () => {
      if (elRef.current) {
        document.body.removeChild(elRef.current);
      }
    };
  }, []);

  if (!elRef.current) {
    return null;
  }

  return ReactDOM.createPortal(
    <div
      className={classNames(s.themeVariables, s.canvas)}
      style={generateStyleFromCtx(ctx, true)}
    >
      {children}
    </div>,
    elRef.current,
  );
}
