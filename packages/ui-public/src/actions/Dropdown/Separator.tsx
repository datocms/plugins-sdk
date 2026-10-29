import React, { useContext } from 'react';
import MenuContext from './MenuContext';

/**
 * A line between two parts of a menu. It does not show while the search
 * field has a term.
 */
const Separator = () => {
  const { searchTerm } = useContext(MenuContext);

  if (searchTerm) {
    return null;
  }

  return <div className="Dropdown__menu__separator" />;
};

export default Separator;
