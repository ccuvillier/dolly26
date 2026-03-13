import { createContext, useContext, useState } from "react";
import { pseudoExiste, creerUtilisateurSiAbsent } from "../firebase/firestoreFunctions";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [pseudo, setPseudo] = useState("");
  const [error, setError] = useState("");

  const login = async (pseudoInput, mode) => {
    const existed = await pseudoExiste(pseudoInput);

    if (mode === "create" && existed) {
      setError("Ce pseudo est déjà utilisé.");
      return false;
    }

    if (mode === "login" && !existed) {
      setError("Cet utilisateur n'existe pas.");
      return false;
    }

    if (mode === "create") {
      await creerUtilisateurSiAbsent(pseudoInput);
    }

    setPseudo(pseudoInput);
    setError("");
    return true;
  };

  return (
    <UserContext.Provider
      value={{
        pseudo,
        login,
        error,
        setError
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);