import React, { type ReactNode, useMemo } from 'react';
import IdText from '../../content/IdText';
import ItemStatus from '../../content/ItemStatus';
import { ItemValidityTriangles } from '../../content/ValidityTriangles';
import { useTranslation } from '../../i18n';
import EntityRow from '../EntityRow';
import { useRecordRowImageSlot, useRecordRowsShowModel } from './context';
import Image, { type RecordRowImage } from './Image';
import List from './List';
import {
  useLoadedRecordPresentation,
  useRecordPresentationModel,
} from './presentation';
import type {
  RecordRowItem,
  RecordRowModel,
  RecordRowPresentation,
} from './types';

export type { RecordRowImageProps } from './Image';
export type { RecordRowListProps } from './List';
export type {
  RecordRowImage,
  RecordRowItem,
  RecordRowModel,
  RecordRowPresentation,
};

// In CSS pixels
const imageSizes = { inline: 20, row: 32 };

type Content =
  /** The data of the record, already resolved */
  | {
      /**
       * The data of the record, for example a result of
       * `ctx.loadItemPresentationInfo`
       */
      presentation: RecordRowPresentation;
      /**
       * The model of the record. The row shows its name above the title,
       * and the status only when it has the draft mode. Without it, the row
       * reads the model of `presentation.itemTypeId` from the host.
       */
      model?: RecordRowModel | null;
      item?: never;
      preferredLocale?: never;
    }
  /** The record: the row loads its data from the host */
  | {
      /**
       * The ID of the record, or the record. The row loads its presentation
       * once, and again when `item` changes: it does not show the changes
       * that somebody makes to the record later. While it loads, it shows a
       * placeholder in place of the title, and the model and the status of
       * a full record.
       */
      item: string | RecordRowItem;
      /** The locale of the title and of the image */
      preferredLocale?: string;
      presentation?: never;
      model?: never;
    };

type Layout =
  | {
      /**
       * "row" shows the model above the title: a row of a list, an option
       * of a menu.
       */
      layout: 'row';
      /**
       * More lines below the title, small and in the subtle ink. For example
       * the parents of the record, or the users that edit it.
       */
      children?: ReactNode;
    }
  | {
      /**
       * "inline" shows one line: a chip, the value of a select, a record in
       * a text. It has no model and no lines below the title.
       */
      layout: 'inline';
      children?: never;
    };

type Common = {
  /**
   * Shows the ID of the record. For example when the ID matches the text of
   * a search.
   * @default false
   */
  showId?: boolean;
  /**
   * The title shows on up to three lines, not on one line. Only for a list
   * of records that is wide enough.
   * @default false
   */
  multilineTitle?: boolean;
  /**
   * The row ignores the `RecordRow.List` around it (for example a chip of a
   * select, when the list is the options of the menu). It shows an image
   * only when it has one, and does not change the rows.
   * @default false
   */
  standalone?: boolean;
};

export type RecordRowProps = Content & Layout & Common;

type PresentedProps = Layout &
  Common & {
    presentation: RecordRowPresentation;
    model?: RecordRowModel | null;
  };

function PresentedRecordRow({
  presentation,
  model: givenModel,
  layout,
  showId = false,
  multilineTitle,
  standalone,
  children,
}: PresentedProps) {
  const { t, tc } = useTranslation();
  const modelOf = useRecordPresentationModel();
  const { id, image, title, status, itemTypeId } = presentation;

  const model =
    givenModel !== undefined
      ? givenModel
      : itemTypeId
        ? modelOf(itemTypeId)
        : null;

  const showImage = useRecordRowImageSlot(Boolean(image), standalone);
  const listShowsModel = useRecordRowsShowModel();
  const showModel = listShowsModel && Boolean(model);
  const idShown = showId && Boolean(id);

  const common = {
    multilineTitle,
    image: showImage && <Image image={image} />,
    title,
    afterTitle: (
      <ItemValidityTriangles
        currentValid={presentation.currentVersionValid}
        publishedValid={presentation.publishedVersionValid}
        draftModeActive={model?.draftModeActive}
      />
    ),
    trailing:
      model?.draftModeActive && status ? (
        <ItemStatus status={status} />
      ) : undefined,
  };

  if (layout === 'inline') {
    return (
      <EntityRow
        layout="inline"
        {...common}
        aside={idShown && id ? <IdText id={id} labeled /> : undefined}
      />
    );
  }

  return (
    <EntityRow
      layout="row"
      {...common}
      kicker={
        showModel || idShown ? (
          <>
            {showModel && model && tc(model.name)}
            {showModel && idShown && ' '}
            {/* After the model, the label says that the ID is the ID of the
                record, not of the model */}
            {idShown && id && (
              <>
                {!showModel && `${t('idText.label')} `}
                <IdText id={id} labeled={showModel} />
              </>
            )}
          </>
        ) : undefined
      }
    >
      {children}
    </EntityRow>
  );
}

// The title while the presentation loads. A screen reader reads that the
// record loads.
function LoadingTitle() {
  const { t } = useTranslation();

  return (
    <span className="RecordRow__loading" aria-busy="true">
      <span className="visually-hidden">{t('recordRow.loading')}</span>
    </span>
  );
}

function LoadedRecordRow({
  item,
  preferredLocale,
  ...rest
}: RecordRowProps & { item: string | RecordRowItem }) {
  const { t } = useTranslation();
  const size = imageSizes[rest.layout];
  const options = useMemo(
    () => ({
      preferredLocale,
      preferredImageSize: { width: size, height: size },
    }),
    [preferredLocale, size],
  );
  const loaded = useLoadedRecordPresentation(item, options);
  const fullItem = typeof item === 'string' ? null : item;
  const id = typeof item === 'string' ? item : item.id;

  const presentation: RecordRowPresentation = loaded
    ? { ...loaded, id }
    : {
        id,
        title:
          loaded === null ? (
            t('recordRow.fallbackTitle', { id })
          ) : (
            <LoadingTitle />
          ),
        image: null,
        itemTypeId: fullItem?.relationships.item_type.data.id,
        // A record of a model without the draft mode has no status
        status: fullItem ? (fullItem.meta.status ?? 'published') : undefined,
        currentVersionValid:
          fullItem?.meta.is_current_version_valid ?? undefined,
        publishedVersionValid:
          fullItem?.meta.is_published_version_valid ?? undefined,
      };

  return (
    <PresentedRecordRow
      {...(rest as Layout & Common)}
      presentation={presentation}
    />
  );
}

/**
 * A record in a row: the image, the model, the title, the validity
 * triangles and the status, always in the same order and with the same
 * sizes. It shows only the content: its container gives the surface, the
 * hover and the click.
 */
function RecordRow(props: RecordRowProps) {
  if (props.item !== undefined) {
    return <LoadedRecordRow {...props} item={props.item} />;
  }

  const { presentation, model, ...rest } = props;

  return (
    <PresentedRecordRow
      {...(rest as Layout & Common)}
      presentation={presentation}
      model={model}
    />
  );
}

export default Object.assign(React.memo(RecordRow), { Image, List });
