import React, { useState, useEffect } from "react";
import { tissus } from "./data/tissusData";
import {DEFAULT_TISSU} from "../../constants/defaultTissu"

export default function PaletteTissus({ x, y, tissu, onChange, onClose }) {

  const safeTissu = tissu ?? DEFAULT_TISSU;
  
  const [selectedName, setSelectedName] = useState(safeTissu.name);

  // Synchronisation si le tissu change depuis l'extérieur
  useEffect(() => {
    setSelectedName(safeTissu.name);
  }, [safeTissu.name]);

  const selectedTissu = tissus.find(t => t.name === selectedName);

  const handleSelectTissu = (t) => {
    setSelectedName(t.name);

    // Initialisation des valeurs par défaut
    onChange(prev => ({
      ...prev,
      name: t.name,
      isUni: t.isUni,
      color: safeTissu.color,
      size: safeTissu.size,
      hue: safeTissu.hue,
      saturation: safeTissu.saturation,
      brightness: safeTissu.brightness
      })
    );
  };



  return (
    <div className="palette-tissus"
       style={{
        position: "fixed",
        top: y,
        left: x,
        zIndex: 1000,
      }}
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
              {t.preview ? (
                <img src={t.preview} alt={t.label} />
              ) : (
                <span className="tissu-uni">Uni</span>
              )}
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* --- Options spécifiques --- */}
        {selectedTissu && (
          <div className="tissu-options">
            {selectedTissu.isUni ? (

              <p>🎨 Couleur unie (color picker à brancher ici)</p>

            ) : (
              <>
                <label>
                  Taille du motif
                  <input
                    type="range"
                    min="50"
                    max="300"
                    value={safeTissu.size}
                    onChange={e =>
                      onChange(prev => ({ ...prev, size: Number(e.target.value) }))
                    }
                  />
                </label>

                <label>
                  Teinte
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={safeTissu.hue}
                    onChange={e =>
                      onChange(prev => ({ ...prev, hue: Number(e.target.value) }))
                    }
                  />
                </label>

                <label>
                  Saturation
                  <input
                    type="range"
                    min="50"
                    max="200"
                    value={safeTissu.saturation}
                    onChange={e =>
                      onChange(prev => ({ ...prev, saturation: Number(e.target.value) }))
                    }
                  />
                </label>

                <label>
                  Luminosité
                  <input
                    type="range"
                    min="50"
                    max="150"
                    value={safeTissu.brightness}
                    onChange={e =>
                      onChange(prev => ({ ...prev, brightness: Number(e.target.value) }))
                    }
                  />
                </label>
              </>
            )}
          </div>
        )}
        </div>
        <button className="close" onClick={onClose}>Fermer</button>
    </div>
  );
}
