import classNames from 'classnames';
import React, { memo, useContext } from 'react';
import type { GroupBase, MultiValueProps } from 'react-select';
import { components } from 'react-select';
import { SortableItem } from '../../lists/dnd';
import { stopPropagation } from '../../utils/events';
import { BaseSelectOption } from './';
import Context from './Context';

function SortableMultiValue<O extends BaseSelectOption, G extends GroupBase<O>>(
  props: MultiValueProps<O, true, G>,
) {
  const id = props.data.value!;
  const { disabled } = useContext(Context);

  return (
    <SortableItem id={id} index={props.index}>
      {({ ref, isDragging, dropIndicator }) => (
        <div
          ref={ref}
          // The user cannot move the chips of a disabled or read-only select
          className={classNames('SelectInput__chip', {
            'is-dragging': isDragging,
            'is-locked': disabled,
          })}
          /*
           These prevent the react-select dropdown from appearing when the user clicks inside a pill body
           (but outside of the actual modal open link).
          */
          onMouseDown={stopPropagation}
          onTouchEnd={stopPropagation}
        >
          <components.MultiValue {...props} />
          {dropIndicator}
        </div>
      )}
    </SortableItem>
  );
}

export default memo(SortableMultiValue) as typeof SortableMultiValue;
