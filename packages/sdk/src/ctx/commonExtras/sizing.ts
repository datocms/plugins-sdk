/** A number of methods that you can use to control the size of the plugin frame */
export type SizingUtilities = {
  /**
   * Listens for DOM changes and automatically calls `setHeight` when it detects
   * a change. If you're using `datocms-react-ui` package, the `<Canvas />`
   * component already takes care of calling this method for you.
   */
  startAutoResizer: () => void;

  /** Stops resizing the iframe automatically */
  stopAutoResizer: () => void;

  /**
   * Triggers a change in the size of the iframe. If you don't explicitely pass
   * a `newHeight` it will be automatically calculated using the iframe content
   * at the moment
   */
  updateHeight: (newHeight?: number) => void;

  /** Wheter the auto-resizer is currently active or not */
  isAutoResizerActive(): boolean;
};

/** These methods can be used to set various properties of the containing iframe */
export type IframeMethods = {
  /** Sets the height for the iframe */
  setHeight: (number: number) => Promise<void>;
};
