import React from 'react';

/**
 * A hairline between two parts of a filter row that must read as separate
 * cells (for example the text filter and the filters of the fields). It takes
 * the full height of the cells, and at least the height of a field.
 */
function Divider() {
  return <div className="Toolbar__divider" aria-hidden="true" />;
}

export default Divider;
