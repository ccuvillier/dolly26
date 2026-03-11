import React from 'react';
import EnteteSvg from "../../enteteSvg";
import { DEFAULT_TISSU } from "../../../constants/defaultTissu";

const DentelleAnglaise = ({ accId, tissuAccessoire, onPickColor }) => {

    const mergedTissu = { ...DEFAULT_TISSU, ...tissuAccessoire };

    return (
          <g>
            <EnteteSvg tissu={tissuAccessoire} />

            <g className='notstroke' fill={mergedTissu.isUni ? mergedTissu.color : `url(#tissu-${mergedTissu.instanceId})`}
                onClick={(e) => 
                    onPickColor && onPickColor(e, {
                        type:"tissu",
                        target: "accessoire",
                        id: accId,
                        value: tissuAccessoire
                    })
                }>
                <path d="M6.2.7v29s2.9,26.6,27.3,26.6,26.1-27,26.1-27V.7H6.2ZM19.9,15.8c1.3-1.3,4-.6,6.1,1.5s2.8,4.8,1.5,6.1-4,.6-6.1-1.5-2.8-4.8-1.5-6.1ZM15.3,29.2c0-1.8,2.4-3.2,5.4-3.2s5.4,1.4,5.4,3.2-2.4,3.2-5.4,3.2-5.4-1.4-5.4-3.2ZM26.6,40.8c-2.1,2.1-4.8,2.8-6.1,1.5s-.6-4,1.5-6.1c2.1-2.1,4.8-2.8,6.1-1.5,1.3,1.3.6,4-1.5,6.1ZM33,9.9c1.8,0,3.2,2.4,3.2,5.4s-1.4,5.4-3.2,5.4-3.2-2.4-3.2-5.4,1.4-5.4,3.2-5.4ZM33,25.5c1.6,0,2.9,1.3,2.9,2.9s-1.3,2.9-2.9,2.9-2.9-1.3-2.9-2.9,1.3-2.9,2.9-2.9ZM33.4,47.2c-1.8,0-3.2-2.4-3.2-5.4s1.4-5.4,3.2-5.4,3.2,2.4,3.2,5.4-1.4,5.4-3.2,5.4ZM40,17c2.1-2.1,4.8-2.8,6.1-1.5,1.3,1.3.6,4-1.5,6.1s-4.8,2.8-6.1,1.5-.6-4,1.5-6.1ZM46.6,42.3c-1.3,1.3-4,.6-6.1-1.5s-2.8-4.8-1.5-6.1,4-.6,6.1,1.5,2.8,4.8,1.5,6.1ZM45.6,31.9c-3,0-5.4-1.4-5.4-3.2s2.4-3.2,5.4-3.2,5.4,1.4,5.4,3.2-2.4,3.2-5.4,3.2Z"/>
            </g>
            <g className='notfill'>
                <ellipse stroke='#000' cx="33" cy="15.3" rx="3.2" ry="5.4"/>
                <ellipse stroke='#000' cx="23.7" cy="19.6" rx="3.2" ry="5.4" transform="translate(-6.9 22.5) rotate(-45)"/>
                <ellipse stroke='#000' cx="20.7" cy="29.2" rx="5.4" ry="3.2"/>
                <ellipse stroke='#000' cx="24.4" cy="38.5" rx="5.4" ry="3.2" transform="translate(-20.1 28.5) rotate(-45)"/>
                <ellipse stroke='#000' cx="45.6" cy="28.7" rx="5.4" ry="3.2"/>
                <ellipse stroke='#000' cx="42.3" cy="19.3" rx="5.4" ry="3.2" transform="translate(-1.2 35.5) rotate(-45)"/>
                <ellipse stroke='#000' cx="33.4" cy="41.8" rx="3.2" ry="5.4"/>
                <ellipse stroke='#000' cx="42.8" cy="38.5" rx="3.2" ry="5.4" transform="translate(-14.6 41.6) rotate(-45)"/>
                <circle stroke='#000' cx="33" cy="28.4" r="2.9"/>
                <path stroke='#000' d="M59.4,1.1H6M6,30.1s2.9,26.6,27.3,26.6,26.1-27,26.1-27"/>
            </g>
          </g>
    );
};
export default React.memo(DentelleAnglaise);