// EnteteSvg.jsx
import React from "react";
import { tissus } from "./paletteTissus/data/tissusData";

const EnteteSvg = ({ tissu }) => {
    if (!tissu || tissu.isUni) return null;

  //console.log("EnteteSvg → tissu actif :", tissu);
  return (
    <defs>
      {tissus
        .filter(t => !t.isUni) // on ne crée des patterns que pour les motifs
        .map(t => (
          <pattern
            key={t.name}
            id={t.name}
            patternUnits="userSpaceOnUse"
            width={t.size}
            height={t.size}
          >
            <image
              href={t.preview}
              width={t.size}
              height={t.size}
              style={{
                filter: `
                  hue-rotate(${t.hue}deg)
                  saturate(${t.saturation}%)
                  brightness(${t.brightness}%)
                `
              }}
            />
          </pattern>
        ))}
    </defs>
  );
};

export default EnteteSvg;
