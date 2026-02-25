import React, { useState, useEffect } from "react";

export default function Accessoire({
  acc,
  onUpdate,
  selectedAccessoireId,
  onDelete,
  setSelected,
  onMove,
  openPicker
}) {
  // ================= TISSU LOCAL =================
  const [localTissu, setLocalTissu] = useState(acc.tissu);
  useEffect(() => setLocalTissu(acc.tissu), [acc.tissu]);

  // ================= UI STATE =================
  const [pos, setPos] = useState({ x: acc.x, y: acc.y });
  const [size, setSize] = useState({ width: 65, height: 65 });
  const [rotation, setRotation] = useState(acc.rotation || 0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [activeAction, setActiveAction] = useState(null); // "drag" | "scale" | "rotate"
  const [scaleStart, setScaleStart] = useState(null); // { mouseX, mouseY, width, height, x, y, corner }
  const [rotateStart, setRotateStart] = useState(null); // { centerX, centerY, startAngle, initialRotation }

  // ================= SAFE COMPONENT =================
  const getComponent = (component) => {
    if (!component) return null;
    if (typeof component === "function") return component;
    if (component.type && typeof component.type === "function") return component.type;
    if (component.default && typeof component.default === "function") return component.default;
    return null;
  };
  const Component = getComponent(acc.component);

  // ================= HANDLERS =================
  const handleDragStart = (e) => {
    e.stopPropagation();
    setIsDragging(true);
    setDragOffset({ x: e.clientX - pos.x, y: e.clientY - pos.y });
    setActiveAction("drag");
  };

  const handleScaleMouseDown = (e, corner) => {
    e.stopPropagation();
    e.preventDefault();
    setActiveAction("scale");
    setScaleStart({
      mouseX: e.clientX,
      mouseY: e.clientY,
      width: size.width,
      height: size.height,
      x: pos.x,
      y: pos.y,
      corner
    });
  };

  const handleRotateMouseDown = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const rect = e.target.parentElement.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const startAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
    setRotateStart({ centerX, centerY, startAngle, initialRotation: rotation });
    setActiveAction("rotate");
  };

  /* ----- SCALE ----- */
  const handleMouseMove = (e) => {
    if (!activeAction) return;

    if (activeAction === "drag") {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      setPos({ x: newX, y: newY });
    }

    if (activeAction === "scale" && scaleStart) {
      const { mouseX, mouseY, width, height, x, y, corner } = scaleStart;
      let deltaX = e.clientX - mouseX;
      let deltaY = e.clientY - mouseY;
      let newWidth = width;
      let newHeight = height;
      let newX = x;
      let newY = y;

      switch (corner) {
        case "top-left":
          newWidth -= deltaX; newHeight -= deltaY; newX += deltaX; newY += deltaY; break;
        case "top-right":
          newWidth += deltaX; newHeight -= deltaY; newY += deltaY; break;
        case "bottom-left":
          newWidth -= deltaX; newHeight += deltaY; newX += deltaX; break;
        case "bottom-right":
          newWidth += deltaX; newHeight += deltaY; break;
      }

      newWidth = Math.max(10, newWidth);
      newHeight = Math.max(10, newHeight);
      setSize({ width: newWidth, height: newHeight });
      setPos({ x: newX, y: newY });
    }

    if (activeAction === "rotate" && rotateStart) {
      const { centerX, centerY, startAngle, initialRotation } = rotateStart;
      const currentAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
      setRotation(initialRotation + (currentAngle - startAngle));
    }
  };


  /* ----- DRAG ----- */
  const handleMouseUp = () => {
    // Persist changes à la fin
    if (activeAction === "drag" || activeAction === "scale" || activeAction === "rotate") {
      onUpdate(acc.id, { x: pos.x, y: pos.y, width: size.width, height: size.height, rotation });
    }
    setIsDragging(false);
    setActiveAction(null);
    setScaleStart(null);
    setRotateStart(null);
  };

  // ================= EFFECT =================
  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [activeAction, dragOffset, scaleStart, rotateStart, pos, size, rotation]);

  // ================= RENDER =================
  return (
    <div
      className={`accessoires-wrapper ${selectedAccessoireId === acc.id ? "selected" : ""}`}
      style={{
        position: "absolute",
        left: pos.x,
        top: pos.y,
        width: size.width,
        height: size.height,
        transform: `rotate(${rotation}deg) scale(${acc.scale || 1})`
      }}
      onMouseDown={(e) => { e.stopPropagation(); setSelected(acc.id); handleDragStart(e); }}
    >
      {Component && (
        <Component
          width={size.width}
          height={size.height}
          accId={acc.id}
          tissuAccessoire={localTissu}
          onPickColor={openPicker}
        />
      )}

      {selectedAccessoireId === acc.id && (
        <>
          <div className="handle rotate-handle" onMouseDown={handleRotateMouseDown} />
          {["top-left","top-right","bottom-left","bottom-right"].map(corner => (
            <div
              key={corner}
              className={`handle ${corner}`}
              onMouseDown={(e) => handleScaleMouseDown(e, corner)}
            />
          ))}
          <button className="close" onClick={(e) => { e.stopPropagation(); onDelete(acc.id); }}>
            Supprimer
          </button>
        </>
      )}
    </div>
  );
}