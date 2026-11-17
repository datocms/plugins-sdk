import React from 'react';
import { FieldGroup, Generic } from '../../icons';
import { type TextMessage } from '../Message';
import {
  type FieldGroupName,
  type FieldType,
  fieldGroupOf,
  fieldTypeSurface,
} from '../utils/fieldTypes';
import { type SvgIcon } from '../utils/types';
import IconAvatar from './IconAvatar';

const groupIcons: Record<FieldGroupName, SvgIcon> = {
  boolean: FieldGroup.BooleanGroupIcon,
  color: FieldGroup.ColorGroupIcon,
  datetime: FieldGroup.DatetimeGroupIcon,
  json: FieldGroup.JsonGroupIcon,
  location: FieldGroup.LocationGroupIcon,
  media: FieldGroup.MediaGroupIcon,
  number: FieldGroup.NumberGroupIcon,
  reference: FieldGroup.ReferenceGroupIcon,
  rich_text: FieldGroup.RichTextGroupIcon,
  seo: FieldGroup.SeoGroupIcon,
  text: FieldGroup.StructuredTextGroupIcon,
};

export type FieldTypeAvatarProps = {
  /** The `field_type` of the field, as the CMA gives it, for example `"rich_text"` */
  fieldType: FieldType | (string & {});
  /** The side of the square in pixels, for example 32 in the image of an EntityRow */
  size: number;
  /**
   * The name for the screen readers. Use it only when no text near the
   * avatar says the type of the field. Without it, the screen readers do
   * not read the avatar.
   */
  ariaLabel?: TextMessage;
};

/**
 * The icon of the group of a field type, on the colors of the group, as
 * DatoCMS shows a field type. A type that the component does not know
 * gets a generic icon on the neutral surface.
 */
function FieldTypeAvatar({ fieldType, size, ariaLabel }: FieldTypeAvatarProps) {
  const group = fieldGroupOf(fieldType);

  return (
    <IconAvatar
      icon={group ? groupIcons[group] : Generic.CircleQuestionIcon}
      size={size}
      surface={fieldTypeSurface(fieldType)}
      ariaLabel={ariaLabel}
    />
  );
}

export default FieldTypeAvatar;
