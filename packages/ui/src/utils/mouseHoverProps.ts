import type React from 'react';

// A touch or a pen does not hover, thus the handlers ignore them.
export function mouseHoverProps(onChange: (isHovered: boolean) => void): {
  onPointerEnter: (e: React.PointerEvent) => void;
  onPointerLeave: (e: React.PointerEvent) => void;
} {
  return {
    onPointerEnter: (e) => {
      if (e.pointerType === 'mouse') onChange(true);
    },
    onPointerLeave: (e) => {
      if (e.pointerType === 'mouse') onChange(false);
    },
  };
}
