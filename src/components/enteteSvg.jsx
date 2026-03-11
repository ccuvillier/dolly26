import React from "react";
import { tissus as tissusRefs } from "./paletteTissus/data/tissusData.js";
import { DEFAULT_TISSU } from "../constants/defaultTissu";

const EnteteSvg = ({ tissus }) => {
  if (!tissus) return null;

  return (
    <defs>
      {Object.values(tissus).map((tissu, index) => {

        const mergedTissu = { ...DEFAULT_TISSU, ...tissu };

        if (mergedTissu.isUni) return null;

        const tissuRef = tissusRefs.find(t => t.name === mergedTissu.name);

        const patternId = `tissu-${mergedTissu.instanceId || mergedTissu.name}`;

        if (!tissuRef || !tissuRef.preview) {
          console.warn("Tissu non trouvé ou pas de preview :", mergedTissu.name);

          return (
            <pattern
              key={index}
              id={`fallback-${mergedTissu.name}`}
              width={mergedTissu.size}
              height={mergedTissu.size}
              patternUnits="userSpaceOnUse"
            >
              <rect
                width={mergedTissu.size}
                height={mergedTissu.size}
                fill="#fff"
              />
            </pattern>
          );
        }

        return (
          <pattern
            key={patternId}
            id={patternId}
            patternUnits="userSpaceOnUse"
            width={mergedTissu.size}
            height={mergedTissu.size}
            style={{
              transformOrigin: "center",
              transform: `rotate(${mergedTissu.rotation}deg)`
            }}
          >
            <image
              href={tissuRef.preview}
              width={mergedTissu.size}
              height={mergedTissu.size}
              style={{
                filter: `
                  hue-rotate(${mergedTissu.hue}deg)
                  saturate(${mergedTissu.saturation}%)
                  brightness(${mergedTissu.brightness}%)
                `
              }}
            />
          </pattern>
        );
      })}
    </defs>
  );
};

export default EnteteSvg;