import { createContext, useContext, useEffect } from 'react';

export type RecordRowListContextValue = {
  showModel: boolean;
  imageSlot: boolean;
  showImageSlot: () => void;
};

export const RecordRowListContext = createContext<RecordRowListContextValue>({
  showModel: true,
  imageSlot: false,
  showImageSlot: () => {},
});

/** False when the `RecordRow.List` around hides the model of its rows */
export function useRecordRowsShowModel() {
  return useContext(RecordRowListContext).showModel;
}

/**
 * Tells if a row of a `RecordRow.List` shows the image slot. A row with an
 * image shows it, and makes all the rows of the list show it, so that the
 * titles align. A `standalone` record (a chip) shows the slot only when it
 * has an image, and does not change the rows.
 */
export function useRecordRowImageSlot(hasImage: boolean, standalone = false) {
  const { imageSlot, showImageSlot } = useContext(RecordRowListContext);

  useEffect(() => {
    if (!standalone && hasImage && !imageSlot) {
      showImageSlot();
    }
  }, [standalone, hasImage, imageSlot, showImageSlot]);

  return hasImage || (!standalone && imageSlot);
}
