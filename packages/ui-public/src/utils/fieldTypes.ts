import type { IconAvatarSurface } from '../content/IconAvatar';
import type { TextMessage } from '../Message';

/** The `field_type` of a field, as the CMA gives it */
export type FieldType =
  | 'boolean'
  | 'color'
  | 'date'
  | 'date_time'
  | 'file'
  | 'float'
  | 'gallery'
  | 'integer'
  | 'json'
  | 'lat_lon'
  | 'link'
  | 'links'
  | 'rich_text'
  | 'seo'
  | 'single_block'
  | 'slug'
  | 'string'
  | 'structured_text'
  | 'text'
  | 'video';

/** A group of field types, as the "Add new field" menu of a model shows it */
export type FieldGroupName =
  | 'text'
  | 'rich_text'
  | 'media'
  | 'datetime'
  | 'number'
  | 'boolean'
  | 'location'
  | 'color'
  | 'seo'
  | 'reference'
  | 'json';

/**
 * The groups of field types, with their types, in the order of the "Add new
 * field" menu of a model
 */
export const fieldTypeGroups: readonly {
  readonly name: FieldGroupName;
  readonly types: readonly FieldType[];
}[] = [
  { name: 'text', types: ['string', 'text', 'structured_text'] },
  { name: 'rich_text', types: ['single_block', 'rich_text'] },
  { name: 'media', types: ['file', 'gallery', 'video'] },
  { name: 'datetime', types: ['date', 'date_time'] },
  { name: 'number', types: ['integer', 'float'] },
  { name: 'boolean', types: ['boolean'] },
  { name: 'location', types: ['lat_lon'] },
  { name: 'color', types: ['color'] },
  { name: 'seo', types: ['slug', 'seo'] },
  { name: 'reference', types: ['link', 'links'] },
  { name: 'json', types: ['json'] },
];

const groupOfType = new Map<string, FieldGroupName>(
  fieldTypeGroups.flatMap((group) =>
    group.types.map((type) => [type, group.name] as const),
  ),
);

// A token name uses a hyphen where the group name has an underscore
// (rich_text gives --color--field-group-rich-text--surface)
function groupSurface(group: FieldGroupName): IconAvatarSurface {
  const slug = group.replace(/_/g, '-');

  return {
    color: `var(--color--field-group-${slug}--surface)`,
    ink: `var(--color--field-group-${slug}--ink)`,
  };
}

// One object for each group, so a memoized avatar gets the same surface on
// each render
const groupSurfaces = new Map<FieldGroupName, IconAvatarSurface>(
  fieldTypeGroups.map((group) => [group.name, groupSurface(group.name)]),
);

/** The group of a field type, or `undefined` for a type that it does not know */
export function fieldGroupOf(fieldType: string): FieldGroupName | undefined {
  return groupOfType.get(fieldType);
}

/**
 * The name of a field type, for example `{ id: 'fieldType.rich_text' }`
 * ("Modular Content (multiple blocks)"). For a type that it does not know,
 * the `field_type` string.
 */
export function fieldTypeMessage(fieldType: string): TextMessage {
  return groupOfType.has(fieldType)
    ? { id: `fieldType.${fieldType}` }
    : fieldType;
}

/** The name of a group of field types, for example `{ id: 'fieldGroup.media.title' }` ("Media") */
export function fieldGroupMessage(group: FieldGroupName): TextMessage {
  return { id: `fieldGroup.${group}.title` };
}

/**
 * The `surface` of an `IconAvatar` in the colors of the group of a field
 * type, or `'muted'` for a type that it does not know
 */
export function fieldTypeSurface(fieldType: string): IconAvatarSurface {
  const group = groupOfType.get(fieldType);

  return (group && groupSurfaces.get(group)) || 'muted';
}
