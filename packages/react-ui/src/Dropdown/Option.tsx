import classNames from 'classnames';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useCtx } from '..';
import { DropdownContext } from './DropdownContext';
import { MenuContext } from './MenuContext';
import { OptionAction } from './OptionAction';
import s from './styles.module.css.json';

export type OptionProps = {
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  to?: string;
  active?: boolean;
  red?: boolean;
  valid?: boolean;
  invalid?: boolean;
  children: React.ReactNode;
  disabled?: boolean;
  closeMenuOnClick?: boolean;
};

export const Option = ({
  onClick,
  to,
  active,
  red,
  valid,
  invalid,
  children,
  disabled,
  closeMenuOnClick,
}: OptionProps): JSX.Element | null => {
  const ctx = useCtx();

  const id = useMemo(() => new Date().getTime().toString(36), []);

  const { searchTerm, addOption, setClickHandlerForOption } =
    useContext(MenuContext);

  const childrenArray = React.Children.toArray(children);

  const buttons = childrenArray.filter(
    (child) =>
      typeof child === 'object' &&
      'type' in child &&
      child.type === OptionAction,
  );

  const notButtons = childrenArray.filter(
    (child) =>
      typeof child !== 'object' ||
      !('type' in child) ||
      child.type !== OptionAction,
  );

  const contentRef = useRef<HTMLButtonElement>(null);
  const [innerText, setInnerText] = useState<string>('');

  useEffect(() => {
    if (contentRef.current) {
      setInnerText(contentRef.current.innerText);
    }
  });

  const { closeMenu } = useContext(DropdownContext);

  const handleClick = useCallback(
    (e) => {
      if (!onClick && !to) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      if (disabled) {
        return;
      }

      if (closeMenuOnClick ?? true) {
        closeMenu();
      }

      if (to) {
        ctx?.navigateTo(to);
      }

      if (onClick) {
        onClick(e);
      }
    },
    [closeMenuOnClick, closeMenu, onClick, to],
  );

  useEffect(() => {
    return addOption(id);
  }, [id]);

  useEffect(() => {
    return setClickHandlerForOption(id, handleClick);
  }, [id, handleClick, setClickHandlerForOption]);

  if (
    innerText &&
    searchTerm &&
    !innerText.toLowerCase().includes(searchTerm.toLowerCase())
  ) {
    return null;
  }

  const content = (
    <>
      <button
        type="button"
        className={s.Dropdown__menu__option__content}
        ref={contentRef}
        onClick={handleClick}
      >
        {notButtons}
      </button>
      {buttons.length > 0 && (
        <div className={s.Dropdown__menu__option__icons}>{buttons}</div>
      )}
    </>
  );

  return (
    <div
      className={classNames(s.Dropdown__menu__option, {
        [s['Dropdown__menu__option--is-active']]: active,
        [s['Dropdown__menu__option--is-disabled']]: disabled,
        [s['Dropdown__menu__option--is-valid']]: valid,
        [s['Dropdown__menu__option--is-invalid']]: invalid,
        [s['Dropdown__menu__option--is-dangerous']]: red,
      })}
      data-option-id={id}
    >
      {content}
    </div>
  );
};
