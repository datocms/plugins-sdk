import React, { useMemo } from 'react';
import RawSelect, {
  type Props as RawSelectProps,
  type GroupBase,
  type StylesConfig,
  type ThemeConfig,
} from 'react-select';
import RawAsyncSelect, { type AsyncProps } from 'react-select/async';
import RawAsyncCreatableSelect, {
  type AsyncCreatableProps,
} from 'react-select/async-creatable';
import RawCreatableSelect, {
  type CreatableProps,
} from 'react-select/creatable';

const themeConfig: ThemeConfig = (existing) => ({
  ...existing,
  borderRadius: 0,
  colors: {
    ...existing.colors,
    primary25: 'var(--color--surface-hover)',
    // disabled
    neutral10: 'var(--color--border)',
    // normal
    neutral20: 'var(--color--border)',
    // focused
    primary: 'var(--color--focus--border)',
    // hover
    neutral30: 'var(--color--border-hover)',
  },
});

const useStyles = (isDisabled?: boolean, error?: boolean) => {
  return useMemo<StylesConfig>(() => {
    return {
      placeholder: (provided) => ({
        ...provided,
        color: 'var(--color--ink-placeholder)',
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
              ? 'var(--color--feedback-fail--border)'
              : 'var(--color--focus--border)',
            backgroundColor: isDisabled
              ? 'var(--color--disabled--surface)'
              : 'var(--color--surface)',
            boxShadow: `0 0 0 4px ${
              error
                ? 'var(--color--feedback-fail--outline)'
                : 'var(--color--focus--outline)'
            }`,
            '&:hover': {
              borderColor: error
                ? 'var(--color--feedback-fail--border)'
                : 'var(--color--focus--border)',
            },
          };
        }

        return {
          ...result,
          borderColor: error
            ? 'var(--color--feedback-fail--border)'
            : 'var(--color--border)',
          backgroundColor: isDisabled
            ? 'var(--color--disabled--surface)'
            : 'var(--color--surface)',
          '&:hover': {
            borderColor: error
              ? 'var(--color--feedback-fail--border)'
              : 'var(--color--border-hover)',
          },
        };
      },
      multiValueRemove: (provided) => ({
        ...provided,
        cursor: 'pointer',
        color: 'var(--color--tinted--ink)',
        ':hover': {
          backgroundColor: 'var(--color--tinted--surface-hover)',
          color: 'var(--color--tinted--ink)',
        },
      }),
      menu: (provided) => {
        return {
          ...provided,
          zIndex: 1000,
          minWidth: 250,
          backgroundColor: 'var(--color--raised--surface)',
          boxShadow: 'var(--shadow--floating)',
        };
      },
      singleValue: (provided) => ({
        ...provided,
        color: 'var(--color--ink)',
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
            ? 'var(--color--surface-hover)'
            : undefined,
        color: 'var(--color--ink)',
      }),
      multiValue: (provided) => {
        return {
          ...provided,
          zIndex: 100,
          backgroundColor: 'var(--color--tinted--surface)',
          userSelect: 'none',
        };
      },
      multiValueLabel: (provided) => ({
        ...provided,
        fontSize: 'inherit',
        padding: 3,
        color: 'var(--color--tinted--ink)',
      }),
    };
  }, [isDisabled, error]);
};

type ErrorProp = { error?: boolean };

export type SelectInputProps<
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>,
> = Omit<RawSelectProps<Option, IsMulti, Group>, 'theme' | 'styles'> &
  ErrorProp;

export function SelectInput<
  Option = unknown,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
>({
  isDisabled,
  error,
  ...other
}: SelectInputProps<Option, IsMulti, Group>): JSX.Element {
  const styles = useStyles(isDisabled, error);

  return (
    <RawSelect<Option, IsMulti, Group>
      {...other}
      isDisabled={isDisabled}
      theme={themeConfig}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      styles={styles as any}
    />
  );
}

export type AsyncSelectInputProps<
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>,
> = Omit<AsyncProps<Option, IsMulti, Group>, 'theme' | 'styles'> & ErrorProp;

export function AsyncSelectInput<
  Option = unknown,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
>({
  isDisabled,
  error,
  ...other
}: AsyncSelectInputProps<Option, IsMulti, Group>): JSX.Element {
  const styles = useStyles(isDisabled, error);

  return (
    <RawAsyncSelect<Option, IsMulti, Group>
      {...other}
      isDisabled={isDisabled}
      theme={themeConfig}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      styles={styles as any}
    />
  );
}

export type CreatableSelectInputProps<
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>,
> = Omit<CreatableProps<Option, IsMulti, Group>, 'theme' | 'styles'> &
  ErrorProp;

export function CreatableSelectInput<
  Option = unknown,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
>({
  isDisabled,
  error,
  ...other
}: CreatableSelectInputProps<Option, IsMulti, Group>): JSX.Element {
  const styles = useStyles(isDisabled, error);

  return (
    <RawCreatableSelect<Option, IsMulti, Group>
      {...other}
      isDisabled={isDisabled}
      theme={themeConfig}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      styles={styles as any}
    />
  );
}

export type AsyncCreatableSelectInputProps<
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>,
> = Omit<AsyncCreatableProps<Option, IsMulti, Group>, 'theme' | 'styles'> &
  ErrorProp;

export function AsyncCreatableSelectInput<
  Option = unknown,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
>({
  isDisabled,
  error,
  ...other
}: AsyncCreatableSelectInputProps<Option, IsMulti, Group>): JSX.Element {
  const styles = useStyles(isDisabled, error);

  return (
    <RawAsyncCreatableSelect<Option, IsMulti, Group>
      {...other}
      isDisabled={isDisabled}
      theme={themeConfig}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      styles={styles as any}
    />
  );
}
