export const SHORTCUTS = {
  delete: ["Delete", "Backspace"],

  copy: { key: "c", ctrl: true },
  paste: { key: "v", ctrl: true },

  move: {
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



// clavierActions.js
export function createKeyboardHandler({ getSelectedIds, actions }) {
  return (e) => {
    const selectedIds = getSelectedIds();

    //console.log("KEYBOARD selectedIds:", selectedIds);

    if (!selectedIds || selectedIds.length === 0) return;

    const isCtrl = e.ctrlKey || e.metaKey; // support Mac Command

    // Ignore input fields
    const tag = e.target.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA") return;

    // DELETE / BACKSPACE
    if (e.key === "Delete" || e.key === "Backspace") {
      e.preventDefault();
      actions.onDelete(selectedIds);
      setSelectedIds([]);
      return;
    }

    // COPY / PASTE
    if (isCtrl && e.key.toLowerCase() === "c") {
      e.preventDefault();
      actions.onCopy(selectedIds);
      return;
    }

    if (isCtrl && e.key.toLowerCase() === "v") {
      e.preventDefault();
      actions.onPaste();
      return;
    }

    // UNDO
    if (isCtrl && e.key.toLowerCase() === "z") {
      e.preventDefault();
      actions.onUndo();
      return;
    }

    // GROUP / UNGROUP
    if (isCtrl && e.key.toLowerCase() === "g") {
      e.preventDefault();
      actions.onGroup(selectedIds);
      return;
    }

    if (isCtrl && e.key.toLowerCase() === "u") {
      e.preventDefault();
      actions.onUngroup(selectedIds);
      return;
    }

    // Déplacement avec flèches
    const moveStep = 1; // pixels ou unité SVG
    let moved = false;
    let dx = 0, dy = 0;
    switch (e.key) {
      case "ArrowUp": dy = -moveStep; moved = true; break;
      case "ArrowDown": dy = moveStep; moved = true; break;
      case "ArrowLeft": dx = -moveStep; moved = true; break;
      case "ArrowRight": dx = moveStep; moved = true; break;
    }
    if (moved) {
      e.preventDefault();
      actions.onMove({ ids: selectedIds, dx, dy });
    }
  };
}