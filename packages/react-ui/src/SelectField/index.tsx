import React, { ReactNode } from 'react';
import {
  AsyncCreatableSelectInput,
  AsyncCreatableSelectInputProps,
  AsyncSelectInput,
  AsyncSelectInputProps,
  CreatableSelectInput,
  CreatableSelectInputProps,
  FieldError,
  FieldHint,
  FormLabel,
  FormLabelProps,
  SelectInput,
  SelectInputProps,
} from '..';
import { GroupBase } from 'react-select';

type SelectFieldProps<
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
> = {
  id: string;
  name: string;
  label: ReactNode;
  hint?: ReactNode;
  placeholder?: string;
  error?: ReactNode;
  required?: boolean;
  formLabelProps?: FormLabelProps;
  value: SelectInputProps<Option, IsMulti, Group>['value'];
  onChange: SelectInputProps<Option, IsMulti, Group>['onChange'];
  selectInputProps?: SelectInputProps<Option, IsMulti, Group>;
};

export function SelectField<
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
>({
  id,
  name,
  label,
  hint,
  error,
  required,
  placeholder,
  formLabelProps,
  value,
  onChange,
  selectInputProps,
}: SelectFieldProps<Option, IsMulti, Group>): JSX.Element {
  return (
    <>
      <FormLabel {...formLabelProps} htmlFor={id} required={required} error={!!error}>
        {label}
      </FormLabel>

      <SelectInput<Option, IsMulti, Group>
        {...selectInputProps}
        id={id}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        error={!!error}
      />

      {error && <FieldError>{error}</FieldError>}
      {hint && <FieldHint>{hint}</FieldHint>}
    </>
  );
}

type AsyncSelectFieldProps<
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
> = {
  id: string;
  name: string;
  label: ReactNode;
  hint?: ReactNode;
  placeholder?: string;
  error?: ReactNode;
  required?: boolean;
  formLabelProps?: FormLabelProps;
  value: AsyncSelectInputProps<Option, IsMulti, Group>['value'];
  onChange: AsyncSelectInputProps<Option, IsMulti, Group>['onChange'];
  selectInputProps?: AsyncSelectInputProps<Option, IsMulti, Group>;
};

export function AsyncSelectField<
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
>({
  id,
  name,
  label,
  hint,
  error,
  required,
  placeholder,
  formLabelProps,
  value,
  onChange,
  selectInputProps,
}: AsyncSelectFieldProps<Option, IsMulti, Group>): JSX.Element {
  return (
    <>
      <FormLabel {...formLabelProps} htmlFor={id} required={required} error={!!error}>
        {label}
      </FormLabel>

      <AsyncSelectInput<Option, IsMulti, Group>
        {...selectInputProps}
        id={id}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        error={!!error}
      />

      {error && <FieldError>{error}</FieldError>}
      {hint && <FieldHint>{hint}</FieldHint>}
    </>
  );
}

type CreatableSelectFieldProps<
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
> = {
  id: string;
  name: string;
  label: ReactNode;
  hint?: ReactNode;
  placeholder?: string;
  error?: ReactNode;
  required?: boolean;
  formLabelProps?: FormLabelProps;
  value: CreatableSelectInputProps<Option, IsMulti, Group>['value'];
  onChange: CreatableSelectInputProps<Option, IsMulti, Group>['onChange'];
  selectInputProps?: CreatableSelectInputProps<Option, IsMulti, Group>;
};

export function CreatableSelectField<
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
>({
  id,
  name,
  label,
  hint,
  error,
  required,
  placeholder,
  formLabelProps,
  value,
  onChange,
  selectInputProps,
}: CreatableSelectFieldProps<Option, IsMulti, Group>): JSX.Element {
  return (
    <>
      <FormLabel {...formLabelProps} htmlFor={id} required={required} error={!!error}>
        {label}
      </FormLabel>

      <CreatableSelectInput<Option, IsMulti, Group>
        {...selectInputProps}
        id={id}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        error={!!error}
      />

      {error && <FieldError>{error}</FieldError>}
      {hint && <FieldHint>{hint}</FieldHint>}
    </>
  );
}

type AsyncCreatableSelectFieldProps<
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
> = {
  id: string;
  name: string;
  label: ReactNode;
  hint?: ReactNode;
  placeholder?: string;
  error?: ReactNode;
  required?: boolean;
  formLabelProps?: FormLabelProps;
  value: AsyncCreatableSelectInputProps<Option, IsMulti, Group>['value'];
  onChange: AsyncCreatableSelectInputProps<Option, IsMulti, Group>['onChange'];
  selectInputProps?: AsyncCreatableSelectInputProps<Option, IsMulti, Group>;
};

export function AsyncCreatableSelectField<
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
>({
  id,
  name,
  label,
  hint,
  error,
  required,
  placeholder,
  formLabelProps,
  value,
  onChange,
  selectInputProps,
}: AsyncCreatableSelectFieldProps<Option, IsMulti, Group>): JSX.Element {
  return (
    <>
      <FormLabel {...formLabelProps} htmlFor={id} required={required} error={!!error}>
        {label}
      </FormLabel>

      <AsyncCreatableSelectInput<Option, IsMulti, Group>
        {...selectInputProps}
        id={id}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        error={!!error}
      />

      {error && <FieldError>{error}</FieldError>}
      {hint && <FieldHint>{hint}</FieldHint>}
    </>
  );
}
