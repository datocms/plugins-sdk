import React, { useMemo } from 'react';
import RawSelect, {
  type Props as RawSelectProps,
  type GroupBase,
} from 'react-select';
import RawAsyncSelect, { type AsyncProps } from 'react-select/async';
import RawAsyncCreatableSelect, {
  type AsyncCreatableProps,
} from 'react-select/async-creatable';
import RawCreatableSelect, {
  type CreatableProps,
} from 'react-select/creatable';
import { buildStyles, themeConfig } from './theme';

const useStyles = (isDisabled?: boolean, error?: boolean) =>
  useMemo(() => buildStyles(isDisabled, error), [isDisabled, error]);

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
