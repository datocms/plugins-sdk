import * as React from 'react';
import {
  FloatingPortal,
  useMergeRefs,
  useDelayGroup,
  useDelayGroupContext,
  useTransitionStyles,
} from '@floating-ui/react';
import { Canvas, useCtx } from '../../Canvas';
import { useTooltipState, getSharedPortalRoot, releaseSharedPortalRoot } from '../utils';
import s from './styles.module.css.json';

export type TooltipContentProps = {
  children?: React.ReactNode;
};

/**
 * TooltipContent contains the content displayed in the floating tooltip.
 *
 * The content is automatically wrapped in a Canvas component to inherit the DatoCMS
 * theme and styling. The tooltip uses a portal to render outside the normal DOM
 * hierarchy, ensuring proper positioning and z-index stacking.
 *
 * @example Simple text tooltip
 *
 * Display plain text in a tooltip to provide helpful information:
 *
 * ```js
 * <Canvas ctx={ctx}>
 *   <Tooltip>
 *     <TooltipTrigger>
 *       <Button>Delete</Button>
 *     </TooltipTrigger>
 *     <TooltipContent>
 *       This action cannot be undone
 *     </TooltipContent>
 *   </Tooltip>
 * </Canvas>;
 * ```
 *
 * @example Rich content tooltip
 *
 * Include formatted content with custom styles for more detailed information:
 *
 * ```js
 * <Canvas ctx={ctx}>
 *   <Tooltip placement="right">
 *     <TooltipTrigger>
 *       <Button leftIcon={<HelpIcon />}>Help</Button>
 *     </TooltipTrigger>
 *     <TooltipContent>
 *       <div>
 *         <strong>Need assistance?</strong>
 *         <p style={{ margin: '5px 0 0 0', fontSize: 'var(--font-size-xs)' }}>
 *           Contact support@example.com
 *         </p>
 *       </div>
 *     </TooltipContent>
 *   </Tooltip>
 * </Canvas>;
 * ```
 *
 * @example Tooltip with keyboard shortcut
 *
 * Combine tooltips with the HotKey component to show keyboard shortcuts:
 *
 * ```js
 * <Canvas ctx={ctx}>
 *   <Tooltip>
 *     <TooltipTrigger>
 *       <Button leftIcon={<SaveIcon />}>Save</Button>
 *     </TooltipTrigger>
 *     <TooltipContent>
 *       <HotKey hotkey="mod+s" label="Save changes" />
 *     </TooltipContent>
 *   </Tooltip>
 * </Canvas>;
 * ```
 */
export const TooltipContent = React.forwardRef<HTMLDivElement, TooltipContentProps>(
  function TooltipContent({ children }, propRef) {
  const ctx = useCtx();
  const state = useTooltipState();
  const { isInstantPhase, currentId } = useDelayGroupContext();
  const ref = useMergeRefs([state.refs.setFloating, propRef]);

  // Use the shared portal root
  const portalRootRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    // Get the shared portal root and increment ref count
    portalRootRef.current = getSharedPortalRoot();

    // Cleanup function to release the shared portal root
    return () => {
      releaseSharedPortalRoot();
    };
  }, []);

  useDelayGroup(state.context, { id: state.context.floatingId });

  const instantDuration = 0;
  const duration = 250;

  const { isMounted, styles } = useTransitionStyles(state.context, {
    duration: isInstantPhase
      ? {
          open: instantDuration,
          // `id` is this component's `id`
          // `currentId` is the current group's `id`
          close:
            currentId === state.context.floatingId ? duration : instantDuration,
        }
      : duration,
    initial: {
      opacity: 0,
    },
  });

  if (!isMounted) return null;

  return (
    <FloatingPortal root={portalRootRef}>
      <Canvas ctx={ctx} noAutoResizer>
        <div
          ref={ref}
          style={{
            ...state.floatingStyles,
            ...styles,
          }}
          {...state.getFloatingProps()}
          className={s.tooltip}
        >
          {children}
        </div>
      </Canvas>
    </FloatingPortal>
  );
  },
);
