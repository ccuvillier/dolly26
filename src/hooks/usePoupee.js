import { useState, useEffect } from "react";
import { collection, doc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { savePoupeeField, supprimerPoupeeFirestore } from "../firebase/firestoreFunctions";

// Valeurs par défaut d'une poupée
const DEFAULT_POUPEE = {
  peau: "#FFE4D9",
  yeux: "#0000FF",
  levres: "#FF7A84",
  cheveux: "#FFFFFF",
  nomCoiffure: "",
  prenom: ""
};

export default function usePoupee(pseudo) {
  const [poupees, setPoupees] = useState([]);      // liste des poupées { id, data }
  const [idPoupee, setIdPoupee] = useState("");    // ID de la poupée active
  const [data, setData] = useState(DEFAULT_POUPEE); // données de la poupée active
  const [poupeeExiste, setPoupeeExiste] = useState(false);

  // Charger toutes les poupées de l'utilisateur
  useEffect(() => {
    if (!pseudo) return;

    const fetchPoupees = async () => {
      const colRef = collection(db, "users", pseudo, "poupees");
      const snapshot = await getDocs(colRef);

      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        data: doc.data()
      }));

      setPoupees(list);
    };

    fetchPoupees();
  }, [pseudo]);





  // Créer une nouvelle poupée
  const creerPoupee = async (prenom = "") => {
    if (!pseudo) return null;

    const ref = doc(db, "users", pseudo, "poupees", prenom);
    const newData = { ...DEFAULT_POUPEE, prenom };
    await setDoc(ref, newData);

    setPoupees(prev => [...prev, { id: prenom, data: newData }]);
    setIdPoupee(prenom);
    setData(newData);
    setPoupeeExiste(true);

    return prenom;
  };

  // Supprimer une poupée
  const supprimerPoupee = async (id) => {
    await supprimerPoupeeFirestore(pseudo, id);

    setPoupees(prev => prev.filter(p => p.id !== id));

    if (id === idPoupee) {
      setIdPoupee("");
      setPoupeeExiste(false);
      setData(DEFAULT_POUPEE);
    }
  };




  // Charger une poupée depuis Firebase + compléter les champs manquants
  const chargerPoupee = async (id) => {
    if (!pseudo || !id) return;

    const ref = doc(db, "users", pseudo, "poupees", id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return;

    const loaded = snap.data();

    // Vérifier les champs manquants
    const missing = {};
    for (const key in DEFAULT_POUPEE) {
      if (!(key in loaded)) missing[key] = DEFAULT_POUPEE[key];
    }

    if (Object.keys(missing).length > 0) {
      await updateDoc(ref, missing);
    }

    const fullData = { ...DEFAULT_POUPEE, ...loaded, ...missing };

    setData(fullData);
    setIdPoupee(id);
    setPoupeeExiste(true);
  };




  // Mettre à jour un champ individuel
  const updateField = async (field, value) => {
    //console.log("updateField appelée :", field, value, "pseudo:", pseudo, "idPoupee:", idPoupee);

    if (!pseudo || !idPoupee) {
      console.warn("updateField STOP : pseudo ou idPoupee manquant", { field, value, pseudo, idPoupee });
      return;
    }


    if (!pseudo || !idPoupee) return;

    await savePoupeeField(pseudo, idPoupee, field, value);

    setData(prev => {
      const newData = { ...prev, [field]: value };

      // Mettre à jour la poupée dans poupees[]
      setPoupees(prevList =>
        prevList.map(p =>
          p.id === idPoupee ? { ...p, data: newData } : p
        )
      );

      return newData;
    });

  };

  const updateNomCoiffure = (value) => updateField("nomCoiffure", value);
  const setPeau = (v) => updateField("peau", v);
  const setYeux = (v) => updateField("yeux", v);
  const setLevres = (v) => updateField("levres", v);
  const setCheveux = (v) => updateField("cheveux", v);
  const setPrenom = (v) => updateField("prenom", v);

  return {
    poupees,        // liste des poupées [{id, data}]
    idPoupee,       // ID de la poupée active
    setIdPoupee,
    poupeeExiste,
    setPoupeeExiste,
    ...data,        // peau, yeux, levres, cheveux, nomCoiffure, prenom
    setPeau,
    setYeux,
    setLevres,
    setCheveux,
    setPrenom,
    setNomCoiffure: updateNomCoiffure,
    creerPoupee,
    chargerPoupee,
    updateNomCoiffure,
    supprimerPoupee
  };
}
