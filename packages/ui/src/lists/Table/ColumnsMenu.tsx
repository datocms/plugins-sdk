import React, { useMemo } from 'react';
import { Generic } from '../../../icons/index';
import { Dropdown } from '../../actions/Dropdown';
import { useTranslation } from '../../i18n';
import type { SortableDropResult } from '../dnd';
import type { TableColumn } from './types';

type Props = {
  columns: TableColumn[];
  columnNames: string[];
  onMove: (result: SortableDropResult) => void;
  onToggle: (columnName: string) => void;
};

function ColumnsMenu({ columns, columnNames, onMove, onToggle }: Props) {
  const { tc } = useTranslation();
  const visibleColumns = useMemo(
    () =>
      columnNames
        .map((name) => columns.find((column) => column.name === name))
        .filter((column): column is TableColumn => Boolean(column)),
    [columns, columnNames],
  );

  const hiddenColumns = useMemo(
    () => columns.filter((column) => !columnNames.includes(column.name)),
    [columns, columnNames],
  );

  return (
    <div className="Table__settings">
      <Dropdown
        triggerComponent={Dropdown.IconTrigger}
        icon={Generic.ProjectSettingsIcon}
      >
        <Dropdown.Menu placement="bottom-end">
          <Dropdown.Group
            name={{ id: 'itemTable.columns.displayed' }}
            onDragEnd={onMove}
          >
            {visibleColumns.map((column, index) => (
              <Dropdown.Option
                key={column.name}
                sortable={{ id: column.name, index }}
                actions={
                  visibleColumns.length > 1 && (
                    <Dropdown.OptionAction
                      icon={Generic.HideIcon}
                      label={{ id: 'itemTable.columns.hide' }}
                      onClick={() => onToggle(column.name)}
                      closeMenuOnClick={false}
                    />
                  )
                }
              >
                {tc(column.label)}
              </Dropdown.Option>
            ))}
          </Dropdown.Group>
          {hiddenColumns.length > 0 && (
            <Dropdown.Group name={{ id: 'itemTable.columns.available' }}>
              {hiddenColumns.map((column) => (
                <Dropdown.Option
                  closeMenuOnClick={false}
                  key={column.name}
                  onPick={() => onToggle(column.name)}
                >
                  {tc(column.label)}
                </Dropdown.Option>
              ))}
            </Dropdown.Group>
          )}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}

export default React.memo(ColumnsMenu);
