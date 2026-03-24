import React, { useState, useEffect, useRef } from "react";
import { ACCESSOIRES_COMPONENTS } from "./data/componentsRegistry";
import PictoColor from "../images/picto-color.svg";
import PictoTrash from "../images/picto-trash.svg";
import PictoClone from "../images/picto-clone.svg";
import useSVGDrag from "../../hooks/useSVGdrag";
import useSVGScale from "../../hooks/useSVGscale";
import useSVGRotate from "../../hooks/useSVGrotate";
import useSVGBBox from "../../hooks/useSVGBox";
import { createKeyboardHandler } from "../../utils/clavierActions"

export default function Accessoire({
  acc,
  viewportRef,

  //selectedAccessoireId,
  //setSelectedAccessoireId,

  selectedIds,
  setSelectedIds,

  accessoireActions,
  openPicker,
  onClosePicker,
  globalScale
}) {
  const { onUpdate, onDelete, onClone, handleChangeAccessoireTissu, onMove } = accessoireActions ?? {};
  const Component = ACCESSOIRES_COMPONENTS[acc.type];

  const isSelected =
    Array.isArray(selectedIds) && selectedIds.includes(acc.id);

  //============ HELPER POUR TOUCHES CLAVIER ========
  useEffect(() => {
    const handler = createKeyboardHandler({
      getSelectedIds: () => selectedIds,
      actions: accessoireActions
    });

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [selectedIds, accessoireActions]); 
 

  // sélection de plusieurs accessoires SHIFT+click
  const handleSelect = (e, id) => {
    if (e.shiftKey) {
      setSelectedIds(prev =>
        prev.includes(id) ? prev : [...prev, id]
      );
    } else {
      setSelectedIds([id]);
    }
  };

  
   // ================= SIZE =================
  const contentRef = useRef(null);
  const baseWidth = 65;
  

  // ================= DRAG =================
  const accessoireHook = useSVGDrag({
    viewportRef,
    initialPos: { x: acc.x, y: acc.y },
    onDragEnd: ({ x, y }) => onUpdate(acc.id, { x, y }) // commit seulement après drag
  });
  const { pos, startDrag } = useSVGDrag({
    viewportRef,
    initialPos: { x: acc.x, y: acc.y },
    onDragEnd: (p) => onUpdate(acc.id, p)
  });

   // ================= SCALE =================
  const { tempScale, startScale } = useSVGScale({
    initialScale: acc.scale,
    onScaleEnd: (finalScale) => {
      accessoireActions.onUpdate(acc.id, { scale: finalScale });
    }
  });

  // ================= ROTATION =================
  const { tempRotation, startRotate } = useSVGRotate({
    initialRotation: acc.rotation || 0,
    pos,
    tempScale,
    contentRef,
    onRotateEnd: (r) => {
      accessoireActions.onUpdate(acc.id, { rotation: r });
    }
  });

 
  // ================= TISSU =================
  const [localTissu, setLocalTissu] = useState(acc.tissu);
  useEffect(() => setLocalTissu(acc.tissu), [acc.tissu]);

  const bbox = useSVGBBox(contentRef, [tempScale, tempRotation, localTissu]);

  
  const handleDuplicate = (e) => {
    e.stopPropagation();
    onClone(acc);
  };
 
  //console.log("accessoireActions:", accessoireActions);
  //console.log("selectedIds in Accessoire:", selectedIds);

  // ================= RENDER =================
  const cx = bbox ? bbox.width / 2 : baseWidth / 2;
  const cy = bbox ? bbox.height / 2 : baseWidth / 2;

  return (
    <g
      className={`svg accessoires-wrapper ${isSelected ? "selected" : ""}`}
      transform={`translate(${pos.x}, ${pos.y})`}
      //transform={`translate(${accessoireHook.pos.x}, ${accessoireHook.pos.y})`}
      onMouseDown={(e) => { 
        e.stopPropagation(); 
        startDrag(e); 
        handleSelect(e, acc.id) }}
    >
      <g ref={contentRef} transform={`scale(${tempScale}) rotate(${Number.isFinite(tempRotation) ? tempRotation : 0}, ${cx}, ${cy})`}>
        {Component ? (
          <Component accId={acc.id} tissuAccessoire={localTissu} />
        ) : (
          <rect width={baseWidth} height={baseWidth} fill="none" stroke="red" />
        )}
      </g>

      {isSelected && (
        <g> 
          <rect
            className="rotate-handle"
            y={-20  / globalScale }
            x={-20  / globalScale}
            width={(baseWidth * tempScale) + (30 / globalScale)}
            height={(baseWidth * tempScale) + (30 / globalScale)}
            onMouseDown={startRotate}
            style={{ strokeWidth: 20 / globalScale, stroke: "transparent" }}
          />


          {/* Scale handles */}
          {["top-left","top-right","bottom-left","bottom-right"].map((corner, i) => {
            const handleSize = 10 / globalScale;
            const offset = (baseWidth * tempScale) ;
            return (
              <rect
                key={i}
                className={`scale-handle ${corner}`}
                x={corner.includes("right") ? offset - handleSize : -handleSize}
                y={corner.includes("bottom") ? offset - handleSize : -handleSize}
                width={handleSize}
                height={handleSize}
                onMouseDown={(e) => startScale(e, corner)}
                strokeWidth={1 / globalScale}
              />
            );
          })}

          {/* encart pictos */}
          <g>
            <rect x={-15 / globalScale} y={-37 / globalScale} width={75 / globalScale} height={25 / globalScale} fill="white" style={{stroke: '#fff'}} rx="3" ry="3" />

            {/* Trash button */}
            <image
              alt="Supprimer l'objet"
              href={PictoTrash}
              x={-15 / globalScale} width={20 / globalScale} height={20 / globalScale}
              y={-35 / globalScale}
              onClick={(e) => { e.stopPropagation(); onDelete(acc.id); }}
            />

            {/* Local tissu */}
            {/* Color button */}
            {acc.tissu.isUni && !acc.tissu.color === "#fff" ? (
              <image
                alt="Colorier"
                href={PictoColor}
                x={10 / globalScale} width={20 / globalScale} height={20 / globalScale}
                y={-35 / globalScale}
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  openPicker(e, { type: "tissu", target: "accessoire", id: acc.id, value: acc.tissu });
                }}
              />
            ) : (
              <circle
                cx={20 / globalScale} cy={-25 / globalScale} r={10 / globalScale}
                fill={
                  localTissu?.isUni
                    ? localTissu.color
                    : `url(#tissu-${localTissu.instanceId})`
                }
                strokeWidth={1 / globalScale}
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  openPicker(e, { type: "tissu", target: "accessoire", id: acc.id, value: localTissu});
                }}
              />
            )}

              <image
                alt="Cloner"
                href={PictoClone}
                x={35 / globalScale} width={20 / globalScale} height={20 / globalScale}
                y={-35 / globalScale}
                onClick={handleDuplicate}
              />
            </g>
        </g>
      )}
    </g>
  );
}