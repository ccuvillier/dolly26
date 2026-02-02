import React, { useState, useEffect } from "react";
import { tissus } from "./data/tissusData";
import { DEFAULT_TISSU } from "../../constants/defaultTissu";

export default function PaletteTissus({ x, y, tissu, onChange, onClose }) {

  //  State local pour l'UI du picker
  const [localTissu, setLocalTissu] = useState(tissu ?? DEFAULT_TISSU);

  // Synchronisation automatique avec le parent
  useEffect(() => {
    if (tissu) {
      setLocalTissu(prev => ({ ...prev, ...tissu }));
    }
  }, [tissu]);

  const [selectedName, setSelectedName] = useState(localTissu.name);

  useEffect(() => {
    setSelectedName(localTissu.name);
  }, [localTissu.name]);

  const selectedTissu = tissus.find(t => t.name === selectedName);


// Selection d’un nouveau tissu dans la palette
const handleSelectTissu = (t) => {
  const updated = { ...localTissu, ...t }; // merge sûr
  setLocalTissu(updated);
  onChange(updated); // parent fusionnera avec prev via applyTissu
};


// Modification d’un champ spécifique (size, hue, saturation, brightness)
const updateField = (field, value) => {
  const updated = { ...localTissu, [field]: value };
  setLocalTissu(updated);
  onChange(updated);
};

  return (
    <div className="palette-tissus"
      style={{ position: "fixed", top: y, left: x, zIndex: 1000 }}
      onClick={(e) => e.stopPropagation()}
    >
      <div>
        <h3>Choisir un tissu</h3>

        {/* --- Sélection du tissu --- */}
        <div className="tissus-list">
          {tissus.map(t => (
            <button
              key={t.name}
              className={`tissu-btn ${selectedName === t.name ? "active" : ""}`}
              onClick={() => handleSelectTissu(t)}
            >
              {t.preview ? <img src={t.preview} alt={t.label} /> : <span className="tissu-uni">Uni</span>}
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* --- Options spécifiques --- */}
        {selectedTissu && !selectedTissu.isUni && (
          <div className="tissu-options">
            <label>
              Taille du motif
              <input
                type="range"
                min="50"
                max="300"
                value={localTissu.size}
                onChange={e => updateField("size", Number(e.target.value))}
              />
            </label>

            <label>
              Teinte
              <input
                type="range"
                min="0"
                max="360"
                value={localTissu.hue}
                onChange={e => updateField("hue", Number(e.target.value))}
              />
            </label>

            <label>
              Saturation
              <input
                type="range"
                min="50"
                max="200"
                value={localTissu.saturation}
                onChange={e => updateField("saturation", Number(e.target.value))}
              />
            </label>

            <label>
              Luminosité
              <input
                type="range"
                min="50"
                max="150"
                value={localTissu.brightness}
                onChange={e => updateField("brightness", Number(e.target.value))}
              />
            </label>
          </div>
        )}

        {selectedTissu && selectedTissu.isUni && (
          <p>🎨 Couleur unie (color picker à brancher ici)</p>
        )}

        <button className="close" onClick={onClose}>Fermer</button>
      </div>
    </div>
  );
}
