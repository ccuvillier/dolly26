import React from 'react';
import EnteteSvg from "../../enteteSvg";
import { DEFAULT_TISSU } from "../../../constants/defaultTissu";

const BasJupeDroiteCourte = ({ tissuBas }) => {

    const mergedTissu = { ...DEFAULT_TISSU, ...tissuBas };

    return (
        <g transform="translate(174 370)" className='svg'>
            <EnteteSvg tissu={tissuBas} />
            <g>
                <path fill={mergedTissu.isUni ? mergedTissu.color : `url(#tissu-${mergedTissu.instanceId})`} 
                    d="M204.2.4c-4,20.1-15.5,37.3-18.6,62.9-1.8,15.2,6.5,118.3,6.5,118.3h91.5s9.7-103.1,7.9-118.3c-3.1-25.7-14.9-42.9-19.1-62.9h-68.2Z"/>
                
            </g>
        </g>
    );
};
export default React.memo(BasJupeDroiteCourte);