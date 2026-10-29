import React from 'react';

export type IconCellProps = {
  /** The icon before the label (an SVG element) */
  icon: React.ReactNode;
  /** The label */
  children: React.ReactNode;
};

/** A label with an icon before it, for example the type of a row */
function IconCell({ icon, children }: IconCellProps) {
  return (
    <span className="IconCell">
      <span className="IconCell__icon" aria-hidden="true">
        {icon}
      </span>
      {children}
    </span>
  );
}

export default React.memo(IconCell);
