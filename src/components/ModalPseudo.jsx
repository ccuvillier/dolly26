import React, { useState } from "react";

export default function ModalPseudo({ visible, pseudo,  onSubmit, error, setError }) {
  const [input, setInput] = useState(pseudo || "");
  const [mode, setMode] = useState("login"); // "login" | "create"


  if (!visible) return null;

  return (
    <div className="modal modalPseudo">
      <div>
        <h2>{mode === "login"
          ? "Retrouve tes poupées"
          : "Créer un nouveau pseudo"}</h2>
          
        <input
            type="text"
            value={input || ""}
            onChange={e => setInput(e.target.value)}
            placeholder={
              mode === "login"
                ? "Ecris ton pseudo ici"
                : "Choisis ton pseudo"
            }
        />
        <button
            onClick={() => {
              onSubmit(input.trim(),mode);
            }}
        >
            {mode === "login"
            ? "Continuer"
            : "Créer"}
        </button>

        {error && <p>{error}</p>}

        <p>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setMode(mode === "login" ? "create" : "login");
              setError("");
            }}
          >
            {mode === "login"
              ? "Créer un compte pour jouer…"
              : "Déjà un compte ? Connecte-toi ici"}
          </a>
        </p>


      </div>
    </div>
  );

}

