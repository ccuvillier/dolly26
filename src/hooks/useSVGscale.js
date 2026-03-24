import { useState, useEffect, useRef } from "react";

export default function useSVGScale({
  initialScale = 1,
  onScaleEnd
}) {

  const [scale, setScale] = useState(initialScale);
  const [tempScale, setTempScale] = useState(initialScale);

  const startPosRef = useRef({ x: 0, y: 0 });
  const hasMovedRef = useRef(false);

  const threshold = 2;


  useEffect(() => {
    setScale(initialScale);
    setTempScale(initialScale);
  }, [initialScale]);

  const startScale = (event, corner) => {
    event.stopPropagation();

    const startX = event.clientX;
    const startY = event.clientY;
    const initial = scale;

    let delta = 0;

    startPosRef.current = { x: startX, y: startY };
    hasMovedRef.current = false;

    const move = (e) => {
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      if (!hasMovedRef.current && Math.abs(dx) + Math.abs(dy) > threshold) {
        hasMovedRef.current = true;
      }

      if (!hasMovedRef.current) return;

      // logique selon coin
      if (corner === "bottom-right") delta = dx + dy;
      else if (corner === "top-left") delta = -(dx + dy);
      else if (corner === "top-right") delta = dx - dy;
      else if (corner === "bottom-left") delta = -dx + dy;

      const factor = 1 + delta / 200;

      setTempScale(Math.max(0.05, initial * factor));
    };

    const up = () => {

      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);

      if (!hasMovedRef.current) return;

      const finalScale = Math.max(0.05, initial * (1 + delta / 200));

      setScale(finalScale);
      setTempScale(finalScale);
      onScaleEnd?.(finalScale);
    };

    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
  };

  return {
    tempScale,
    startScale
  };
}