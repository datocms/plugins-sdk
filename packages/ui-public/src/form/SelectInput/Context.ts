import { createContext } from 'react';
import type { SortableDropResult } from '../../lists/dnd';

export type SelectContextType = {
  disabled: boolean;
  onDrop: (result: SortableDropResult) => void;
};

export default createContext<SelectContextType>({
  disabled: false,
  onDrop: () => {},
});
