import React, {
  ReactNode,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import ReactSelect, {
  GroupBase,
  type Props as ReactSelectProps,
} from 'react-select';
import CreatableReactSelect from 'react-select/creatable';
import { useTranslation } from '../../i18n';
import type { SortableDropResult } from '../../lists/dnd';
import { reorder } from '../../lists/dnd/reorder';
import { useFieldInput } from '../FieldWrapper';
import { getEditState } from '../getEditState';
import { BaseInputComponentPropsFieldWithReadOnly } from '../inputProps';
import Context from './Context';
import SelectClearIndicator from './SelectClearIndicator';
import SelectDropdownIndicator from './SelectDropdownIndicator';
import SelectEmpty from './SelectEmpty';
import SelectGroup from './SelectGroup';
import SelectInputElement from './SelectInputElement';
import SelectMenu, { MenuListContext, type SelectMenuList } from './SelectMenu';
import SelectMultiValueRemove from './SelectMultiValueRemove';
import SelectOption from './SelectOption';
import SortableMultiValue from './SortableMultiValue';
import SortableValueContainer from './SortableValueContainer';
import { useSelectClassNames } from './useSelectClassNames';
import { useSelectValueAdapter } from './useSelectValueAdapter';

function noop() {}

const COMPONENTS = {
  MultiValue: SortableMultiValue,
  ValueContainer: SortableValueContainer,
  Option: SelectOption,
  Group: SelectGroup,
  NoOptionsMessage: SelectEmpty,
  LoadingMessage: SelectEmpty,
  Menu: SelectMenu,
  DropdownIndicator: SelectDropdownIndicator,
  ClearIndicator: SelectClearIndicator,
  MultiValueRemove: SelectMultiValueRemove,
  Input: SelectInputElement,
  IndicatorSeparator: null,
};

/** The look of the control of a SelectInput */
export type SelectVariant = 'default' | 'embedded' | 'filter' | 'filter-field';

/** An option with a label to show and a string value. */
export type DefaultSelectOption = { label: ReactNode; value: string };
/** The least that an option needs: a `value`. */
export type BaseSelectOption = { value: string | null };

/**
 * The user can type a value that is not an option: the menu then shows an
 * option that creates it.
 */
export type SelectCreatable = {
  /** Called with the text that the user types, to add the new value */
  onCreate: (inputValue: string) => void;
  /**
   * The label of the option that creates the value. By default it is
   * 'Create "…"'.
   */
  formatLabel?: (inputValue: string) => ReactNode;
};

/**
 * The select shows the options that it gets and does not filter them: the
 * page loads the options that match the text that the user types.
 */
export type SelectSearch = {
  /**
   * Called with the text in the input each time it changes. The select
   * empties the input when the user picks an option, leaves the select or
   * closes the menu: the query is then an empty string, thus the next open
   * starts from the full list.
   */
  onQueryChange: (query: string) => void;
};

/**
 * A select to pick one option or many options. See the props of each
 * variant in SelectInputProps.
 */
export default function SelectInput<
  O extends BaseSelectOption,
  G extends GroupBase<O>,
>({
  id,
  value,
  options,
  multiple,
  onBlur,
  onChange,
  acceptValueNotIncludedInOptions,
  creatable,
  clearable,
  disabled,
  loading,
  readOnly,
  placeholder,
  autosize,
  variant = 'default',
  onKeyDown,
  onMenuClose,
  tabSelectsValue,
  search,
  ...rest
}: SelectInputProps<O, G>) {
  const [menuList, setMenuList] = useState<SelectMenuList | null>(null);
  const menuListContext = useMemo(
    () => ({ list: menuList, setList: setMenuList }),
    [menuList],
  );
  const {
    options: adaptedOptions,
    value: adaptedValue,
    onChange: adaptedOnChange,
  } = useSelectValueAdapter<O, G>(
    multiple
      ? {
          value,
          options,
          multiple,
          onBlur,
          onChange,
          acceptValueNotIncludedInOptions,
        }
      : {
          value,
          options,
          multiple,
          onBlur,
          onChange,
          acceptValueNotIncludedInOptions,
        },
  );

  const { classNames, styles } = useSelectClassNames<O, G>({
    multiple,
    value,
    autosize,
    variant,
    disabled,
    readOnly,
  });

  const onDrop = useCallback(
    multiple
      ? (result: SortableDropResult) => {
          const { draggableId, destination } = result;

          // The pills are only the values with an option, thus the indexes
          // of the drop count the pills, not the values. The moved value
          // goes before the pill that follows it after the move, and the
          // values without a pill stay where they are.
          const pillIds = (adaptedValue as O[]).map((o) => o.value);
          const nextId = reorder(pillIds, result)[destination.index + 1];

          const arr = (value || []).filter((v) => v !== draggableId);
          const nextIndex = nextId != null ? arr.indexOf(nextId) : -1;
          arr.splice(nextIndex === -1 ? arr.length : nextIndex, 0, draggableId);

          const pills = adaptedValue as O[];
          const chosen = arr
            .map((v) => pills.find((o) => o.value === v))
            .filter((o): o is O => Boolean(o));

          (onChange as (newValue: string[], options: O[]) => void)(arr, chosen);
        }
      : () => {},
    [value, adaptedValue, onChange],
  );

  // The options have the classes of the Dropdown options. A select in a
  // Dropdown menu (for example the timezone of DateTimeDropdown) keeps its
  // arrow keys: else the Dropdown moves its highlight to the options of the
  // select.
  //
  // While the footer shows a list in the place of the options, the keys that
  // move between the options or pick one must do nothing, and Escape goes
  // back to the options. react-select skips its own key handling when the
  // event has its default prevented.
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event);

      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.stopPropagation();
      }

      if (!menuList) return;

      if (event.key === 'Escape') {
        event.preventDefault();
        setMenuList(null);
      } else if (OPTION_KEYS.includes(event.key)) {
        event.preventDefault();
      }
    },
    [onKeyDown, menuList],
  );

  const handleMenuClose = useCallback(() => {
    setMenuList(null);
    onMenuClose?.();
  }, [onMenuClose]);

  const { locked } = getEditState({ disabled, readOnly });
  const { id: inputId, ...fieldAria } = useFieldInput({ id, ...rest });

  const { t } = useTranslation();
  const noOptionsMessage = useCallback(() => t('selectInput.noOptions'), [t]);
  const loadingMessage = useCallback(() => t('selectInput.loading'), [t]);
  const formatCreateLabel = useCallback(
    (inputValue: string) =>
      creatable?.formatLabel
        ? creatable.formatLabel(inputValue)
        : t('selectInput.create', { value: inputValue }),
    [creatable?.formatLabel, t],
  );

  const SelectComponent: React.ComponentType<any> = creatable
    ? CreatableReactSelect
    : ReactSelect;
  const creatableProps = creatable
    ? { onCreateOption: creatable.onCreate, formatCreateLabel }
    : {};

  const searchProps = useSearchProps(search);

  const contextValue = useMemo(
    () => ({ onDrop, disabled: locked }),
    [onDrop, locked],
  );

  const selectElement = (
    <SelectComponent
      // The texts of react-select are in English only. A caller can give its
      // own texts.
      noOptionsMessage={noOptionsMessage}
      loadingMessage={loadingMessage}
      {...rest}
      {...searchProps}
      {...fieldAria}
      {...creatableProps}
      // The label of the Field points to the id: the text input of the
      // select gets it, not the box around the control
      inputId={inputId}
      // Without a placeholder, react-select shows its own "Select..." (in
      // English only). An empty select shows nothing, as an empty text input.
      placeholder={placeholder ?? ''}
      value={adaptedValue}
      options={adaptedOptions}
      onChange={locked ? noop : adaptedOnChange}
      onKeyDown={handleKeyDown}
      onMenuClose={handleMenuClose}
      // The Tab key must not pick an option that the list hides
      tabSelectsValue={menuList ? false : tabSelectsValue}
      unstyled
      classNames={classNames}
      styles={styles}
      isClearable={clearable && !locked}
      isDisabled={disabled}
      isLoading={loading}
      isMulti={multiple}
      // A read-only select has the regular look and the user can focus it,
      // but the user cannot open the menu, type or remove a value
      {...(readOnly
        ? {
            menuIsOpen: false,
            isSearchable: false,
            backspaceRemovesValue: false,
          }
        : {})}
      components={COMPONENTS}
    />
  );

  const element = (
    <MenuListContext.Provider value={menuListContext}>
      {selectElement}
    </MenuListContext.Provider>
  );

  if (multiple) {
    return <Context.Provider value={contextValue}>{element}</Context.Provider>;
  }

  return element;
}

const OPTION_KEYS = [
  'Enter',
  ' ',
  'ArrowUp',
  'ArrowDown',
  'PageUp',
  'PageDown',
];

// We forward only the changes of the text, not the events of react-select.
// react-select calls onInputChange more than one time for one reset (blur
// and menu close), thus we skip a query that is the same as the last one.
function useSearchProps(search: SelectSearch | undefined) {
  const lastQueryRef = useRef('');
  const onQueryChange = search?.onQueryChange;

  const onInputChange = useCallback(
    (text: string) => {
      if (!onQueryChange || text === lastQueryRef.current) return;
      lastQueryRef.current = text;
      onQueryChange(text);
    },
    [onQueryChange],
  );

  return onQueryChange ? { onInputChange, filterOption: null } : {};
}

type CommonProps<O extends BaseSelectOption> = {
  /**
   * The options load: the control shows a spinner, and the open menu shows
   * the loading text in place of the options
   */
  loading?: boolean;
  /**
   * Shows a button that clears the value. A single select with no value
   * needs it to go back to empty.
   */
  clearable?: boolean;
  /** The control is as wide as its value, not as wide as the field. */
  autosize?: boolean;
  /**
   * The look of the control. "default" is a field with a border. "embedded"
   * has no border: use it inside another box. "filter" is embedded and small,
   * for the operator and the value of a filter tile. "filter-field" is a
   * filter select with the soft primary color, for the field of a filter tile.
   * @default 'default'
   */
  variant?: SelectVariant;
  /**
   * Makes an option for a value that is not in `options`, so the select shows
   * it. Without it, or when it gives `undefined`, the select shows no text for
   * such a value.
   */
  acceptValueNotIncludedInOptions?: (value: string) => O | undefined;
  /** The user can type a value that is not an option, and add it */
  creatable?: SelectCreatable;
  /**
   * Turns off the filter of the select and reports the text that the user
   * types. Use it when the options come from a request and the server does
   * the filter: load the options for `search.onQueryChange`, give them in
   * `options` and set `loading` while the request runs.
   * `useAsyncSelectOptions` does all of it. It replaces the `filterOption`
   * and the `onInputChange` of react-select.
   */
  search?: SelectSearch;
  /**
   * Actions below the options of the menu, for example "Create new". Build
   * them with `SelectMenuAction`: an action with `list` opens a second list
   * in the place of the options. Close the menu with `closeSelectMenu`.
   */
  menuFooter?: ReactNode;
};

type SingleValueSelectInputProps<
  O extends BaseSelectOption,
  G extends GroupBase<O>,
> = BaseInputComponentPropsFieldWithReadOnly<
  string | null,
  [option: O | null]
> &
  Omit<
    ReactSelectProps<O, false, G>,
    | 'isClearable'
    | 'isDisabled'
    | 'isMulti'
    | 'isLoading'
    | 'styles'
    | 'classNames'
    | 'unstyled'
    | 'theme'
    | 'components'
    | 'value'
    | 'onBlur'
    | 'onChange'
    | 'name'
  > & {
    /** Lets the user pick one option. The value is a string or `null`. */
    multiple?: false;
  } & CommonProps<O>;

type MultiValueSelectInputProps<
  O extends BaseSelectOption,
  G extends GroupBase<O>,
> = BaseInputComponentPropsFieldWithReadOnly<string[] | null, [options: O[]]> &
  Omit<
    ReactSelectProps<O, true, G>,
    // for these we use a variant without "is"
    | 'isClearable'
    | 'isDisabled'
    | 'isMulti'
    | 'isLoading'
    // these are auto-calculated
    | 'styles'
    | 'classNames'
    | 'unstyled'
    | 'theme'
    | 'components'
    // these are defined in BaseInputComponentPropsFieldWithReadOnly
    | 'value'
    | 'onBlur'
    | 'onChange'
    | 'name'
  > & {
    /**
     * Lets the user pick many options. The value is a list of strings. The
     * user can drag the values to sort them.
     */
    multiple: true;
  } & CommonProps<O>;

/**
 * The props of `SelectInput`. The variant with `multiple: true` has a list of
 * strings as value, and `onChange` gets the chosen options in the order of
 * the value. The other variant has a string or `null`, and `onChange` gets
 * the chosen option or `null`. The props of react-select (`options`,
 * `placeholder`, `formatOptionLabel`, ...) also work.
 */
export type SelectInputProps<
  O extends BaseSelectOption,
  G extends GroupBase<O>,
> = SingleValueSelectInputProps<O, G> | MultiValueSelectInputProps<O, G>;

export {
  closeSelectMenu,
  SelectMenuAction,
  type SelectMenuActionProps,
} from './SelectMenu';
