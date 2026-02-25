import { useState, useEffect } from "react";
import { collection, doc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { DEFAULT_POUPEE } from "../constants/defaultPoupee";
import { DEFAULT_TISSU } from "../constants/defaultTissu";
import { savePoupeeField, supprimerPoupeeFirestore, renommerPoupeeFirestore } from "../firebase/firestoreFunctions";


export default function usePoupee(pseudo) {
  const [poupees, setPoupees] = useState([]);      // liste des poupées { id, data }
  const [idPoupee, setIdPoupee] = useState("");    // ID de la poupée active
  const [data, setData] = useState({DEFAULT_POUPEE, accessoires: []}); // données de la poupée active
  const [poupeeExiste, setPoupeeExiste] = useState(false);

  const [tissuHaut, setTissuHaut] = useState(DEFAULT_TISSU);
  const [tissuBas, setTissuBas] = useState(DEFAULT_TISSU);

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
    const newData = { 
      ...DEFAULT_POUPEE, 
      prenom,
      tissuBas: DEFAULT_TISSU,
      tissuHaut: DEFAULT_TISSU, accessoires: []
    };

    await setDoc(ref, newData);

    setPoupees(prev => [...prev, { id: prenom, data: newData }]);
    setIdPoupee(prenom);
    setData(newData);
    setTissuHaut(newData.tissuHaut);
    setTissuBas(newData.tissuBas);
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
      setTissuHaut(newData.tissuHaut);
      setTissuBas(newData.tissuBas);
    }
  };


// Renommer une poupée
const renommerPoupee = async (oldId, newId) => {
  const exists = poupees.some(p => p.id === newId);
  if (exists) {
    alert("Une poupée avec ce prénom existe déjà.");
    return;
  }

  await renommerPoupeeFirestore(pseudo, oldId, newId);

  setPoupees(prev =>
    prev.map(p =>
      p.id === oldId
        ? { ...p, id: newId, data: { ...p.data, prenom: newId } }
        : p
    )
  );

  if (idPoupee === oldId) {
    setIdPoupee(newId);
    setData(prev => ({ ...prev, prenom: newId }));
  }
};





  // Charger une poupée depuis Firebase + compléter les champs manquants
  const chargerPoupee = async (id) => {
    if (!pseudo || !id) return;

    const ref = doc(db, "users", pseudo, "poupees", id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return;

    const loaded = snap.data();

    setTissuHaut(data.tissuHaut ?? DEFAULT_TISSU);
    setTissuBas(data.tissuBas ?? DEFAULT_TISSU);

    // Ajouter les champs manquants
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


// ----------------- SANITIZE -----------------
function sanitize(obj) {
  // Supprime tout ce qui n'est pas JSON-serializable
  if (typeof obj === "symbol" || typeof obj === "function") return undefined;
  if (Array.isArray(obj)) return obj.map(sanitize);
  if (obj && typeof obj === "object") {
    const clean = {};
    for (const key in obj) {
      if (key === "component") continue; // on ignore le component pour la BDD
      const sanitized = sanitize(obj[key]);
      if (sanitized !== undefined) clean[key] = sanitized;
    }
    return clean;
  }
  return obj;
}


  // ----------------- ACCESSOIRES -----------------
  // Ajouter
  const addAccessoire = async (newAcc) => {
    const current = Array.isArray(data.accessoires) ? data.accessoires : [];
      
    // Crée une version safe pour Firestore
    const safeAcc = sanitize(newAcc);
      
    // Mise à jour Firestore
    await updateField("accessoires", [...current, safeAcc]);

    // Pour l'UI, on garde le component intact
    setData({
      ...data,
      accessoires: [...current, newAcc] // newAcc contient component pour l'affichage
    });
  };

  // Modifier
  const updateAccessoire = async (id, patch) => {
    const current = Array.isArray(data.accessoires) ? data.accessoires : [];

    // On applique le patch à l'accessoire ciblé pour l'UI
    const updatedUI = current.map(acc =>
      acc.id === id ? { ...acc, ...patch } : acc
    );

    // Version safe pour Firestore
    const updatedSafe = updatedUI.map(acc => sanitize(acc));

    // Mise à jour Firestore
    await updateField("accessoires", updatedSafe);

    // Mise à jour UI locale
    setData({
      ...data,
      accessoires: updatedUI
    });
  };

  // Supprimer
  const deleteAccessoire = async (id) => {
    const updated = data.accessoires.filter(acc => acc.id !== id);

    await updateField("accessoires", updated);
  };

  // Modifier le tissu de l'accessoire
  const updateAccessoireTissu = async (id, patch) => {
    const updated = data.accessoires.map(acc =>
      acc.id === id
        ? { ...acc, tissu: { ...acc.tissu, ...patch } }
        : acc
    );

    await updateField("accessoires", updated);
  };

  // ----------------- MÉTHODES SPÉCIFIQUES -----------------
  const updateNomCoiffure = (value) => updateField("nomCoiffure", value);
  const updateNomHaut = (value) => updateField("nomHaut", value);
  const updateNomBas = (value) => updateField("nomBas", value);
  const updateNomChaussures = (value) => updateField("nomChaussures", value);
  const setPeau = (v) => updateField("peau", v);
  const setYeux = (v) => updateField("yeux", v);
  const setLevres = (v) => updateField("levres", v);
  const setCheveux = (v) => updateField("cheveux", v);
  const setChaussuresColor = (v) => updateField("chaussuresColor", v);
  const setPrenom = (v) => updateField("prenom", v);
  const updateTissuBas = (patch) => updateField("tissuBas", {...data.tissuBas, ...patch});
  const updateTissuHaut = (patch) => updateField("tissuHaut", {...data.tissuHaut, ...patch});

  
  //console.log("POUPEE CHARGÉE :", data);

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
    setChaussuresColor,
    setPrenom,
    setNomCoiffure: updateNomCoiffure,
    setNomChaussures: updateNomChaussures,
    setNomHaut: updateNomHaut,
    setNomBas: updateNomBas,
    creerPoupee,
    chargerPoupee,
    updateNomCoiffure,
    supprimerPoupee,
    renommerPoupee,
    tissuHaut,
    setTissuHaut,
    updateTissuHaut,
    tissuBas,
    setTissuBas,
    updateTissuBas,
    accessoires: data.accessoires,
    updateAccessoire,
    addAccessoire,
    deleteAccessoire,
    updateAccessoireTissu
  };
}

