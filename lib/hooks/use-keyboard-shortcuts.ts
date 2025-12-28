import { useEffect, useCallback, useMemo } from 'react';

interface ShortcutConfig {
  key: string;
  meta?: boolean; // Cmd on Mac, Ctrl on Windows
  shift?: boolean;
  callback: () => void;
  /** Only trigger when this element or its children are focused */
  scope?: 'global' | 'focused';
}

export function useKeyboardShortcuts(shortcuts: ShortcutConfig[]) {
  // Memoize the shortcuts array to prevent unnecessary effect re-runs
  const memoizedShortcuts = useMemo(() => shortcuts, [shortcuts]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    for (const shortcut of memoizedShortcuts) {
      const metaMatch = shortcut.meta ? (e.metaKey || e.ctrlKey) : true;
      const shiftMatch = shortcut.shift ? e.shiftKey : !e.shiftKey;

      if (e.key.toLowerCase() === shortcut.key.toLowerCase() && metaMatch && shiftMatch) {
        e.preventDefault();
        shortcut.callback();
        return;
      }
    }
  }, [memoizedShortcuts]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
