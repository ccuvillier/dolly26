import React from "react";
import FilleNue from "./FilleNue.jsx";

function Poupee({ peau, yeux, levres, openPicker }) {
  return (
    <div id="poupee">
      <FilleNue
        peau={peau}
        yeux={yeux}
        levres={levres}
        openPicker={openPicker}
      />
    </div>
  );
}

export default Poupee;
