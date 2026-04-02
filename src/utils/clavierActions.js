export const SHORTCUTS = {
  delete: ["Delete", "Backspace"],

  copy: { key: "c", ctrl: true },
  paste: { key: "v", ctrl: true },

  onMove: {
    up: "ArrowUp",
    down: "ArrowDown",
    left: "ArrowLeft",
    right: "ArrowRight",
  },

  undo: { key: "z", ctrl: true },

  group: { key: "g", ctrl: true },
  ungroup: { key: "G", ctrl: true, shift: true },

  multiSelect: { key: "Shift", mouse: "click" },
};



// utils/clavierActions.js
export function createKeyboardHandler({ getSelectedIds, actions, data }) {
  return function handler(e) {
    const selectedIds = getSelectedIds?.() || [];
    const isCtrl = e.ctrlKey || e.metaKey; // support Cmd sur Mac

    // ------------------ DELETE ------------------
    if (e.key === "Delete" && selectedIds.length) {
      e.preventDefault();
      actions.onDelete?.(selectedIds);
      return;
    }

    // ------------------ CTRL+G → grouper / dégrouper ------------------
    if (isCtrl && e.key.toLowerCase() === "g") {
      e.preventDefault();
      if (!selectedIds.length) return;

      const currentSelection = selectedIds.map(id =>
        data.accessoires.find(acc => acc.id === id)
      );

      // Cas 1 : un seul groupe sélectionné → dégroup
      if (currentSelection.length === 1 && currentSelection[0]?.type === "group") {
        actions.onUngroup?.(selectedIds);
        return;
      }

      // Cas 2 : plusieurs accessoires → grouper
      if (selectedIds.length >= 2) {
        actions.onGroup?.(selectedIds);
      }
      return;
    }

    // ------------------ CTRL+C / CTRL+V ------------------
    if (isCtrl && e.key.toLowerCase() === "c" && selectedIds.length) {
      e.preventDefault();
      actions.onCopy?.(selectedIds);
      return;
    }

    if (isCtrl && e.key.toLowerCase() === "v") {
      e.preventDefault();
      actions.onPaste?.();
      return;
    }

    // ------------------ UNDO / REDO ------------------
    if (isCtrl && e.key.toLowerCase() === "z") {
      e.preventDefault();
      if (e.shiftKey) {
        actions.onRedo?.();
      } else {
        actions.onUndo?.();
      }
      return;
    }
  };
}
