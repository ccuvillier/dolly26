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
            <Component width={50} height={50} />
          </div>
        );
      })}
    </div>
  );
}
