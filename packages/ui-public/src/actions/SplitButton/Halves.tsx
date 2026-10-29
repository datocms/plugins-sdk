import classNames from 'classnames';
import React, { type ReactNode } from 'react';
import Button, { ButtonProps } from '../Button';

type SplitButtonHalvesProps = {
  /** The props of the main half */
  main: ButtonProps;
  className?: string;
  /** The caret, with its menu */
  children: ReactNode;
};

/**
 * The main half and the place of the caret. `SplitButton` and its picture
 * at rest (`Static.tsx`) render it.
 */
const SplitButtonHalves = React.forwardRef<
  HTMLDivElement,
  SplitButtonHalvesProps
>(function SplitButtonHalves({ main, className, children }, ref) {
  return (
    <div ref={ref} className={classNames('button--container', className)}>
      <Button {...main} className="button--sub" />
      {children}
    </div>
  );
});

export default SplitButtonHalves;
