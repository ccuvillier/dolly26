import { useState, useEffect } from "react";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

// Valeurs par défaut de la poupée
const DEFAULT_POUPEE = {
  peau: "#FFE4D9",
  yeux: "#0000FF",
  levres: "#FF7A84",
  cheveux: "#FFFFFF",
  nomCoiffure: ""
};




export default function usePoupee() {
  const [prenom, setPrenom] = useState("");
  const [data, setData] = useState(DEFAULT_POUPEE);
  const [poupeeExiste, setPoupeeExiste] = useState(false);

  // 🔍 Vérifie si la poupée existe quand le prénom change
  useEffect(() => {
    if (!prenom) {
      setPoupeeExiste(false);
      return;
    }

    const check = async () => {
      const ref = doc(db, "poupees", prenom);
      const snap = await getDoc(ref);
      setPoupeeExiste(snap.exists());
    };

    check();
  }, [prenom]);

  // 🟢 Créer une nouvelle poupée avec les valeurs actuelles
  const creerPoupee = async () => {
    const ref = doc(db, "poupees", prenom);

    await setDoc(ref, {
      ...DEFAULT_POUPEE, // sécurité
      ...data            // valeurs actuelles
    });

    setPoupeeExiste(true);
  };

  // 📥 Charger une poupée depuis Firebase + compléter les champs manquants
  const chargerPoupee = async () => {
    const ref = doc(db, "poupees", prenom);
    const snap = await getDoc(ref);

    if (!snap.exists()) return;

    const loaded = snap.data();

    // Vérifier les champs absents
    const missing = {};
    for (const key in DEFAULT_POUPEE) {
      if (!(key in loaded)) {
        missing[key] = DEFAULT_POUPEE[key];
      }
    }

    // Ajouter les champs manquants dans Firebase
    if (Object.keys(missing).length > 0) {
      await updateDoc(ref, missing);
    }

    // Mettre à jour le state avec les valeurs complètes
    setData({ ...DEFAULT_POUPEE, ...loaded });

    setPoupeeExiste(true);
  };

  // 🟣 Mettre à jour UN SEUL champ (peau, yeux, cheveux, etc.)
  const updateField = async (field, value) => {
    const ref = doc(db, "poupees", prenom);

    await updateDoc(ref, { [field]: value });
    setData(prev => ({ ...prev, [field]: value }));
  };

  // 🟣 Mettre à jour le nom de la coiffure
  const updateNomCoiffure = (value) => updateField("nomCoiffure", value);

  return {
    // état général
    prenom,
    setPrenom,
    poupeeExiste,

    ...data, // peau, yeux, levres, cheveux, nomCoiffure

    // setters simples
    setPeau: (v) => updateField("peau", v),
    setYeux: (v) => updateField("yeux", v),
    setLevres: (v) => updateField("levres", v),
    setCheveux: (v) => updateField("cheveux", v),
    setNomCoiffure: (v) => updateField("nomCoiffure", v),

    // actions
    creerPoupee,
    chargerPoupee,
    updateNomCoiffure
  };
}
