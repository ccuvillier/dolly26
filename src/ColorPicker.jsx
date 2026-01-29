import React, { useEffect, useState } from "react";
import { SketchPicker } from "react-color";

const ColorPicker = ({ x, y, currentColor, target, onChange, onClose }) => {
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
        top: y,
        left: x,
        zIndex: 1000,
        background: "#fff",
        padding: "10px",
        boxShadow: "0 0 10px rgba(0,0,0,0.3)"
      }}
      onClick={e => e.stopPropagation()}
    >
      <SketchPicker color={tempColor} onChange={handleChange} />
      <button onClick={onClose} className="close">Fermer</button>
    </div>
  );
};

export default ColorPicker;
