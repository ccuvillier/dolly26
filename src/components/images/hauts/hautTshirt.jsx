import React from 'react';
import EnteteSvg from "../../EnteteSvg";
import { DEFAULT_TISSU } from "../../../constants/defaultTissu";

const HautTshirt = ({ tissuHaut, onPickColor }) => {

  const mergedTissu = { ...DEFAULT_TISSU, ...tissuHaut };

  return (
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg"  
           width="100%" viewBox="-298 -230 800 800" className="svg"
           style={{ cursor: "pointer" }}
      >

      <EnteteSvg tissu={tissuHaut} />

      <g fill={mergedTissu.isUni ? mergedTissu.color : `url(#tissu-${mergedTissu.instanceId})`}
        onClick={(e) => onPickColor && onPickColor(e, { type: "tissu", target: "haut", value: mergedTissu })}
      >
        <path class="st0" d="M71.9,71.5c1-3.9-13.9-36.3-13.9-36.3l-15,54.1,19.5,6.8s8.3-20.7,9.4-24.6Z"/>
        <path class="st0" d="M143.9,143.9s-.7-32.2,1.5-50.7c2.4-20.8,19.1-58.3,19.1-58.3,0,0-1.9-9.1-16.5-10.2s-18.2-2.8-18.2-2.8c0,0-4.6,12.6-18.5,12.6-13.9,0-18.5-12.6-18.5-12.6,0,0-.6,1.4-18.2,2.8s-16.5,10.2-16.5,10.2c0,0,16.7,37.5,19.1,58.3s1.5,50.7,1.5,50.7h65.2Z"/>
        <path class="st0" d="M150.6,71.5c-1-3.9,13.9-36.3,13.9-36.3l15,54.1-19.5,6.8s-8.3-20.7-9.4-24.6Z"/>
      </g>
    </svg>
  );
};
export default React.memo(HautTshirt);