import React, { useEffect, useState } from "react";
import { HexColorPicker } from "react-colorful";

const ColorfulPickerBase = ({ color, onChange }) => {
  
  const [tempColor, setTempColor] = useState(color);
  useEffect(() => {
    setTempColor(color);
  }, [color]);

  const handleChange = (color) => {
    setTempColor(color); // preview local uniquement
  };

  const handleMouseUp = () => {
    if (tempColor !== color) {
      onChange?.(tempColor);
    }
  };
  
  return (

    <div onMouseUp={handleMouseUp}>
      <HexColorPicker
        className="Color-ful-picker-base"
        color={tempColor || "#ffffff"}
        onChange={handleChange}
      />
    </div>

  );
};

export default ColorfulPickerBase;
