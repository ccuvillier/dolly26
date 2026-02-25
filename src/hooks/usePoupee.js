import { useState, useEffect } from "react";
import { collection, doc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { DEFAULT_POUPEE } from "../constants/defaultPoupee";
import { DEFAULT_TISSU } from "../constants/defaultTissu";
import { savePoupeeField, supprimerPoupeeFirestore, renommerPoupeeFirestore } from "../firebase/firestoreFunctions";

// Registry des composants accessoires pour recréer le Component côté UI
import { ACCESSOIRES_COMPONENTS } from "../components/paletteAccessoires/data/componentsRegistry";

export default function usePoupee(pseudo) {
  // ---------------- STATES ----------------
  const [poupees, setPoupees] = useState([]); // liste des poupées {id, data}
  const [idPoupee, setIdPoupee] = useState(""); // id de la poupée active
  const [data, setData] = useState({ ...DEFAULT_POUPEE, accessoires: [] }); // données UI de la poupée active
  const [poupeeExiste, setPoupeeExiste] = useState(false);

  const [tissuHaut, setTissuHaut] = useState(DEFAULT_TISSU);
  const [tissuBas, setTissuBas] = useState(DEFAULT_TISSU);

  // ---------------- UTILS ----------------
  // Convertit un accessoire pour Firestore (supprime component)
  const toFirestoreAcc = (acc) => {
    const { component, ...safe } = acc;
    return safe;
  };

  // ---------------- LOAD POUPEES ----------------
  useEffect(() => {
    if (!pseudo) return;
    if (poupeeExiste) return; // ne pas fetch si une poupée est affichée

    const fetchPoupees = async () => {
      const colRef = collection(db, "users", pseudo, "poupees");
      const snapshot = await getDocs(colRef);
      const list = snapshot.docs.map(doc => ({ id: doc.id, data: doc.data() }));
      setPoupees(prev => {
        const fetchedIds = list.map(p => p.id);
        const filteredPrev = prev.filter(p => !fetchedIds.includes(p.id));
        return [...filteredPrev, ...list];
      });
    };

    fetchPoupees();
  }, [pseudo, poupeeExiste]);

  // ---------------- CREATE POUPEE ----------------
  const creerPoupee = async (prenom = "") => {
    if (!pseudo) return null;

    const ref = doc(db, "users", pseudo, "poupees", prenom);
    const newData = { 
      ...DEFAULT_POUPEE, 
      prenom,
      tissuBas: DEFAULT_TISSU,
      tissuHaut: DEFAULT_TISSU,
      accessoires: []
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

  // ---------------- DELETE / RENAME ----------------
  const supprimerPoupee = async (id) => {
    await supprimerPoupeeFirestore(pseudo, id);

    setPoupees(prev => prev.filter(p => p.id !== id));

    if (id === idPoupee) {
      setIdPoupee("");
      setPoupeeExiste(false);
      setData({ ...DEFAULT_POUPEE, accessoires: [] });
      setTissuHaut(DEFAULT_TISSU);
      setTissuBas(DEFAULT_TISSU);
    }
  };

  const renommerPoupee = async (oldId, newId) => {
    if (poupees.some(p => p.id === newId)) {
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

  // ---------------- LOAD SINGLE POUPEE ----------------
  const chargerPoupee = async (id) => {
    if (!pseudo || !id) return;

    const ref = doc(db, "users", pseudo, "poupees", id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return;

    const loaded = snap.data();

    // Assure les tissus existants
    setTissuHaut(loaded.tissuHaut ?? DEFAULT_TISSU);
    setTissuBas(loaded.tissuBas ?? DEFAULT_TISSU);

    // Ajouter les champs manquants
    const missing = {};
    for (const key in DEFAULT_POUPEE) {
      if (!(key in loaded)) missing[key] = DEFAULT_POUPEE[key];
    }

    if (Object.keys(missing).length > 0) {
      await updateDoc(ref, missing);
    }

    // ---------------- Mapping UI ----------------
    const accessoiresMapped = (loaded.accessoires || []).map(acc => ({
      ...acc,
      component: ACCESSOIRES_COMPONENTS[acc.type] || null
    }));

    const fullData = {
      ...DEFAULT_POUPEE,
      ...loaded,
      ...missing,
      accessoires: accessoiresMapped
    };

    setData(fullData);
    setIdPoupee(id);
    setPoupeeExiste(true);
  };

  // ---------------- UPDATE FIELD ----------------
  const updateField = async (field, value) => {
    if (!pseudo || !idPoupee) return;

    await savePoupeeField(pseudo, idPoupee, field, value);

    setData(prev => {
      const newData = { ...prev, [field]: value };
      setPoupees(prevList =>
        prevList.map(p =>
          p.id === idPoupee ? { ...p, data: newData } : p
        )
      );
      return newData;
    });
  };

  // ---------------- ACCESSOIRES ----------------
  const addAccessoire = async (newAcc) => {
    const current = Array.isArray(data.accessoires) ? data.accessoires : [];
    const updated = [...current, newAcc];

    // UI
    setData({ ...data, accessoires: updated });

    // BDD
    await updateField("accessoires", updated.map(toFirestoreAcc));
  };



  const updateAccessoire = async (id, patch) => {
    const current = Array.isArray(data.accessoires) ? data.accessoires : [];

    const updatedUI = current.map(acc =>
      acc.id === id
        ? { ...acc, ...patch, component: acc.component || ACCESSOIRES_COMPONENTS[acc.type] }
        : acc
    );

    setData({ ...data, accessoires: updatedUI });
    await updateField("accessoires", updatedUI.map(toFirestoreAcc));
  };




  const updateAccessoireTissu = async (id, patch) => {
    const updatedUI = data.accessoires.map(acc =>
      acc.id === id ? { ...acc, tissu: { ...acc.tissu, ...patch } } : acc
    );

    setData({ ...data, accessoires: updatedUI });
    await updateField("accessoires", updatedUI.map(toFirestoreAcc));
  };

  const deleteAccessoire = async (id) => {
    const updatedUI = data.accessoires.filter(acc => acc.id !== id);
    setData({ ...data, accessoires: updatedUI });

    await updateField("accessoires", updatedUI.map(toFirestoreAcc));
  };

  // ---------------- SPECIFIC METHODS ----------------
  const updateNomCoiffure = (v) => updateField("nomCoiffure", v);
  const updateNomHaut = (v) => updateField("nomHaut", v);
  const updateNomBas = (v) => updateField("nomBas", v);
  const setPeau = (v) => updateField("peau", v);
  const setYeux = (v) => updateField("yeux", v);
  const setLevres = (v) => updateField("levres", v);
  const setCheveux = (v) => updateField("cheveux", v);
  const updateNomChaussures = (value) => updateField("nomChaussures", value);
  const setChaussuresColor = (v) => updateField("chaussuresColor", v);
  const setPrenom = (v) => updateField("prenom", v);
  const updateTissuBas = (patch) => updateField("tissuBas", { ...data.tissuBas, ...patch });
  const updateTissuHaut = (patch) => updateField("tissuHaut", { ...data.tissuHaut, ...patch });

  // ---------------- RETURN ----------------
  return {
    poupees,
    idPoupee,
    setIdPoupee,
    poupeeExiste,
    setPoupeeExiste,
    ...data,
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