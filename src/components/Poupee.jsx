import React from "react";
import FilleNue from "./FilleNue.jsx";

function Poupee({ peau, yeux, levres, openColorPicker }) {
  return (
    <div id="poupee">
      <FilleNue
        peau={peau}
        yeux={yeux}
        levres={levres}
        openColorPicker={openColorPicker}
      />
    </div>
  );
}

export default Poupee;
