import { useCallback } from "react";

export function useDragOrClick(onClick, threshold = 5) {
  const handleMouseDown = useCallback(
    (e) => {
      const startX = e.clientX;
      const startY = e.clientY;
      let moved = false;

      const handleMove = (moveEvent) => {
        const dx = moveEvent.clientX - startX;
        const dy = moveEvent.clientY - startY;

        if (Math.abs(dx) > threshold || Math.abs(dy) > threshold) {
          moved = true;
        }
      };

      const handleUp = (upEvent) => {
        document.removeEventListener("mousemove", handleMove);
        document.removeEventListener("mouseup", handleUp);

        if (!moved && typeof onClick === "function") {
          onClick(upEvent);
        }
      };

      document.addEventListener("mousemove", handleMove);
      document.addEventListener("mouseup", handleUp);
    },
    [onClick, threshold]
  );

  return handleMouseDown;
}