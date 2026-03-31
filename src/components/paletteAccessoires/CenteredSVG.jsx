import { useRef, useState, useEffect } from "react";

export default function CenteredSVG({ Component, size = 60 }) {
  const innerRef = useRef(null);
  const [bbox, setBBox] = useState(null);

  useEffect(() => {
    if (innerRef.current) {
      try {
        const box = innerRef.current.getBBox();
        setBBox(box);
      } catch (e) {
        console.warn("BBox error", e);
      }
    }
  }, [Component]);

  const center = size / 2;

  const transform = bbox
    ? `translate(${center - (bbox.x + bbox.width / 2)}, ${center - (bbox.y + bbox.height / 2)})`
    : "";

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} className="svg">
      <g transform={transform}>
        {/* IMPORTANT : wrapper réel pour que getBBox fonctionne */}
        <g ref={innerRef}>
          <Component />
        </g>
      </g>
    </svg>
  );
}