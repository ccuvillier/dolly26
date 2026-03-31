import React, { useRef, useState, useEffect } from "react";
import { accessoiresPalette } from "./data/accessoiresData";
import CenteredSVG from "./CenteredSVG";
import { useDraggable } from "../../hooks/useDraggable";

export default function PaletteAccessoires({ onAddAccessoire, onClose }) {

    /* PALETTE TISSU DRAGGABLE */ 
    const { position, dragging, bindHeader } = useDraggable({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2
    });


  return (
    <div id="paletteAccessoires"
      style={{ top: position.y, left: position.x }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="palette-acc-header" 
         {...bindHeader}
          style={{
            cursor: dragging ? "grabbing" : "grab",
            userSelect: "none",
            touchAction: "none",
          }}
        >
        {/*<span>Déplacer la palette</span>*/}
      </div>
      
      <button className="close" onClick={onClose}>fermer</button>

      <div className="palette-acc-body">
        {accessoiresPalette.map((item, index) => {
          const Component = item.component;


          return (
            <div
              key={index}
              title={item.type}
              onClick={() => onAddAccessoire(item)}
            >
              <CenteredSVG Component={Component} size={60} />
            </div>
          );
        })}
        </div>
    </div>
  );
}
