import { useState, useEffect } from "react";
import { collection, doc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { DEFAULT_POUPEE } from "../constants/defaultPoupee";
import { DEFAULT_TISSU } from "../constants/defaultTissu";
import { savePoupeeField, supprimerPoupeeFirestore, renommerPoupeeFirestore } from "../firebase/firestoreFunctions";

// Registry des composants accessoires pour recréer le Component côté UI
import { ACCESSOIRES_COMPONENTS } from "../components/paletteAccessoires/data/componentsRegistry";

export default function usePoupee(pseudo, updateData) {
  // ---------------- STATES ----------------
  const [poupees, setPoupees] = useState([]); // liste des poupées {id, data}
  const [idPoupee, setIdPoupee] = useState(""); // id de la poupée active
  const [data, setData] = useState({ ...DEFAULT_POUPEE, accessoires: [] }); // données UI de la poupée active
  const [poupeeExiste, setPoupeeExiste] = useState(false);

  const [tissuHaut, setTissuHaut] = useState();
  const [tissuBas, setTissuBas] = useState();

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
      tissuBas: {},
      tissuHaut: {},
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
    setTissuHaut(loaded.tissuHaut ?? {});
    setTissuBas(loaded.tissuBas ?? {});

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
  const updateField = async (field, value, commit = false) => {
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

    // UI + undo
    updateData({ ...data, accessoires: updated });

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

    // UI + undo
    updateData({ ...data, accessoires: updatedUI });
    await updateField("accessoires", updatedUI.map(toFirestoreAcc));
  };




  const updateAccessoireTissu = async (id, patch) => {
    const updatedUI = data.accessoires.map(acc =>
      acc.id === id ? { ...acc, tissu: { ...acc.tissu, ...patch } } : acc
    );

    updateData({ ...data, accessoires: updatedUI });
    await updateField("accessoires", updatedUI.map(toFirestoreAcc));
  };



  const deleteAccessoire = async (ids) => {
    const idsArray = Array.isArray(ids) ? ids : [ids];

    const updatedUI = data.accessoires.filter(
      acc => !idsArray.includes(acc.id)
    );

    updateData({ ...data, accessoires: updatedUI });

    await updateField(
      "accessoires",
      updatedUI.map(toFirestoreAcc)
    );
  };

  // grouper / dégrouper
  /*const accessoiresArray = data.accessoires;
  const accessoiresMap = Object.fromEntries(accessoiresArray.map(acc => [acc.id, acc]));*/

  const onGroup = (selectedIds) => {
    if (!selectedIds || selectedIds.length < 2) return;

    const groupId = `g_${Date.now()}`;

    setData(prev => {
      const map = Object.fromEntries(prev.accessoires.map(acc => [acc.id, acc]));

      const nodes = selectedIds.map(id => map[id]).filter(Boolean);
      if (nodes.length < 2) return prev;

      const avgX = nodes.reduce((sum, n) => sum + (n.x || 0), 0) / nodes.length;
      const avgY = nodes.reduce((sum, n) => sum + (n.y || 0), 0) / nodes.length;

      const newGroup = {
        id: groupId,
        type: "group",
        childrenIds: selectedIds,
        pos: { x: avgX, y: avgY },
        scale: 1
      };

      nodes.forEach(node => {
        map[node.id] = {
          ...node,
          parentGroupId: groupId,
          x: (node.x || 0) - avgX,
          y: (node.y || 0) - avgY
        };
      });
      map[groupId] = newGroup;

      const updated = {
        ...prev,
        accessoires: Object.values(map)
      };

      return updated;
    });
  };

  const onUngroup = (selectedIds) => {
    console.log("ici");
    setData(prev => {
      const map = Object.fromEntries(prev.accessoires.map(acc => [acc.id, acc]));
      
      selectedIds.forEach(id => {
        const group = map[id];
        if (!group || group.type !== "group") return;

        group.childrenIds.forEach(childId => {
          const child = map[childId];
          if (!child) return;

          map[childId] = {
            ...child,
            parentGroupId: null,
            x: (child.x || 0) + (group.pos?.x || 0),
            y: (child.y || 0) + (group.pos?.y || 0)
          };
        });

        delete map[id];
      });

      const updated = {
        ...prev,
        accessoires: Object.values(map)
      };

      return updated;
    });
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
    data,
    setData,
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
    updateAccessoireTissu,
    onGroup,
    onUngroup
  };
}