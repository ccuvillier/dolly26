import React from "react";
import FilleNue from "./FilleNue.jsx";

function Poupee({ peau, yeux, openColorPicker }) {
  return (
    <div id="poupee">
      <FilleNue
        peau={peau}
        yeux={yeux}
        openColorPicker={openColorPicker}
      />
    </div>
  );
}

export default Poupee;
