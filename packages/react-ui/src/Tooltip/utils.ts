import type { Placement } from '@floating-ui/react';
import {
  autoUpdate,
  flip,
  offset,
  shift,
  useDelayGroupContext,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
} from '@floating-ui/react';
import * as React from 'react';

// Create a single shared portal root for all tooltips
let sharedPortalRoot: HTMLDivElement | null = null;
let portalRefCount = 0;

export function getSharedPortalRoot(): HTMLDivElement {
  if (!sharedPortalRoot) {
    sharedPortalRoot = document.createElement('div');
    sharedPortalRoot.style.position = 'relative';
    sharedPortalRoot.style.zIndex = '100000';
    sharedPortalRoot.style.height = '0px';

    // Insert as the first child of body
    if (document.body.firstChild) {
      document.body.insertBefore(sharedPortalRoot, document.body.firstChild);
    } else {
      document.body.appendChild(sharedPortalRoot);
    }
  }
  portalRefCount++;
  return sharedPortalRoot;
}

export function releaseSharedPortalRoot(): void {
  portalRefCount--;
  if (portalRefCount === 0 && sharedPortalRoot) {
    if (sharedPortalRoot.parentNode) {
      sharedPortalRoot.parentNode.removeChild(sharedPortalRoot);
    }
    sharedPortalRoot = null;
  }
}

export interface TooltipOptions {
  /** Whether the tooltip is initially open (uncontrolled mode) */
  initialOpen?: boolean;
  /** Placement of the tooltip relative to its trigger */
  placement?: Placement;
  /** Controlled open state */
  open?: boolean;
  /** Callback when open state changes (controlled mode) */
  onOpenChange?: (open: boolean) => void;
}

/**
 * Hook that manages tooltip state and positioning logic.
 *
 * This hook provides the core tooltip behavior including hover/focus detection,
 * positioning, and accessibility features. Use this when you need full control
 * over the tooltip structure.
 *
 * @example Basic tooltip hook usage
 *
 * Build a custom tooltip implementation using the hook directly for maximum flexibility:
 *
 * ```js
 * function MyComponent() {
 *   const tooltip = useTooltip({ placement: 'top' });
 *
 *   return (
 *     <>
 *       <button
 *         ref={tooltip.refs.setReference}
 *         {...tooltip.getReferenceProps()}
 *       >
 *         Hover me
 *       </button>
 *
 *       {tooltip.open && (
 *         <div
 *           ref={tooltip.refs.setFloating}
 *           style={tooltip.floatingStyles}
 *           {...tooltip.getFloatingProps()}
 *         >
 *           Tooltip content
 *         </div>
 *       )}
 *     </>
 *   );
 * }
 * ```
 *
 * @example Controlled tooltip
 *
 * Control the tooltip's open state programmatically for click-to-toggle behavior:
 *
 * ```js
 * function ControlledTooltip() {
 *   const [open, setOpen] = React.useState(false);
 *   const tooltip = useTooltip({ open, onOpenChange: setOpen });
 *
 *   return (
 *     <Canvas ctx={ctx}>
 *       <button onClick={() => setOpen(!open)}>
 *         Toggle tooltip
 *       </button>
 *     </Canvas>
 *   );
 * }
 * ```
 */
export function useTooltip({
  initialOpen = false,
  placement = 'top',
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: TooltipOptions = {}) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(initialOpen);

  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = setControlledOpen ?? setUncontrolledOpen;

  const { delay } = useDelayGroupContext();

  const data = useFloating({
    placement,
    open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware: [offset(5), flip(), shift()],
  });

  const context = data.context;

  const hover = useHover(context, {
    move: false,
    enabled: controlledOpen == null,
    delay,
  });
  const focus = useFocus(context, {
    enabled: controlledOpen == null,
  });
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: 'tooltip' });

  const interactions = useInteractions([hover, focus, dismiss, role]);

  return React.useMemo(
    () => ({
      open,
      setOpen,
      ...interactions,
      ...data,
    }),
    [open, setOpen, interactions, data],
  );
}

type ContextType = ReturnType<typeof useTooltip> | null;

export const TooltipContext = React.createContext<ContextType>(null);

export const useTooltipState = () => {
  const context = React.useContext(TooltipContext);

  if (context == null) {
    throw new Error('Tooltip components must be wrapped in <Tooltip />');
  }

  return context;
};
