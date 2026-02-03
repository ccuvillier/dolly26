import React, { useState, useEffect, useRef } from "react";
import { tissus } from "./data/tissusData";
import { DEFAULT_TISSU } from "../../constants/defaultTissu";

export default function PaletteTissus({ x, y, tissu, onChange, onClose, openPicker }) {

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
    onChange(updated); 

      // si tissu uni, ouvrir le color picker
    if (t.isUni && colorInputRef.current) {
      colorInputRef.current.click();
    }
  };


  // Modification d’un champ spécifique (size, hue, saturation, brightness)
  const updateField = (field, value) => {
    const updated = { ...localTissu, [field]: value };
    setLocalTissu(updated);
    onChange(updated);
  };




  /* PALETTE TISSU DRAGGABLE */ 
  const [position, setPosition] = useState({ x, y });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // début du drag
  const handleMouseDown = (e) => {
    e.preventDefault();
    setDragging(true);
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    setDragging(true);
    setOffset({
      x: touch.clientX - position.x,
      y: touch.clientY - position.y,
    });
  };

  // le déplacement
  const handleMove = (e) => {
    if (!dragging) return;

    let clientX = e.clientX;
    let clientY = e.clientY;

    if (e.type.startsWith("touch")) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    }

    setPosition({
      x: clientX - offset.x,
      y: clientY - offset.y,
    });
  };

  // arrêt du drag
  const handleEnd = () => setDragging(false);

  // écouteurs du drag
  useEffect(() => {
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleEnd);
    window.addEventListener("touchmove", handleMove, { passive: false });
    window.addEventListener("touchend", handleEnd);
    window.addEventListener("touchcancel", handleEnd);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleEnd);
      window.removeEventListener("touchcancel", handleEnd);
    };
  }, [dragging, offset]);



  return (
    <div className="palette-tissus"
      style={{ position: "fixed", top: position.y, left: position.x, zIndex: 1000
       }}
      
    >
      <div className="palette-header" 
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onClick={(e) => e.stopPropagation()}
        style={{ cursor: dragging ? "grabbing" : "grab"
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
            <input
              ref={colorInputRef}
              type="color"
              value={localTissu.color || "#ffffff"}
              onChange={(e) => updateField("color", e.target.value)}
              style={{ opacity: 0, position: "absolute", pointerEvents: "none" }}
            />
          </div>
        )}

        <button className="close" onClick={onClose}>Fermer</button>
      </div>
    </div>
  );
}
