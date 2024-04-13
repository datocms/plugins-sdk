import cn from 'classnames';
import React, {
  Children,
  useCallback,
  type CSSProperties,
  type FormEventHandler,
  type FormEvent,
  type ReactNode,
} from 'react';
import styles from './styles.module.css.json';

export interface FormProps {
  onSubmit?: FormEventHandler;
  spacing?: 'condensed' | 'default';
  style?: CSSProperties;
  className?: string;
  children: ReactNode;
}

/**
 * @example Full example
 *
 * ```js
 * <Canvas ctx={ctx}>
 *   <Form onSubmit={() => console.log('onSubmit')}>
 *     <FieldGroup>
 *       <TextField
 *         required
 *         name="name"
 *         id="name"
 *         label="Name"
 *         value="Mark Smith"
 *         placeholder="Enter full name"
 *         hint="Provide a full name"
 *         onChange={(newValue) => console.log(newValue)}
 *       />
 *       <TextField
 *         required
 *         name="email"
 *         id="email"
 *         label="Email"
 *         type="email"
 *         value=""
 *         placeholder="your@email.com"
 *         error="Please enter an email!"
 *         hint="Enter email address"
 *         onChange={(newValue) => console.log(newValue)}
 *       />
 *       <TextField
 *         required
 *         name="apiToken"
 *         id="apiToken"
 *         label="API Token"
 *         value="XXXYYY123"
 *         hint="Enter a valid API token"
 *         textInputProps={{ monospaced: true }}
 *         onChange={(newValue) => console.log(newValue)}
 *       />
 *       <TextareaField
 *         required
 *         name="longText"
 *         id="longText"
 *         label="Long text"
 *         value="Lorem ipsum dolor sit amet, consectetur adipiscing elit.."
 *         hint="Enter some text"
 *         onChange={(newValue) => console.log(newValue)}
 *       />
 *       <SelectField
 *         name="option"
 *         id="option"
 *         label="Option"
 *         hint="Select one of the options"
 *         value={{ label: 'Option 1', value: 'option1' }}
 *         selectInputProps={{
 *           options: [
 *             { label: 'Option 1', value: 'option1' },
 *             { label: 'Option 2', value: 'option2' },
 *             { label: 'Option 3', value: 'option3' },
 *           ],
 *         }}
 *         onChange={(newValue) => console.log(newValue)}
 *       />
 *       <SelectField
 *         name="multipleOption"
 *         id="multipleOption"
 *         label="Multiple options"
 *         hint="Select one of the options"
 *         value={[
 *           { label: 'Option 1', value: 'option1' },
 *           { label: 'Option 2', value: 'option2' },
 *         ]}
 *         selectInputProps={{
 *           isMulti: true,
 *           options: [
 *             { label: 'Option 1', value: 'option1' },
 *             { label: 'Option 2', value: 'option2' },
 *             { label: 'Option 3', value: 'option3' },
 *           ],
 *         }}
 *         onChange={(newValue) => console.log(newValue)}
 *       />
 *       <SwitchField
 *         name="debugMode"
 *         id="debugMode"
 *         label="Debug mode active?"
 *         hint="Logs messages to console"
 *         value={true}
 *         onChange={(newValue) => console.log(newValue)}
 *       />
 *     </FieldGroup>
 *     <FieldGroup>
 *       <Button fullWidth buttonType="primary">
 *         Submit
 *       </Button>
 *     </FieldGroup>
 *   </Form>
 * </Canvas>;
 * ```
 */
export const Form = ({
  children,
  className,
  onSubmit,
  spacing = 'default',
  ...otherProps
}: FormProps): JSX.Element => {
  const classNames = cn(styles.Form, className);

  const formItemClassNames = cn(
    styles.Form__item,
    styles[`Form__item--${spacing}`],
  );

  const handleSubmit = useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      if (onSubmit) {
        onSubmit(event);
      }
    },
    [onSubmit],
  );

  return (
    <form className={classNames} onSubmit={handleSubmit} {...otherProps}>
      {Children.map(children, (child) => {
        if (child) {
          return <div className={formItemClassNames}>{child}</div>;
        }
        return null;
      })}
    </form>
  );
};
