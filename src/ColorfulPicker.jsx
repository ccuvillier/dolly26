import React, { useEffect, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { useDraggable } from "./hooks/useDraggable";

const ColorfulPicker = ({ x, y, currentColor, target, onChange, onClose, picker }) => {

  const [tempColor, setTempColor] = useState(currentColor || "#ffffff");

  useEffect(() => {
    setTempColor(currentColor || "#ffffff");
  }, [currentColor]);

  const handleChange = (color) => {
    setTempColor(color);
  };
  
  const handleMouseUp = () => {
    onChange?.(target, tempColor); 
  };

  /* PALETTE COULEUR DRAGGABLE */ 
  const { position, dragging, bindHeader } = useDraggable({
    x: picker?.x ?? x,
    y: picker?.y ?? y,
  });

  return (
    <div
      className={`${picker?.positionClass ?? "top"}`}
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

      <div onMouseUp={handleMouseUp}>
        <HexColorPicker
          color={tempColor}
          onChange={handleChange}
        />
      </div>
      <button onClick={onClose} className="close">Fermer</button>
    </div>
  );
};

export default ColorfulPicker;
