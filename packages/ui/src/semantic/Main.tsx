import React from 'react';

export type MainProps = Omit<React.HTMLAttributes<HTMLElement>, 'id'>;

/**
 * The main content of the page: a landmark. A page has only one. It always
 * has the id "main-content", because the skip link of the authenticated
 * layout points to it. A heading of level 1 goes inside it.
 */
const Main = React.forwardRef<HTMLElement, MainProps>(
  function Main(props, ref) {
    return <main {...props} id="main-content" ref={ref} />;
  },
);

export default Main;
