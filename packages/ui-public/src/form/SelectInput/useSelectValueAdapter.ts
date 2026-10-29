import { useCallback, useMemo } from 'react';
import { GroupBase, Options, OptionsOrGroups } from 'react-select';
import { isDefined } from '../../utils/isDefined';
import { BaseSelectOption } from './';

type UseSelectValueAdapterOptions<
  O extends BaseSelectOption,
  G extends GroupBase<O>,
> =
  | {
      multiple: true;
      value: string[] | null | undefined;
      onBlur?: (value: string[]) => void;
      onChange?: (value: string[], options: O[]) => void;
      acceptValueNotIncludedInOptions?: (value: string) => O | undefined;
      options?: OptionsOrGroups<O, G>;
    }
  | {
      multiple: false | undefined;
      value: string | null | undefined;
      options?: OptionsOrGroups<O, G>;
      onBlur?: (value: string | null) => void;
      onChange?: (value: string | null, option: O | null) => void;
      acceptValueNotIncludedInOptions?: (value: string) => O | undefined;
    };

export function useSelectValueAdapter<
  O extends BaseSelectOption,
  G extends GroupBase<O>,
>({
  value: rawValue,
  options,
  multiple,
  onBlur: rawOnBlur,
  onChange: rawOnChange,
  acceptValueNotIncludedInOptions,
}: UseSelectValueAdapterOptions<O, G>) {
  const flatOptions = useMemo<Options<O>>(
    () => ungroupedOptions<O, G>(options),
    [options],
  );

  const valueForReactSelect = useMemo(() => {
    const findOrCreateOptionFromValue = (val: string) => {
      const option = flatOptions.find((o) => o.value === val);

      return !option && acceptValueNotIncludedInOptions
        ? acceptValueNotIncludedInOptions(val)
        : option;
    };

    if (multiple) {
      return rawValue
        ? rawValue
            .map((v) => findOrCreateOptionFromValue(v))
            .filter((o): o is O => Boolean(o))
        : [];
    }

    return rawValue ? (findOrCreateOptionFromValue(rawValue) ?? null) : null;
  }, [rawValue, multiple, flatOptions, acceptValueNotIncludedInOptions]);

  const onChange = useCallback(
    multiple
      ? (newValue: readonly O[]) => {
          const chosen = newValue.filter((x) => isDefined(x.value));
          const ids = chosen.map((x) => x.value).filter(isDefined);
          rawOnChange?.(ids, chosen);
          rawOnBlur?.(ids);
        }
      : (newValue: O | null) => {
          if (newValue) {
            rawOnChange?.(newValue.value, newValue);
            rawOnBlur?.(newValue.value);
          } else {
            rawOnChange?.(null, null);
            rawOnBlur?.(null);
          }
        },
    [rawOnChange, rawOnBlur, multiple],
  );

  return {
    options,
    value: valueForReactSelect,
    onChange,
  };
}

function isGroupedOptions<O extends BaseSelectOption, G extends GroupBase<O>>(
  options: OptionsOrGroups<O, G> | undefined,
): options is G[] {
  return Boolean(options && options.length > 0 && 'options' in options[0]);
}

export function ungroupedOptions<
  O extends BaseSelectOption,
  G extends GroupBase<O>,
>(options: OptionsOrGroups<O, G> | undefined) {
  return isGroupedOptions<O, G>(options)
    ? options.flatMap((o) => o.options)
    : (options as Options<O>);
}
