import classNames from 'classnames';
import React, { ReactNode } from 'react';
import { useIntersectionObserver } from 'usehooks-ts';
import { Content } from '../../icons/index';
import { useTranslation } from '../i18n';
import { type Message } from '../Message';
import Tooltip from '../overlays/Tooltip';
import { useFormApp } from './FormAppContext';

/** A required label shows an asterisk, thus it cannot also show "(optional)" */
type LabelRequirementProps =
  /** The label of a field that is not required, with "(optional)" */
  | {
      required?: false;
      /** Adds "(optional)" after the text. */
      optional: true;
    }
  /** Any other label */
  | {
      /** Adds an asterisk after the text. */
      required?: boolean;
      optional?: false;
    };

export type LabelProps = LabelRequirementProps & {
  /** The `id` of the input that the label names. */
  htmlFor: string;
  /**
   * The `id` of the text of the label. A group input (a radio group) has no
   * element for `htmlFor`: it names itself with `aria-labelledby` and this id.
   */
  textId?: string;
  /** The text of the label. */
  label: Message;
  /** Hides the label from the eye. A screen reader still reads it. */
  hidden?: boolean;
  /** Adds the icon that tells that the value is different for each locale. */
  localized?: boolean;
  /**
   * Renders a menu at the end of the label. It renders only when the label
   * is in the viewport.
   */
  renderDropdown?: () => ReactNode;
  /** Renders extra content between the text and the menu. */
  renderInfo?: () => ReactNode;
  /**
   * The validators of the field. The `FieldValidations` component of
   * `FormAppProvider` shows them next to the text.
   */
  validators?: Record<string, any>;
};

const Label = ({
  htmlFor,
  textId,
  label,
  hidden,
  required,
  optional,
  localized,
  renderDropdown,
  renderInfo,
  validators,
}: LabelProps) => {
  const { t, tc } = useTranslation();
  const { FieldValidations } = useFormApp();
  const { ref, isIntersecting: isVisible } = useIntersectionObserver({
    threshold: 0,
  });

  return (
    <label
      htmlFor={htmlFor}
      className={classNames('form__label', hidden && 'visually-hidden')}
      ref={ref}
    >
      <span className="form__label__text" id={textId}>
        {tc(label)}
        {required && '*'}
        {optional && (
          <span className="form__label__optional">{t('form.optional')}</span>
        )}
        {localized && (
          <Tooltip label={t('form.localizedField')}>
            <span className="form__label__icon">
              <Content.ManageLocalesIcon />
            </span>
          </Tooltip>
        )}
        {FieldValidations && <FieldValidations validators={validators} />}
      </span>
      {renderInfo?.()}
      {/* Dropdown contains heavy code for plugins, so we render it only when needed */}
      {isVisible && renderDropdown?.()}
    </label>
  );
};

export default React.memo(Label);
