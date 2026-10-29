import React from 'react';

/** A text in the menu that is not an option (for example a hint) */
const Text = ({ children }: { children: React.ReactNode }) => {
  return <div className="Dropdown__menu__text">{children}</div>;
};

export default Text;
