import React, { ReactNode } from 'react';

export type SubtitleProps = {
  /** A short text, for example the count of a list ("7,206 assets") */
  children: ReactNode;
  /** The subtitle does not show */
  hidden?: boolean;
};

/** A quiet text immediately after the title */
function Subtitle({ children, hidden }: SubtitleProps) {
  return hidden ? null : <div className="Toolbar__subtitle">{children}</div>;
}

export default Subtitle;
