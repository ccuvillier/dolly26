import React from 'react';
import EnteteSvg from "../../EnteteSvg";
import { DEFAULT_TISSU } from "../../../constants/defaultTissu";

const HautManchesCourtesColBateau = ({ tissus = {}, onZoneClick = () => {} }) => {

    const getFill = (zone) => {
        const tissu = tissus?.[zone]

        if (!tissu) return "#fff"

        return tissu.isUni
            ? tissu.color
            : `url(#tissu-${tissu.instanceId})`
    }

    return (
        <g transform="translate(302 229)" className='svg'>
            <EnteteSvg tissus={tissus} />

            <path data-zone="zone1" fill={getFill("zone1")} onMouseDown={() => onZoneClick("zone1")}
            d="M144.9,144.7c-2.3-11.8-4.8-20.7-4.7-36.3-1-17.4,10.3-45.1,10.3-45.1h.1c0-.1,24.6-9.9,24.6-10.5-.4-4-3.6-16.3-10.2-22.9-4-4.1-8.6-5.1-17.3-5.5-6.8,3-20,5.2-35.3,5.2s-28.6-2.1-35.3-5.2c-8.8.6-14.5.7-18.6,4.8-6.6,6.6-9.5,19.3-10.1,23.3,0,.4,22.6,10.7,22.6,10.7,0,0,10.2,30.1,9.6,46.7,0,18-1.7,22.8-3.8,34.6h68.2Z"/>
        </g>
    );
};

export default React.memo(HautManchesCourtesColBateau);