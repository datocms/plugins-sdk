import { Placement } from '@floating-ui/react-dom';

type Side = 'top' | 'right' | 'bottom' | 'left';

const oppositeSide: Record<Side, Side> = {
  top: 'bottom',
  right: 'left',
  bottom: 'top',
  left: 'right',
};

// The CSS animation of the menu starts from the point of the menu that is
// nearest to the trigger, so the menu comes out of the trigger.
export function placementStyle(placement: Placement) {
  const [side, alignment] = placement.split('-') as [
    Side,
    'start' | 'end' | undefined,
  ];

  const isVertical = side === 'top' || side === 'bottom';

  const alignedEdge =
    alignment === 'start'
      ? isVertical
        ? 'left'
        : 'top'
      : alignment === 'end'
        ? isVertical
          ? 'right'
          : 'bottom'
        : 'center';

  const origin = isVertical
    ? `${alignedEdge} ${oppositeSide[side]}`
    : `${oppositeSide[side]} ${alignedEdge}`;

  return {
    'data-side': side,
    style: { '--Dropdown-origin': origin } as React.CSSProperties,
  };
}
