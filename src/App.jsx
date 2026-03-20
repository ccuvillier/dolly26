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
    updateAccessoireTissu
  } = usePoupee(pseudo);

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
  const handleMoveAccessoire = (id, x, y) => {
    updateAccessoire(id, { x, y });
  };

  /*--------- SUPPRIMER --------*/
  const handleDeleteAccessoire = (ids) => {
    deleteAccessoire(ids);
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

  const cloneAccessoire = (acc) => ({
    ...acc,
    id: crypto.randomUUID(),
    x: acc.x + 20,
    y: acc.y + 20,
    tissu: { ...acc.tissu, instanceId: crypto.randomUUID() }
  });


  // ------------------ ACCESSOIRES ACTIONS -------------
  const dataRef = useRef(null);

  useEffect(() => {
    if (data) {
      dataRef.current = data;
      //console.log("DATA REF UPDATE:", data); // debug
    }
  }, [data]);

  // copier/coller CTRL+C - CTRL+V
    const [clipboard, setClipboard] = useState([]);

    const safeData = data ?? { accessoires: [] };
    
   const onCopy = (ids) => {
    const currentData = dataRef.current;

    if (!currentData?.accessoires) {
      //console.log("❌ NO DATA IN REF");
      return;
    }

    if (!Array.isArray(ids) || ids.length === 0) return;

    const selected = currentData.accessoires.filter(acc =>
      ids.includes(acc.id)
    );

    //console.log("COPIED:", selected);

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

    //console.log("PASTE:", clones);

    setData(newData);
    setSelectedIds(clones.map(c => c.id));
  };


  const onAddAccessoire = (item) => {
    const newAcc = createAccessoire(item);
    addAccessoire(newAcc);
    setSelectedIds([newAcc.id]);
  };

  const onClone = (acc) => {
    const clone = cloneAccessoire(acc);
    addAccessoire(clone);
    setSelectedIds([clone.id]);
  };
  
  const accessoireActions = {
    onAddAccessoire,
    onMove: handleMoveAccessoire,
    onDelete: handleDeleteAccessoire,
    onUpdate: handleUpdateAccessoire,
    onClone,
    onCopy,
    onPaste,
    handleChangeAccessoireTissu: async (id, newTissu) => {
      updateAccessoire(id, { tissu: newTissu });
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
    haut: async (zoneId, newTissu) => {
      const updated = { ...(tissuHaut || {}), [zoneId]: newTissu };
      setTissuHaut(updated);
      await updateTissuHaut(updated);
      setTissusZones(prev => ({
        ...prev,
        [`haut-${zoneId}`]: { ...newTissu, instanceId: `${idPoupee}-haut-${zoneId}` }
      }));
    },

    bas: async (zoneId, newTissu) => {
      const updated = { ...(tissuBas || {}), [zoneId]: newTissu };
      setTissuBas(updated);
      await updateTissuBas(updated);
      setTissusZones(prev => ({
        ...prev,
        [`bas-${zoneId}`]: { ...newTissu, instanceId: `${idPoupee}-bas-${zoneId}` }
      }));
    },

    accessoire: async (id, newTissu) => {
      updateAccessoire(id, { tissu: newTissu });
      await updateAccessoireTissu(id, newTissu);
    }
  };


  const handleChangeTissu = async (newTissu) => {
    if (!picker?.zoneId) {
      console.warn("⚠️ zoneId manquant");
      return;
    }

    const target = picker.target;
    const zoneId = picker.zoneId;

    if (tissuActions[target]) {
      await tissuActions[target](zoneId, newTissu);
    } else {
      console.warn(`⚠️ target inconnu pour tissuActions: ${target}`);
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

                //selectedAccessoireId={selectedAccessoireId}
                //setSelectedAccessoireId={setSelectedAccessoireId}

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