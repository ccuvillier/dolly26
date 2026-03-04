import React from 'react';
import EnteteSvg from "../../enteteSvg";
import { DEFAULT_TISSU } from "../../../constants/defaultTissu";

const NoeudPapillon = ({ accId, tissuAccessoire, onPickColor }) => {

    const mergedTissu = { ...DEFAULT_TISSU, ...tissuAccessoire };

    return (
        <g>
            <EnteteSvg tissu={tissuAccessoire} />

            <g fill={mergedTissu.isUni ? mergedTissu.color : `url(#tissu-${mergedTissu.instanceId})`}
                onClick={(e) => 
                    onPickColor && onPickColor(e, {
                        type:"tissu",
                        target: "accessoire",
                        id: accId,
                        value: tissuAccessoire
                    })
                }
            >
                <path d="M27.9,10.7c.2.2-.1,3.4-.7,4.7-1.7-.8-3.3-1.3-5.7-1.3-6.3,0-6.8,3.9-.2,3.3.4,0,5.4-.4,5.7.4.5,1.5.7,3.9.7,3.9,0,0-13.7,11-22.7,8.2C.6,28.7.4,24.5.8,20.4s.8-4,1.1-6c.4-3.6-.9-9.6.2-11.9S6.2.5,8.7.7c8.7.7,18.3,8.9,19.2,10Z"/>
                <path d="M31.5,24.8c0,0-.4,6.8-1.5,9.9-3.5,10.2-13.1,21.5-13.1,21.4,0-.7-1-7.1-1.8-8.1-1.4-1.6-7.8-.2-9.3-.3,2.3-1.8,7.9-11.2,12.1-15.6s10.5-8.1,10.6-8.2c.9.4,3,.8,3,.8Z"/>
                <path d="M37.4,10.7c-.2.2.1,3.4.7,4.7,1.7-.8,3.3-1.3,5.7-1.3,6.3,0,6.8,3.9.2,3.3-.4,0-5.4-.4-5.7.4-.5,1.5-.7,3.9-.7,3.9,0,0,13.7,11,22.7,8.2s4.5-5.5,4.1-9.5-.8-4-1.1-6c-.4-3.6.9-9.6-.2-11.9s-4.2-2-6.7-1.8c-8.7.7-18.3,8.9-19.2,10Z"/>
                <path d="M33.8,24.8c0,0,.4,6.8,1.5,9.9,3.5,10.2,13.1,21.5,13.1,21.4,0-.7,1-7.1,1.8-8.1,1.4-1.6,7.8-.2,9.3-.3-2.3-1.8-7.9-11.2-12.1-15.6s-10.5-8.1-10.6-8.2c-.9.4-3,.8-3,.8Z"/>
                <path d="M35.5,10.5c0,.5.4,8,0,10.6-.2,1.5-5.4,1.4-5.7.3-.6-2.7-.6-10.4-.6-10.8.1-1.4,6-1.8,6.3,0Z"/>
            </g>
        </g>
    );
};

export default React.memo(NoeudPapillon);