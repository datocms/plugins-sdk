import React, { ReactNode } from 'react';
import { TextFormat } from '../../../icons/index';
import { EditorToolbarButton } from './Button';
import { EditorToolbarGroup } from './Group';

// The buttons that the toolbar of an editor can show. The settings of a field
// use the same names.
export type EditorToolbarButtonKey =
  | 'bold'
  | 'italic'
  | 'strikethrough'
  | 'code'
  | 'unordered_list'
  | 'ordered_list'
  | 'quote'
  | 'link'
  | 'image'
  | 'table'
  | 'align_left'
  | 'align_center'
  | 'align_right'
  | 'align_justify'
  | 'outdent'
  | 'indent'
  | 'undo'
  | 'redo'
  | 'show_source'
  | 'fullscreen';

// What a button does in one editor
export type EditorToolbarCommand = {
  /** Runs the command in the editor. */
  run: () => void;
  /** Tells if the format is on at the cursor. */
  active?: boolean;
  /** Fades the button and stops the click. */
  disabled?: boolean;
  /** The shortcut of the editor for the command, for the tooltip. */
  shortcut?: string;
};

export type EditorToolbarCommands = Partial<
  Record<EditorToolbarButtonKey, EditorToolbarCommand>
>;

type ButtonSpec = {
  key: EditorToolbarButtonKey;
  icon: ReactNode;
  title: string;
  // The icon and the title while the command is active
  activeIcon?: ReactNode;
  activeTitle?: string;
};

// The order of the buttons is fixed and is the same in all the editors (also
// in the structured text editor): the settings of the field only tell which
// buttons show.
const buttonGroups: ButtonSpec[][] = [
  [
    {
      key: 'bold',
      icon: <TextFormat.BoldIcon />,
      title: 'slate.toolbarButton.strong',
    },
    {
      key: 'italic',
      icon: <TextFormat.ItalicIcon />,
      title: 'slate.toolbarButton.emphasis',
    },
    {
      key: 'strikethrough',
      icon: <TextFormat.StrikethroughIcon />,
      title: 'slate.toolbarButton.strikethrough',
    },
    {
      key: 'code',
      icon: <TextFormat.CodeIcon />,
      title: 'slate.toolbarButton.code',
    },
  ],
  [
    {
      key: 'unordered_list',
      icon: <TextFormat.BulletedListIcon />,
      title: 'slate.toolbarButton.bulletedList',
    },
    {
      key: 'ordered_list',
      icon: <TextFormat.NumberedListIcon />,
      title: 'slate.toolbarButton.numberedList',
    },
    {
      key: 'quote',
      icon: <TextFormat.BlockquoteIcon />,
      title: 'slate.slash.blockquote.title',
    },
  ],
  [
    {
      key: 'link',
      icon: <TextFormat.LinkIcon />,
      title: 'slate.toolbarButton.link',
    },
    {
      key: 'image',
      icon: <TextFormat.ImageIcon />,
      title: 'editorToolbar.addImage',
    },
    {
      key: 'table',
      icon: <TextFormat.TableIcon />,
      title: 'editorToolbar.addTable',
    },
  ],
  [
    {
      key: 'align_left',
      icon: <TextFormat.AlignLeftIcon />,
      title: 'editorToolbar.alignLeft',
    },
    {
      key: 'align_center',
      icon: <TextFormat.AlignCenterIcon />,
      title: 'editorToolbar.alignCenter',
    },
    {
      key: 'align_right',
      icon: <TextFormat.AlignRightIcon />,
      title: 'editorToolbar.alignRight',
    },
    {
      key: 'align_justify',
      icon: <TextFormat.AlignJustifyIcon />,
      title: 'editorToolbar.alignJustify',
    },
  ],
  [
    {
      key: 'outdent',
      icon: <TextFormat.OutdentIcon />,
      title: 'editorToolbar.outdent',
    },
    {
      key: 'indent',
      icon: <TextFormat.IndentIcon />,
      title: 'editorToolbar.indent',
    },
  ],
  [
    {
      key: 'undo',
      icon: <TextFormat.UndoIcon />,
      title: 'editorToolbar.undo',
    },
    {
      key: 'redo',
      icon: <TextFormat.RedoIcon />,
      title: 'editorToolbar.redo',
    },
  ],
  [
    {
      key: 'show_source',
      icon: <TextFormat.SourceIcon />,
      title: 'editorToolbar.source',
    },
    {
      key: 'fullscreen',
      icon: <TextFormat.OpenFullscreenIcon />,
      title: 'editorToolbar.openFullscreen',
      activeIcon: <TextFormat.CloseFullscreenIcon />,
      activeTitle: 'editorToolbar.closeFullscreen',
    },
  ],
];

export type EditorToolbarButtonsProps = {
  /**
   * The buttons that the settings of the field enable. For example
   * `['bold', 'italic', 'link']`.
   */
  buttons: readonly string[];
  /** The commands of the editor. A button without a command does not show. */
  commands: EditorToolbarCommands;
};

const ToolbarButton = React.memo(function ToolbarButton({
  spec,
  command,
}: {
  spec: ButtonSpec;
  command: EditorToolbarCommand;
}) {
  const active = Boolean(command.active);

  return (
    <EditorToolbarButton
      active={active}
      disabled={command.disabled}
      onClick={() => command.run()}
      label={{ id: (active && spec.activeTitle) || spec.title }}
      shortcut={command.shortcut}
    >
      {(active && spec.activeIcon) || spec.icon}
    </EditorToolbarButton>
  );
});

// The groups of buttons of the toolbar, after the menu of the block format
export const EditorToolbarButtons = React.memo(function EditorToolbarButtons({
  buttons,
  commands,
}: EditorToolbarButtonsProps) {
  return (
    <>
      {buttonGroups.map((group) => {
        const shown = group.filter(
          ({ key }) => buttons.includes(key) && commands[key],
        );

        if (shown.length === 0) {
          return null;
        }

        return (
          <EditorToolbarGroup key={shown[0].key}>
            {shown.map((spec) => (
              <ToolbarButton
                key={spec.key}
                spec={spec}
                command={commands[spec.key] as EditorToolbarCommand}
              />
            ))}
          </EditorToolbarGroup>
        );
      })}
    </>
  );
});
