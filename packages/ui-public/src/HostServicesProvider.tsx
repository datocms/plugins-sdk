import React, { createContext, ReactNode, useContext } from 'react';
import { type Message } from './Message';
import { type QuestionPayload } from './overlays/confirmQuestion';

export type {
  Choice,
  Intent,
  QuestionPayload,
} from './overlays/confirmQuestion';

/**
 * The services of the host that the components of ui-public use: the
 * notifications and the confirm dialog. The host draws them.
 * `BuiltInHostServices` makes one for the apps.
 */
export type HostServices = {
  /** Shows a short confirmation of success */
  notice: (message: Message) => void;
  /** Shows a warning that needs no action */
  warn: (message: Message) => void;
  /** Shows an error */
  alert: (message: Message) => void;
  /**
   * Asks a question. The promise gives the `value` of the button that the
   * user chooses, or the `value` of `cancel`, also when the user closes the
   * dialog with no choice.
   */
  confirm: <ResponseType>(
    question: QuestionPayload<ResponseType>,
  ) => Promise<ResponseType>;
};

const HostServicesContext = createContext<HostServices | null>(null);

export type HostServicesProviderProps = {
  /** The services of the host. Give a stable object (`useMemo`). */
  value: HostServices;
  /** The app */
  children: ReactNode;
};

/**
 * Gives the services of the host to the components of ui-public. Put it once,
 * near the root of the app.
 */
export function HostServicesProvider({
  value,
  children,
}: HostServicesProviderProps) {
  return (
    <HostServicesContext.Provider value={value}>
      {children}
    </HostServicesContext.Provider>
  );
}

/**
 * The services of the host, from the nearest HostServicesProvider. A class
 * component gets them as a prop from a function component that calls this
 * hook.
 */
export function useHostServices(): HostServices {
  const services = useContext(HostServicesContext);

  // A notification or a question that does not show is an error that is
  // easy to miss. Thus a missing provider stops the render with a clear
  // message.
  if (!services) {
    throw new Error(
      'A component of ui-public has no HostServicesProvider above it. Put BuiltInHostServices (the notifications and the dialogs of ui-public) near the root.',
    );
  }

  return services;
}

export default HostServicesProvider;
