import classNames from 'classnames';
import { useContext, useMemo } from 'react';
import { ClassNamesConfig, GroupBase, StylesConfig } from 'react-select';
import { ZIndexContext } from '../../overlays/NewZIndex';
import { getEditState } from '../getEditState';
import { BaseSelectOption, type SelectVariant } from './';

type Options = {
  multiple?: boolean;
  value: string | string[] | null;
  autosize?: boolean;
  variant: SelectVariant;
  disabled?: boolean;
  readOnly?: boolean;
};

// The select has the "unstyled" prop of react-select. _SelectInput.css sets
// the look of its parts through these classes. The menu, its groups and its
// options are the parts of the Dropdown menus (see SelectMenu).
export function useSelectClassNames<
  O extends BaseSelectOption,
  G extends GroupBase<O>,
>({ multiple, value, autosize, variant, disabled, readOnly }: Options) {
  const embedded = variant !== 'default';
  const smaller = variant === 'filter' || variant === 'filter-field';
  const accentColor = variant === 'filter-field';

  const currentZIndex = useContext(ZIndexContext);

  // The menu must show above the layer that holds the select (for example a
  // modal). Only the ZIndexContext knows the z-index of that layer.
  const styles = useMemo<StylesConfig<O, boolean, G>>(
    () => ({
      menu: (provided) => ({ ...provided, zIndex: currentZIndex + 1 }),
    }),
    [currentZIndex],
  );

  const hasValue = multiple
    ? Array.isArray(value) && value.length > 0
    : Boolean(value);

  const config = useMemo<ClassNamesConfig<O, boolean, G>>(() => {
    const { stateClass } = getEditState({ disabled, readOnly });

    return {
      container: () =>
        classNames('SelectInput', {
          'SelectInput--autosize': autosize,
          'SelectInput--smaller': smaller,
        }),
      control: ({ isFocused, menuIsOpen }) =>
        classNames('InputFrame', 'SelectInput__control', stateClass, {
          'is-focused': isFocused,
          'is-open': menuIsOpen,
          'SelectInput__control--embedded': embedded,
          'SelectInput__control--smaller': smaller,
          'SelectInput__control--accent': accentColor,
          // The control gets the width of what it shows (for example an
          // avatar and a name) and of the text that the user types. A
          // multiple select with values keeps the full width for its chips.
          'SelectInput__control--fit': autosize && !(multiple && hasValue),
        }),
      valueContainer: () => 'SelectInput__value-container',
      placeholder: () => 'SelectInput__placeholder',
      singleValue: () => 'SelectInput__single-value',
      input: () =>
        classNames('SelectInput__input', {
          // The text input is above the value. Thus the pointer events of a
          // single select with a value go to the value.
          'SelectInput__input--inert': !multiple && hasValue,
        }),
      indicatorsContainer: () => 'SelectInput__indicators',
      clearIndicator: () => 'SelectInput__clear',
      dropdownIndicator: () => 'SelectInput__dropdown-indicator',
      loadingIndicator: () => 'SelectInput__loading',
      menu: () => 'SelectInput__menu Dropdown__menu-container',
      menuList: () => 'SelectInput__menu-list',
      multiValue: ({ isDisabled }) =>
        classNames('SelectInput__multi-value', { 'is-disabled': isDisabled }),
      multiValueLabel: () => 'SelectInput__multi-value-label',
      multiValueRemove: () => 'SelectInput__multi-value-remove',
    };
  }, [
    multiple,
    hasValue,
    autosize,
    smaller,
    accentColor,
    embedded,
    disabled,
    readOnly,
  ]);

  return { classNames: config, styles };
}
