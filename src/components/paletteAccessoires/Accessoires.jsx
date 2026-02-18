import React, { useState } from "react";

export default function Accessoire({ acc, onDragStart, onUpdate, isActive, onDelete, setSelected }) {
  const [size, setSize] = useState({ width: 65, height: 65 });
  const [position, setPosition] = useState({ x: acc.x, y: acc.y });

  const Component = acc.component;

  const handleScaleMouseDown = (e, corner) => {
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = size.width;
    const startHeight = size.height;
    const startPos = { ...position };

    const onMouseMove = (moveEvent) => {
      let deltaX = moveEvent.clientX - startX;
      let deltaY = moveEvent.clientY - startY;
      let newWidth = startWidth, newHeight = startHeight, newX = startPos.x, newY = startPos.y;

      switch(corner) {
        case "top-left": newWidth -= deltaX; newHeight -= deltaY; newX += deltaX; newY += deltaY; break;
        case "top-right": newWidth += deltaX; newHeight -= deltaY; newY += deltaY; break;
        case "bottom-left": newWidth -= deltaX; newHeight += deltaY; newX += deltaX; break;
        case "bottom-right": newWidth += deltaX; newHeight += deltaY; break;
      }

      if(newWidth < 10) newWidth = 10;
      if(newHeight < 10) newHeight = 10;

      setSize({ width: newWidth, height: newHeight });
      setPosition({ x: newX, y: newY });
      onUpdate(acc.id, { width: newWidth, height: newHeight, x: newX, y: newY });
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  return (
    <div
      className={`accessoires-wrapper ${isActive ? "selected" : ""}`}
      style={{ position: "absolute", left: acc.x, top: acc.y, width: size.width, height: size.height }}
      onMouseDown={(e) => onDragStart(e, acc)}
      onClick={(e) => { e.stopPropagation(); setSelected(acc.id); }}
    >
      <Component width={size.width} height={size.height} />
      {isActive && (
        <>
          {["top-left","top-right","bottom-left","bottom-right"].map(corner => (
            <div key={corner} className={`handle ${corner}`} onMouseDown={(e) => handleScaleMouseDown(e, corner)} />
          ))}
          <button className="close" onClick={() => onDelete(acc.id)}>Supprimer</button>
        </>
      )}
    </div>
  );
}
