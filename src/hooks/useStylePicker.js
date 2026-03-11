import { useState } from "react";

export default function useStylePicker(e, options) {
  const [picker, setPicker] = useState({
    visible: false,
    type: null,     // "color" | "tissu"
    target: null,   // "cheveux" | "haut" | "bas"
    zone: null,
    value: null,
    id: null,
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
      zoneId: options.zoneId ?? null,
      id: options.id ?? null,
      value: options.value,
      ...options,
      x: x + 100,
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
