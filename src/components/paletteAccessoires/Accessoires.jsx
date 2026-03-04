import React, { useState, useEffect, useRef } from "react";
import { ACCESSOIRES_COMPONENTS } from "./data/componentsRegistry";
import PictoColor from "../images/picto-color.svg";
import PictoClose from "../images/picto-close.svg";

export default function Accessoire({
  acc,
  viewportRef,
  onUpdate,
  selectedAccessoireId,
  onDelete,
  setSelected,
  openPicker,
  onClosePicker
}) {
  const Component = ACCESSOIRES_COMPONENTS[acc.type];

  // ================= POSITION =================
  const [pos, setPos] = useState({ x: acc.x, y: acc.y });
  useEffect(() => setPos({ x: acc.x, y: acc.y }), [acc.x, acc.y]);

  // ================= SIZE =================
  const [scale, setScale] = useState(acc.scale || 1);
  const contentRef = useRef(null);
  const [bbox, setBbox] = useState(null);
  const baseWidth = 65;

  // ================= ROTATION =================
  const [rotation, setRotation] = useState(acc.rotation || 0);
  useEffect(() => {
    setRotation(acc.rotation || 0);
  }, []);

  // ================= DRAG =================
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // ================= TISSU =================
  const [localTissu, setLocalTissu] = useState(acc.tissu);
  useEffect(() => setLocalTissu(acc.tissu), [acc.tissu]);

  // ================= BBOX =================
  useEffect(() => {
    if (contentRef.current) {
      setBbox(contentRef.current.getBBox());
    }
  }, [scale, rotation, localTissu]);

  // ================= DRAG =================
  const getSVGPoint = (event) => {
    const svg = viewportRef.current;
    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    return point.matrixTransform(svg.getScreenCTM().inverse());
  };

  const handleDragStart = (e) => {
    e.stopPropagation();
    setIsDragging(true);
    const svgPoint = getSVGPoint(e);
    setDragOffset({ x: svgPoint.x - pos.x, y: svgPoint.y - pos.y });
    setSelected(acc.id);
  };

  useEffect(() => {
    const handleMove = (e) => {
      if (!isDragging) return;
      const svgPoint = getSVGPoint(e);
      setPos({ x: svgPoint.x - dragOffset.x, y: svgPoint.y - dragOffset.y });
    };
    const handleUp = () => {
      if (!isDragging) return;
      setIsDragging(false);
      onUpdate(acc.id, { x: pos.x, y: pos.y });
    };
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
  }, [isDragging, dragOffset, pos]);

  // ================= SCALE =================
  const handleScale = (corner, e) => {
    e.stopPropagation();
    const startX = e.clientX;
    const startScale = scale;
    let lastDeltaX = 0;

    const onMove = (moveEvent) => {
      lastDeltaX = moveEvent.clientX - startX;
      const factor = 1 + lastDeltaX / 200;
      setScale(Math.max(0.05, startScale * factor));
    };

    const onUp = () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      const finalScale = Math.max(0.05, startScale * (1 + lastDeltaX / 200));
      onUpdate(acc.id, { scale: finalScale });
      console.log(finalScale); // valeur correcte
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  };

  // ================= ROTATE =================
  const handleRotate = (e) => {
    e.stopPropagation();
    if (!contentRef.current) return;

    // bbox de l'élément contenu
    const box = contentRef.current.getBBox();

    // centre réel pour la transformation
    const cx = pos.x + (box.x + box.width / 2) * scale;
    const cy = pos.y + (box.y + box.height / 2) * scale;

    // coordonnées de la poignée de rotation
    const handleX = pos.x + 48;        // même que ton circle
    const handleY = pos.y + 30 * scale;

    // angle initial entre souris et poignée
    const startAngle = Math.atan2(e.clientY - handleY, e.clientX - handleX);
    const initialRotation = rotation;
    let diff = 0;

    // distance curseur-poignée pour amplifier la rotation
    const distance = Math.sqrt((e.clientX - handleX) ** 2 + (e.clientY - handleY) ** 2);
    const sensitivity = Math.max(1, distance / 50);

    const onMove = (moveEvent) => {
      const currentAngle = Math.atan2(moveEvent.clientY - handleY, moveEvent.clientX - handleX);
      diff = ((currentAngle - startAngle) * (180 / Math.PI)) * sensitivity;
      setRotation(initialRotation + diff);
    };

    const onUp = () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      onUpdate(acc.id, { rotation: initialRotation + diff });
      console.log(rotation, initialRotation + diff);
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  };

  // ================= RENDER =================
  const cx = bbox ? bbox.width / 2 : baseWidth / 2;
  const cy = bbox ? bbox.height / 2 : baseWidth / 2;

  return (
    <g
      className={`svg accessoires-wrapper ${selectedAccessoireId === acc.id ? "selected" : ""}`}
      transform={`translate(${pos.x}, ${pos.y})`}
      onMouseDown={(e) => { e.stopPropagation(); handleDragStart(e); setSelected(acc.id); }}
    >
      <g ref={contentRef} transform={`scale(${scale}) rotate(${rotation}, ${cx}, ${cy})`}>
        {Component ? (
          <Component accId={acc.id} tissuAccessoire={localTissu} />
        ) : (
          <rect width={baseWidth} height={baseWidth} fill="none" stroke="red" />
        )}
      </g>

      {selectedAccessoireId === acc.id && (
        <>
          {/* Rotate handle */}
          <circle
            className="rotate-handle"
            cx={30 * scale}
            cy={30 * scale}
            r={baseWidth * scale}
            onMouseDown={handleRotate}
            style={{ strokeWidth: scale * 30 }}
          />


          {/* Scale handles */}
          {["top-left","top-right","bottom-left","bottom-right"].map((corner, i) => {
            const handleSize = 10;
            const offset = baseWidth * scale;
            return (
              <rect
                key={i}
                className={`scale-handle ${corner}`}
                x={corner.includes("right") ? offset - handleSize : -handleSize}
                y={corner.includes("bottom") ? offset - handleSize : -handleSize}
                width={handleSize}
                height={handleSize}
                onMouseDown={(e) => handleScale(corner, e)}
              />
            );
          })}

          {/* Close button */}
          <image
            alt="Supprimer l'objet"
            href={PictoClose}
            x={-15} width={20} height={20}
            y={-35}
            onClick={(e) => { e.stopPropagation(); onDelete(acc.id); }}
          />



          {/* Local tissu pour le cicle */}

          {/* Color button */}
          {localTissu.color === "#ffffff" ? (
            <image
              alt="Colorier"
              href={PictoColor}
              x={15} width={20} height={20}
              y={-35}
              onClick={(e) => {
                e.stopPropagation();
                openPicker(e, { type: "tissu", target: "accessoire", id: acc.id, value: localTissu });
              }}
            />
          ) : (
            <circle
              cx={20} cy={-25} r={10}
              //fill={localTissu.color ?? "#fff"}
              fill={
                localTissu?.isUni
                  ? localTissu.color
                  : `url(#tissu-${localTissu.instanceId})`
              }
              onClick={(e) => {
                e.stopPropagation();
                openPicker(e, { type: "tissu", target: "accessoire", id: acc.id, value: localTissu });
              }}
            />
          )}
        </>
      )}
    </g>
  );
}