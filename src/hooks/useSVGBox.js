import { useState, useEffect } from "react";

export default function useSVGBBox(contentRef, deps = [], handleSize = 0, scale = 1) {
  const [bbox, setBBox] = useState(null);

  useEffect(() => {
    if (!contentRef.current) return;

    try {
      const box = contentRef.current.getBBox();
      const scaledBuffer = handleSize / scale;

      const bufferedBBox = {
        x: box.x - scaledBuffer,
        y: box.y - scaledBuffer,
        width: box.width + scaledBuffer,
        height: box.height + scaledBuffer,
      };

      setBBox(bufferedBBox);
    } catch (e) {
      // En cas d'erreur SVG (élément vide ou non rendu)
      setBBox(null);
    }
  }, deps); // recalculer si deps changent

  return bbox;
}