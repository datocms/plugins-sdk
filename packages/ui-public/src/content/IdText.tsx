import React from 'react';
import { useTranslation } from '../i18n';

export type IdTextProps = {
  /** The ID to show, for example "168342". */
  id: string;
  /**
   * Show "· ID" before the ID. Use it when the ID follows another detail on
   * the same line (for example the model of a record): without the label,
   * the ID seems to be the ID of that detail.
   */
  labeled?: boolean;
};

// A row that is a link to a record (a search result, an option of a select)
// shows no ID: the title and the model tell what the record is. It shows the
// ID only when the search finds the record by its ID.
export function idMatchesQuery(id: string, query: string | null | undefined) {
  return !!query && query.trim() === id;
}

// Use CopyableId when the ID is a value of its own (an info row, a column of
// a table).
const IdText = React.memo(function IdText({ id, labeled }: IdTextProps) {
  const { t } = useTranslation();

  const idElement = <span className="IdText">{id}</span>;

  if (!labeled) {
    return idElement;
  }

  return (
    <span className="IdText-labeled">
      <span className="IdText-labeled__separator" aria-hidden="true">
        ·
      </span>
      {t('idText.label')} {idElement}
    </span>
  );
});

export default IdText;
