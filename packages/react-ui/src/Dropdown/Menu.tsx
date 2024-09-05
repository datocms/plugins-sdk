import React, {
  createRef,
  type SyntheticEvent,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useInView } from 'react-intersection-observer';
import scrollIntoView from 'scroll-into-view-if-needed';
import { mergeRefs } from '../mergeRefs';
import { DropdownContext } from './DropdownContext';
import { Group } from './Group';
import { MenuContext } from './MenuContext';
import { Portal } from './Portal';
import s from './styles.module.css.json';

const MenuDesktopContainer = React.forwardRef<
  HTMLDivElement,
  { children: React.ReactNode }
>(({ children }, ref) => (
  <Portal>
    <div
      className={s['Dropdown__menu-container']}
      style={{ zIndex: 1000 }}
      ref={ref}
    >
      {children}
    </div>
  </Portal>
));

function getAbsoluteHeight(el: HTMLElement) {
  const styles = window.getComputedStyle(el);
  const margin =
    Number.parseFloat(styles.marginTop) +
    Number.parseFloat(styles.marginBottom);
  return Math.ceil(el.offsetHeight + margin);
}

function getAbsoluteWidth(el: HTMLElement) {
  const styles = window.getComputedStyle(el);
  const margin =
    Number.parseFloat(styles.marginLeft) +
    Number.parseFloat(styles.marginRight);
  return Math.ceil(el.offsetWidth + margin);
}

function setPosition(
  panel: HTMLElement,
  parent: HTMLElement,
  alignment: 'left' | 'right',
) {
  const rect = parent.getBoundingClientRect();
  const height = getAbsoluteHeight(panel);
  const parentWidth = getAbsoluteWidth(parent);
  const width = getAbsoluteWidth(panel);

  if (alignment === 'left') {
    // eslint-disable-next-line no-param-reassign
    panel.style.left = `${rect.left + window.pageXOffset}px`;
  } else {
    // eslint-disable-next-line no-param-reassign
    panel.style.left = `${
      rect.left + window.pageXOffset + parentWidth - width
    }px`;
  }

  const windowHeight = Math.max(
    document.documentElement.clientHeight || 0,
    window.innerHeight || 0,
  );

  const menu = panel.querySelector<HTMLElement>(`.${s.Dropdown__menu}`);

  if (!menu) {
    return;
  }

  const styles = window.getComputedStyle(menu);
  const marginTop = Number.parseFloat(styles.marginTop);

  const fitsBelow = rect.bottom + height <= windowHeight;
  const fitsAbove = rect.top - height > 0;

  if (!fitsBelow && fitsAbove) {
    // eslint-disable-next-line no-param-reassign
    panel.style.top = `${rect.bottom - height}px`;
  } else if (fitsBelow) {
    // eslint-disable-next-line no-param-reassign
    panel.style.top = `${rect.bottom}px`;
  } else {
    const spaceAbove = rect.top;
    const spaceBelow = windowHeight - rect.bottom;

    if (spaceBelow > spaceAbove) {
      // eslint-disable-next-line no-param-reassign
      panel.style.top = `${rect.bottom}px`;
    } else {
      // eslint-disable-next-line no-param-reassign
      panel.style.top = '0px';
    }
  }

  // eslint-disable-next-line no-param-reassign
  panel.style.visibility = 'visible';
}

export type MenuProps = {
  children: React.ReactNode;
  alignment?: 'left' | 'right';
};

export const Menu = ({
  children,
  alignment = 'left',
}: MenuProps): JSX.Element => {
  const { closeMenu } = useContext(DropdownContext);

  const childrenArray = React.Children.toArray(children);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [options, setOptions] = useState<
    Array<{
      id: string;
      handler?: (e: SyntheticEvent) => void;
    }>
  >([]);

  const handleChange = useCallback(
    (e) => {
      setSearchTerm(e.target.value);
    },
    [setSearchTerm],
  );

  const anyGroup = childrenArray.some(
    (child) =>
      typeof child === 'object' && 'type' in child && child.type === Group,
  );

  const addOption = useCallback(
    (id: string) => {
      setOptions((old) => [...old, { id }]);

      return () => {
        setOptions((old) => old.filter((x) => x.id !== id));
      };
    },
    [setOptions],
  );

  const setClickHandlerForOption = useCallback(
    (id: string, handler: (e: SyntheticEvent) => void) => {
      setOptions((old) =>
        old.map((x) => (x.id !== id ? x : { ...x, handler })),
      );
    },
    [setOptions],
  );

  const contentRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        closeMenu();
      }

      if (['ArrowDown', 'ArrowUp'].includes(event.key)) {
        event.preventDefault();
        event.stopPropagation();

        if (!contentRef.current) {
          return;
        }

        const delta = event.key === 'ArrowUp' ? -1 : 1;

        const selectedOption = contentRef.current.querySelector(
          `.${s['Dropdown__menu__option--is-selected']}`,
        );

        let nextOption: Element | null;

        if (!selectedOption) {
          nextOption = contentRef.current.querySelector(
            `.${s.Dropdown__menu__option}`,
          );
        } else {
          const elements = Array.from(
            contentRef.current.querySelectorAll(`.${s.Dropdown__menu__option}`),
          );
          const index = elements.findIndex((el) => el === selectedOption);
          const nextIndex =
            index + delta < 0
              ? elements.length - 1
              : (index + delta) % elements.length;
          nextOption = elements[nextIndex];
          selectedOption.classList.remove(
            s['Dropdown__menu__option--is-selected'],
          );
        }

        if (nextOption) {
          nextOption.classList.add(s['Dropdown__menu__option--is-selected']);

          scrollIntoView(nextOption, {
            scrollMode: 'if-needed',
            behavior: 'auto',
          });
        }
      }

      if (event.key === 'Enter') {
        event.preventDefault();
        event.stopPropagation();

        if (!contentRef.current) {
          return;
        }

        const selectedOption = contentRef.current.querySelector(
          `.${s['Dropdown__menu__option--is-selected']}`,
        );

        if (selectedOption) {
          const id = (selectedOption as HTMLButtonElement).dataset.optionId;
          const option = options.find((x) => x.id === id);
          if (option?.handler) {
            option.handler(event);
          }
        }
      }
    },
    [options],
  );

  const [observerRef, inView, entry] = useInView({
    threshold: 0,
    rootMargin: '0px 0px 0px 0px',
    triggerOnce: false,
  });

  const parentRef = createRef<HTMLDivElement>();
  const menuRef = createRef<HTMLDivElement>();

  const reposition = useCallback(() => {
    if (menuRef.current && parentRef.current) {
      setPosition(menuRef.current, parentRef.current, alignment);
    }
  }, [menuRef, parentRef, alignment]);

  useEffect(() => {
    reposition();
  }, [inView, entry?.intersectionRatio]);

  useEffect(() => {
    if (menuRef.current && parentRef.current) {
      const resizeObserver = new ResizeObserver(reposition);
      resizeObserver.observe(menuRef.current);
      resizeObserver.observe(parentRef.current);

      return () => {
        resizeObserver.disconnect();
      };
    }

    return undefined;
  }, [menuRef, reposition]);

  useEffect(() => {
    window.addEventListener('resize', reposition);
    return () => window.removeEventListener('resize', reposition);
  }, [reposition]);

  return (
    <>
      <div
        ref={mergeRefs(observerRef, parentRef)}
        className={s.Dropdown__spacer}
      />
      <MenuDesktopContainer ref={menuRef}>
        <div className={s.Dropdown__menu}>
          {options.length > 5 && (
            <div className={s.Dropdown__menu__search}>
              <input
                type="text"
                value={searchTerm || ''}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="Search..."
                className={s.Dropdown__menu__search__input}
              />
            </div>
          )}
          <MenuContext.Provider
            value={{ searchTerm, addOption, setClickHandlerForOption }}
          >
            <div className={s.Dropdown__menu__inner} ref={contentRef}>
              {anyGroup ? (
                children
              ) : (
                <div className={s.Dropdown__menu__group__content}>
                  {children}
                </div>
              )}
            </div>
          </MenuContext.Provider>
        </div>
      </MenuDesktopContainer>
    </>
  );
};
