import React from 'react';
import { Environments } from '../../icons/index';
import { useTranslation } from '../i18n';
import { type Message } from '../Message';
import Pill from './Pill';

export type EnvironmentPillProps = {
  /** True for the primary environment, false for a sandbox */
  primary: boolean;
  /**
   * The type of the environment
   * @default "Primary" or "Sandbox"
   */
  label?: Message;
};

/** A pill that tells the type of an environment, with its icon */
function EnvironmentPill({ primary, label }: EnvironmentPillProps) {
  const { tc } = useTranslation();
  const Icon = primary
    ? Environments.PrimaryEnvironmentIcon
    : Environments.SandboxEnvironmentIcon;

  return (
    <Pill tone="soft" icon={<Icon />}>
      {tc(
        label ?? {
          id: primary ? 'environment.primary' : 'environment.sandbox',
        },
      )}
    </Pill>
  );
}

export default React.memo(EnvironmentPill);
