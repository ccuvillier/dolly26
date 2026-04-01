import PictoColor from "../images/picto-color.svg";
import PictoTrash from "../images/picto-trash.svg";
import PictoClone from "../images/picto-clone.svg";

const SelectionAccessoires = ({
  //baseWidth,
  //baseHeight,
  safeWidth,
  safeHeight,
  scale,
  rotation,
  cx,
  cy,
  offsetX,
  offsetY,
  globalScale,
  onRotate,
  onScale,
  onDelete,
  onClone,
  onColor,
  tissu,
  localTissu,
  acc,
  openPicker
}) => {
  
  const hasOffset = Number.isFinite(offsetX) && Number.isFinite(offsetY);
  
  const handleSize = 10 / globalScale; // taille des handlers
  const handleBuffer = 20 / globalScale; // espace supplémentaire pour placer les handlers

  const boxWidth = safeWidth * scale;
  const boxHeight = safeHeight * scale;


  return (
    <g transform={hasOffset ? `translate(${offsetX}, ${offsetY})` : `translate(0, 0)`} onMouseDown={(e) => e.stopPropagation()}>
      {/* Rotate */}
      <rect
        className="rotate-handle"
        y={-handleBuffer + handleSize}
        x={-handleBuffer + handleSize}
        width={boxWidth + (handleSize)}
        height={boxHeight + (handleSize)}
        onMouseDown={(e) => {
          e.stopPropagation();
          onRotate?.(e);
        }}
        style={{ strokeWidth: 20 / globalScale, stroke: "transparent" }}
      />

      {/* Scale */}
     {["top-left","top-right","bottom-left","bottom-right"].map((corner, i) => {

        return (
          <rect
            key={i}
            className={`scale-handle ${corner}`}
            x={corner.includes("right") ? boxWidth - handleSize : -handleSize}
            y={corner.includes("bottom") ? boxHeight - handleSize : -handleSize}
            width={handleSize}
            height={handleSize}
            onMouseDown={(e) => onScale(e, corner)}
            strokeWidth={1 / globalScale}
          />
        );
      })}

      {/* UI pictos */}
      <g>
        <rect
          x={-15 / globalScale}
          y={-37 / globalScale}
          width={75 / globalScale}
          height={25 / globalScale}
          fill="white"
          strokeWidth={1 / globalScale}
          rx={3 / globalScale}
          ry={3 / globalScale}
          className="pictos"
        />

        <image
          href={PictoTrash}
          x={-15 / globalScale}
          y={-35 / globalScale}
          width={20 / globalScale}
          height={20 / globalScale}
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.();
          }}
        />

        {/* Local tissu */} 
        {/* Color button */} 
        {acc?.tissu?.isUni && acc.tissu.color === "#fff" ? ( 
          <image alt="Colorier" 
            href={PictoColor} 
            x={10 / globalScale} 
            width={20 / globalScale}
            height={20 / globalScale} 
            y={-35 / globalScale}
            onMouseDown={(e) => e.stopPropagation()} 
            onClick={(e) => { 
              e.stopPropagation(); 
              openPicker(e, { type: "tissu", target: "accessoire", id: acc.id, value: acc.tissu }); 
            }} 
          /> ) : ( 
          <circle 
            cx={20 / globalScale} 
            cy={-25 / globalScale} 
            r={10 / globalScale} 
            fill={ localTissu?.isUni ? localTissu.color : `url(#tissu-${localTissu?.instanceId})` } 
            strokeWidth={1 / globalScale} 
            onMouseDown={(e) => e.stopPropagation()} 
            onClick={(e) => { 
              e.stopPropagation(); 
              openPicker(e, { type: "tissu", target: "accessoire", id: acc.id, value: localTissu}); 
            }} 
          /> 
        )}

        <image
          href={PictoClone}
          x={35 / globalScale}
          y={-35 / globalScale}
          width={20 / globalScale}
          height={20 / globalScale}
          onClick={(e) => {
            e.stopPropagation();
            onClone?.(acc.id);
          }}
        />
      </g>
    </g>
  );
};

export default SelectionAccessoires;