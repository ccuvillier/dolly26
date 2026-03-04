import React, { useState } from "react";
import FilleNue from "./filleNue";
import { hairs } from "./carousels/data/coiffuresData";
import { chaussures } from "./carousels/data/chaussuresData";
import { hauts } from "./carousels/data/hautsData";
import { bass } from "./carousels/data/bassData";
import Accessoire from "./paletteAccessoires/Accessoires.jsx";

export default function PoupeePreview({ id, data, renommerPoupee }) {
const { 
  peau, 
  yeux, 
  levres, 
  cheveux, 
  nomCoiffure, 
  chaussuresColor,
  nomChaussures,
  nomHaut, 
  nomBas,
  tissuHaut,
  tissuBas,
  //accessoires
  accessoires,
  selectedAccessoireId,
} = data;

const coiffure = hairs.find(h => h.name === nomCoiffure);
const HairComponent = coiffure ? coiffure.component : null;
const chaussuresData = chaussures.find(h => h.name === nomChaussures);
const ChaussuresComponent = chaussuresData ? chaussuresData.component : null;
const haut = hauts.find(h => h.name === nomHaut);
const HautComponent = haut ? haut.component : null;
const bas = bass.find(h => h.name === nomBas);
const BasComponent = bas ? bas.component : null;
const [editing, setEditing] = useState(false);
const [nouveauPrenom, setNouveauPrenom] = useState(data.prenom); 
  // ⚡ Ajouter instanceId pour chaque tissu
  const tissuHautWithId = { ...tissuHaut, instanceId: `${id}-haut` };
  const tissuBasWithId  = { ...tissuBas, instanceId: `${id}-bas` };

const handleRename = async () => {
    if (!nouveauPrenom) return;
    await renommerPoupee(data.prenom, nouveauPrenom);  // utilise la fonction passée en prop
    setEditing(false);
};



return (
    <div>
       
      <svg
        viewBox="0 0 800 800"
        width="100%"
        height="100%"
      >
        {/* Corps */}
        <FilleNue
          peau={peau}
          yeux={yeux}
          levres={levres}
          preview={true}
        />
        

        {/* Cheveux */}
        {HairComponent && (
          <HairComponent
            color={cheveux}
          />
        )}

        {/* Bas */}
        {BasComponent && (
          <BasComponent
            color={bas}
            tissuBas={tissuBasWithId}
          />
        )}

        {/* Haut */}
        {HautComponent && (
          <HautComponent
            color={haut}
            tissuHaut={tissuHautWithId}
          />
        )}

        {/* Chaussures */}
        {ChaussuresComponent && (
          <ChaussuresComponent
            color={chaussuresColor}
          />
        )}

        {/* Accessoires */}
        {accessoires?.map(acc => (
          <Accessoire
            key={acc.id}
            acc={acc}
            tissuAccessoire={acc.tissu}
            preview={true}
          />
        ))}

      </svg>

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

       
    </div>
  );
}

