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
                <path d="M33.3,8.8c-11.6,0-21,9.4-21,21s9.4,21,21,21,21-9.4,21-21-9.4-21-21-21ZM33.3,32.8c-1.7,0-3-1.4-3-3s1.4-3,3-3,3,1.4,3,3-1.4,3-3,3Z"/>
            </g>
            <g className='notstroke'>
                <path fill='#fff' fillOpacity="0.75" d="M25.4,16.2h15.7s2.6-4.7,2.6-4.7c0,0-4.4-2.8-10.4-2.8s-10.7,2.9-10.7,2.9l2.8,4.5Z"/>
                <path fill='#fff' fillOpacity="0.5" d="M17.6,29.8l7.8-13.5-2.8-4.7s-4.5,2.4-7.6,7.5c-3,5-2.8,10.5-2.8,10.5h5.3Z"/>
                <path fill='#fff' fillOpacity="0.25" d="M25.3,43.5l-7.7-13.7h-5.3c0,0-.2,5.1,2.8,10.4s7.8,7.9,7.8,7.9l2.5-4.5Z"/>
                <path fill='#000' fillOpacity="0.5" d="M41,43.6h-15.7s-2.5,4.5-2.5,4.5c0,0,4.4,2.8,10.7,2.8s10.2-2.8,10.2-2.8l-2.7-4.4Z"/>
                <path fill='#000' fillOpacity="0.25" d="M49.2,30.2l-8.2,13.4,2.7,4.4s4.4-2.2,7.5-7.3c3.1-5.3,3.1-10.4,3.1-10.4h-5.1Z"/>
                <path fill='#fff' fillOpacity="0.25" d="M41.1,16.3l8.1,13.9h5.1c0,.1.3-5.4-2.6-10.7s-8-7.9-8-7.9l-2.6,4.7Z"/>
            </g>
          </g>
    );
};
export default React.memo(Sequin);