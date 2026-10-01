import type { StylesConfig, Theme } from 'react-select';

// Hosts older than the `disabled-field` context don't send its tokens, and
// the SDK defines no colors of its own, so each one falls back to the token
// disabled fields used before.
const disabledFieldSurface =
  'var(--color--disabled-field--surface, var(--color--disabled--surface))';
const disabledFieldInk =
  'var(--color--disabled-field--ink, var(--color--disabled--ink))';
const disabledFieldInkPlaceholder =
  'var(--color--disabled-field--ink-placeholder, var(--color--ink-placeholder))';

/**
 * Maps react-select's palette slots to DatoCMS tokens, mirroring the CMS's own
 * `SelectInput/useThemeProps.ts`. Every slot react-select reads is mapped, so
 * none falls back to its hardcoded (light-only) greys.
 */
export const themeConfig = (existing: Theme): Theme => ({
  ...existing,
  borderRadius: 0,
  colors: {
    ...existing.colors,
    // menu & option background
    neutral0: 'var(--color--surface-raised)',
    // disabled background
    neutral10: disabledFieldSurface,
    // default border
    neutral20: 'var(--color--border)',
    // hover border
    neutral30: 'var(--color--border-hover)',
    // disabled indicator/text
    neutral40: 'var(--color--ink-disabled)',
    // value text
    neutral80: 'var(--color--ink)',
    // focused border
    primary: 'var(--color--focus--border)',
    // option hover background
    primary25: 'var(--color--surface-raised-hover)',
  },
});

/**
 * Builds the react-select `styles` for a SelectInput.
 *
 * @param isDisabled - Whether the control is disabled
 * @param error - Whether the field is in an error state
 */
export const buildStyles = (
  isDisabled?: boolean,
  error?: boolean,
): StylesConfig => ({
  placeholder: (provided, state) => ({
    ...provided,
    color: state.isDisabled
      ? disabledFieldInkPlaceholder
      : 'var(--color--ink-placeholder)',
  }),
  container: (provided) => {
    return {
      ...provided,
      fontSize: 'inherit',
    };
  },

  control: (provided, { isFocused }) => {
    let result = provided;

    result = {
      ...result,
      minHeight: 40,
    };

    if (isFocused) {
      return {
        ...result,
        borderColor: error
          ? 'var(--color--danger-soft--border)'
          : 'var(--color--focus--border)',
        backgroundColor: isDisabled
          ? disabledFieldSurface
          : 'var(--color--surface-raised)',
        boxShadow: `0 0 0 4px ${
          error
            ? 'var(--color--danger-soft--outline)'
            : 'var(--color--focus--outline)'
        }`,
        '&:hover': {
          borderColor: error
            ? 'var(--color--danger-soft--border)'
            : 'var(--color--focus--border)',
        },
      };
    }

    return {
      ...result,
      borderColor: error
        ? 'var(--color--danger-soft--border)'
        : 'var(--color--border)',
      backgroundColor: isDisabled
        ? disabledFieldSurface
        : 'var(--color--surface-raised)',
      '&:hover': {
        borderColor: error
          ? 'var(--color--danger-soft--border)'
          : 'var(--color--border-hover)',
      },
    };
  },
  multiValueRemove: (provided) => ({
    ...provided,
    cursor: 'pointer',
    color: 'var(--color--primary-soft--ink)',
    ':hover': {
      backgroundColor: 'var(--color--primary-soft--surface-hover)',
      color: 'var(--color--primary-soft--ink)',
    },
  }),
  menu: (provided) => {
    return {
      ...provided,
      zIndex: 1000,
      minWidth: 250,
      backgroundColor: 'var(--color--surface-raised)',
      boxShadow: 'var(--shadow--floating)',
    };
  },
  singleValue: (provided, state) => ({
    ...provided,
    // the disabled control sits on `disabled-field--surface`, so its text must
    // use the paired context ink: the standalone `ink-disabled` used by
    // react-select's neutral40 slot can coincide with that surface
    color: state.isDisabled ? disabledFieldInk : 'var(--color--ink)',
  }),
  input: (provided) => ({
    ...provided,
    color: 'var(--color--ink)',
    boxShadow: 'none',
    'input:focus': {
      boxShadow: 'none',
    },
  }),
  option: (provided, { isFocused, isSelected }) => ({
    ...provided,
    backgroundColor: isSelected
      ? 'var(--color--selected--surface)'
      : isFocused
        ? 'var(--color--surface-raised-hover)'
        : undefined,
    color: 'var(--color--ink)',
  }),
  multiValue: (provided) => {
    return {
      ...provided,
      zIndex: 100,
      backgroundColor: 'var(--color--primary-soft--surface)',
      userSelect: 'none',
    };
  },
  multiValueLabel: (provided) => ({
    ...provided,
    fontSize: 'inherit',
    padding: 3,
    color: 'var(--color--primary-soft--ink)',
  }),
});
