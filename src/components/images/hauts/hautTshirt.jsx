import React from 'react';
import EnteteSvg from "../../EnteteSvg";
import { DEFAULT_TISSU } from "../../../constants/defaultTissu";

const HautTshirt = ({ tissus = {}, onZoneClick = () => {} }) => {

  const getFill = (zone) => {
        const tissu = tissus?.[zone]

        if (!tissu) return "#fff"

        return tissu.isUni
            ? tissu.color
            : `url(#tissu-${tissu.instanceId})`
    }

  return (
    <g transform="translate(300 228)" className='svg'>

      <EnteteSvg tissus={tissus} />

      <g data-zone="zone1" fill={getFill("zone1")} onMouseDown={() => onZoneClick("zone1")}>
        <path d="M71.9,71.5c1-3.9-13.9-36.3-13.9-36.3l-15,54.1,19.5,6.8s8.3-20.7,9.4-24.6Z"/>
        <path d="M143.9,143.9s-.7-32.2,1.5-50.7c2.4-20.8,19.1-58.3,19.1-58.3,0,0-1.9-9.1-16.5-10.2s-18.2-2.8-18.2-2.8c0,0-4.6,12.6-18.5,12.6-13.9,0-18.5-12.6-18.5-12.6,0,0-.6,1.4-18.2,2.8s-16.5,10.2-16.5,10.2c0,0,16.7,37.5,19.1,58.3s1.5,50.7,1.5,50.7h65.2Z"/>
        <path d="M150.6,71.5c-1-3.9,13.9-36.3,13.9-36.3l15,54.1-19.5,6.8s-8.3-20.7-9.4-24.6Z"/>
      </g>
    </g>
  );
};
HautTshirt.zones = ["main"];
export default React.memo(HautTshirt);