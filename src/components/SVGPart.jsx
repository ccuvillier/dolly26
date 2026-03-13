import React from "react";

export default function SVGPart({
  type,             // "haut" | "bas" | "chaussures" | "cheveux"
  component,        // le composant SVG réel
  zones = [],       // tableau des zones à colorer (pour haut/bas)
  tissusZones = {}, // objet global des tissus { "haut-zone1": { ... }, "bas-zone2": { ... } }
  color,            // couleur pour cheveux ou chaussures
  onClickTissu,     // callback quand on clique sur une zone
  onClickColor      // callback quand on clique sur la couleur simple
}) {
  if (!component) return null; // rien à rendre si pas de composant

  const handleClick = (zone) => {
    if (onClickTissu && zone) onClickTissu(zone);
    else if (onClickColor) onClickColor();
  };

  // Construire les props selon type
  let props = {};
  if (zones.length) {
    // c'est un vêtement avec zones à colorer
    props.tissus = zones.reduce((acc, zone) => {
      acc[zone] = tissusZones[`${type}-${zone}`] ?? null;
      return acc;
    }, {});
  } else if (color) {
    props.color = color;
  }

  return (
    <g
      style={{ cursor: "pointer", pointerEvents: "all" }}
      onMouseDown={(e) => {
        e.stopPropagation();
        const zone = e.target.closest("[data-zone]")?.dataset.zone;
        handleClick(zone);
      }}
    >
      {React.createElement(component, props)}
    </g>
  );
}