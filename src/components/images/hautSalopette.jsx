import React from 'react';
import EnteteSvg from "../EnteteSvg";
import { DEFAULT_TISSU } from "../../constants/defaultTissu";

const HautSalopette = ({ tissuHaut, color, width = 250, height = 210, onPickColor }) => {

  const mergedTissu = { ...DEFAULT_TISSU, ...tissuHaut };

  return (
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg"  
      width={width} height={height} viewBox="-23 0 250 210" className="svg"
      style={{ cursor: "pointer" }}
    >

    <EnteteSvg tissu={tissuHaut} />

    <g
      fill={mergedTissu.isUni ? mergedTissu.color : `url(#tissu-${mergedTissu.instanceId})`}
      onClick={(e) => onPickColor && onPickColor(e, { type: "tissu", target: "haut", value: mergedTissu })}
    >
        <polygon stroke='#000' points="81.9 54.7 78.8 23.1 85.7 22.5 89.9 54.8 81.9 54.7"/>
        <polygon stroke='#000' points="141 54.8 143.9 23.1 137 22.5 133 55 141 54.8"/>
        <g>
            <path d="M147.8,144.2s7.9-47.8,8.3-49.5,2.1-5.4,2.1-5.4c0,0-6.7-11.5-9-16.8s-7.6-17.2-7.6-17.2h-59.8s-5.3,12-7.6,17.2c-2.3,5.3-9,16.8-9,16.8,0,0,1.8,3.7,2.1,5.4s11.6,49.5,11.6,49.5h68.9Z"/>
            <path d="M67.7,96s5.5-7.3,10.4-17.9c5-10.7,8.3-17.8,8.3-17.8l50.2.3s4.8,10.8,8.3,17.7c3.5,6.8,10.8,18.8,10.8,18.8"/>
        </g>
        <g>
            <path d="M91,71.8h39.1v19.3s.3,7.4-6,7.4h-26.6s-6.7-.7-6.7-8.3.3-18.4.3-18.4Z"/>
            <path d="M93.2,72.2v18s-.1,5.4,4.1,5.4h26.9s3.4-.4,3.4-4.5v-19.1"/>
            <line x1="91.3" y1="76.5" x2="130.1" y2="76.5"/>
            <line x1="91.2" y1="79" x2="130.1" y2="79"/>
        </g>
      </g>
    </svg>
  );
};
export default React.memo(HautSalopette);