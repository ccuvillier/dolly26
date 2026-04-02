import Accessoire from "./Accessoires";

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

  // ===== GROUP =====
  if (node.type === "group") {
    const children = data.accessoires.filter(
      a => a.parentGroupId === node.id
    );

    return (
      <g transform={`translate(${node.pos?.x || 0}, ${node.pos?.y || 0}) scale(${node.scale || 1})`}>
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
      </g>
    );
  }

  // ===== SINGLE =====
  return (
    <Accessoire
      acc={node}
      viewportRef={viewportRef}
      globalScale={globalScale}
      accessoireActions={accessoireActions}
      selectedIds={selectedIds}
      setSelectedIds={setSelectedIds}
      dimensions={dimensions}
      openPicker={openPicker}
      onMeasure={onMeasure}
    />
  );
}