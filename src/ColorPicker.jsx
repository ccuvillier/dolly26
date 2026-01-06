import React, { useState, useEffect } from "react";
import { SketchPicker } from "react-color";

const ColorPicker = ({ x, y, currentColor, onValidate, onClose, onChange }) => {
  const [tempColor, setTempColor] = useState(currentColor);

  // Sync avec currentColor à chaque ouverture
  useEffect(() => {
    setTempColor(currentColor);
  }, [currentColor]);

  const handleChange = (color) => {
    if (!color?.hex) return; // ignore les valeurs invalides venant du picker
    setTempColor(color.hex);
    if (onChange) onChange(color.hex);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: y,
        left: x,
        zIndex: 1000,
        background: "#fff",
        padding: "10px",
        boxShadow: "0 0 10px rgba(0,0,0,0.3)"
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <SketchPicker color={tempColor} onChange={handleChange} />

      <button className="close" onClick={onClose}>Fermer</button>
    </div>
  );
};

export default ColorPicker;
