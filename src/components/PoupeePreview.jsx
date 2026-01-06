import React from "react";
import FilleNue from "./filleNue";
import { hairs } from "./CarouselCoiffuresData";

export default function PoupeePreview({ id, data }) {
const { peau, yeux, levres, cheveux, nomCoiffure } = data;
const coiffure = hairs.find(h => h.name === nomCoiffure);
const HairComponent = coiffure ? coiffure.component : null;

  return (
    <div>
       
      {/* Corps */}
      <div>
        <FilleNue peau={peau} yeux={yeux} levres={levres} preview={true} />
      </div>

      <h2>{id}</h2>

       {/* Coiffure */}
      {HairComponent && (
        <div className="cheveuxPreview">
          <HairComponent color={cheveux} />
        </div>
      )}
    </div>
  );
}

