import React from 'react';

/**
 * The surface of a card. `HoverCard` and its picture at rest (`Static.tsx`)
 * render it.
 */
const HoverCardSurface = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(function HoverCardSurface(props, ref) {
  return <div ref={ref} {...props} className="HoverCard" />;
});

export default HoverCardSurface;
