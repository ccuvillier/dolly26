import { useState, useEffect } from "react";

export default function useSVGScale({
  initialScale = 1,
  onScaleEnd
}) {

  const [scale, setScale] = useState(initialScale);

  useEffect(() => {
    setScale(initialScale);
  }, [initialScale]);

  const startScale = (event) => {
    event.stopPropagation();

    const startX = event.clientX;
    const startScale = scale;

    let lastDeltaX = 0;

    const move = (e) => {

      lastDeltaX = e.clientX - startX;

      const factor = 1 + lastDeltaX / 200;

      setScale(Math.max(0.05, startScale * factor));
    };

    const up = () => {

      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);

      const finalScale = Math.max(0.05, startScale * (1 + lastDeltaX / 200));

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