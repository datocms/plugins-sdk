import React, { memo, useContext } from 'react';
import type { GroupBase, ValueContainerProps } from 'react-select';
import { components } from 'react-select';
import { SortableList } from '../../lists/dnd';
import { BaseSelectOption } from './';
import Context from './Context';

function SortableValueContainer<
  O extends BaseSelectOption,
  G extends GroupBase<O>,
>(props: ValueContainerProps<O, true, G>) {
  const { onDrop, disabled } = useContext(Context);

  return (
    <SortableList axis="horizontal" disabled={disabled} onDrop={onDrop}>
      <components.ValueContainer {...props} />
    </SortableList>
  );
}

export default memo(SortableValueContainer) as typeof SortableValueContainer;
