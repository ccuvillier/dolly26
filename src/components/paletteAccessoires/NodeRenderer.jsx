import React from "react";
import Accessoire from "./Accessoires";
import SelectionAccessoires from "./SelectionAccessoires";
import useSVGDrag from "../../hooks/useSVGdrag";

export default function NodeRenderer({
  node,
  data,
  accessoireActions,
  selectedIds,
  setSelectedIds,
  globalScale,
  viewportRef,
  openPicker,
  dimensions,
  onMeasure
}) {
  const isGroup = node.type === "group";

  if (isGroup) {
    // Récupérer les enfants du groupe
    const children = data.accessoires.filter(a => a.parentGroupId === node.id);

    // Calculer le bbox global du groupe
    const bbox = children.reduce(
      (acc, child) => {
        const d = dimensions[child.id] || { width: 65, height: 65 };
        const x = child.x || 0;
        const y = child.y || 0;
        acc.minX = Math.min(acc.minX, x);
        acc.minY = Math.min(acc.minY, y);
        acc.maxX = Math.max(acc.maxX, x + d.width);
        acc.maxY = Math.max(acc.maxY, y + d.height);
        return acc;
      },
      { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity }
    );

    // définir le centre pour les transformations globales
    const width = bbox.maxX - bbox.minX;
    const height = bbox.maxY - bbox.minY;
    const offsetX = bbox.minX;
    const offsetY = bbox.minY;
    const cx = width / 2;
    const cy = height / 2;

    const isSelected = selectedIds.includes(node.id);

    // =========== drag du group ================
    const { pos, startDrag } = useSVGDrag({
      viewportRef,
      initialPos: { x: node.pos?.x || 0, y: node.pos?.y || 0 },
      onDrag: ({ dx, dy }) => {
        const ids = data.accessoires
          .filter(a => a.parentGroupId === node.id)
          .map(a => a.id);
        accessoireActions.onMove({ ids, dx, dy });
      }
    });

  

    return (
      <g className="group"
        transform={`translate(${node.pos?.x || 0}, ${node.pos?.y || 0}) scale(${node.scale || 1})`}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedIds([node.id]);
        }}
      >
        {children.map(child => (
          <NodeRenderer
            key={child.id}
            node={child}
            data={data}
            accessoireActions={accessoireActions}
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
            globalScale={globalScale}
            viewportRef={viewportRef}
            openPicker={openPicker}
            dimensions={dimensions}
            onMeasure={onMeasure}
          />
        ))}

         {isSelected && (
          <SelectionAccessoires
            acc={node}
            offsetX={offsetX}
            offsetY={offsetY}
            safeWidth={width}
            safeHeight={height}
            scale={node.scale || 1}
            rotation={node.rotation || 0}
            cx={cx}
            cy={cy}
            globalScale={globalScale}
            onDelete={() => accessoireActions.onDelete(node)}
            onClone={() => accessoireActions.onClone(node)}
            startDrag={startDrag}
            //onScale={(s) => accessoireActions.onScaleGroup(node, s)}
            //onRotate={(r) => accessoireActions.onRotateGroup(node, r)}
            //onDrag={(pos) => accessoireActions.onDragGroup(node, pos)}
          />
        )}
      </g>
    );
  }

  // Single accessoire
  return (
    <Accessoire
      acc={node}
      viewportRef={viewportRef}
      selectedIds={selectedIds}
      setSelectedIds={setSelectedIds}
      accessoireActions={accessoireActions}
      globalScale={globalScale}
      dimensions={dimensions}
      onMeasure={onMeasure}
      openPicker={openPicker}
    />
  );
}