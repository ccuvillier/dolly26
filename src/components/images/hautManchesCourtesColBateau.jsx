import React from 'react';

const HautManchesCourtesColBateau = ({ color, width = 220, height = 195, onPickColor }) => {
    return (
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg"  
           width={width} height={height} viewBox="-10 0 220 195" className="svg"
           style={{ cursor: "pointer" }}
        >

        <path fill="#fff" d="M144.9,144.7c-2.3-11.8-4.8-20.7-4.7-36.3-1-17.4,10.3-45.1,10.3-45.1h.1c0-.1,24.6-9.9,24.6-10.5-.4-4-3.6-16.3-10.2-22.9-4-4.1-8.6-5.1-17.3-5.5-6.8,3-20,5.2-35.3,5.2s-28.6-2.1-35.3-5.2c-8.8.6-14.5.7-18.6,4.8-6.6,6.6-9.5,19.3-10.1,23.3,0,.4,22.6,10.7,22.6,10.7,0,0,10.2,30.1,9.6,46.7,0,18-1.7,22.8-3.8,34.6h68.2Z"/>
        </svg>
    );
};
export default HautManchesCourtesColBateau;