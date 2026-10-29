type FocusReturn = {
  /** Gives the focus to the trigger, or to the nearest ancestor that is still on the page */
  focus: () => void;
  /**
   * After the next frame, gives the focus to the nearest ancestor of the
   * trigger when the trigger left the page and the focus is lost. Use it
   * when the overlay closes and the action can remove the trigger.
   */
  rescue: () => void;
};

function isFocusLost() {
  return !document.activeElement || document.activeElement === document.body;
}

/**
 * Remembers the element that opened an overlay, with its ancestors, while it
 * is on the page. When the action of the overlay removes the trigger (a menu
 * option that removes its own row, a dialog that fills an empty field), the
 * browser moves the focus to the body and a screen reader goes back to the
 * top of the page. The nearest ancestor that is still on the page keeps the
 * user in the same place.
 */
export function createFocusReturn(trigger: Element | null): FocusReturn {
  const ancestors: HTMLElement[] = [];

  for (
    let element = trigger?.parentElement;
    element && element !== document.body;
    element = element.parentElement
  ) {
    ancestors.push(element);
  }

  function focusNearestAncestor() {
    const nearest = ancestors.find((element) => element.isConnected);

    if (!nearest) {
      return;
    }

    if (nearest.tabIndex < 0) {
      nearest.tabIndex = -1;
    }
    nearest.focus();
  }

  return {
    focus() {
      if (trigger instanceof HTMLElement && trigger.isConnected) {
        trigger.focus();
      } else {
        focusNearestAncestor();
      }
    },
    rescue() {
      requestAnimationFrame(() => {
        if (!trigger?.isConnected && isFocusLost()) {
          focusNearestAncestor();
        }
      });
    },
  };
}
