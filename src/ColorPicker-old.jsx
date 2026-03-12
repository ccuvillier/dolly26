import React, { useEffect, useState } from "react";
import { SketchPicker } from "react-color";
import { useDraggable } from "./hooks/useDraggable";

const ColorPicker = ({ x, y, currentColor, target, onChange, onClose }) => {

  const { position, dragging, bindHeader } = useDraggable({ x, y }); // Draggable
  const [tempColor, setTempColor] = useState(currentColor || "#ffffff");

  useEffect(() => {
    setTempColor(currentColor || "#ffffff");
  }, [currentColor]);

  const handleChange = (color) => {
    if (!color?.hex) return;
    setTempColor(color.hex);
    if (onChange) onChange(target, color.hex); // <-- important : target + color
  };

  return (
    <div
      style={{
        position: "fixed",
        top: position.y,
        left: position.x,
        zIndex: 1000,
        background: "#fff",
        padding: "10px",
        boxShadow: "0 0 10px rgba(0,0,0,0.3)"
      }}
      onClick={e => e.stopPropagation()}
    >
    
    {/* HEADER DRAGGABLE */}
      <div className="palette-header"
        {...bindHeader}
        style={{
          cursor: dragging ? "grabbing" : "grab",
          userSelect: "none",
          touchAction: "none",
        }}
      >
        <span>Déplacer la palette</span>
      </div>

      <SketchPicker color={tempColor} onChange={handleChange} />
      <button onClick={onClose} className="close">Fermer</button>
    </div>
  );
};

export default ColorPicker;
