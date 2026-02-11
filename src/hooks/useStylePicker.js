import { useState } from "react";

export default function useStylePicker() {
  const [picker, setPicker] = useState({
    visible: false,
    type: null,     // "color" | "tissu"
    target: null,   // "cheveux" | "haut" | "bas"
    value: null,
    x: 0,
    y: 0,
    positionClass: "top"
  });

  const openPicker = (e, options) => {
    if (!options) return;

    const x = e?.clientX ?? window.innerWidth / 2;
    const y = e?.clientY ?? window.innerHeight / 2;


    // Classe CSS top/bottom selon position du clic
    const positionClass = y < window.innerHeight / 2 ? "top" : "bottom";

    setPicker({
      visible: true,
      type: options.type || "color",
      target: options.target,
      value: options.value,
      x: x + 20,
      y,
      positionClass
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
