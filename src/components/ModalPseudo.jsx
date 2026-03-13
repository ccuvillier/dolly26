import React, { useState } from "react";
import { useUser } from "../context/UserContext";

export default function ModalPseudo() {
  const { pseudo, login, error, setError } = useUser();
  const [input, setInput] = useState("");
  const [mode, setMode] = useState("login"); // "login" | "create"

  // Fonction de soumission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const success = await login(input.trim(), mode);
    if (!success) return;

    // Réinitialise l'input après login
    setInput("");
  };

  // Si le pseudo existe déjà, on n'affiche pas la modale
  if (pseudo) return null;

  return (
    <div className="modal modalPseudo">
      <div>
        <h2>{mode === "login" ? "Retrouve tes poupées" : "Créer un nouveau pseudo"}</h2>

        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            autoFocus
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === "login" ? "Ecris ton pseudo ici" : "Choisis ton pseudo"}
          />
          <button type="submit">
            {mode === "login" ? "Continuer" : "Créer"}
          </button>
        </form>

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