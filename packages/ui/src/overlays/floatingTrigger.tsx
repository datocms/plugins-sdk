import mergeRefs from '@react-hook/merged-ref';
import React from 'react';

// The element that opens a Tooltip or a HoverCard. It must take a ref: an
// HTML element, or a component with React.forwardRef that gives the ref and
// the event props to its root element. Put a component without a ref in a
// <span>.
export type FloatingTrigger = React.ReactElement<
  React.HTMLAttributes<HTMLElement> & React.RefAttributes<HTMLElement>
>;

// Gives the ref and the event props of a floating element to its trigger.
// The event props of the trigger stay: getReferenceProps merges them.
export function cloneTrigger(
  trigger: FloatingTrigger,
  setReference: (node: HTMLElement | null) => void,
  getReferenceProps: (
    props: React.HTMLProps<Element>,
  ) => Record<string, unknown>,
  extraProps?: Record<string, unknown>,
) {
  const child = React.Children.only(trigger);

  return React.cloneElement(child, {
    ...getReferenceProps(child.props as React.HTMLProps<Element>),
    ...extraProps,
    // React 17 keeps the ref of an element out of its props
    ref: mergeRefs(setReference, (child as any).ref),
  });
}
