import React, { useMemo } from 'react';
import RawSelect, {
  Props as RawSelectProps,
  GroupBase,
  StylesConfig,
  ThemeConfig,
} from 'react-select';
import RawAsyncSelect, { AsyncProps } from 'react-select/async';
import RawAsyncCreatableSelect, {
  AsyncCreatableProps,
} from 'react-select/async-creatable';
import RawCreatableSelect, { CreatableProps } from 'react-select/creatable';

const themeConfig: ThemeConfig = (existing) => ({
  ...existing,
  borderRadius: 0,
  colors: {
    ...existing.colors,
    primary25: 'var(--semi-transparent-accent-color)',
    // disabled
    neutral10: 'var(--border-color)',
    // normal
    neutral20: 'var(--border-color)',
    // focused
    primary: 'var(--accent-color)',
    // hover
    neutral30: 'var(--darker-border-color)',
  },
});

const useStyles = (isDisabled?: boolean, error?: boolean) => {
  return useMemo<StylesConfig>(() => {
    return {
      placeholder: (provided) => ({
        ...provided,
        color: 'var(--placeholder-body-color)',
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
            borderColor: error ? 'var(--alert-color)' : 'var(--accent-color)',
            backgroundColor: isDisabled ? 'var(--disabled-color)' : 'white',
            boxShadow: `0 0 0 3px ${
              error
                ? 'rgba(var(--alert-color-rgb-components), 0.2)'
                : 'var(--semi-transparent-accent-color)'
            }`,
            '&:hover': {
              borderColor: error ? 'var(--alert-color)' : 'var(--accent-color)',
            },
          };
        }

        return {
          ...result,
          borderColor: error ? 'var(--alert-color)' : 'var(--border-color)',
          backgroundColor: isDisabled ? 'var(--disabled-color)' : 'white',
          '&:hover': {
            borderColor: error
              ? 'var(--alert-color)'
              : 'var(--darker-border-color)',
          },
        };
      },
      multiValueRemove: (provided) => ({
        ...provided,
        cursor: 'pointer',
      }),
      menu: (provided) => {
        return {
          ...provided,
          zIndex: 1000,
          minWidth: 250,
        };
      },
      input: (provided) => {
        const result = {
          ...provided,
          boxShadow: 'none',
          'input:focus': {
            boxShadow: 'none',
          },
        };

        return result;
      },
      multiValue: (provided) => {
        return {
          ...provided,
          zIndex: 100,
          backgroundColor: 'var(--light-color)',
          userSelect: 'none',
        };
      },
      multiValueLabel: (provided) => ({
        ...provided,
        fontSize: 'inherit',
        padding: 3,
      }),
    };
  }, [isDisabled, error]);
};

type ErrorProp = { error?: boolean };

export type SelectInputProps<
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
> = Omit<RawSelectProps<Option, IsMulti, Group>, 'theme' | 'styles'> &
  ErrorProp;

export function SelectInput<
  Option = unknown,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
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
  Group extends GroupBase<Option>
> = Omit<AsyncProps<Option, IsMulti, Group>, 'theme' | 'styles'> & ErrorProp;

export function AsyncSelectInput<
  Option = unknown,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
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
  Group extends GroupBase<Option>
> = Omit<CreatableProps<Option, IsMulti, Group>, 'theme' | 'styles'> &
  ErrorProp;

export function CreatableSelectInput<
  Option = unknown,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
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
  Group extends GroupBase<Option>
> = Omit<AsyncCreatableProps<Option, IsMulti, Group>, 'theme' | 'styles'> &
  ErrorProp;

export function AsyncCreatableSelectInput<
  Option = unknown,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
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
