import React, { ReactNode } from 'react';

export const EditorToolbarGroup = React.memo(function EditorToolbarGroup({
  children,
}: {
  children: ReactNode | undefined;
}) {
  return <div className="EditorToolbar__group">{children}</div>;
});
