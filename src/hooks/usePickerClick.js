import { useDragOrClick } from "./useDragOrClick";

export function usePickerClick(openPicker, type, target, getValue, defaultZoneId = null) {
  return useDragOrClick((e) => {
    const zoneElement = e.target.closest("[data-zone]");
    const zone = zoneElement?.dataset.zone || defaultZoneId;

    // value dynamique
    const value = typeof getValue === "function" ? getValue() : getValue;

    openPicker(e, {
      type,
      target,
      zoneId: zone,
      value,
    });
  });
}