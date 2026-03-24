import { useState, useEffect, useRef } from "react";

export default function useSVGRotate({
  initialRotation = 0,
  pos,
  tempScale,
  contentRef,
  onRotateEnd,
  sensitivityFactor = 1 // nouveau paramètre
}) {

  const [rotation, setRotation] = useState(initialRotation);
  const [tempRotation, setTempRotation] = useState(initialRotation);

  const startAngleRef = useRef(0);
  const startRotationRef = useRef(initialRotation);
  const hasMovedRef = useRef(false);

  const threshold = 2;


  useEffect(() => { setRotation(initialRotation);}, [initialRotation]);
  useEffect(() => { setTempRotation(initialRotation);}, [initialRotation]);

  const startRotate = (event) => {
    event.stopPropagation();
    if (!contentRef.current || !pos || !Number.isFinite(tempScale)) {
      console.warn("❌ ROTATE ABORT", { hasRef: !!contentRef.current, pos, tempScale });
      return;
    }

    const box = contentRef.current.getBBox();

    // centre réel de rotation
    const cx = pos.x + (box.x + box.width / 2) * tempScale;
    const cy = pos.y + (box.y + box.height / 2) * tempScale;

    // angle initial entre curseur et centre
    const getAngle = (event) => { return Math.atan2(event.clientY - cy, event.clientX - cx)};

    startAngleRef.current = getAngle(event);
    startRotationRef.current = rotation;
    hasMovedRef.current = false;

    // calcul distance curseur → centre pour sensibilité
    const distance = Math.sqrt(
      (event.clientX - cx) ** 2 + (event.clientY - cy) ** 2
    );
    const sensitivity = Math.max(sensitivityFactor, distance / 50); // ajustable

    let diff = 0;

    const move = (e) => {
      const dx = e.clientX - event.clientX;
      const dy = e.clientY - event.clientY;

      if (!hasMovedRef.current && Math.abs(dx) + Math.abs(dy) > threshold) {
        hasMovedRef.current = true;
      }

      if (!hasMovedRef.current) return;

      const currentAngle = getAngle(e);
      diff = ((currentAngle - startAngleRef.current) * (180 / Math.PI)) * sensitivity;
      setTempRotation(startRotationRef.current + diff);
    };



    const up = () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);
      if (!hasMovedRef.current) return;
      onRotateEnd?.(startRotationRef.current + diff);
    };

    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
  };

  return {
    rotation,
    tempRotation,
    startRotate
  };
}