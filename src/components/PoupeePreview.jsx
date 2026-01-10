import React, { useState } from "react";
import FilleNue from "./filleNue";
import { hairs } from "./CarouselCoiffuresData";

export default function PoupeePreview({ id, data, renommerPoupee }) {
const { peau, yeux, levres, cheveux, nomCoiffure } = data;
const coiffure = hairs.find(h => h.name === nomCoiffure);
const HairComponent = coiffure ? coiffure.component : null;
const [editing, setEditing] = useState(false);
const [nouveauPrenom, setNouveauPrenom] = useState(data.prenom); 

const handleRename = async () => {
    if (!nouveauPrenom) return;
    await renommerPoupee(data.prenom, nouveauPrenom);  // utilise la fonction passée en prop
    setEditing(false);
  };


  return (
    <div>
       
      {/* Corps */}
      <div>
        <FilleNue peau={peau} yeux={yeux} levres={levres} preview={true} />
      </div>

      {!editing ? (
        <h2 onClick={(e) => {
          e.stopPropagation();
          setEditing(true)
        }}>
          {data.prenom}</h2>
        ) : (
          <input
            type="text"
            value={nouveauPrenom}
            onChange={(e) => setNouveauPrenom(e.target.value)}
            onBlur={handleRename}
            onKeyDown={e => e.key === "Enter" && handleRename()}
            autoFocus
          />
        )}

       {/* Coiffure */}
      {HairComponent && (
        <div className="cheveuxPreview">
          <HairComponent color={cheveux} />
        </div>
      )}
    </div>
  );
}

