import React, { useContext } from 'react';

export const ZIndexContext = React.createContext<number>(10050);

export type NewZIndexProps = {
  /** A function that gets the new z-index and returns the content. */
  children: (zIndex: number) => React.ReactNode;
  /** Use this z-index, not the one of the parent plus 10. */
  forcedValue?: number;
};

/**
 * Gives its content a z-index 10 higher than the one of the parent layer.
 * Every floating layer (dialog, menu, tooltip) wraps its box in it, thus a
 * layer always shows over its parent.
 */
export default function NewZIndex({ children, forcedValue }: NewZIndexProps) {
  const currentZIndex = useContext(ZIndexContext);
  const newZindex = forcedValue ? forcedValue : currentZIndex + 10;

  return (
    <ZIndexContext.Provider value={newZindex}>
      {children(newZindex)}
    </ZIndexContext.Provider>
  );
}
