import { useEffect, useRef } from 'react';

type CloseFn = () => void;

let lastOpenDropdown: CloseFn | null = null;

export function useDropdownRegistry(closeFn: CloseFn, isOpen: boolean) {
  const closeFnRef = useRef(closeFn);
  closeFnRef.current = closeFn;

  useEffect(() => {
    if (isOpen) {
      if (lastOpenDropdown && lastOpenDropdown !== closeFnRef.current) {
        lastOpenDropdown();
      }
      lastOpenDropdown = closeFnRef.current;
    } else if (lastOpenDropdown === closeFnRef.current) {
      lastOpenDropdown = null;
    }
  }, [isOpen]);
}
