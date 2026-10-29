import React from 'react';
import { getListDetailMaxWidth } from './Split';
import { useListDetailWidths } from './Widths';

type Props = {
  // The overview of the empty section (a BlankSlate with titleLevel={1})
  children: React.ReactNode;
};

// The area of the overview of an empty section, in place of the
// ListDetail.Split. It has the same largest width as the split, thus the
// overview is in the center of the same area as the list and the detail.
function ListDetailOverview({ children }: Props) {
  const { listWidth, detailWidth } = useListDetailWidths();

  return (
    <div
      className="ListDetailOverview"
      style={{ maxWidth: getListDetailMaxWidth(listWidth, detailWidth) }}
    >
      {children}
    </div>
  );
}

export default React.memo(ListDetailOverview);
