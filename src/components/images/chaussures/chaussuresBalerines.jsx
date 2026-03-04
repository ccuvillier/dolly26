import React from 'react';

const ChaussuresBalerines = ({ color = "#fff" }) => {

    return (
        <g transform="translate(344 633)" className='svg'>
          <g fill={color}>
            <path d="M43.1,132.7s2.8,11.8,12.1,11.8,9.8-12.9,9.8-12.9c0,0,10.4,28.2-8.7,28.7s-13.2-27.6-13.2-27.6Z"/>
            <path d="M92.3,132.7s-2.8,11.8-12.1,11.8-9.8-12.9-9.8-12.9c0,0-10.4,28.2,8.7,28.7,23.1.6,13.2-27.6,13.2-27.6Z"/>
          </g>
        </g>
    );
};
export default React.memo(ChaussuresBalerines);