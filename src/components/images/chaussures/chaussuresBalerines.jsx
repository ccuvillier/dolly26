import React from 'react';

const ChaussuresBalerines = ({ color = "#fff", onPickColor }) => {

    return (
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg"  
           width="100%" viewBox="-344 -633 800 800" className="svg"
           style={{ cursor: "pointer" }}
      >


          <g fill={color} onClick={(e) => onPickColor && onPickColor(e)} style={{ pointerEvents: "all" }}>
            <path d="M43.1,132.7s2.8,11.8,12.1,11.8,9.8-12.9,9.8-12.9c0,0,10.4,28.2-8.7,28.7s-13.2-27.6-13.2-27.6Z"/>
            <path d="M92.3,132.7s-2.8,11.8-12.1,11.8-9.8-12.9-9.8-12.9c0,0-10.4,28.2,8.7,28.7,23.1.6,13.2-27.6,13.2-27.6Z"/>
          </g>
        </svg>
    );
};
export default React.memo(ChaussuresBalerines);