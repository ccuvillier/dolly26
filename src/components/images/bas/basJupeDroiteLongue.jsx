import React from 'react';
import EnteteSvg from "../../enteteSvg";

const BasJupeDroiteLongue = ({ tissus = {}, onZoneClick = () => {} }) => {

     const getFill = (zone) => {
        const tissu = tissus?.[zone]

        if (!tissu) return "#fff"

        return tissu.isUni
            ? tissu.color
            : `url(#tissu-${tissu.instanceId})`
    }

    return (
        <g transform="translate(171 372)" className='svg'>
            <EnteteSvg tissus={tissus} />

            <g data-zone="zone1" fill={getFill("zone1")} onMouseDown={() => onZoneClick("zone1")}>
                <path d="M275.3,7.3c6.3,14.8,17.6,37.5,20.8,63.2,1.8,15.2,10.4,240.5,10.4,240.5,0,0-27.6,5.8-49.4-10.2-38.5-28.4.7-293.5.7-293.5h17.5Z"/>
                <path d="M204.2,7.3c-5.6,11.5-18,37.6-21.2,63.2-1.8,15.2-11.9,240.5-11.9,240.5,0,0,57.5,4.3,82.2-45.7,24.7-50,11.3-258,11.3-258h-60.4Z"/>
                <polygon points="203.9 7.3 205.7 .2 274.1 .7 275.5 7.3 203.9 7.3"/>
            </g>
            
            <path data-zone="zone2" fill={getFill("zone2")} onMouseDown={() => onZoneClick("zone2")} d="M170.8,311.1s57.5,4.3,82.2-45.7c24.7-50,11.3-258,11.3-258h-11.1s-.6,165-8.4,224.6-72.6,60.8-72.6,60.8l-1.4,18.4Z"/>

            
            
        </g>
    );
};

export default React.memo(BasJupeDroiteLongue);