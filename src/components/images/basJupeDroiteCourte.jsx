import React from 'react';

const BasJupeDroiteCourte = ({ color, width = 400, height = 400, onPickColor }) => {
    return (
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg"  
           width={width} height={height} viewBox="27 0 400 400" className="svg"
           style={{ cursor: "pointer" }}
        >
        <path fill="#fff" d="M204.2.4c-4,20.1-15.5,37.3-18.6,62.9-1.8,15.2,6.5,118.3,6.5,118.3h91.5s9.7-103.1,7.9-118.3c-3.1-25.7-14.9-42.9-19.1-62.9h-68.2Z"/>
        </svg>
    );
};
export default BasJupeDroiteCourte;