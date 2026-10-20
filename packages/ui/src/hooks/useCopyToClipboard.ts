import copy from 'copy-to-clipboard';
import { useCallback, useEffect, useState } from 'react';

// How long the control tells that the copy is done
const COPIED_FOR = 1500;

// See the "Copyable values" docs page (stories/Content/CopyableValues/CopyableValues.mdx).
// The control that calls `copy` swaps its icon or its label while `copied` is true. Use this hook in
// all the controls that copy: do not keep this state in a component.
export function useCopyToClipboard(value: string | null | undefined) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) {
      return undefined;
    }

    const timeout = setTimeout(() => setCopied(false), COPIED_FOR);
    return () => clearTimeout(timeout);
  }, [copied]);

  const copyValue = useCallback(() => {
    if (!value) {
      return;
    }

    copy(value);
    setCopied(true);
  }, [value]);

  return { copied, copy: copyValue };
}
