import { useState, useEffect } from "react";

export default function useSVGScale({
  initialScale = 1,
  onScaleEnd
}) {

  const [scale, setScale] = useState(initialScale);

  useEffect(() => {
    setScale(initialScale);
  }, [initialScale]);

  const startScale = (event, corner) => {
    event.stopPropagation();

    const startX = event.clientX;
    const startY = event.clientY;
    const startScale = scale;

    let delta = 0;

    const move = (e) => {
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      // logique selon coin
      if (corner === "bottom-right") {
        delta = dx + dy;
      }

      if (corner === "top-left") {
        delta = -(dx + dy); // inversion
      }

      if (corner === "top-right") {
        delta = dx - dy;
      }

      if (corner === "bottom-left") {
        delta = -dx + dy;
      }

      const factor = 1 + delta / 200;

      setScale(Math.max(0.05, startScale * factor));
    };

    const up = () => {

      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);

      const finalScale = Math.max(0.05, startScale * (1 + delta / 200));

      onScaleEnd?.(finalScale);
    };

    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
  };

  return {
    scale,
    setScale,
    startScale
  };
}