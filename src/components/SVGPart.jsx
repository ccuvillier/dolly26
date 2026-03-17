import React from "react";

export default function SVGPart({
  type,             // "haut" | "bas" | "chaussures" | "cheveux"
  component,        // le composant SVG réel
  zones = [],       // tableau des zones à colorer (pour haut/bas)
  tissusZones = {}, // objet global des tissus { "haut-zone1": { ... }, "bas-zone2": { ... } }
  color,            // couleur pour cheveux ou chaussures
  onMouseDown
}) {
  if (!component) return null; // rien à rendre si pas de composant

  // Construire les props selon type
  const props = {};

  if (zones.length) {
    props.tissus = zones.reduce((acc, zone) => {
      acc[zone] = tissusZones[`${type}-${zone}`] ?? null;
      return acc;
    }, {});
  }

  if (color) props.color = color;

  //const clickHandler = onClickTissu || onClickColor;

  return (
    <g
      style={{ cursor: "pointer", pointerEvents: "all" }}
      onMouseDown={onMouseDown}
    >
      {React.createElement(component, props)}
    </g>
  );
}