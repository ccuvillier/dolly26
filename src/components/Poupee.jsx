import React from "react";
import FilleNue from "./FilleNue.jsx";

function Poupee({ peau, yeux, onPickColor }) {
  return (
    <div id="poupee">
      <FilleNue
        peau={peau}
        yeux={yeux}
        onPickColor={onPickColor}
      />
    </div>
  );
}

export default Poupee;
