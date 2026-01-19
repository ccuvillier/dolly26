import { useState } from "react";
import { createDefaultPoupee } from "../constants/defaultPoupee";

export default function useCreationPoupee() {
  const [isCreating, setIsCreating] = useState(false);
  const [creationData, setCreationData] = useState(createDefaultPoupee());
  const [showModalPrenom, setShowModalPrenom] = useState(false);
  const [nouveauPrenom, setNouveauPrenom] = useState("");

  const startCreation = () => {
    setCreationData(createDefaultPoupee());
    setIsCreating(true);
    setShowModalPrenom(true);
    setNouveauPrenom("");
    console.log("startCreation appelé");

  };

  const cancelCreation = () => {
    setIsCreating(false);
    setShowModalPrenom(false);
    setNouveauPrenom("");
  };

  return {
    isCreating,
    creationData,
    setCreationData,
    showModalPrenom,
    nouveauPrenom,
    setNouveauPrenom,
    startCreation,
    cancelCreation
  };
}
