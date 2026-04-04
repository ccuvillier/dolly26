import { useState, useEffect, useRef } from "react";

export default function useSVGdrag({ viewportRef, initialPos, onDrag }) {
  const [pos, setPos] = useState(initialPos); // position actuelle de l'accessoire
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const startPosRef = useRef({ x: 0, y: 0 });
  const hasMovedRef = useRef(false);
  const lastPosRef = useRef(initialPos);
  const threshold = 2; // pixels pour déclencher le drag

  useEffect(() => {
    setPos(initialPos); // synchroniser la position si elle change depuis le parent
  }, [initialPos.x, initialPos.y]);

  const getSVGPoint = (event) => {
    if (!viewportRef.current) return pos;

    const svg = viewportRef?.current;
    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    return point.matrixTransform(svg.getScreenCTM().inverse());
  };

  const startDrag = (event) => {
    event.stopPropagation();
    const svg = viewportRef?.current;
     if (!svg) {
      console.warn("SVG non monté, drag annulé");
      return; 
    }
    const svgPoint = getSVGPoint(event);

    startPosRef.current = { x: event.clientX, y: event.clientY };
    hasMovedRef.current = false;

    setDragOffset({
      x: svgPoint.x - pos.x,
      y: svgPoint.y - pos.y
    });

    setIsDragging(true);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMove = (event) => {
      const svgPoint = getSVGPoint(event);

      const newPos = {
        x: svgPoint.x - dragOffset.x,
        y: svgPoint.y - dragOffset.y
      };

      // calcul du delta
      const dx = newPos.x - lastPosRef.current.x;
      const dy = newPos.y - lastPosRef.current.y;


      // ne déclenche le drag réel qu'après le threshold
      if (!hasMovedRef.current && Math.abs(dx) + Math.abs(dy) > threshold) {
        hasMovedRef.current = true;
      }

      if (!hasMovedRef.current) return;
      
      lastPosRef.current = newPos;

      // on envoie le mouvement global
      onDrag?.({ dx, dy });

      // garder le visuel fluide
      setPos(newPos);

      // mémoriser la position
      lastPosRef.current = newPos;
    };

    const handleUp = () => {
      hasMovedRef.current = false;
      lastPosRef.current = pos;
      setIsDragging(false);
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
  }, [isDragging, dragOffset, pos, onDrag]);

  return { pos, startDrag };
}