import React, { createContext, ReactNode, useContext } from 'react';

// The behaviours of the forms that need the data or the components of the
// app. The app gives them once, near the root. Without a provider, the forms
// work without these behaviours.
export type FormAppOptions = {
  // Shows the rules of the validators of a field next to its label.
  FieldValidations?: React.ComponentType<{
    validators: Record<string, any> | undefined;
  }>;
  // Shows the Formik state of a form in debug mode.
  DebugView?: React.ComponentType;
  // Shows a dialog for a base error that needs more than a message (for
  // example a limit of the plan). It returns null for the other errors. The
  // form shows it again when the error changes.
  BaseErrorDialog?: React.ComponentType<{
    error: BaseError;
    onClose: () => void;
  }>;
  // The IDs of the base errors that the app shows in a different place,
  // thus FormGlobalError does not show them.
  hiddenBaseErrorIds?: string[];
  // Finds the error when no field and no global error of the form shows it.
  // It returns true when it finds the error.
  scrollIntoErrorFallback?: (root: ParentNode) => boolean;
};

export type BaseError =
  | string
  | {
      id: string;
      details: {
        limit: string;
        analysis: Record<string, unknown>;
      };
    };

const EMPTY_OPTIONS: FormAppOptions = {};

const FormAppContext = createContext<FormAppOptions>(EMPTY_OPTIONS);

export function FormAppProvider({
  value,
  children,
}: {
  value: FormAppOptions;
  children: ReactNode;
}) {
  return (
    <FormAppContext.Provider value={value}>{children}</FormAppContext.Provider>
  );
}

export function useFormApp() {
  return useContext(FormAppContext);
}
