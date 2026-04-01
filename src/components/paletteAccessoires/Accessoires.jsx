import React, { useState, useEffect, useRef, useCallback } from "react";
import { ACCESSOIRES_COMPONENTS } from "./data/componentsRegistry";
import useSVGDrag from "../../hooks/useSVGdrag";
import useSVGScale from "../../hooks/useSVGscale";
import useSVGRotate from "../../hooks/useSVGrotate";
import useSVGBBox from "../../hooks/useSVGBox";
import SelectionAccessoires from "./SelectionAccessoires";
import { createKeyboardHandler } from "../../utils/clavierActions"

export default function Accessoire({
  acc,
  viewportRef,
  selectedIds,
  setSelectedIds,
  accessoireActions,
  onDeleteSingle,
  openPicker,
  onClosePicker,
  globalScale,
  onMeasure,
  dimensions
}) {
  const {
    onUpdate = () => {},
    onDelete = () => {},
    onClone = () => {},
    onCopy = () => {},
    onPaste = () => {},
    onMove = () => {},
    onGroup = () => {},
    onUngroup = () => {},
    handleChangeAccessoireTissu = () => {}
  } = accessoireActions ?? {};

  const Component = ACCESSOIRES_COMPONENTS[acc.type];

  const isSelected =
    Array.isArray(selectedIds) && selectedIds.includes(acc.id);

  //============ HELPER POUR TOUCHES CLAVIER ========
  const keyboardHandler = useCallback(
    (e) => createKeyboardHandler({
      getSelectedIds: () => selectedIds,
      actions: {
        onUpdate,
        onDelete,
        onCopy,
        onPaste,
        onMove,
        onGroup,
        onUngroup
      }
    })(e),
    [selectedIds, onUpdate, onDelete, onCopy, onPaste, onMove, onGroup, onUngroup]
  );

  useEffect(() => {
    document.addEventListener("keydown", keyboardHandler);
    return () => document.removeEventListener("keydown", keyboardHandler);
  }, [keyboardHandler]);
 

  // sélection de plusieurs accessoires SHIFT+click
  const handleSelect = (e, id) => {
    const selectedId = acc.parentGroupId ? acc.parentGroupId : id;

    if (e.shiftKey) {
      setSelectedIds(prev =>
        prev.includes(selectedId) ? prev : [...prev, selectedId]
      );
    } else {
      setSelectedIds([selectedId]);
    }
  };

  
   // ================= SIZE =================
  const contentRef = useRef(null);
  const baseWidth = 65;
  

  // ================= DRAG =================
  /*const accessoireHook = useSVGDrag({
    viewportRef,
    initialPos: { x: acc.x, y: acc.y },
    onDragEnd: ({ x, y }) => onUpdate(acc.id, { x, y }) // commit seulement après drag
  });*/
  const { pos, startDrag } = useSVGDrag({
    viewportRef,
    initialPos: { x: acc.x, y: acc.y },
    onDragEnd: (p) => {
      onUpdate(acc.id, p);
    }
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


  // ================= BBOX SINGLE ACCESSOIRE =================
  const handleSize = 10 / globalScale;
  const bbox = useSVGBBox(contentRef, [tempScale, tempRotation, localTissu], handleSize);
  useEffect(() => {
    if (!bbox || !onMeasure) return;

    const prev = dimensions[acc.id];
    if (!prev || prev.width !== bbox.width || prev.height !== bbox.height) {
      onMeasure?.(acc.id, {
        width: bbox.width,
        height: bbox.height
      });
    }
  }, [bbox, acc.id, onMeasure, dimensions]);
  

  const safeWidth = Number.isFinite(bbox?.width) ? bbox.width : baseWidth || 0;
  const safeHeight = Number.isFinite(bbox?.height) ? bbox.height : baseWidth || 0;

  // centre de rotation / scale
  const cx = safeWidth / 2;
  const cy = safeHeight / 2;

  
  // ================= RENDER =================
  return (
    <g
      className={`svg accessoires-wrapper ${isSelected ? "selected" : ""}`}
      transform={`translate(${pos?.x}, ${pos?.y})`}
      onMouseDown={(e) => { 
        e.stopPropagation(); 
        if (e.target.closest(".pictos")) return;
        startDrag(e); 
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (e.defaultPrevented) return;
        handleSelect(e, acc.id);
      }}
    >
      

      {isSelected && (
        <SelectionAccessoires
          acc={acc}
          safeWidth={safeWidth || baseWidth}
          safeHeight={safeHeight}
          scale={tempScale}
          rotation={tempRotation}
          cx={cx}
          cy={cy}
          globalScale={globalScale}

          onRotate={startRotate}
          onScale={startScale}

          onDelete={() => onDeleteSingle()}
          onClone={() => {cloneAction(acc) }}

          tissu={acc.tissu}
          localTissu={localTissu}
          openPicker={openPicker}
        />
      )}

      <g ref={contentRef} transform={`scale(${tempScale}) rotate(${Number.isFinite(tempRotation) ? tempRotation : 0}, ${cx}, ${cy})`}>
        {Component ? (
          <Component accId={acc.id} tissuAccessoire={localTissu} />
        ) : (
          <rect width={baseWidth} height={baseWidth} fill="none" stroke="red" />
        )}
      </g>
    </g>
  );
}