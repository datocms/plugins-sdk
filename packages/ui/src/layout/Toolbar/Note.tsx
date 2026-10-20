import React, { ReactNode } from 'react';

/**
 * A short quiet text before a button at the end of the toolbar, that tells
 * why the button is there (for example "New version available!" before
 * "Update"). It ends with an ellipsis when the toolbar is narrow.
 */
function Note({ children }: { children: ReactNode }) {
  return <span className="Toolbar__note">{children}</span>;
}

export default Note;
