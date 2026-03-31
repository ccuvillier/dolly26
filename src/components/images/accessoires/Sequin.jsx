import React from 'react';
import EnteteSvg from "../../enteteSvg";

const Sequin = ({ accId, tissuAccessoire, onPickColor }) => {

    const getFill = (tissu) => {
        if (!tissu) return "#000"
        return tissu.isUni
            ? tissu.color
            : `url(#tissu-${tissu.instanceId})`
    }

    return (
          <g>
            <EnteteSvg tissus={{ main: tissuAccessoire }} />

            <g className='notstroke' fill={getFill(tissuAccessoire)} onClick={(e) => onPickColor?.(e, accId)}>
                <path d="M21.2.4C9.6.4.2,9.8.2,21.4s9.4,21,21,21,21-9.4,21-21S32.8.4,21.2.4ZM21.2,24.4c-1.7,0-3-1.4-3-3s1.4-3,3-3,3,1.4,3,3-1.4,3-3,3Z"/>
            </g>
            <g className='notstroke'>
                <path fill='#fff' fillOpacity="0.75" d="M13.3,7.8h15.7l2.6-4.7S27.2.3,21.2.3s-10.7,2.9-10.7,2.9l2.8,4.5h0Z"/>
                <path fill='#fff' fillOpacity="0.5" d="M5.5,21.4l7.8-13.5-2.8-4.7s-4.5,2.4-7.6,7.5C0,15.7.1,21.2.1,21.2h5.3v.2Z"/>
                <path fill='#fff' fillOpacity="0.25" d="M13.2,35.1l-7.7-13.7H.2S0,26.5,3,31.8s7.8,7.9,7.8,7.9l2.5-4.5h0Z"/>
                <path fill='#000' fillOpacity="0.5" d="M28.9,35.2h-15.7l-2.5,4.5s4.4,2.8,10.7,2.8,10.2-2.8,10.2-2.8l-2.7-4.4h0Z"/>
                <path fill='#000' fillOpacity="0.25" d="M37.1,21.8l-8.2,13.4,2.7,4.4s4.4-2.2,7.5-7.3c3.1-5.3,3.1-10.4,3.1-10.4h-5.1Z"/>
                <path fill='#fff' fillOpacity="0.25" d="M29,7.9l8.1,13.9h5.1c0,.1.3-5.4-2.6-10.7s-8-7.9-8-7.9l-2.6,4.7Z"/>
            </g>
          </g>
    );
};
export default React.memo(Sequin);