import * as React from 'react';
import { TooltipContext, TooltipOptions, useTooltip } from '../utils';

export type TooltipProps = {
  children?: React.ReactNode;
} & TooltipOptions;

/**
 * Tooltip wrapper component that provides context for TooltipTrigger and TooltipContent.
 *
 * This is a compound component pattern. The Tooltip component itself doesn't render anything,
 * but provides the necessary context for its children (TooltipTrigger and TooltipContent).
 *
 * @example Basic tooltip
 *
 * Create a simple tooltip that appears when hovering over a button:
 *
 * ```js
 * <Canvas ctx={ctx}>
 *   <Tooltip>
 *     <TooltipTrigger>
 *       <Button>Hover me</Button>
 *     </TooltipTrigger>
 *     <TooltipContent>
 *       This is helpful information!
 *     </TooltipContent>
 *   </Tooltip>
 * </Canvas>;
 * ```
 *
 * @example Tooltip with custom placement
 *
 * Control where the tooltip appears relative to its trigger using the `placement` prop:
 *
 * ```js
 * <Canvas ctx={ctx}>
 *   <Tooltip placement="right">
 *     <TooltipTrigger>
 *       <Button>Right tooltip</Button>
 *     </TooltipTrigger>
 *     <TooltipContent>
 *       Appears on the right side
 *     </TooltipContent>
 *   </Tooltip>
 * </Canvas>;
 * ```
 *
 * @example Multiple tooltips
 *
 * Use multiple tooltips on the same page to provide contextual help for different actions:
 *
 * ```js
 * <Canvas ctx={ctx}>
 *   <div style={{ display: 'flex', gap: 'var(--spacing-m)' }}>
 *     <Tooltip>
 *       <TooltipTrigger>
 *         <Button leftIcon={<SaveIcon />} />
 *       </TooltipTrigger>
 *       <TooltipContent>
 *         Save changes (⌘S)
 *       </TooltipContent>
 *     </Tooltip>
 *
 *     <Tooltip>
 *       <TooltipTrigger>
 *         <Button leftIcon={<DeleteIcon />} />
 *       </TooltipTrigger>
 *       <TooltipContent>
 *         Delete item
 *       </TooltipContent>
 *     </Tooltip>
 *   </div>
 * </Canvas>;
 * ```
 */
export function Tooltip({ children, ...options }: TooltipProps) {
  // This can accept any props as options, e.g. `placement`,
  // or other positioning options.
  const tooltip = useTooltip(options);
  return (
    <TooltipContext.Provider value={tooltip}>
      {children}
    </TooltipContext.Provider>
  );
}
