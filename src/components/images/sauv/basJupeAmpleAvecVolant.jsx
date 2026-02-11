import React from 'react';
import EnteteSvg from "../enteteSvg";
import { DEFAULT_TISSU } from "../../constants/defaultTissu";

const BasJupeAmpleAvecVolant = ({ tissuBas = { name: "uni", color: "#fff" }, width = 400, height = 400, onPickColor }) => {

      const mergedTissu = { ...DEFAULT_TISSU, ...tissuBas };

    return (
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg"  
           width={width} height={height} viewBox="27 0 400 400" className="svg"
           style={{ cursor: "pointer" }}
        >
         <EnteteSvg tissu={tissuBas} />

        <g fill={mergedTissu.isUni ? mergedTissu.color : `url(#tissu-${mergedTissu.instanceId})`} 
        onClick={(e) => onPickColor && onPickColor(e, { type: "tissu", target: "haut", value: mergedTissu })}
        style={{ pointerEvents: "all" }}>
            <path d="M202.3,8.4L204.3,0s15.5.4,32.1.4,36.3.1,36.3.1l1.7,7.7h-72.1Z"/>
            <path d="M109.2,151.3s-23.6,49.8-29.5,57.4-11.8,11-11.8,11c0,0,7.6,13.5,30.4,16s21.9-5.1,38,0c16,5.1,27,16.9,27,16.9,0,0,29.5,16.9,86.1,6.8s65.8-16,65.8-16c0,0,21.1.8,43.9-7.6,22.8-8.4,24.5-12.7,24.5-12.7l-3.4-7.6s14.3-1.7,22.8-7.6l8.4-5.9s-21.1-43-42.2-75.1-38-48.9-38-48.9l-182.2,4.2-39.7,69.2h0Z"/>
            <path d="M202.3,8.4s-27.3,9.6-52.6,44.2c-25.3,34.6-59.9,81-59.9,81,0,0,48.1,54,119.8,43,71.7-11-5.9-40.5,39.7-49.8s59.9-15.2,70-21.1,15.2-10.1,15.2-10.1l-12.7-15.2s.8,2.5,9.3-2.5,7.6-7.6,7.6-7.6c0,0-16-28.7-36.3-43s-28.1-18.8-28.1-18.8h-72,0Z"/>
        </g>
        <g className='relief'>
            <path d="M234.7,142.1s-11.6-19.9-7.9-46.1,6.8-59.2,6.8-59.2c0,0-15.8,53.6-12.8,70.9s1.1,19.9,13.9,34.5h0Z"/>
            <path d="M327.9,88.2s-14.9-16.5-25.3-30.8c-7.8-10.7-27-30-27-30,0,0,19,19.1,30.2,30s22.1,30.8,22.1,30.8h0Z"/>
            <path d="M313.8,243s-12.4-22.9-16.1-54-6.8-51.8-6.8-51.8"/>
            <path d="M321.3,118.9s25.5,30.8,37.1,52.9,21.7,43.7,21.7,43.7"/>
            <path d="M117.7,235.9s6-13.5,15-29.6,10.5-27.8,10.5-27.8c0,0-10.9,23.6-18.4,36s-13.9,22.1-13.9,22.1l6.8-.8h0Z"/>
            <path d="M200.2,177.4s41.6,1.5,46.5-15-17.2-25.1-1.1-30.8,59.6-15.8,73.9-23.2,15.1-12.8,15.1-12.8l-9.1-10.5s1.9.8,4.9-.4,4.5-2.6,4.5-2.6l-3.7-4.2s-.5.5-3.8,2-5.4.6-5.4.6l12.7,15.2s-12.5,13.9-46.6,21.8-50,7.4-52.9,15.8c-4.1,12,8.1,19.9,5.6,27.8-4.9,15.8-40.5,16.5-40.5,16.5v-.2Z"/>
        </g>
        </svg>

    );
};
export default React.memo(BasJupeAmpleAvecVolant);