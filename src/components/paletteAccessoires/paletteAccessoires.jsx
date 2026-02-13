import React, { useState, useEffect, useRef } from "react";
import { accessoiresPalette } from "./data/accessoiresData";

export default function PaletteAccessoires({ x, y, onAddAccessoire }) {

  return (
    <div style={styles.container} id="paletteAccessoires"
        style={{ position: "absolute", top: y, left: x, zIndex: 1000, transform: "translate(-50%, -50%)" }}>
      {accessoiresPalette.map((acc, index) => {
        const Component = acc.component;

        return (
          <div
            key={index}
            style={styles.item}
            onClick={() => onAddAccessoire(acc.type)}
            title={acc.type}
          >
            <Component width={50} height={50} />
          </div>
        );
      })}
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    gap: "8px",
    padding: "10px",
    background: "#fff0f6",
    borderRadius: "12px",
    border: "2px solid #ffb6d9"
  },

  item: {
    cursor: "pointer",
    padding: "6px",
    background: "white",
    borderRadius: "8px",
    border: "1px solid #ddd",
    transition: "transform 0.1s",
  }
};
