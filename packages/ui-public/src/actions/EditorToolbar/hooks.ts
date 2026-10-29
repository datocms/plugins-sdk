import { isEqual } from 'lodash-es';
import { useCallback, useEffect, useState } from 'react';
import { useDebounceOnBoolean } from '../../hooks/useDebounceOnBoolean';

export function useEditorToolbarVisible(
  editorFocused: boolean,
  someModalOpen: boolean,
) {
  // We have implemented a debounced version of focus to address a peculiar
  // issue with the links within the structured text. When the upper toolbar
  // appears, it occasionally causes the remainder of the page to shift down,
  // resulting in the link that was originally under the cursor to move out of
  // reach.
  //
  // By introducing a slight delay, we have effectively mitigated this issue,
  // ensuring that the toolbar displays after the link has been clicked.
  const debouncedEditorFocused = useDebounceOnBoolean(editorFocused, 250, 250);
  const debouncedSomeModalOpen = useDebounceOnBoolean(someModalOpen, 0, 250);

  return debouncedEditorFocused || debouncedSomeModalOpen;
}

// The formats at the cursor of an editor. The state changes only when a
// format changes, thus the toolbar does not render again on each key. Give
// module functions for readState and subscribe: they must not change.
export function useEditorToolbarState<Editor, State>(
  editor: Editor | null | undefined,
  emptyState: State,
  readState: (editor: Editor) => State,
  // Calls update after each event that can change the state, and gives the
  // function that stops it
  subscribe: (editor: Editor, update: () => void) => () => void,
) {
  const [state, setState] = useState(emptyState);

  useEffect(() => {
    if (!editor) {
      setState(emptyState);
      return undefined;
    }

    const update = () => {
      const newState = readState(editor);
      setState((oldState) =>
        isEqual(oldState, newState) ? oldState : newState,
      );
    };

    update();

    return subscribe(editor, update);
  }, [editor, emptyState, readState, subscribe]);

  return state;
}

type WiringOptions = {
  // A modal or a dialog of the editor is open: the toolbar stays
  busy: boolean;
  // Puts the focus back in the editor after a change of the fullscreen mode
  focusEditor: () => void;
};

// The state of the toolbar of an editor that is not structured text: the
// focus, the open menus and the fullscreen mode.
export function useEditorToolbarWiring({ busy, focusEditor }: WiringOptions) {
  const [isFocused, setFocused] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isFullscreen, setFullscreen] = useState(false);

  const toggleFullscreen = useCallback(() => {
    setFullscreen((fullscreen) => !fullscreen);
    focusEditor();
  }, [focusEditor]);

  const visible =
    useEditorToolbarVisible(isFocused, isMenuOpen || busy) || isFullscreen;

  return {
    setFocused,
    onMenuToggle: setMenuOpen,
    isFullscreen,
    setFullscreen,
    toggleFullscreen,
    visible,
  };
}
