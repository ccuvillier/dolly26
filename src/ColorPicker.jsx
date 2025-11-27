import React, { useState, useEffect } from "react";
import { SketchPicker } from "react-color";

const ColorPicker = ({ x, y, currentColor, onValidate, onClose, onChange }) => {
  const [tempColor, setTempColor] = useState(currentColor);

  // Met à jour tempColor si currentColor change (ex : ouverture picker)
  useEffect(() => {
    setTempColor(currentColor);
  }, [currentColor]);

  const handleChange = (color) => {
    setTempColor(color.hex);
    if (onChange) onChange(color.hex); // mise à jour live dans App.jsx
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
    >
      <SketchPicker color={tempColor} onChange={handleChange} />
      <button onClick={() => onValidate(tempColor)}>Enregistrer</button>
      <button onClick={onClose}>Fermer</button>
    </div>
  );
};

export default ColorPicker;
