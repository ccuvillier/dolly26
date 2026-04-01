import React, { useState, useEffect, useRef } from "react";
import { useUser } from "./context/UserContext";
import ModalPseudo from "./components/ModalPseudo";
import ModalPrenom from "./components/ModalPrenom";
import PoupeesGrid from "./components/PoupeesGrid";
import PoupeeEditor from "./components/PoupeeEditor";
import usePoupee from "./hooks/usePoupee";
import useCreationPoupee from "./hooks/useCreationPoupee";
import useStylePicker from "./hooks/useStylePicker";
import { DEFAULT_TISSU } from "./constants/defaultTissu";

import './App.scss';

export default function App() {
  // ------------------- USER -------------------
  
  const { pseudo } = useUser();
  const hasPseudo = pseudo.trim() !== "";

  //-------------------------
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const isEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b);

  const updateData = (newData) => {
    //console.trace("🔥 updateData appelé");
    
    const current = dataRef.current;


    if (isEqual(current, newData)) {
      console.log("ignoré : aucune modification réelle");
      return;
    }

    setHistory(prev => {
      const snapshot = JSON.parse(JSON.stringify(current));
      //console.log("✅ HISTORY +1");
      return [...prev, snapshot];
    });

    setRedoStack([]);
    setData(newData);
    dataRef.current = newData;
  };

  // ------------------- HOOK POUPEE -------------------
  const {
    poupees,
    idPoupee,
    data,
    setData,
    setIdPoupee,
    prenom,
    peau, setPeau,
    yeux, setYeux,
    levres, setLevres,
    cheveux, setCheveux,
    nomCoiffure, setNomCoiffure,
    chaussuresColor, setChaussuresColor,
    nomChaussures, setNomChaussures,
    nomHaut, setNomHaut,
    nomBas, setNomBas,
    poupeeExiste,
    setPoupeeExiste,
    creerPoupee,
    chargerPoupee,
    supprimerPoupee,
    renommerPoupee,
    updateNomCoiffure,
    tissuHaut,
    setTissuHaut,
    updateTissuHaut,
    tissuBas,
    setTissuBas,
    updateTissuBas,
    accessoires,
    addAccessoire,
    updateAccessoire,
    deleteAccessoire,
    updateAccessoireTissu,
    onGroup,
    onUngroup
  } = usePoupee(pseudo, updateData);

  // ------------------- HOOK CREATION -------------------
  const {
    isCreating,
    creationData,
    setCreationData,
    showModalPrenom,
    nouveauPrenom,
    setNouveauPrenom,
    startCreation,
    cancelCreation
  } = useCreationPoupee();

  const [selectedIds, setSelectedIds] = useState([]);

  // ------------------- PICKERS -------------------
  const { picker, openPicker, closePicker } = useStylePicker();

  // ------------------- STATE LOCAUX -------------------
  const [tissusZones, setTissusZones] = useState({});
  const [activePalette, setActivePalette] = useState(null);
  //const [selectedAccessoireId, setSelectedAccessoireId] = useState(null);
  const showAccessoires = (state = "accessoires") => setActivePalette(state);

  

  // ------------------ COULEURS ACTIONS ----------------
  const couleurActions = {
    peau: setPeau,
    yeux: setYeux,
    levres: setLevres,
    cheveux: setCheveux,
    chaussures: setChaussuresColor
  };
  const applyColor = (target, color) => {
    couleurActions[target]?.(color);
  };

  /*--------- DRAG D'UN ACCESSOIRE --------*/
  const handleMoveAccessoire = ({ ids, dx, dy }) => {
    const currentData = dataRef.current;

    if (!currentData?.accessoires) return;

    const newData = {
      ...currentData,
      accessoires: currentData.accessoires.map(acc =>
        ids.includes(acc.id)
          ? { ...acc, x: acc.x + dx, y: acc.y + dy }
          : acc
      )
    };

    updateData(newData);
  };

  /*--------- SUPPRIMER --------*/
  const handleDeleteAccessoire = async (ids) => {
    await deleteAccessoire(ids);  // attendre que l'updateData soit fait
    setSelectedIds([]);
  };

  /*--------- UPDATE --------*/
  const handleUpdateAccessoire = (id, newProps) => {
    updateAccessoire(id, newProps);
  };

  // ---------------- ACCESSOIRES HELPERS ----------------
  const createAccessoire = (item) => ({
    id: crypto.randomUUID(),
    type: item.type,
    x: 400,
    y: 400,
    scale: 1,
    rotation: 0,
    tissu: { ...DEFAULT_TISSU, instanceId: crypto.randomUUID() },
    zoneId: crypto.randomUUID()
  });

  const cloneAccessoire = (acc) => {
    return {
      ...acc,
      id: crypto.randomUUID(),
      x: acc.x + 20,
      y: acc.y + 20,
      tissu: { ...acc.tissu, instanceId: crypto.randomUUID() }
    };
  };


  // ------------------ ACCESSOIRES ACTIONS -------------
  const dataRef = useRef(null);

  useEffect(() => {
    if (data) { dataRef.current = data; }
  }, [data]);

  // copier/coller CTRL+C - CTRL+V
  const [clipboard, setClipboard] = useState([]);

  const safeData = data ?? { accessoires: [] };
    
  const onCopy = (ids) => {
    const currentData = dataRef.current;

    if (!currentData?.accessoires) { return; }

    if (!Array.isArray(ids) || ids.length === 0) return;

    const selected = currentData.accessoires.filter(acc =>
      ids.includes(acc.id)
    );

    setClipboard(JSON.parse(JSON.stringify(selected)));
  };

  const onPaste = () => {
    const currentData = dataRef.current;

    if (!currentData?.accessoires || !clipboard.length) return;

    const clones = clipboard.map(acc => ({
      ...acc,
      id: crypto.randomUUID(),
      x: acc.x + 20,
      y: acc.y + 20,
      tissu: {
        ...acc.tissu,
        instanceId: crypto.randomUUID()
      }
    }));

    const newData = {
      ...currentData,
      accessoires: [...currentData.accessoires, ...clones]
    };

    updateData(newData);
    setSelectedIds(clones.map(c => c.id));
  };

  // Annuler / rétablir
  const onUndo = () => {
    setHistory(prev => {
      if (prev.length === 0) return prev;

      const last = prev[prev.length - 1];

      setRedoStack(rs => [...rs, JSON.parse(JSON.stringify(dataRef.current))]);
      setData(last);
      dataRef.current = last;

      return prev.slice(0, -1);
    });
  };
  const onRedo = () => {
    setRedoStack(prevRedo => {
      if (prevRedo.length === 0) return prevRedo;

      const next = prevRedo[prevRedo.length - 1];

      setHistory(prevHistory => [
        ...prevHistory,
        JSON.parse(JSON.stringify(dataRef.current))
      ]);

      setData(next);
      dataRef.current = next;

      return prevRedo.slice(0, -1);
    });
  };


  const onAddAccessoire = (item) => {
    const newAcc = createAccessoire(item);
    addAccessoire(newAcc);
    setSelectedIds([newAcc.id]);
  };

  const onClone = (acc) => {
    const clone = cloneAccessoire(acc);

    setData(prev => ({
      ...prev,
      accessoires: [...prev.accessoires, clone]
    }));

    setSelectedIds([clone.id]);
  };
  
  const accessoireActions = {
    data,
    setData,
    onAddAccessoire,
    onMove: handleMoveAccessoire,
    onDelete: handleDeleteAccessoire,
    onUpdate: handleUpdateAccessoire,
    onClone,
    onCopy,
    onPaste,
    onUndo,
    onRedo,
    onGroup,
    onUngroup,
    handleChangeAccessoireTissu: async (id, newTissu) => {
      await updateAccessoireTissu(id, newTissu);
    }
  };


  const annulerPoupee = () => {
    cancelCreation();
    setPoupeeExiste(false);
    setIdPoupee("");
  };


  const poupeeAffichee = isCreating
    ? creationData
    : { peau, yeux, levres, cheveux, nomCoiffure, setNomCoiffure, chaussuresColor, nomChaussures, setNomChaussures, nomHaut, setNomHaut, nomBas, setNomBas, prenom, tissuHaut, tissuBas, accessoires };

  
  // ------------------- MODALES POUPEE ------------------
  const handleCreer = async () => {
    if (!nouveauPrenom) return;
    const id = await creerPoupee(nouveauPrenom);
    await chargerPoupee(id);
    setIdPoupee(id);
    setPoupeeExiste(true);
    cancelCreation();
  };
  

  // ------------------- CHARGEMENT TISSUS -------------------
  useEffect(() => {
    if (!poupeeExiste || !idPoupee) return;
    const p = poupees.find(p => p.data.prenom === prenom || p.id === idPoupee);
    if (!p) return;

    setTissuHaut(p.data.tissuHaut ?? {});
    setTissuBas(p.data.tissuBas ?? {});

    const rebuiltZones = {};
    Object.entries(p.data.tissuBas ?? {}).forEach(([zone, tissu]) => {
      rebuiltZones[`bas-${zone}`] = tissu;
    });
    Object.entries(p.data.tissuHaut ?? {}).forEach(([zone, tissu]) => {
      rebuiltZones[`haut-${zone}`] = tissu;
    });
    setTissusZones(rebuiltZones);
  }, [poupeeExiste, idPoupee, poupees, prenom]);


  // ------------------- TISSU ACTIONS -------------------
  const tissuActions = {
    // Tissu haut
    haut: (zoneId, newTissu, commit = false) => {
      // Update instantané UI
      const updated = { ...(tissuHaut || {}), [zoneId]: newTissu };
      setTissuHaut(updated);
      setTissusZones(prev => ({
        ...prev,
        [`haut-${zoneId}`]: { ...newTissu, instanceId: `${idPoupee}-haut-${zoneId}` }
      }));

      const newData = {
        ...dataRef.current,
        tissuHaut: updated
      };

      updateTissuHaut(updated);
      updateData(newData);
      dataRef.current = newData;
    },

    // Tissu bas
    bas: (zoneId, newTissu, commit = false) => {
      //console.log("COMMIT ?", commit);
      const updated = { ...(tissuBas || {}), [zoneId]: newTissu };
      setTissuBas(updated);
      setTissusZones(prev => ({
        ...prev,
        [`bas-${zoneId}`]: { ...newTissu, instanceId: `${idPoupee}-bas-${zoneId}` }
      }));

      const newData = {
        ...dataRef.current,
        tissuBas: updated
      };

      updateTissuBas(updated);
      updateData(newData);
      dataRef.current = newData;

    },

    // Accessoires
    accessoire: (id, newTissu, commit = false) => {
      const currentData = dataRef.current;

      if (!currentData?.accessoires) return;

      const updatedAccessoires = currentData.accessoires.map(acc =>
        acc.id === id
          ? { ...acc, tissu: newTissu }
          : acc
      );

      // PREVIEW (pas d'historique)
      setData({
        ...currentData,
        accessoires: updatedAccessoires
      });

      // ✅ COMMIT (history + firestore)
      if (commit) {
        updateData({
          ...currentData,
          accessoires: updatedAccessoires
        });

        updateAccessoireTissu(id, newTissu); // Firestore
      }
    }
  };


  const handleChangeTissu = async (newTissu, commit) => {
    if (!picker) return;

    const { target, zoneId, id } = picker;

    // ✅ CAS ACCESSOIRE
    if (target === "accessoire") {
      if (!id) {
        console.warn("⚠️ id accessoire manquant");
        return;
      }

      await updateAccessoireTissu(id, newTissu);
      return;
    }

    // ✅ CAS HAUT / BAS
    if (!zoneId) {
      console.warn("⚠️ zoneId manquant");
      return;
    }

    if (tissuActions[target]) {
      await tissuActions[target](zoneId, newTissu);
    } else {
      console.warn(`⚠️ target inconnu: ${target}`);
    }
  };

  // ------------------- RENDER -------------------
  return (
    <div className="App zoomIn">
      {!hasPseudo && <ModalPseudo />}

      {hasPseudo && (
        <>
          {!poupeeExiste && !showModalPrenom && !isCreating && (
            <PoupeesGrid
              poupees={poupees}
              onAddPoupee={startCreation}
              chargerPoupee={chargerPoupee}
              supprimerPoupee={supprimerPoupee}
              renommerPoupee={renommerPoupee}
            />
          )}

          {showModalPrenom && (
            <ModalPrenom
              visible={true}
              prenom={nouveauPrenom}
              setPrenom={setNouveauPrenom}
              exists={false}
              creer={handleCreer}
              onAnnuler={annulerPoupee}
            >
              <input
                type="text"
                placeholder="Nom de la poupée"
                value={nouveauPrenom}
                onChange={(e) => setNouveauPrenom(e.target.value)}
                style={{ marginBottom: "10px" }}
              />
            </ModalPrenom>
          )}

          {(isCreating || poupeeExiste) && (
            <>
              <h1>{isCreating ? "Ma nouvelle amie" : idPoupee ? `Mon amie ${idPoupee}` : "Ma meilleure amie"}</h1>

              <PoupeeEditor
                accessoireActions={accessoireActions}
                revoirGrille={annulerPoupee}
                poupeeAffichee={poupeeAffichee}
                idPoupee={idPoupee}
                isCreating={isCreating}
                tissusZones={tissusZones}
                setTissusZones={setTissusZones}
                openPicker={openPicker}
                closePicker={closePicker}
                picker={picker}
                applyColor={applyColor}
                handleChangeTissu={handleChangeTissu}
                activePalette={activePalette}
                showAccessoires={showAccessoires}
                selectedIds={selectedIds}
                setSelectedIds={setSelectedIds}
              />
            </>
          )}
        </>
      )}
    </div>
  );
}