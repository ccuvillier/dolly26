import { useState } from "react";

export default function useStylePicker() {
  const [picker, setPicker] = useState({
    visible: false,
    type: null,     // "color" | "tissu"
    target: null,   // "cheveux" | "haut" | "bas"
    value: null,
    x: 0,
    y: 0
  });

  const openPicker = (e, options) => {
    if (!options) return;

    const x = e?.clientX ?? window.innerWidth / 2;
    const y = e?.clientY ?? window.innerHeight / 2;

    setPicker({
      visible: true,
      type: options.type || "color",
      target: options.target,
      value: options.value,
      x: x + 20,
      y
    });
  };

  const closePicker = () => {
    setPicker(prev => ({ ...prev, visible: false }));
  };

  return {
    picker,
    setPicker,
    openPicker,
    closePicker
  };
}
