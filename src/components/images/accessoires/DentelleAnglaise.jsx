import React from 'react';
import EnteteSvg from "../../enteteSvg";

const DentelleAnglaise = ({ accId, tissuAccessoire, onPickColor }) => {

    const getFill = (tissu) => {
        if (!tissu) return "#fff"
        return tissu.isUni
            ? tissu.color
            : `url(#tissu-${tissu.instanceId})`
    }

    return (
          <g>
            <EnteteSvg tissus={{ main: tissuAccessoire }} />

            <g className='notstroke' fill={getFill(tissuAccessoire)} onClick={(e) => onPickColor?.(e, accId)}>
                <path d="M.7.7v29s2.9,26.6,27.3,26.6,26.1-27,26.1-27V.7H.7ZM14.4,15.8c1.3-1.3,4-.6,6.1,1.5,2.1,2.1,2.8,4.8,1.5,6.1s-4,.6-6.1-1.5-2.8-4.8-1.5-6.1ZM9.8,29.2c0-1.8,2.4-3.2,5.4-3.2s5.4,1.4,5.4,3.2-2.4,3.2-5.4,3.2-5.4-1.4-5.4-3.2ZM21.1,40.8c-2.1,2.1-4.8,2.8-6.1,1.5s-.6-4,1.5-6.1,4.8-2.8,6.1-1.5c1.3,1.3.6,4-1.5,6.1ZM27.5,9.9c1.8,0,3.2,2.4,3.2,5.4s-1.4,5.4-3.2,5.4-3.2-2.4-3.2-5.4,1.4-5.4,3.2-5.4ZM27.5,25.5c1.6,0,2.9,1.3,2.9,2.9s-1.3,2.9-2.9,2.9-2.9-1.3-2.9-2.9,1.3-2.9,2.9-2.9ZM27.9,47.2c-1.8,0-3.2-2.4-3.2-5.4s1.4-5.4,3.2-5.4,3.2,2.4,3.2,5.4-1.4,5.4-3.2,5.4ZM34.5,17c2.1-2.1,4.8-2.8,6.1-1.5,1.3,1.3.6,4-1.5,6.1s-4.8,2.8-6.1,1.5-.6-4,1.5-6.1ZM41.1,42.3c-1.3,1.3-4,.6-6.1-1.5s-2.8-4.8-1.5-6.1,4-.6,6.1,1.5,2.8,4.8,1.5,6.1ZM40.1,31.9c-3,0-5.4-1.4-5.4-3.2s2.4-3.2,5.4-3.2,5.4,1.4,5.4,3.2-2.4,3.2-5.4,3.2Z"/>
            </g>
            <g className='notfill'>
                <ellipse stroke='#000' cx="27.5" cy="15.3" rx="3.2" ry="5.4"/>
                <ellipse stroke='#000' cx="18.2" cy="19.6" rx="3.2" ry="5.4" transform="translate(-8.5 18.6) rotate(-45)"/>
                <ellipse stroke='#000' cx="15.2" cy="29.2" rx="5.4" ry="3.2"/>
                <ellipse stroke='#000' cx="18.8" cy="38.5" rx="5.4" ry="3.2" transform="translate(-21.7 24.6) rotate(-45)"/>
                <ellipse stroke='#000' cx="40.1" cy="28.7" rx="5.4" ry="3.2"/>
                <ellipse stroke='#000' cx="36.8" cy="19.2" rx="5.4" ry="3.2" transform="translate(-2.8 31.7) rotate(-45)"/>
                <ellipse stroke='#000' cx="27.9" cy="41.8" rx="3.2" ry="5.4"/>
                <ellipse stroke='#000' cx="37.4" cy="38.6" rx="3.2" ry="5.4" transform="translate(-16.3 37.7) rotate(-45)"/>
                <circle stroke='#000' cx="27.5" cy="28.4" r="2.9"/>
                <path stroke='#000' d="M53.9,1.1H.5M.5,30.1s2.9,26.6,27.3,26.6,26.1-27,26.1-27"/>
            </g>
          </g>
    );
};
export default React.memo(DentelleAnglaise);