import { useState, useEffect } from "react";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

export default function usePoupee() {
  const [prenom, setPrenom] = useState("");

  // État complet de la poupée
  const [data, setData] = useState({
    peau: "#FFE4D9",
    yeux: "#0000FF",
    cheveux: "#FFFFFF",
    nomCoiffure: ""
  });

  const [poupeeExiste, setPoupeeExiste] = useState(false);

  /**
   * 🔍 Vérifie en BDD si la poupée existe quand le prénom change
   */
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

  /**
   * 🟢 Crée une poupée avec les valeurs actuelles
   */
  const creerPoupee = async () => {
    const ref = doc(db, "poupees", prenom);
    await setDoc(ref, {
      peau: data.peau,
      yeux: data.yeux,
      cheveux: data.cheveux,
      nomCoiffure: data.nomCoiffure
    });
    setPoupeeExiste(true);
  };

  /**
   * 📥 Charge une poupée depuis Firebase et met à jour le state
   */
  const chargerPoupee = async () => {
    const ref = doc(db, "poupees", prenom);
    const snap = await getDoc(ref);

    if (!snap.exists()) return;

     const loadedData = snap.data();

    setData(prev => ({ ...prev, ...snap.data() }));
    setPoupeeExiste(true);
    console.log(snap.data(), loadedData.nomCoiffure);
  };

  /**
   * 🟣 Met à jour UN SEUL champ dans Firebase et dans React
   */
  const updateField = async (field, value) => {
    const ref = doc(db, "poupees", prenom);
    await updateDoc(ref, { [field]: value });

    setData(prev => ({ ...prev, [field]: value }));
  };

  /**
   * 🧼 Expose des fonctions claires
   */
  const updatePeau = (value) => updateField("peau", value);
  const updateYeux = (value) => updateField("yeux", value);
  const updateCheveux = (value) => updateField("cheveux", value);
  const updateNomCoiffure = (value) => updateField("nomCoiffure", value);

  return {
    prenom, setPrenom,
    poupeeExiste,

    ...data, // peau, yeux, cheveux, nomCoiffure

    // ✅ Ajouter les setters
    setPeau: updatePeau,
    setYeux: updateYeux,
    setCheveux: updateCheveux,
    setNomCoiffure: updateNomCoiffure,

    creerPoupee,
    chargerPoupee,

    updatePeau,
    updateYeux,
    updateCheveux,
    updateNomCoiffure
  };
}
