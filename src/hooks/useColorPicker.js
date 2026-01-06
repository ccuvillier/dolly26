import { useState } from "react";
import { savePoupeeField } from "../firebase/firestoreFunctions";

export default function useColorPicker(pseudo, idPoupee, peau, setPeau, yeux, setYeux, levres, setLevres, cheveux, setCheveux) {
  const [pickerVisible, setPickerVisible] = useState(false);
  const [pickerX, setPickerX] = useState(0);
  const [pickerY, setPickerY] = useState(0);
  const [currentField, setCurrentField] = useState(null);

  const openColorPicker = (e, field) => {
    const x = e?.clientX ?? window.innerWidth / 2;
    const y = e?.clientY ?? window.innerHeight / 2;

    setPickerX(x);
    setPickerY(y);
    setCurrentField(field);
    setPickerVisible(true);
  };

  const applyColor = async (newColor) => {
    if (currentField === "peau") setPeau(newColor);
    if (currentField === "yeux") setYeux(newColor);
    if (currentField === "levres") setLevres(newColor);
    if (currentField === "cheveux") setCheveux(newColor);

    if (!pseudo || !idPoupee) {
      console.warn("applyColor STOP → pseudo ou prenom absent", { pseudo, idPoupee });
      return;
    }

    await savePoupeeField(pseudo, idPoupee, currentField, newColor);
  };

  return {
    pickerVisible,
    pickerX,
    pickerY,
    currentField,
    openColorPicker,
    applyColor,
    setPickerVisible
  };
}
