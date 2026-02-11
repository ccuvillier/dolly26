import { HexColorPicker } from "react-colorful";

const ColorfulPickerBase = ({ color, onChange }) => {
  return (
    <HexColorPicker
      color={color || "#ffffff"}
      className="Color-ful-picker-base"
      onChange={onChange}
    />
  );
};

export default ColorfulPickerBase;
