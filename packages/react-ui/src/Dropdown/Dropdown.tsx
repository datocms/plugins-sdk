import React, { useCallback, useEffect, useRef, useState } from 'react';
import { MediaQuery } from '../useMediaQuery';
import useClickOutside from '../useClickOutside';
import { DropdownContext } from './DropdownContext';
import s from './styles.module.css.json';

type RenderTriggerCtx = {
  open: boolean;
  onClick: () => void;
};

export type DropdownProps = {
  renderTrigger: (ctx: RenderTriggerCtx) => JSX.Element;
  children: React.ReactNode;
};

/**
 * @example Basic example
 *
 * ```js
 * <Canvas ctx={ctx}>
 *   <Dropdown
 *     renderTrigger={({ open, onClick }) => (
 *       <Button
 *         onClick={onClick}
 *         rightIcon={open ? <CaretUpIcon /> : <CaretDownIcon />}
 *       >
 *         Options
 *       </Button>
 *     )}
 *   >
 *     <DropdownMenu>
 *       <DropdownOption onClick={() => {}}>Edit</DropdownOption>
 *       <DropdownOption disabled onClick={() => {}}>
 *         Duplicate
 *       </DropdownOption>
 *       <DropdownSeparator />
 *       <DropdownOption red onClick={() => {}}>
 *         Delete
 *       </DropdownOption>
 *     </DropdownMenu>
 *   </Dropdown>
 * </Canvas>;
 * ```
 *
 * @example Option actions
 *
 * ```js
 * <Canvas ctx={ctx}>
 *   <Dropdown
 *     renderTrigger={({ open, onClick }) => (
 *       <Button
 *         onClick={onClick}
 *         rightIcon={open ? <CaretUpIcon /> : <CaretDownIcon />}
 *       >
 *         Fields
 *       </Button>
 *     )}
 *   >
 *     <DropdownMenu>
 *       <DropdownOption>
 *         First option
 *         <DropdownOptionAction icon={<PlusIcon />} onClick={() => {}} />
 *         <DropdownOptionAction
 *           red
 *           icon={<TrashIcon />}
 *           onClick={() => {}}
 *         />
 *       </DropdownOption>
 *       <DropdownOption>
 *         Second option
 *         <DropdownOptionAction icon={<PlusIcon />} onClick={() => {}} />
 *         <DropdownOptionAction
 *           red
 *           icon={<TrashIcon />}
 *           onClick={() => {}}
 *         />
 *       </DropdownOption>
 *     </DropdownMenu>
 *   </Dropdown>
 * </Canvas>;
 * ```
 *
 * @example Option groups
 *
 * ```js
 * <Canvas ctx={ctx}>
 *   <Dropdown
 *     renderTrigger={({ open, onClick }) => (
 *       <Button
 *         onClick={onClick}
 *         rightIcon={open ? <CaretUpIcon /> : <CaretDownIcon />}
 *       >
 *         Fields
 *       </Button>
 *     )}
 *   >
 *     <DropdownMenu>
 *       <DropdownGroup name="Group 1">
 *         <DropdownOption>Foo</DropdownOption>
 *         <DropdownOption>Bar</DropdownOption>
 *         <DropdownOption>Qux</DropdownOption>
 *       </DropdownGroup>
 *       <DropdownGroup name="Group 2">
 *         <DropdownOption>Foo</DropdownOption>
 *         <DropdownOption>Bar</DropdownOption>
 *         <DropdownOption>Qux</DropdownOption>
 *       </DropdownGroup>
 *       <DropdownGroup name="Group 3">
 *         <DropdownOption>Foo</DropdownOption>
 *         <DropdownOption>Bar</DropdownOption>
 *         <DropdownOption>Qux</DropdownOption>
 *       </DropdownGroup>
 *     </DropdownMenu>
 *   </Dropdown>
 * </Canvas>;
 * ```
 */
export function Dropdown({
  renderTrigger,
  children,
}: DropdownProps): JSX.Element {
  const isClickOutsideEnabled = useRef<boolean>();
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    isClickOutsideEnabled.current = false;
  }, []);

  const handleClickOutside = useCallback(
    (event) => {
      if (
        isClickOutsideEnabled.current &&
        !event.target.closest('.' + s['Dropdown__menu']) &&
        isOpen
      ) {
        setOpen(false);
      }
    },
    [setOpen, isOpen, isClickOutsideEnabled],
  );

  const outsideRef = useClickOutside<HTMLDivElement>(handleClickOutside);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const handleToggle = useCallback(() => {
    setOpen((open) => !open);
  }, [setOpen]);

  return (
    <MediaQuery media="(max-width: 1024px)">
      {({ matches }) => {
        // In small devices click outside is disabled because
        // the menu goes full screen and has a close button.
        isClickOutsideEnabled.current = !matches;

        return (
          <DropdownContext.Provider value={{ closeMenu: handleClose }}>
            <div className={s['Dropdown']} ref={outsideRef}>
              {renderTrigger({ open: isOpen, onClick: handleToggle })}
              {isOpen && children}
            </div>
          </DropdownContext.Provider>
        );
      }}
    </MediaQuery>
  );
}
