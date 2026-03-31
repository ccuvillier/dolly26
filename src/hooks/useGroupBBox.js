import { useMemo } from "react";

export default function useGroupBBox(accessoires = [], dimensions = {}) {
  const getGroupBBox = (group) => {
    if (!group || !group.childrenIds?.length) return { x: 0, y: 0, width: 0, height: 0 };

    const safe = (v) => Number.isFinite(v) ? v : 0;

    const children = group.childrenIds
      .map(id => accessoires.find(acc => acc.id === id))
      .filter(Boolean);

    const boxes = children.map(child => {
      if (child.type === "group") {
        const childBBox = getGroupBBox(child);
        return {
          minX: safe(childBBox.x) + safe(child.x),
          minY: safe(childBBox.y) + safe(child.y),
          maxX: safe(childBBox.x + childBBox.width) + safe(child.x),
          maxY: safe(childBBox.y + childBBox.height) + safe(child.y)
        };
      }

      const dim = dimensions[child.id] || {};
      const width = safe(dim.width || child.baseWidth || 65) * (child.scale || 1);
      const height = safe(dim.height || child.baseHeight || width) * (child.scale || 1);

      return {
        minX: safe(child.x),
        minY: safe(child.y),
        maxX: safe(child.x + width),
        maxY: safe(child.y + height)
      };
    });

    const minX = Math.min(...boxes.map(b => b.minX));
    const minY = Math.min(...boxes.map(b => b.minY));
    const maxX = Math.max(...boxes.map(b => b.maxX));
    const maxY = Math.max(...boxes.map(b => b.maxY));

    return {
        x: Number.isFinite(minX) ? minX : 0,
        y: Number.isFinite(minY) ? minY : 0,
        width: Number.isFinite(maxX - minX) ? maxX - minX : 0,
        height: Number.isFinite(maxY - minY) ? maxY - minY : 0
    };
  };

  return useMemo(() => ({ getGroupBBox }), [accessoires, dimensions]);
}