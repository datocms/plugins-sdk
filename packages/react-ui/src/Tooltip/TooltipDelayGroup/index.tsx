import { FloatingDelayGroup } from '@floating-ui/react';
import * as React from 'react';

export type TooltipDelayGroupProps = {
  children?: React.ReactNode;
  /** The delay in milliseconds before a tooltip opens on hover (default: 1000) */
  delay?: number | { open?: number; close?: number };
  /** How long to wait in milliseconds before closing the group (default: 0) */
  timeoutMs?: number;
};

/**
 * TooltipDelayGroup synchronizes hover delays across multiple tooltips.
 *
 * When tooltips are wrapped in a delay group, hovering over the first tooltip
 * will use the configured delay, but subsequent tooltips in the group will
 * open instantly. This creates a smoother UX when users explore multiple
 * interactive elements with tooltips.
 *
 * @example Basic delay group
 *
 * Group multiple tooltips together so they open instantly after the first one:
 *
 * ```js
 * <Canvas ctx={ctx}>
 *   <TooltipDelayGroup delay={500}>
 *     <div style={{ display: 'flex', gap: 'var(--spacing-m)' }}>
 *       <Tooltip>
 *         <TooltipTrigger>
 *           <Button leftIcon={<SaveIcon />} />
 *         </TooltipTrigger>
 *         <TooltipContent>Save changes</TooltipContent>
 *       </Tooltip>
 *
 *       <Tooltip>
 *         <TooltipTrigger>
 *           <Button leftIcon={<UndoIcon />} />
 *         </TooltipTrigger>
 *         <TooltipContent>Undo</TooltipContent>
 *       </Tooltip>
 *
 *       <Tooltip>
 *         <TooltipTrigger>
 *           <Button leftIcon={<RedoIcon />} />
 *         </TooltipTrigger>
 *         <TooltipContent>Redo</TooltipContent>
 *       </Tooltip>
 *     </div>
 *   </TooltipDelayGroup>
 * </Canvas>;
 * ```
 *
 * @example Custom delay configuration
 *
 * Configure different delays for opening and closing tooltips in the group:
 *
 * ```js
 * <Canvas ctx={ctx}>
 *   <TooltipDelayGroup delay={{ open: 800, close: 200 }} timeoutMs={500}>
 *     <div style={{ display: 'flex', gap: 'var(--spacing-s)' }}>
 *       <Tooltip>
 *         <TooltipTrigger>
 *           <Button>Action 1</Button>
 *         </TooltipTrigger>
 *         <TooltipContent>First action</TooltipContent>
 *       </Tooltip>
 *
 *       <Tooltip>
 *         <TooltipTrigger>
 *           <Button>Action 2</Button>
 *         </TooltipTrigger>
 *         <TooltipContent>Second action</TooltipContent>
 *       </Tooltip>
 *     </div>
 *   </TooltipDelayGroup>
 * </Canvas>;
 * ```
 *
 * @example Toolbar with grouped tooltips
 *
 * Create a toolbar where hovering between tools feels instant and responsive:
 *
 * ```js
 * <Canvas ctx={ctx}>
 *   <TooltipDelayGroup delay={600}>
 *     <div style={{
 *       display: 'flex',
 *       gap: 'var(--spacing-xs)',
 *       padding: 'var(--spacing-s)',
 *       borderRadius: 'var(--border-radius-m)',
 *       backgroundColor: 'var(--light-bg-color)'
 *     }}>
 *       <Tooltip>
 *         <TooltipTrigger>
 *           <Button buttonSize="s" leftIcon={<BoldIcon />} />
 *         </TooltipTrigger>
 *         <TooltipContent>Bold</TooltipContent>
 *       </Tooltip>
 *
 *       <Tooltip>
 *         <TooltipTrigger>
 *           <Button buttonSize="s" leftIcon={<ItalicIcon />} />
 *         </TooltipTrigger>
 *         <TooltipContent>Italic</TooltipContent>
 *       </Tooltip>
 *
 *       <Tooltip>
 *         <TooltipTrigger>
 *           <Button buttonSize="s" leftIcon={<UnderlineIcon />} />
 *         </TooltipTrigger>
 *         <TooltipContent>Underline</TooltipContent>
 *       </Tooltip>
 *     </div>
 *   </TooltipDelayGroup>
 * </Canvas>;
 * ```
 */
export function TooltipDelayGroup({
  children,
  delay = 1000,
  timeoutMs = 0,
}: TooltipDelayGroupProps) {
  return (
    <FloatingDelayGroup delay={delay} timeoutMs={timeoutMs}>
      {children}
    </FloatingDelayGroup>
  );
}
