import React, { useState } from "react";
import FilleNue from "./filleNue";
import { hairs } from "./carousels/data/CarouselCoiffuresData";
import { hauts } from "./carousels/data/CarouselHautsData";
import { bass } from "./carousels/data/CarouselBasData";

export default function PoupeePreview({ id, data, renommerPoupee }) {
const { 
  peau, 
  yeux, 
  levres, 
  cheveux, 
  nomCoiffure, 
  nomHaut, 
  nomBas,
  tissuHaut,
  tissuBas 
} = data;

const coiffure = hairs.find(h => h.name === nomCoiffure);
const HairComponent = coiffure ? coiffure.component : null;
const haut = hauts.find(h => h.name === nomHaut);
const HautComponent = haut ? haut.component : null;
const bas = bass.find(h => h.name === nomBas);
const BasComponent = bas ? bas.component : null;
const [editing, setEditing] = useState(false);
const [nouveauPrenom, setNouveauPrenom] = useState(data.prenom); 

const handleRename = async () => {
    if (!nouveauPrenom) return;
    await renommerPoupee(data.prenom, nouveauPrenom);  // utilise la fonction passée en prop
    setEditing(false);
};
console.log("Preview tissuHaut :", tissuHaut);


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
      

       {/* Haut */}
      {HautComponent && (
        <div className="hautPreview">
          <HautComponent color={haut} tissuHaut={tissuHaut} />
        </div>
      )}
      

       {/* Bas */}
      {BasComponent && (
        <div className="basPreview">
          <BasComponent color={bas} tissuBas={tissuBas} />
        </div>
      )}
    </div>
  );
}

