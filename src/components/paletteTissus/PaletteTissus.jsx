import React, { useState, useEffect, useRef } from "react";
import { tissus } from "./data/tissusData.js";
import { DEFAULT_TISSU } from "../../constants/defaultTissu";
import ColorfulPickerBase from "../../ColorfulPickerBase";
import { useDraggable } from "../../hooks/useDraggable";

export default function PaletteTissus({ x, y, id, tissu, onChange, onClose, openPicker, picker }) {

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


  const colorInputRef = useRef(null);

  // Selection d’un nouveau tissu dans la palette
  const handleSelectTissu = (t) => {
    const updated = { ...localTissu, ...t }; 
    setLocalTissu(updated);
    setSelectedName(t.name);
    onChange(updated, picker.id); 

      // si tissu uni, ouvrir le color picker
    if (t.isUni && colorInputRef.current) {
      colorInputRef.current.click();
    }
  };


  // Modification d’un champ spécifique (size, hue, saturation, brightness)
  const updateField = (field, value) => {
    const updated = { ...localTissu, [field]: value };
    setLocalTissu(updated);
    onChange(updated, picker.id);
  };




  /* PALETTE TISSU DRAGGABLE */ 
  const { position, dragging, bindHeader } = useDraggable({
    x: picker?.x ?? x,
    y: picker?.y ?? y,
  });

  return (
    <div className={`palette-tissus ${picker.positionClass ?? "top"}`}
      style={{ position: "fixed", top: position.y, left: position.x, zIndex: 1000 }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="palette-header" 
         {...bindHeader}
          style={{
            cursor: dragging ? "grabbing" : "grab",
            userSelect: "none",
            touchAction: "none",
          }}
        >
        <span>Déplacer la palette</span>
      </div>

      <div className="palette-body">
        <h3>Choisir un tissu</h3>

        {/* --- Sélection du tissu --- */}
        <div className="tissus-list">
          {tissus.map(t => (
            <button
              key={t.name}
              className={`tissu-btn ${localTissu.name === t.name ? "active" : ""}`}
              onClick={() => handleSelectTissu(t)}
            >
              {t.preview ? (
                <img src={t.preview} alt={t.label} />
              ) : (
                <span className="tissu-uni">Uni</span>
              )}
              {/*<span>{t.label}</span>*/}
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
                min="0"
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
                max="200"
                value={localTissu.brightness}
                onChange={e => updateField("brightness", Number(e.target.value))}
              />
            </label>

            <label>
              Rotation
              <input
                type="range"
                min="0"
                max="360"
                value={localTissu.rotation}
                onChange={e => updateField("rotation", Number(e.target.value))}
              />
            </label>
          </div>
        )}

        {selectedTissu && selectedTissu.isUni && (
          <div className="tissu-options">
            <ColorfulPickerBase
              color={localTissu.color}
              onChange={(color) => updateField("color", color)}
            />
          </div>
        )}

        <button className="close" onClick={onClose}>Fermer</button>
      </div>
    </div>
  );
}
