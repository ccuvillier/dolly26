import React, { useState, useEffect } from "react";

export default function Accessoire({
  acc,
  onUpdate,
  selectedAccessoireId,
  onDelete,
  setSelected,
  onMove,
  openPicker,
  tissuAccessoire
}) {

  /* forcer la mise à jour du tissu */
  const [localTissu, setLocalTissu] = useState(acc.tissu);

  useEffect(() => {
    setLocalTissu(acc.tissu);
  }, [acc.tissu]);



  const [size, setSize] = useState({ width: 65, height: 65 });
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const Component = acc.component;

  /* ================= SCALE ================= */

  const handleScaleMouseDown = (e, corner) => {
    e.stopPropagation();
    e.preventDefault();

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = size.width;
    const startHeight = size.height;
    const startPos = { x: acc.x, y: acc.y };

    const onMouseMove = (moveEvent) => {
      let deltaX = moveEvent.clientX - startX;
      let deltaY = moveEvent.clientY - startY;
      let newWidth = startWidth;
      let newHeight = startHeight;
      let newX = startPos.x;
      let newY = startPos.y;

      switch (corner) {
        case "top-left":
          newWidth -= deltaX;
          newHeight -= deltaY;
          newX += deltaX;
          newY += deltaY;
          break;
        case "top-right":
          newWidth += deltaX;
          newHeight -= deltaY;
          newY += deltaY;
          break;
        case "bottom-left":
          newWidth -= deltaX;
          newHeight += deltaY;
          newX += deltaX;
          break;
        case "bottom-right":
          newWidth += deltaX;
          newHeight += deltaY;
          break;
      }

      newWidth = Math.max(10, newWidth);
      newHeight = Math.max(10, newHeight);

      setSize({ width: newWidth, height: newHeight });
      onUpdate(acc.id, { width: newWidth, height: newHeight, x: newX, y: newY });
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  /* ================= ROTATE ================= */

  const handleRotateMouseDown = (e) => {
    e.stopPropagation();
    e.preventDefault();

    const rect = e.target.parentElement.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const startAngle =
      Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);

    const initialRotation = acc.rotation;

    const onMouseMove = (moveEvent) => {
      const currentAngle =
        Math.atan2(
          moveEvent.clientY - centerY,
          moveEvent.clientX - centerX
        ) *
        (180 / Math.PI);

      const newRotation = initialRotation + (currentAngle - startAngle);
      onUpdate(acc.id, { rotation: newRotation });
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  /* ================= DRAG ================= */

  const handleDragStart = (e) => {
    setIsDragging(true);
    setOffset({
      x: e.clientX - acc.x,
      y: e.clientY - acc.y
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const newX = e.clientX - offset.x;
    const newY = e.clientY - offset.y;

    onMove(acc.id, newX, newY);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (!isDragging) return;

    const moveListener = (e) => handleMouseMove(e);
    const upListener = () => handleMouseUp();

    document.addEventListener("mousemove", moveListener);
    document.addEventListener("mouseup", upListener);

    return () => {
      document.removeEventListener("mousemove", moveListener);
      document.removeEventListener("mouseup", upListener);
    };
  }, [isDragging, offset]);

  console.log("Rendering Accessoire", acc.id, acc.tissu);

  /* ================= RENDER ================= */

  return (
    <div
      className={`accessoires-wrapper ${
        selectedAccessoireId === acc.id ? "selected" : ""
      }`}
      style={{
        position: "absolute",
        left: acc.x,
        top: acc.y,
        width: size.width,
        height: size.height,
        transform: `rotate(${acc.rotation}deg) scale(${acc.scale})`
      }}
      onMouseDown={(e) => {
        e.stopPropagation();
        setSelected(acc.id);
        handleDragStart(e);
      }}
      
    >
      <Component width={size.width} height={size.height} accId={acc.id} tissuAccessoire={localTissu} onPickColor={openPicker}/>

      {selectedAccessoireId === acc.id && (
        <>
          <div className="handle rotate-handle" onMouseDown={handleRotateMouseDown} />

          {["top-left", "top-right", "bottom-left", "bottom-right"].map(
            (corner) => (
              <div
                key={corner}
                className={`handle ${corner}`}
                onMouseDown={(e) => handleScaleMouseDown(e, corner)}
              />
            )
          )}

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