import React, { useState, useEffect } from "react";
import { ACCESSOIRES_COMPONENTS } from "./data/componentsRegistry";

export default function Accessoire({
  acc,
  onUpdate,
  selectedAccessoireId,
  onDelete,
  setSelected,
  openPicker
}) {
  // ================= POSITION LOCALE =================
  const [pos, setPos] = useState({ x: acc.x, y: acc.y });
  useEffect(() => setPos({ x: acc.x, y: acc.y }), [acc.x, acc.y]);

  // ================= SIZE =================
  const [size, setSize] = useState({
    width: acc.width || 65,
    height: acc.height || 65
  });

  // ================= ROTATION =================
  const [rotation, setRotation] = useState(acc.rotation || 0);

  // ================= DRAG =================
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // ================= TISSU =================
  const [localTissu, setLocalTissu] = useState(acc.tissu);
  useEffect(() => setLocalTissu(acc.tissu), [acc.tissu]);

  const Component = ACCESSOIRES_COMPONENTS[acc.type];

  // ===================================================
  // DRAG START
  // ===================================================
  const handleDragStart = (e) => {
    e.stopPropagation();
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - pos.x,
      y: e.clientY - pos.y
    });
  };

  // ===================================================
  // DRAG MOVE
  // ===================================================
  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;

    setPos({ x: newX, y: newY }); // UI locale uniquement
  };

  // ===================================================
  // DRAG END
  // ===================================================
  const handleMouseUp = () => {
    if (!isDragging) return;

    setIsDragging(false);

    // 🔥 Firebase seulement ici
    onUpdate(acc.id, {
      x: pos.x,
      y: pos.y,
      width: size.width,
      height: size.height,
      rotation,
      tissu: localTissu
    });
  };

  // ===================================================
  // SCALE
  // ===================================================
  const handleScale = (corner, e) => {
    e.stopPropagation();

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = size.width;
    const startHeight = size.height;

    const onMove = (moveEvent) => {
      let deltaX = moveEvent.clientX - startX;
      let deltaY = moveEvent.clientY - startY;

      let newWidth = startWidth;
      let newHeight = startHeight;

      if (corner.includes("right")) newWidth += deltaX;
      if (corner.includes("left")) newWidth -= deltaX;
      if (corner.includes("bottom")) newHeight += deltaY;
      if (corner.includes("top")) newHeight -= deltaY;

      newWidth = Math.max(10, newWidth);
      newHeight = Math.max(10, newHeight);

      setSize({ width: newWidth, height: newHeight });
    };

    const onUp = () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);

      onUpdate(acc.id, {
        width: size.width,
        height: size.height
      });
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  };

  // ===================================================
  // ROTATE
  // ===================================================
  const handleRotate = (e) => {
    e.stopPropagation();

    const rect = e.target.parentElement.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const startAngle = Math.atan2(e.clientY - cy, e.clientX - cx);
    const initialRotation = rotation;

    const onMove = (moveEvent) => {
      const currentAngle = Math.atan2(
        moveEvent.clientY - cy,
        moveEvent.clientX - cx
      );

      const diff = (currentAngle - startAngle) * (180 / Math.PI);
      setRotation(initialRotation + diff);
    };

    const onUp = () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);

      onUpdate(acc.id, { rotation });
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  };

  // ===================================================
  // EFFECT LISTENERS DRAG
  // ===================================================
  useEffect(() => {
    if (!isDragging) return;

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragOffset, pos]);

  // ===================================================
  // RENDER
  // ===================================================
  return (
    <div
      className={`accessoires-wrapper ${
        selectedAccessoireId === acc.id ? "selected" : ""
      }`}
      style={{
        position: "absolute",
        left: pos.x,
        top: pos.y,
        width: size.width,
        height: size.height,
        transform: `rotate(${rotation}deg)`
      }}
      onMouseDown={(e) => {
        handleDragStart(e);
        setSelected(acc.id);
      }}
    >
      {Component ? (
        <Component
          width={size.width}
          height={size.height}
          accId={acc.id}
          tissuAccessoire={localTissu}
          onPickColor={openPicker}
        />
      ) : (
        <div style={{ width: size.width, height: size.height, border: "1px dashed red" }}>
          {acc.type}
        </div>
      )}

      {selectedAccessoireId === acc.id && (
        <>
          <div className="handle rotate-handle" onMouseDown={handleRotate} />
          {["top-left","top-right","bottom-left","bottom-right"].map(corner => (
            <div
              key={corner}
              className={`handle ${corner}`}
              onMouseDown={(e) => handleScale(corner, e)}
            />
          ))}
          <button
            className="close"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(acc.id);
            }}
          >
            Supprimer
          </button>
        </>
      )}
    </div>
  );
}