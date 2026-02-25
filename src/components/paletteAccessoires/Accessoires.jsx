import React, { useState, useEffect } from "react";
import { ACCESSOIRES_COMPONENTS } from "./data/componentsRegistry";

export default function Accessoire({
  acc,
  onUpdate,
  selectedAccessoireId,
  onDelete,
  setSelected,
  onMove,
  openPicker
}) {
  const [pos, setPos] = useState({ x: acc.x, y: acc.y });
  const [size, setSize] = useState({ width: acc.width || 65, height: acc.height || 65 });
  const [rotation, setRotation] = useState(acc.rotation || 0);
  const [localTissu, setLocalTissu] = useState(acc.tissu);

  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setPos({ x: acc.x, y: acc.y });
  }, [acc.x, acc.y]);

  // Toujours recalculer Component depuis le type
  const Component = ACCESSOIRES_COMPONENTS[acc.type] || null;

  useEffect(() => setPos({ x: acc.x, y: acc.y }), [acc.x, acc.y]);
  useEffect(() => setLocalTissu(acc.tissu), [acc.tissu]);

  const handleDragStart = (e) => {
    e.stopPropagation();
    setIsDragging(true);
    setDragOffset({ x: e.clientX - pos.x, y: e.clientY - pos.y });
    setSelected(acc.id);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;
    setPos({ x: newX, y: newY }); // UI fluide locale
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    onUpdate(acc.id, {
      x: pos.x,
      y: pos.y,
      width: size.width,
      height: size.height,
      rotation,
      tissu: localTissu
    });
  };

  useEffect(() => {
    if (!isDragging) return;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragOffset, pos, size, rotation, localTissu]);

  const handleScale = (corner, e) => {
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = size.width;
    const startHeight = size.height;
    const startPos = { ...pos };

    const onMove = (moveEvent) => {
      let deltaX = moveEvent.clientX - startX;
      let deltaY = moveEvent.clientY - startY;
      let newWidth = startWidth;
      let newHeight = startHeight;
      let newX = startPos.x;
      let newY = startPos.y;

      switch (corner) {
        case "top-left": newWidth -= deltaX; newHeight -= deltaY; newX += deltaX; newY += deltaY; break;
        case "top-right": newWidth += deltaX; newHeight -= deltaY; newY += deltaY; break;
        case "bottom-left": newWidth -= deltaX; newHeight += deltaY; newX += deltaX; break;
        case "bottom-right": newWidth += deltaX; newHeight += deltaY; break;
      }

      newWidth = Math.max(10, newWidth);
      newHeight = Math.max(10, newHeight);

      setSize({ width: newWidth, height: newHeight });
      setPos({ x: newX, y: newY });
    };

    const onUp = () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      onUpdate(acc.id, { x: pos.x, y: pos.y, width: size.width, height: size.height });
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  };

  const handleRotate = (e) => {
    e.stopPropagation();
    const rect = e.target.parentElement.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const startAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
    const initialRotation = rotation;

    const onMove = (moveEvent) => {
      const currentAngle = Math.atan2(moveEvent.clientY - centerY, moveEvent.clientX - centerX) * (180 / Math.PI);
      setRotation(initialRotation + (currentAngle - startAngle));
    };

    const onUp = () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      onUpdate(acc.id, { rotation });
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  };

  const handleTissuChange = (newTissu) => {
    setLocalTissu(newTissu);
    onUpdate(acc.id, { tissu: newTissu });
  };

  return (
    <div
      className={`accessoires-wrapper ${selectedAccessoireId === acc.id ? "selected" : ""}`}
      style={{
        position: "absolute",
        left: pos.x,
        top: pos.y,
        width: size.width,
        height: size.height,
        transform: `rotate(${rotation}deg) scale(${acc.scale})`
      }}
      onMouseDown={handleDragStart}
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
          <button className="close" onClick={(e) => { e.stopPropagation(); onDelete(acc.id); }}>Supprimer</button>
        </>
      )}
    </div>
  );
}