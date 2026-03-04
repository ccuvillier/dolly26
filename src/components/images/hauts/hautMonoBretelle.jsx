import React from 'react';
import EnteteSvg from "../../EnteteSvg";
import { DEFAULT_TISSU } from "../../../constants/defaultTissu";

const HautMonoBretelle = ({ tissuHaut }) => {

    const mergedTissu = { ...DEFAULT_TISSU, ...tissuHaut };

    return (
      <g transform="translate(300 230)" className='svg'>
        <EnteteSvg tissu={tissuHaut} />
        
        <g>
          <path fill={mergedTissu.isUni ? mergedTissu.color : `url(#tissu-${mergedTissu.instanceId})`}
            d="M84,23.4s6.6,18,29,26.7c22.4,8.7,36.2,9.6,36.2,9.6,0,0-11.3,29.5-8.6,55.7,2.1,20.8,3.5,29,3.5,29h-67.2s4.1-14.3,4.2-31.4c.3-24.7-8.4-52.2-8.4-52.2,0,0,4.1-3.1,4.2-12.4s-3-23.9-3-23.9l10.1-1.1Z"/>
        </g>
      </g>
    );
};
export default React.memo(HautMonoBretelle);