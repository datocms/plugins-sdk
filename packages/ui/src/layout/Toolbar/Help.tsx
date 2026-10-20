import classNames from 'classnames';
import React, { ReactNode } from 'react';
import { Generic } from '../../../icons/index';
import { Dropdown } from '../../actions/Dropdown';
import DropdownTriggerButton from '../../actions/Dropdown/triggers/DropdownTriggerButton';
import { DropdownTriggerBaseProps } from '../../actions/Dropdown/triggers/types';
import { useTranslation } from '../../i18n';

function Trigger({ open, onTrigger }: DropdownTriggerBaseProps) {
  const { t } = useTranslation();

  return (
    <DropdownTriggerButton
      open={open}
      onTrigger={onTrigger}
      className={classNames('Toolbar__help', { 'is-open': open })}
      aria-label={t('toolbar.help')}
    >
      <Generic.CircleQuestionIcon />
    </DropdownTriggerButton>
  );
}

export type HelpProps = {
  /** The text that tells what the page is for: two short sentences, plain text */
  children: ReactNode;
  /**
   * The page of the documentation about the subject. A "Learn more" link to
   * it comes after the text.
   */
  docsUrl?: string;
};

/**
 * A "?" button that opens the text that tells what the page is for. Give
 * Help to the "help" prop of Toolbar.Title, not as a sibling of the title.
 */
function Help({ children, docsUrl }: HelpProps) {
  return (
    <Dropdown triggerComponent={Trigger}>
      <Dropdown.Menu placement="bottom-start" minWidth={360}>
        <HelpBody docsUrl={docsUrl}>{children}</HelpBody>
      </Dropdown.Menu>
    </Dropdown>
  );
}

/**
 * The text of a Help, without the "?" button. Help shows it in its popover.
 * A title that opens a menu (Toolbar.PresetsTitle) shows it at the bottom of
 * the menu ("footer"), with "secondary", in place of the "?" button.
 */
export function HelpBody({
  children,
  docsUrl,
  secondary = false,
}: HelpProps & {
  /**
   * The help is under other content (the options of a menu): smaller text
   * in the subtle ink
   */
  secondary?: boolean;
}) {
  const { t } = useTranslation();

  return (
    <div
      className={classNames('Dropdown__menu__body Toolbar__help__body', {
        'Toolbar__help__body--secondary': secondary,
      })}
    >
      {children}
      {docsUrl && (
        <>
          {' '}
          <a href={docsUrl} target="_blank" rel="noopener noreferrer">
            {t('toolbar.learnMore')}
          </a>
        </>
      )}
    </div>
  );
}

export default React.memo(Help);
