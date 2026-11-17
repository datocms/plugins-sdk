import React, {
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { RecordRowListContext } from './context';

export type RecordRowListProps = {
  /**
   * The rows show the model above the title. Give false when all the
   * records have the same model.
   * @default true
   */
  showModel?: boolean;
  /**
   * All the rows show the image slot from the start, before a row with an
   * image loads. Use it when a model of the rows has an image, in a list
   * with many records of the same models.
   * @default false
   */
  reserveImageSlot?: boolean;
  /** The rows */
  children: ReactNode;
};

/**
 * Put it around the rows of records of a list that are one above the other.
 * It renders no element: it gives the rows the same settings, so that they
 * look the same. When one row has an image, all the rows show the image
 * slot, so that the titles align.
 */
function List({
  showModel = true,
  reserveImageSlot = false,
  children,
}: RecordRowListProps) {
  const [imageSlot, setImageSlot] = useState(reserveImageSlot);

  // Reset the slot only when reserveImageSlot changes, not on the first
  // render. The effects of the rows run before this effect: a reset on the
  // first render replaces the slot that a row with an image shows, and that
  // row does not show it again.
  const previousReserve = useRef(reserveImageSlot);

  useEffect(() => {
    if (previousReserve.current === reserveImageSlot) {
      return;
    }

    previousReserve.current = reserveImageSlot;
    setImageSlot(reserveImageSlot);
  }, [reserveImageSlot]);

  const value = useMemo(
    () => ({
      showModel,
      imageSlot,
      showImageSlot: () => setImageSlot(true),
    }),
    [showModel, imageSlot],
  );

  return (
    <RecordRowListContext.Provider value={value}>
      {children}
    </RecordRowListContext.Provider>
  );
}

export default List;
