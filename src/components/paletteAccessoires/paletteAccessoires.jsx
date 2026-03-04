import React from "react";
import { accessoiresPalette } from "./data/accessoiresData";

export default function PaletteAccessoires({ onAddAccessoire, onClose }) {

  return (
    <div id="paletteAccessoires">
      <button className="close" onClick={onClose}>fermer</button>

      {accessoiresPalette.map((item, index) => {
        const Component = item.component;

        return (
          <div
            key={index}
            title={item.type}
            onClick={() => onAddAccessoire(item)}
          >
            <svg
              width={50}
              height={50}
              viewBox="0 0 800 800"
              className="svg"
            >
                <g transform="translate(-10 100) scale(12)">
                  <Component />
                </g>
            </svg>
          </div>
        );
      })}
    </div>
  );
}
