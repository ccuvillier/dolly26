import { useState, useEffect } from "react";

export default function useSVGRotate({
  initialRotation = 0,
  pos,
  scale,
  contentRef,
  onRotateEnd,
  sensitivityFactor = 1 // nouveau paramètre
}) {

  const [rotation, setRotation] = useState(initialRotation);

  useEffect(() => {
    setRotation(initialRotation);
  }, [initialRotation]);

  const startRotate = (event) => {
    event.stopPropagation();
    if (!contentRef.current) return;

    const box = contentRef.current.getBBox();

    // centre réel de rotation
    const cx = pos.x + (box.x + box.width / 2) * scale;
    const cy = pos.y + (box.y + box.height / 2) * scale;

    // angle initial entre curseur et centre
    const startAngle = Math.atan2(event.clientY - cy, event.clientX - cx);
    const initialRotationValue = rotation;

    // calcul distance curseur → centre pour sensibilité
    const distance = Math.sqrt(
      (event.clientX - cx) ** 2 + (event.clientY - cy) ** 2
    );
    const sensitivity = Math.max(sensitivityFactor, distance / 50); // ajustable

    let diff = 0;

    const move = (e) => {
      const currentAngle = Math.atan2(e.clientY - cy, e.clientX - cx);
      diff = ((currentAngle - startAngle) * (180 / Math.PI)) * sensitivity;
      setRotation(initialRotationValue + diff);
    };

    const up = () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);
      onRotateEnd?.(initialRotationValue + diff);
    };

    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
  };

  return {
    rotation,
    startRotate
  };
}