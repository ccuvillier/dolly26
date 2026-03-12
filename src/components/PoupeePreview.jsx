import React, { useState, useMemo } from "react";
import FilleNue from "./FilleNue";
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
    accessoires,
    prenom
  } = data;

  const [editing, setEditing] = useState(false);
  const [nouveauPrenom, setNouveauPrenom] = useState(prenom);

  // 🔹 Lookup maps pour composants
  const hairMap = useMemo(() => Object.fromEntries(hairs.map(h => [h.name, h.component])), []);
  const chaussuresMap = useMemo(() => Object.fromEntries(chaussures.map(c => [c.name, c.component])), []);
  const hautsMap = useMemo(() => Object.fromEntries(hauts.map(h => [h.name, h.component])), []);
  const bassMap = useMemo(() => Object.fromEntries(bass.map(b => [b.name, b.component])), []);

  const HairComponent = hairMap[nomCoiffure];
  const ChaussuresComponent = chaussuresMap[nomChaussures];
  const HautComponent = hautsMap[nomHaut];
  const BasComponent = bassMap[nomBas];

  // 🔹 Ajouter instanceId à chaque zone de tissu
  const buildTissusWithId = (tissus, type) =>
    tissus
      ? Object.fromEntries(
          Object.entries(tissus).map(([zone, t]) => [zone, { ...t, instanceId: `${id}-${type}-${zone}` }])
        )
      : {};

  const tissuHautWithId = buildTissusWithId(tissuHaut, "haut");
  const tissuBasWithId = buildTissusWithId(tissuBas, "bas");

  // 🔹 Gestion du renommage
  const handleRename = async () => {
    if (!nouveauPrenom) return;
    await renommerPoupee(prenom, nouveauPrenom);
    setEditing(false);
  };

  return (
    <div>
      <svg viewBox="0 0 800 800" width="100%" height="100%">
        {/* Corps */}
        <FilleNue peau={peau} yeux={yeux} levres={levres} preview={true} />

        {/* Cheveux */}
        {HairComponent && <HairComponent color={cheveux} />}

        {/* Bas */}
        {BasComponent && <BasComponent color={nomBas} tissus={tissuBasWithId} />}

        {/* Haut */}
        {HautComponent && <HautComponent color={nomHaut} tissus={tissuHautWithId} />}

        {/* Chaussures */}
        {ChaussuresComponent && <ChaussuresComponent color={chaussuresColor} />}

        {/* Accessoires */}
        {accessoires?.map(acc => (
          <Accessoire key={acc.id} acc={acc} tissuAccessoire={acc.tissu} preview={true} />
        ))}
      </svg>

      {/* Nom de la poupée */}
      {!editing ? (
        <h2 onClick={e => { e.stopPropagation(); setEditing(true); }}>
          {prenom}
        </h2>
      ) : (
        <input
          type="text"
          value={nouveauPrenom}
          onChange={e => setNouveauPrenom(e.target.value)}
          onBlur={handleRename}
          onKeyDown={e => e.key === "Enter" && handleRename()}
          autoFocus
        />
      )}
    </div>
  );
}