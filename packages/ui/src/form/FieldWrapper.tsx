import classNames from 'classnames';
import React, {
  Children,
  createContext,
  forwardRef,
  isValidElement,
  type ReactNode,
  useContext,
  useMemo,
} from 'react';
import { useAutoincrementIntegerId } from '../hooks/useAutoincrementIntegerId';
import { useTranslation } from '../i18n';
import { type Message } from '../Message';
import FieldHint from './FieldHint';
import { type FieldInputStatics } from './inputProps';
import Label from './Label';

/** The parts of the label of a field that are not its text */
export type FieldWrapperLabelExtras = {
  /**
   * Hides the label from the eye. A screen reader still reads it as the name
   * of the input. Use it when a text near the input shows what it is.
   */
  hidden?: boolean;
  /** Adds the icon that tells that the value is different for each locale. */
  localized?: boolean;
  /**
   * The validators of the field, for the `FieldValidations` component of
   * `FormAppProvider`. They do not validate the value.
   */
  validators?: Record<string, any>;
  /** Renders a menu at the end of the label. See `Label`. */
  renderDropdown?: () => ReactNode;
  /** Renders extra content in the label. See `Label`. */
  renderInfo?: () => ReactNode;
};

/** The label of a field */
export type FieldWrapperLabelProps =
  /** A field with a label above the input */
  | {
      /**
       * The text of the label: a `Message` (a string, `{ id, values }`,
       * `{ html }` or an element). It is the name of the input. Do not give
       * it around a `SwitchInput`: the switch names itself.
       */
      label: Message;
      /** The parts of the label that are not its text */
      labelExtras?: FieldWrapperLabelExtras;
    }
  /** A field with no label: the input names itself (a switch) */
  | { label?: never; labelExtras?: never };

/**
 * A required field shows an asterisk, thus it cannot also show "(optional)".
 */
export type FieldWrapperRequirementProps =
  /** A field that is not required, with "(optional)" after the label */
  | {
      required?: false;
      labelExtras: FieldWrapperLabelExtras & {
        /**
         * Shows "(optional)" after the label. Use it when most of the fields
         * of the form are required.
         */
        optional: true;
      };
    }
  /** Any other field */
  | {
      /** Adds an asterisk to the label and `aria-required` to the input */
      required?: boolean;
      labelExtras?: FieldWrapperLabelExtras & { optional?: false };
    };

/** The props of `FieldWrapper` */
export type FieldWrapperProps = FieldWrapperLabelProps &
  FieldWrapperRequirementProps & {
    /**
     * The `id` of the input. The label points to it, and the input gets it
     * through `useFieldInput`. Without it, the field makes an id.
     */
    id?: string;
    /**
     * A short help under the input. A string is plain text. For markup, give
     * `{ html }`: this HTML is not sanitized, thus give only HTML that you
     * trust. A screen reader reads it as the description of the input.
     */
    hint?: Message;
    /**
     * A link to the docs, under the hint. `label` is the text of the link and
     * `to` is the URL.
     */
    docs?: { label: Message; to: string };
    /**
     * The error of the value. The field shows it under the input, and the
     * input gets `aria-invalid` and the error as its description. Without
     * it, the value is valid.
     */
    error?: Message;
    /**
     * The attributes of the container of the field, for the layout of the
     * page: an `id` to scroll to, a class, and content after the hint.
     */
    container?: {
      /** The `id` of the container */
      id?: string;
      /** A CSS class for the container, next to `form__field` */
      className?: string;
      /** Content after the hint, inside the container */
      trailing?: ReactNode;
    };
    /**
     * The input. It must call `useFieldInput`: all the inputs of the package
     * do.
     */
    children: ReactNode;
  };

/** What a `FieldWrapper` gives to the input in it */
export type FieldContextValue = {
  /** The `id` of the input */
  id: string;
  /** The `id` of the text of the label, when the field has a label */
  labelledBy?: string;
  /** The `id` of the error and of the hint, when they show */
  describedBy?: string;
  /** The value has an error */
  invalid: boolean;
  /** The field is required */
  required: boolean;
};

// A custom input types its props with the contract of the inputs, thus a
// plugin gets the types from this module.
export type {
  BaseInputComponentPropsField,
  BaseInputComponentPropsFieldWithReadOnly,
} from './inputProps';

const FieldContext = createContext<FieldContextValue | undefined>(undefined);

/** The props of an input that its field gives */
export type FieldInputProps = {
  /** The `id` of the input. The label of the field points to it. */
  id?: string;
  /** The `id` of the text of the label of the field */
  'aria-labelledby'?: string;
  /** The `id` of the error and of the hint of the field */
  'aria-describedby'?: string;
  /** Set when the value has an error */
  'aria-invalid'?: React.AriaAttributes['aria-invalid'];
  /** Set when the field is required */
  'aria-required'?: React.AriaAttributes['aria-required'];
};

/**
 * Gives the `id` and the ARIA props of an input in a `FieldWrapper`. It
 * takes the props of the input and reads the five props of
 * `FieldInputProps`: a prop that the caller gives wins over the field. Out
 * of a `FieldWrapper`, it gives the props of the caller as they are.
 *
 * All the inputs of the package call it. A custom input of a plugin calls it
 * too, and puts the result on the element that gets the focus: thus the
 * input works in a `FieldWrapper`.
 * @example const fieldProps = useFieldInput(props); return <input {...fieldProps} />;
 */
export function useFieldInput(props: FieldInputProps): FieldInputProps {
  const field = useContext(FieldContext);

  return {
    id: props.id ?? field?.id,
    'aria-labelledby': props['aria-labelledby'] ?? field?.labelledBy,
    'aria-describedby': props['aria-describedby'] ?? field?.describedBy,
    'aria-invalid': props['aria-invalid'] ?? (field?.invalid || undefined),
    'aria-required': props['aria-required'] ?? (field?.required || undefined),
  };
}

/** The props of `FieldWrapper.Boundary` */
export type FieldWrapperBoundaryProps = {
  /** The inner inputs of a composite input */
  children: ReactNode;
};

/**
 * Stops the field at the group element of a composite input (a list, a
 * group of inputs). The inputs in it do not get the `id` and the ARIA props
 * of the field: each one has its own name.
 */
function Boundary({ children }: FieldWrapperBoundaryProps) {
  return (
    <FieldContext.Provider value={undefined}>{children}</FieldContext.Provider>
  );
}

function warnOnSwitchLabel(label: Message | undefined, children: ReactNode) {
  if (!import.meta.env.DEV || label === undefined) return;

  const items = Children.toArray(children);
  const child = items.length === 1 ? items[0] : undefined;

  if (
    isValidElement(child) &&
    typeof child.type !== 'string' &&
    (child.type as FieldInputStatics).fieldLabel === 'inside'
  ) {
    console.warn(
      'FieldWrapper has a label around an input that names itself (SwitchInput): give the label to the input, and only the hint and the error to FieldWrapper',
    );
  }
}

/**
 * The layout of a field: the label, the input, the error and the hint. The
 * field owns the accessibility (the ids, the name, the description), and
 * the input owns the value.
 */
const FieldWrapper = forwardRef<HTMLDivElement, FieldWrapperProps>(
  function FieldWrapper(
    {
      id,
      label,
      labelExtras,
      required,
      hint,
      docs,
      error,
      container,
      children,
    },
    ref,
  ) {
    const { tc } = useTranslation();
    const uid = useAutoincrementIntegerId();
    const inputId = id ?? `FieldWrapper-${uid}`;
    const labelTextId = `${inputId}-label`;
    const errorId = `${inputId}-error`;
    const hintId = `${inputId}-hint`;
    // An empty string is no error: a form library can give it for a valid value
    const invalid = Boolean(error);
    const hasHint = Boolean(hint || docs);

    warnOnSwitchLabel(label, children);

    const describedBy =
      [invalid && errorId, hasHint && hintId].filter(Boolean).join(' ') ||
      undefined;
    const labelledBy = label ? labelTextId : undefined;

    const context = useMemo<FieldContextValue>(
      () => ({
        id: inputId,
        labelledBy,
        describedBy,
        invalid,
        required: Boolean(required),
      }),
      [inputId, labelledBy, describedBy, invalid, required],
    );

    return (
      <div
        id={container?.id}
        className={classNames('form__field', container?.className, {
          'form__field--invalid': invalid,
        })}
        ref={ref}
      >
        {label && (
          <Label
            htmlFor={inputId}
            textId={labelTextId}
            label={label}
            hidden={labelExtras?.hidden}
            {...(labelExtras?.optional ? { optional: true } : { required })}
            localized={labelExtras?.localized}
            renderInfo={labelExtras?.renderInfo}
            renderDropdown={labelExtras?.renderDropdown}
            validators={labelExtras?.validators}
          />
        )}
        <FieldContext.Provider value={context}>
          {children}
        </FieldContext.Provider>
        {error && (
          <div id={errorId} role="alert" className="form__error">
            {tc(error)}
          </div>
        )}
        <FieldHint id={hintId} hint={hint} docs={docs} />
        {container?.trailing}
      </div>
    );
  },
);

export default Object.assign(FieldWrapper, { Boundary });
