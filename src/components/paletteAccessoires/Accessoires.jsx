import React, { useState, useEffect, useRef } from "react";
import { ACCESSOIRES_COMPONENTS } from "./data/componentsRegistry";
import PictoColor from "../images/picto-color.svg";
import PictoClose from "../images/picto-close.svg";
import PictoClone from "../images/picto-clone.svg";
import useSVGDrag from "../../hooks/useSVGdrag";
import useSVGScale from "../../hooks/useSVGscale";
import useSVGRotate from "../../hooks/useSVGrotate";
import useSVGBBox from "../../hooks/useSVGBox";
import duplicateAccessoireSVG from "../../utils/duplicateAccessoireSVG"

export default function Accessoire({
  acc,
  viewportRef,
  selectedAccessoireId,
  accessoireActions,
  openPicker,
  onClosePicker
}) {
  const { onUpdate, onDelete, setSelected, duplicateAccessoire, handleChangeAccessoireTissu, onMove } = accessoireActions ?? {};
  const Component = ACCESSOIRES_COMPONENTS[acc.type];
  
   // ================= SIZE =================
  const contentRef = useRef(null);
  const baseWidth = 65;
  

  // ================= DRAG =================
  const { pos, startDrag } = useSVGDrag({
    viewportRef,
    initialPos: { x: acc.x, y: acc.y },
    onDragEnd: (p) => onUpdate(acc.id, p)
  });

   // ================= SCALE =================
  const { scale, startScale } = useSVGScale({
    initialScale: acc.scale || 1,
    onScaleEnd: (s) => onUpdate(acc.id, { scale: s })
  });

  // ================= ROTATION =================
  const { rotation, startRotate } = useSVGRotate({
    initialRotation: acc.rotation || 0,
    pos,
    scale,
    contentRef,
    onRotateEnd: (r) => onUpdate(acc.id, { rotation: r })
  });

 
  // ================= TISSU =================
  const [localTissu, setLocalTissu] = useState(acc.tissu);
  useEffect(() => setLocalTissu(acc.tissu), [acc.tissu]);

  const bbox = useSVGBBox(contentRef, [scale, rotation, localTissu]);

  
  const handleDuplicate = (e) => {
    e.stopPropagation();

    const clone = duplicateAccessoireSVG(
      acc,
      scale,
      rotation,
      localTissu,
      duplicateAccessoire, // fonction passée depuis App.jsx
      20 // offset pixels
    );


    // Optionnel : sélectionner automatiquement le clone
    setSelected(clone.id);
  };
 


  // ================= RENDER =================
  const cx = bbox ? bbox.width / 2 : baseWidth / 2;
  const cy = bbox ? bbox.height / 2 : baseWidth / 2;

  return (
    <g
      className={`svg accessoires-wrapper ${selectedAccessoireId === acc.id ? "selected" : ""}`}
      transform={`translate(${pos.x}, ${pos.y})`}
      onMouseDown={(e) => { e.stopPropagation(); startDrag(e); setSelected(acc.id); }}
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
            onMouseDown={startRotate}
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
                onMouseDown={(e) => startScale(e)}
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



          {/* Local tissu */}
          {/* Color button */}
          {acc.tissu.isUni && !acc.tissu.color === "#fff" ? (
            <image
              alt="Colorier"
              href={PictoColor}
              x={10} width={20} height={20}
              y={-35}
              onClick={(e) => {
                e.stopPropagation();
                openPicker(e, { type: "tissu", target: "accessoire", id: acc.id, value: acc.tissu, onChange: (newTissu) => handleChangeAccessoireTissu(acc.id, newTissu) });
              }}
            />
          ) : (
            <circle
              cx={20} cy={-25} r={10}
              fill={
                localTissu?.isUni
                  ? localTissu.color
                  : `url(#tissu-${localTissu.instanceId})`
              }
              onClick={(e) => {
                e.stopPropagation();
                openPicker(e, { type: "tissu", target: "accessoire", id: acc.id, value: localTissu, onChange: (newTissu) => handleChangeAccessoireTissu(acc.id, newTissu) });
              }}
            />
          )}


          <image
              alt="Cloner"
              href={PictoClone}
              x={35} width={20} height={20}
              y={-35}
              onClick={handleDuplicate}
            />
        </>
      )}
    </g>
  );
}