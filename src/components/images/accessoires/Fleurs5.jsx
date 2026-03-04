import React from 'react';
import EnteteSvg from "../../enteteSvg";
import { DEFAULT_TISSU } from "../../../constants/defaultTissu";

const Fleurs5 = ({ accId, tissuAccessoire, onPickColor }) => {

    const mergedTissu = { ...DEFAULT_TISSU, ...tissuAccessoire };

    return (
          <g>
            <EnteteSvg tissu={tissuAccessoire} />

            <path fill={mergedTissu.isUni ? mergedTissu.color : `url(#tissu-${mergedTissu.instanceId})`}
                onClick={(e) => 
                    onPickColor && onPickColor(e, {
                        type:"tissu",
                        target: "accessoire",
                        id: accId,
                        value: tissuAccessoire
                    })
                } 
            d="M60.6,26.6c-1-10.9-8.1-10.3-12.7-8.5-3.7,1.5-7.4,4.1-8.7,5.1,1.6-1.2,6.7-5.2,8.6-8,2.3-3.3,3-10.9-7.4-13.9s-12.6,3.7-12.6,8.6,1.9,10.5,1.9,10.5c0,0-3-7.9-5.7-10.9-2.7-3-9.8-5.6-15.3,3.8-5.5,9.4.5,13.1,5.3,14.3,2.2.6,4.6.8,6.6.8-2.7.1-6.2.4-8.3,1.1-3.8,1.3-8.9,6.9-2.3,15.6,6.6,8.7,12.3,4.5,15.2.5,2.2-3,3.6-6.8,4.2-8.5-.7,2.3-2.4,8-2.2,11.2.2,4,4.2,10.5,14.3,6.6,10.2-3.9,7.8-10.6,4.8-14.5-3-3.9-7.5-7.3-7.5-7.3,0,0,7.5,4.6,11.4,5.5,3.9.9,11.2-1.2,10.2-12ZM32.5,35c-3.5,0-6.4-2.9-6.4-6.4s2.9-6.4,6.4-6.4,6.4,2.9,6.4,6.4-2.9,6.4-6.4,6.4Z"/>
          </g>
    );
};

export default React.memo(Fleurs5);