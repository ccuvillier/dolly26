import React from 'react';
import EnteteSvg from "../../enteteSvg";
import { DEFAULT_TISSU } from "../../../constants/defaultTissu";

const Perles = ({ accId, tissuAccessoire, onPickColor }) => {

    const mergedTissu = { ...DEFAULT_TISSU, ...tissuAccessoire };

    return (
        <g transform="translate(-6 0)">
            <EnteteSvg tissu={tissuAccessoire} />

            <g fill={mergedTissu.isUni ? mergedTissu.color : `url(#tissu-${mergedTissu.instanceId})`}
                onClick={(e) => 
                    onPickColor && onPickColor(e, {
                        type:"tissu",
                        target: "accessoire",
                        id: accId,
                        value: tissuAccessoire
                    })
                }
            >
            <circle cx="33.2" cy="7.3" r="6"/>
            <circle cx="33.2" cy="19.4" r="6"/>
            <circle cx="33.2" cy="40.7" r="15.1"/>
            </g>
            <path className="relief" d="M43.6,34.5s-1.8,7.5-5.9,11.2-11.1,4.8-11.1,4.8c0,0,6.9,5.4,14.6-1.1,7.1-5.9,2.5-15,2.5-15Z"/>
      </g> 
    );
};

Perles.zones = ["main"];
export default React.memo(Perles);