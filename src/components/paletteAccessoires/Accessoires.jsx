import React, { useState } from "react";

export default function Accessoire({ acc, onDragStart, onUpdate, selectedAccessoireId, onDelete, setSelected }) {
  const [size, setSize] = useState({ width: 65, height: 65 });

  const Component = acc.component;

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
      onUpdate(acc.id, { width: newWidth, height: newHeight, x: newX, y: newY });
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  console.log("RENDER Accessoire", acc.id, "selected:", selectedAccessoireId === acc.id);

  return (
    <div
      className={`accessoires-wrapper ${selectedAccessoireId === acc.id ? "selected" : ""}`}
      style={{ position: "absolute", left: acc.x, top: acc.y, width: size.width, height: size.height }}
      onMouseDown={(e) => {
        console.log("ACCESSOIRE MOUSEDOWN");
        e.stopPropagation();      // empêche la désélection globale
        setSelected(acc.id);      // sélection immédiate
        onDragStart(e, acc);      // puis drag
      }}
    >
      <Component width={size.width} height={size.height} />
      {selectedAccessoireId === acc.id && (
        <>
          {["top-left","top-right","bottom-left","bottom-right"].map(corner => (
            <div key={corner} className={`handle ${corner}`} onMouseDown={(e) => handleScaleMouseDown(e, corner)} />
          ))}
          <button className="close" onClick={(e) => { e.stopPropagation(); onDelete(acc.id); }}>Supprimer</button>
        </>
      )}
    </div>
  );
}
