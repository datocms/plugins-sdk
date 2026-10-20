import mergeRefs from '@react-hook/merged-ref';
import classNames from 'classnames';
import React, {
  CSSProperties,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { Generic } from '../../../icons';
import { useTranslation } from '../../i18n';
import {
  dropTargetClassName,
  TreeDraggableProvided,
  TreeDraggableSnapshot,
  useTreeRow,
} from '../../lists/dnd';
import { type Message } from '../../Message';
import RawButton from '../../semantic/RawButton';
import { DisclosureChevron } from '../Chevron';
import Link from '../Link';
import { isActivePath, useNavigation } from '../NavigationProvider';

// The indent of each level of a sidebar tree, in pixels. Give it to the
// "offsetPerLevel" prop of the tree. It is the width of the toggle column
// (see ".SidebarTree__node__toggle"), thus the toggle of a child is below the
// icon of its parent.
export const SIDEBAR_TREE_OFFSET_PER_LEVEL = 28;

/** The props of a node that is in a tree with drag and drop */
export type SidebarTreeNodeTreeProps = {
  /** True when the user reorders the tree. The node shows a grip. */
  editMode: boolean;
  /**
   * Give it when the node has child nodes: the node shows the toggle that
   * opens and closes them
   */
  expandable?: {
    /** True when the child nodes show */
    open: boolean;
    /** Runs when the user clicks the toggle */
    onToggle: () => void;
  };
  /** True when the user can drop other nodes into this node */
  droppable: boolean;
};

function getEditableTreeNodeProps(
  provided: TreeDraggableProvided,
  snapshot: TreeDraggableSnapshot,
  editMode: boolean,
): { style: CSSProperties; classNames: Record<string, boolean> } {
  // The tree indents each level with a left padding, in edit mode too
  const style: CSSProperties = {
    paddingLeft: provided.draggableProps.style.paddingLeft,
  };

  return {
    style,
    classNames: {
      'SidebarTree__node--editing': editMode,
      'SidebarTree__node--is-dragging': snapshot.isDragging,
    },
  };
}

const SidebarTreeGrip = React.memo(function SidebarTreeGrip() {
  return (
    <span className="SidebarTree__node__grip" aria-hidden="true">
      <Generic.DragGripIcon />
    </span>
  );
});

/** Runs "onClick": the node is a button */
type ClickAction = {
  onClick: () => void;
  to?: never;
  exact?: never;
  href?: never;
  newTab?: never;
};

/** A link to a page of the app */
type LinkAction = {
  /** The page of the node: the path with its query */
  to: string;
  /** The node is active only when the URL is exactly `to` */
  exact?: boolean;
  /** Opens the page in a new tab */
  newTab?: boolean;
  /**
   * Runs on a click, before the page opens. For example, it closes the
   * sidebar on small screens.
   */
  onClick?: () => void;
  href?: never;
};

/** A link to a page out of the app */
type ExternalLinkAction = {
  href: string;
  /** Opens the page in a new tab */
  newTab?: boolean;
  /** Runs on a click, before the page opens */
  onClick?: () => void;
  to?: never;
  exact?: never;
};

/** No action: a plain row */
type NoAction = {
  onClick?: never;
  to?: never;
  exact?: never;
  href?: never;
  newTab?: never;
};

/** What the node does on a click */
export type SidebarTreeNodeAction =
  | ClickAction
  | LinkAction
  | ExternalLinkAction
  | NoAction;

/** A node in a tree with drag and drop */
type InTree = {
  tree: SidebarTreeNodeTreeProps;
  alignWithTree?: never;
};

/** A node out of a tree */
type OutOfTree = {
  /**
   * The node is next to a tree, but not in it. It keeps the space of the
   * toggle, thus its icon aligns with the icons of the tree.
   * @default false
   */
  alignWithTree?: boolean;
  tree?: never;
};

/** Where the node is: in a tree or not */
export type SidebarTreeNodePlacement = InTree | OutOfTree;

export type SidebarTreeNodeProps = SidebarTreeNodeAction &
  SidebarTreeNodePlacement & {
    /** The name of the node, for example "Blog post" */
    label: Message;
    /** Shows after the label, on the same line: an ApiKey, a small icon */
    afterTitle?: ReactNode;
    /**
     * A second line under the label, small and subtle (for example the
     * parents of the node in the results of a search)
     */
    details?: Message;
    /** Shows at the end of the row: a FeedbackDot, a small icon */
    trailing?: ReactNode;
    /** An icon before the label */
    icon?: ReactNode;
    /** Runs when the user double-clicks the node */
    onDoubleClick?: () => void;
    /**
     * Forces the active state, for a node that is also active on other paths.
     * @default true when the URL matches `to`
     */
    active?: boolean;
    /** Edit mode actions. See SidebarTree.NodeActions. */
    actions?: ReactNode;
    /**
     * Shows the highlight of a new node (see _HighlightElement.css) and
     * scrolls the node into view
     */
    highlighted?: boolean;
    /** Only for the place of the node, not for its look */
    className?: string;
  };

// Each row has only one element that the user can focus (a link or a
// button), and a click on any part of the row goes to it
function SidebarTreeNode({
  label,
  afterTitle,
  details,
  trailing,
  icon,
  to,
  exact,
  href,
  newTab,
  onClick,
  onDoubleClick,
  active: isActiveProp,
  actions,
  tree,
  highlighted,
  alignWithTree,
  className,
}: SidebarTreeNodeProps) {
  const { tc } = useTranslation();
  const { location } = useNavigation();
  const ownRef = useRef<HTMLDivElement | null>(null);
  const treeRow = useTreeRow();

  if (import.meta.env.DEV && tree && !treeRow) {
    console.warn(
      'SidebarTree.Node: a node with `tree` must be a row of a SortableTree',
    );
  }

  const isActive =
    isActiveProp ??
    (to && location ? isActivePath(location.pathname, to, exact) : false);

  // When the tree shows for the first time, the active node scrolls into view
  useEffect(() => {
    if (tree && isActive) {
      ownRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  useEffect(() => {
    if (highlighted) {
      ownRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [highlighted]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick?.();
      }
    },
    [onClick],
  );

  const handleToggle = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      tree?.expandable?.onToggle();
      ownRef.current?.querySelector<HTMLElement>('[data-tree-item]')?.focus();
    },
    [tree?.expandable?.onToggle],
  );

  const handleToggleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        tree?.expandable?.onToggle();
      }
    },
    [tree?.expandable?.onToggle],
  );

  const editable =
    tree && treeRow
      ? getEditableTreeNodeProps(
          treeRow.provided,
          treeRow.snapshot,
          tree.editMode,
        )
      : undefined;

  // In edit mode the row is the drag handle. A link is draggable by itself:
  // it must not start its own drag.
  const linkDraggable = tree?.editMode ? false : undefined;

  const treeItem = tree && treeRow?.provided.treeItemProps;

  const content = (
    <>
      {icon && (
        <span aria-hidden="true" className="SidebarTree__node__icon">
          {icon}
        </span>
      )}
      <span className="SidebarTree__node__text">
        <span className="SidebarTree__node__title">
          <span className="SidebarTree__node__name">{tc(label)}</span>
          {/* A space between the name and the content after it, thus a
              screen reader reads two words and not one */}
          {afterTitle && ' '}
          {afterTitle}
        </span>
        {details && (
          <span className="SidebarTree__node__details">{tc(details)}</span>
        )}
      </span>
      {trailing && (
        <span className="SidebarTree__node__trailing">{trailing}</span>
      )}
    </>
  );

  const main = to ? (
    <Link
      className="SidebarTree__node__main"
      to={to}
      exact={exact}
      active={isActiveProp}
      target={newTab ? '_blank' : undefined}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      draggable={linkDraggable}
      {...treeItem}
    >
      {content}
    </Link>
  ) : href ? (
    <a
      className="SidebarTree__node__main"
      href={href}
      target={newTab ? '_blank' : undefined}
      rel="noopener noreferrer"
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      draggable={linkDraggable}
      {...treeItem}
    >
      {content}
    </a>
  ) : onClick ? (
    <div
      className="SidebarTree__node__main"
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      onDoubleClick={onDoubleClick}
      {...treeItem}
    >
      {content}
    </div>
  ) : tree?.expandable ? (
    // A row without an action that opens and closes is a button: only a
    // button can carry the aria-expanded of the tree. Thus Enter, Space and
    // a click toggle it, as the toggle does.
    <div
      className="SidebarTree__node__main SidebarTree__node__main--static"
      role="button"
      tabIndex={0}
      onClick={handleToggle}
      onKeyDown={handleToggleKeyDown}
      {...treeItem}
    >
      {content}
    </div>
  ) : (
    <div
      className="SidebarTree__node__main SidebarTree__node__main--static"
      tabIndex={treeItem ? 0 : undefined}
      {...treeItem}
    >
      {content}
    </div>
  );

  const toggle = tree?.expandable ? (
    <RawButton
      className="SidebarTree__node__icon SidebarTree__node__toggle"
      ariaHidden={true}
      tabIndex={-1}
      onClick={handleToggle}
    >
      <DisclosureChevron open={tree.expandable.open} />
      {tree.editMode && <SidebarTreeGrip />}
    </RawButton>
  ) : tree || alignWithTree ? (
    // A node without children keeps the space of the toggle, thus all the
    // icons align
    <span
      aria-hidden="true"
      className="SidebarTree__node__icon SidebarTree__node__toggle"
    >
      {tree?.editMode && <SidebarTreeGrip />}
    </span>
  ) : null;

  return (
    <div
      className={classNames(
        'SidebarTree__node',
        {
          'SidebarTree__node--active': isActive,
          HighlightElement: highlighted,
        },
        tree?.droppable &&
          dropTargetClassName({
            isOver: Boolean(treeRow?.snapshot.isCombineTarget),
          }),
        editable?.classNames,
        className,
      )}
      ref={mergeRefs(
        ownRef,
        ((tree && treeRow?.provided.innerRef) ??
          null) as React.Ref<HTMLDivElement>,
      )}
      style={editable?.style}
      // Outside of edit mode the row is not a drag handle, thus only its
      // link or button gets the focus
      tabIndex={tree?.editMode ? 0 : undefined}
    >
      {toggle}
      {main}
      {actions}
      {tree && treeRow?.provided.dropIndicator}
    </div>
  );
}

export default React.memo(SidebarTreeNode);
