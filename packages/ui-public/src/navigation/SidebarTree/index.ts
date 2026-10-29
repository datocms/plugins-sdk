import Node from './SidebarTreeNode';
import NodeActions from './SidebarTreeNodeActions';

export {
  SIDEBAR_TREE_OFFSET_PER_LEVEL,
  type SidebarTreeNodeProps,
  type SidebarTreeNodeTreeProps,
} from './SidebarTreeNode';
export type { SidebarTreeNodeActionsProps } from './SidebarTreeNodeActions';

export const SidebarTree = { Node, NodeActions };
