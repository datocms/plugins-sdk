import React, { ReactNode } from 'react';
import Toolbar from '../Toolbar';

export type FormHeaderTitleProps = {
  /** The name of the thing that the form edits */
  children: ReactNode;
  /** The help of the page (a Toolbar.Help element) */
  help?: ReactNode;
};

export type FormHeaderDetailsProps = {
  /**
   * The state of the thing, immediately after the title: a Pill, or a
   * Toolbar.TextualDropdown ("Used by 3 models")
   */
  children: ReactNode;
};

export type FormHeaderMenuProps = {
  /**
   * The actions on the thing (Dropdown.Option elements): duplicate, then
   * delete as the last option, after a separator
   */
  children: ReactNode;
  /** The menu does not show, for example on the form of a new thing */
  hidden?: boolean;
};

export type FormHeaderSubmitProps = {
  /**
   * The submit button of the form: a Toolbar.Button with `tone="primary"`
   * and `submit`
   */
  children: ReactNode;
};

// The parts only carry their props. Pane.FormHeader renders them.
function Title(_props: FormHeaderTitleProps) {
  return null;
}

function Details(_props: FormHeaderDetailsProps) {
  return null;
}

function Menu(_props: FormHeaderMenuProps) {
  return null;
}

function Submit(_props: FormHeaderSubmitProps) {
  return null;
}

function findPart<P>(
  children: ReactNode,
  type: React.ComponentType<P>,
): React.ReactElement<P> | undefined {
  return React.Children.toArray(children).find(
    (child): child is React.ReactElement<P> =>
      React.isValidElement(child) && child.type === type,
  );
}

/**
 * The title bar of an edit pane: a pane that is the form of one thing (a
 * settings form, the form of a role or of a webhook). A view pane (a list, a
 * sidebar, a page to read) uses Pane.Header. The rules of this bar are here,
 * thus all the forms have the same bar. The record editor has its own bar.
 *
 * Rules:
 * - Pane.FormHeader renders the parts in a fixed order: title, details,
 *   menu, space, submit button. The order of the parts in the JSX does not
 *   matter. The DOM order and the tab order are the same as the visual
 *   order.
 * - A dev warning shows when the bar has no Title.
 * - The Title is the heading of level 1 of the page. Use Pane.FormHeader
 *   only for a form page inside <main>.
 * - The Submit button is always the last control, at the right end. The menu
 *   comes right after the title and never at the right end.
 * - A part with no children does not show, and a Menu with `hidden` does not
 *   show.
 * - The parts must be direct children of Pane.FormHeader. A fragment hides
 *   them.
 *
 * Put Pane.FormHeader in the `header` slot of Pane, inside the form: the
 * submit button must be in the form element.
 */
function FormHeader({ children }: { children: ReactNode }) {
  const title = findPart(children, Title);
  const details = findPart(children, Details);
  const menu = findPart(children, Menu);
  const submit = findPart(children, Submit);

  if (import.meta.env.DEV && !title) {
    console.warn('Pane.FormHeader needs a Title');
  }

  return (
    <Toolbar>
      {title && (
        <Toolbar.Title level={1} help={title.props.help}>
          {title.props.children}
        </Toolbar.Title>
      )}
      {details?.props.children}
      {menu && !menu.props.hidden && menu.props.children && (
        <Toolbar.DotsDropdown>{menu.props.children}</Toolbar.DotsDropdown>
      )}
      <Toolbar.Space />
      {submit?.props.children}
    </Toolbar>
  );
}

export default Object.assign(React.memo(FormHeader), {
  Title,
  Details,
  Menu,
  Submit,
});
