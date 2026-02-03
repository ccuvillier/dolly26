import React from "react";
import { tissus } from "./paletteTissus/data/tissusData";
import { DEFAULT_TISSU } from "../constants/defaultTissu";

const EnteteSvg = ({ tissu }) => {
  if (!tissu) return null;

  // Merge avec DEFAULT_TISSU pour s'assurer que tous les champs existent
  const mergedTissu = { ...DEFAULT_TISSU, ...tissu };

  // Si le tissu est uni, pas besoin de pattern
  if (mergedTissu.isUni) return null;

  // Cherche la référence dans le tableau tissus
  const tissuRef = tissus.find(t => t.name === mergedTissu.name);

// Génère un ID unique stable pour ce tissu
const patternId = `tissu-${mergedTissu.instanceId || mergedTissu.name}`;


  if (!tissuRef || !tissuRef.preview) {
    console.warn("Tissu non trouvé ou pas de preview :", mergedTissu.name);
    // fallback simple : carré blanc
    return (
      <defs>
        <pattern id={`fallback-${mergedTissu.name}`} width={mergedTissu.size} height={mergedTissu.size} patternUnits="userSpaceOnUse">
          <rect width={mergedTissu.size} height={mergedTissu.size} fill="#fff" />
        </pattern>
      </defs>
    );
  }



  return (
    <defs>
      <pattern
        id={patternId}
        patternUnits="userSpaceOnUse"
        width={mergedTissu.size}
        height={mergedTissu.size}
        style={{
            transofrmOrigin: "center",
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
    </defs>
  );
};

export default EnteteSvg;
