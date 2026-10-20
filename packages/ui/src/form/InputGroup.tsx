import classNames from 'classnames';
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';
import { useTranslation } from '../i18n';
import { type Message, type TextMessage } from '../Message';
import FieldWrapper, { useFieldInput } from './FieldWrapper';
import StringInput, { StringInputProps } from './StringInput';

// An Omit for each member of a union. A plain Omit of `StringInputProps`
// merges the enabled and the disabled props into one type.
type DistributiveOmit<U, K extends PropertyKey> = U extends unknown
  ? Omit<U, K>
  : never;

/**
 * The props of `InputGroup`: the props of `StringInput` and the addons. The
 * package draws the box, thus `InputGroup` takes no class. Put a class for
 * the layout on the field (`container.className` of `FieldWrapper`).
 */
export type InputGroupProps = DistributiveOmit<
  StringInputProps,
  'className'
> & {
  /** A text or an icon before the input, for example "https://" */
  pre?: Message;
  /** A text or an icon after the input, for example ".admin.datocms.com" */
  post?: Message;
};

/** The props of `InputGroup.Root`: the box of a group of more inputs. */
export type InputGroupRootProps = {
  /**
   * The inputs (`InputGroup.Input`) and the addons. In a `FieldWrapper`,
   * the box takes the `id` and the description of the field, and each input
   * keeps its own name.
   */
  children: ReactNode;
  /**
   * The name of the group for a screen reader. The box has
   * `role="group"`. Put the unit in it, because a screen reader does not
   * read the addons.
   * @example "Minimum size in pixels"
   */
  ariaLabel: TextMessage;
  /**
   * The box is as wide as its content, not as wide as its container. Use it
   * for short values on one line, for example a width and a height.
   * @default false
   */
  inline?: boolean;
  /**
   * Shows the inputs and the addons in the monospaced font. An
   * `InputGroup.Input` can set its own `code`.
   * @default false
   */
  code?: boolean;
};

/** The props of `InputGroup.Input`: the props of `StringInput`. */
export type InputGroupInputProps = DistributiveOmit<
  StringInputProps,
  'className'
> & {
  /**
   * The name of the input for a screen reader, when its field has no
   * label. The name of the group comes before it.
   * @example "Width"
   */
  ariaLabel?: TextMessage;
};

/** The props of `InputGroup.Addon`. */
export type InputGroupAddonProps = {
  /** The fixed text, for example "px" or "x" */
  children: ReactNode;
};

// React 17 has no `useId`, thus we make the ids of the addons with a counter.
let nextAddonsId = 0;

const InputGroupContext = createContext<{ code: boolean }>({ code: false });

function Root({ children, ariaLabel, inline, code }: InputGroupRootProps) {
  const { tm } = useTranslation();
  // The box has its own name, thus it takes only the id and the description
  const field = useFieldInput({});

  return (
    <div
      id={field.id}
      role="group"
      aria-label={tm(ariaLabel)}
      aria-describedby={field['aria-describedby']}
      className={classNames(
        'InputFrame input-group',
        inline && 'input-group--inline',
        code && 'input-group--code',
      )}
    >
      <InputGroupContext.Provider value={{ code: Boolean(code) }}>
        <FieldWrapper.Boundary>{children}</FieldWrapper.Boundary>
      </InputGroupContext.Provider>
    </div>
  );
}

/**
 * The bare input of an `InputGroup.Root`. It has the props of `StringInput`.
 * Give it as the `component` of a `Field`.
 */
function Input({ ariaLabel, code, ...other }: InputGroupInputProps) {
  const { tm } = useTranslation();
  const group = useContext(InputGroupContext);

  return (
    <StringInput
      {...other}
      aria-label={ariaLabel ? tm(ariaLabel) : undefined}
      code={code ?? group.code}
      className="InputFrame__input"
    />
  );
}

/**
 * A fixed text in an `InputGroup.Root`. A click on it does nothing, because
 * the box can have more inputs. A screen reader does not read it: the names
 * of the group and of the inputs tell the unit.
 */
function Addon({ children }: InputGroupAddonProps) {
  return (
    <span className="input-group__addon" aria-hidden={true}>
      {children}
    </span>
  );
}

function InputGroup({ pre, post, code, ...other }: InputGroupProps) {
  const { tc } = useTranslation();
  const field = useFieldInput(other);
  const describedBy = field['aria-describedby'];
  const groupRef = useRef<HTMLDivElement>(null);
  const [addonsId] = useState(() => `InputGroup__addon-${++nextAddonsId}`);
  const preId = `${addonsId}-pre`;
  const postId = `${addonsId}-post`;

  const handleAddonClick = useCallback(() => {
    groupRef.current?.querySelector('input')?.focus();
  }, []);

  return (
    <div
      ref={groupRef}
      className={classNames(
        'InputFrame input-group',
        code && 'input-group--code',
      )}
    >
      {pre && (
        <span
          id={preId}
          className="input-group__addon"
          onClick={handleAddonClick}
        >
          {tc(pre)}
        </span>
      )}
      {/* The description of the input has the addons after the error and
          the hint of the field. Thus a screen reader reads the label, then the error, then
          the addons. */}
      <StringInput
        {...other}
        {...field}
        aria-describedby={
          [describedBy, pre && preId, post && postId]
            .filter(Boolean)
            .join(' ') || undefined
        }
        code={code}
        className="InputFrame__input"
      />
      {post && (
        <span
          id={postId}
          className="input-group__addon"
          onClick={handleAddonClick}
        >
          {tc(post)}
        </span>
      )}
    </div>
  );
}

export default Object.assign(React.memo(InputGroup), {
  Root,
  Input: React.memo(Input),
  Addon,
});
