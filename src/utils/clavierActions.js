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
  ungroup: { key: "u", ctrl: true },

  multiSelect: { key: "Shift", mouse: "click" },
};



export function createKeyboardHandler({ getSelectedIds, actions }) {
  return (e) => {
    const selectedIds = getSelectedIds(); // ids sélectionnés

    const isCtrl = e.ctrlKey || e.metaKey; // support Mac Command

    // Ignore input fields
    const tag = e.target.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA") return;

    // ------------------ UNDO / REDO ------------------
    if (isCtrl && e.key.toLowerCase() === "z") {
      e.preventDefault();
      actions.onUndo?.();
      return;
    }

    if (isCtrl && e.key.toLowerCase() === "y") {
      e.preventDefault();
      actions.onRedo?.();
      return;
    }

    // ------------------ COPY / PASTE ------------------
    if (isCtrl && e.key.toLowerCase() === "c") {
      e.preventDefault();
      if (!actions?.onCopy) return;
      if (selectedIds?.length) actions.onCopy?.(selectedIds);
      return;
    }

    if (isCtrl && e.key.toLowerCase() === "v") {
      e.preventDefault();
      if (!actions?.onPaste) return;
      actions.onPaste?.();
      return;
    }

    // ------------------ DELETE ------------------
    if (e.key === "Delete" || e.key === "Backspace") {
      e.preventDefault();
      if (selectedIds?.length) actions.onDelete?.(selectedIds);
      return;
    }

    // ------------------ GROUP / UNGROUP ------------------
    if (isCtrl && e.key.toLowerCase() === "g") {
      e.preventDefault();
      if (selectedIds.length < 2) return;
      if (selectedIds?.length) actions.onGroup?.(selectedIds);
      return;
    }

    if (isCtrl && e.key.toLowerCase() === "u") {
      e.preventDefault();
      if (selectedIds.length < 2) return;
      if (selectedIds?.length) actions.onUngroup?.(selectedIds);
      return;
    }

    // ------------------ DEPLACEMENT AVEC FLÈCHES ------------------
    if (!selectedIds?.length) return; // pas d'ids → pas de déplacement

    const moveStep = 1; // pixels ou unité SVG
    let dx = 0, dy = 0;
    switch (e.key) {
      case "ArrowUp": dy = -moveStep; break;
      case "ArrowDown": dy = moveStep; break;
      case "ArrowLeft": dx = -moveStep; break;
      case "ArrowRight": dx = moveStep; break;
    }

    if (dx !== 0 || dy !== 0) {
      e.preventDefault();
      actions.onMove?.({ ids: selectedIds, dx, dy });
    }
  };
}