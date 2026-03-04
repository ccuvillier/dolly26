import { useDragOrClick } from "./useDragOrClick";

export function usePickerClick(openPicker, type, target, value) {
  return useDragOrClick((e) => {
    openPicker(e, {
      type,
      target,
      value,
    });
  });
}