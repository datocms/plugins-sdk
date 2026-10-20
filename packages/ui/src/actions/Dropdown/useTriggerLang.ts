import { useContext, useLayoutEffect, useState } from 'react';
import DropdownContext from './DropdownContext';

// A menu goes into a Portal on document.body, thus it does not get the "lang"
// of an ancestor. The trigger that opens the menu is not in a Portal. This
// hook finds the "lang" of the nearest ancestor of the trigger.
export function useTriggerLang() {
  const { triggerId } = useContext(DropdownContext);
  const [lang, setLang] = useState<string | undefined>(undefined);

  useLayoutEffect(() => {
    const trigger = triggerId ? document.getElementById(triggerId) : null;
    setLang(trigger?.closest('[lang]')?.getAttribute('lang') ?? undefined);
  }, [triggerId]);

  return lang;
}
