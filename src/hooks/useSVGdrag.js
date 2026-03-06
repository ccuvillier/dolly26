import { useState, useEffect } from "react";

export default function useSVGdrag({
  viewportRef,
  initialPos,
  onDragEnd
}) {

  const [pos, setPos] = useState(initialPos);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setPos(initialPos);
  }, [initialPos.x, initialPos.y]);

  const getSVGPoint = (event) => {
    const svg = viewportRef.current;
    const point = svg.createSVGPoint();

    point.x = event.clientX;
    point.y = event.clientY;

    return point.matrixTransform(svg.getScreenCTM().inverse());
  };

  const startDrag = (event) => {
    event.stopPropagation();

    const svgPoint = getSVGPoint(event);

    setIsDragging(true);
    setDragOffset({
      x: svgPoint.x - pos.x,
      y: svgPoint.y - pos.y
    });
  };

  useEffect(() => {

    const handleMove = (event) => {
      if (!isDragging) return;

      const svgPoint = getSVGPoint(event);

      setPos({
        x: svgPoint.x - dragOffset.x,
        y: svgPoint.y - dragOffset.y
      });
    };

    const handleUp = () => {
      if (!isDragging) return;

      setIsDragging(false);

      onDragEnd?.(pos);
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };

  }, [isDragging, dragOffset, pos]);

  return {
    pos,
    setPos,
    startDrag
  };
}