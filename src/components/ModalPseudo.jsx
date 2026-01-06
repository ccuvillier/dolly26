import React, { useState } from "react";

export default function ModalPseudo({ visible, pseudo, setPseudo, onSubmit }) {
  const [input, setInput] = useState(pseudo || "");

  if (!visible) return null;

  return (
    <div className="modal modalPseudo">
      <div>
        <h2>Crée ou retrouve tes poupées</h2>
        <input
            type="text"
            value={input || ""}
            onChange={e => setInput(e.target.value)}
            placeholder="Ecris ton pseudo ici"
        />
        <button
            onClick={() => {
              const cleanPseudo = input.trim();
              if(!cleanPseudo) return;
              onSubmit(cleanPseudo);
            }}
        >
            Continuer
        </button>
      </div>
    </div>
  );

}

