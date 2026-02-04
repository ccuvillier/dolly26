import { useState, useEffect, useCallback } from "react";

export function useDraggable(initialPosition = { x: 0, y: 0 }) {
  const [position, setPosition] = useState(initialPosition);
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // ----- START DRAG -----
  const startDrag = useCallback((clientX, clientY) => {
    setDragging(true);
    setOffset({
      x: clientX - position.x,
      y: clientY - position.y,
    });
  }, [position]);

  const onMouseDown = (e) => {
    e.preventDefault();
    startDrag(e.clientX, e.clientY);
  };

  const onTouchStart = (e) => {
    const touch = e.touches[0];
    startDrag(touch.clientX, touch.clientY);
  };

  // ----- MOVE -----
  const onMove = useCallback((clientX, clientY) => {
    if (!dragging) return;
    setPosition({
      x: clientX - offset.x,
      y: clientY - offset.y,
    });
  }, [dragging, offset]);

  const onMouseMove = (e) => onMove(e.clientX, e.clientY);
  const onTouchMove = (e) => onMove(e.touches[0].clientX, e.touches[0].clientY);

  // ----- END -----
  const endDrag = () => setDragging(false);

  // ----- LISTENERS -----
  useEffect(() => {
    if (!dragging) return;

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", endDrag);
    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("touchend", endDrag);
    window.addEventListener("touchcancel", endDrag);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", endDrag);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", endDrag);
      window.removeEventListener("touchcancel", endDrag);
    };
  }, [dragging, onMove]);

  return {
    position,
    dragging,
    bindHeader: {
      onMouseDown,
      onTouchStart,
    },
  };
}
