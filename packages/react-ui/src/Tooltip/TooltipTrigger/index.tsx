import { useMergeRefs } from '@floating-ui/react';
import * as React from 'react';
import { useTooltipState } from '../utils';

export type TooltipTriggerProps = {
  children: React.ReactElement;
};

/**
 * TooltipTrigger wraps the element that triggers the tooltip on hover/focus.
 *
 * The child must be a single React element that accepts ref and event handler props.
 * Common triggers include buttons, icons, or other interactive elements.
 *
 * @example With Button component
 *
 * Wrap a button to show a tooltip when the user hovers over it:
 *
 * ```js
 * <Canvas ctx={ctx}>
 *   <Tooltip>
 *     <TooltipTrigger>
 *       <Button>Hover for info</Button>
 *     </TooltipTrigger>
 *     <TooltipContent>
 *       Additional information appears here
 *     </TooltipContent>
 *   </Tooltip>
 * </Canvas>;
 * ```
 *
 * @example With icon button
 *
 * Use tooltips with icon-only buttons to explain their purpose:
 *
 * ```js
 * <Canvas ctx={ctx}>
 *   <Tooltip placement="bottom">
 *     <TooltipTrigger>
 *       <Button buttonSize="s" leftIcon={<InfoIcon />} />
 *     </TooltipTrigger>
 *     <TooltipContent>
 *       Click for more details
 *     </TooltipContent>
 *   </Tooltip>
 * </Canvas>;
 * ```
 */
export const TooltipTrigger = React.forwardRef<
  HTMLElement,
  TooltipTriggerProps
>(function TooltipTrigger({ children, ...props }, propRef) {
  const state = useTooltipState();

  const childrenRef = (children as any).ref;
  const ref = useMergeRefs([state.refs.setReference, propRef, childrenRef]);

  if (!React.isValidElement(children)) {
    throw new Error('TooltipTrigger children must be a valid React element');
  }

  return React.cloneElement(
    children,
    state.getReferenceProps({
      ref,
      ...props,
      ...children.props,
      'data-state': state.open ? 'open' : 'closed',
    }),
  );
});
