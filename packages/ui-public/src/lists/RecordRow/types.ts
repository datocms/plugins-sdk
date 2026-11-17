import type { Message } from '../../Message';
import type { RecordRowImage } from './Image';

/**
 * The data of a record that the row shows. A result of
 * `ctx.loadItemPresentationInfo` is a `RecordRowPresentation`.
 */
export type RecordRowPresentation = {
  /**
   * The ID of the record. A block that is not saved yet has no ID. The row
   * shows it only with `showId`.
   */
  id?: string;
  /** The title of the record */
  title: Message;
  /** The image of the record, or null when the record has no image */
  image: RecordRowImage | null;
  /**
   * The ID of the model of the record. Without `model`, the row reads the
   * model from the host with this ID.
   */
  itemTypeId?: string;
  /**
   * The publishing status of the record. The row shows it only when the
   * model has the draft mode: without it, a record is published every time
   * that it is saved, and the status says nothing.
   */
  status?: 'draft' | 'updated' | 'published';
  /** False when the current version of the record does not pass the validations */
  currentVersionValid?: boolean;
  /** False when the published version of the record does not pass the validations */
  publishedVersionValid?: boolean;
};

/** The model of the record */
export type RecordRowModel = {
  /** The name of the model, with its emoji */
  name: Message;
  /** True when the model has the draft mode */
  draftModeActive: boolean;
};

/**
 * A record as the API gives it. The row reads only these fields, for the
 * model, the status and the validity while the presentation loads.
 */
export type RecordRowItem = {
  id: string;
  relationships: { item_type: { data: { id: string } } };
  meta: {
    status?: 'draft' | 'updated' | 'published' | null;
    is_current_version_valid?: boolean | null;
    is_published_version_valid?: boolean | null;
  };
};
