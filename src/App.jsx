import React, { useState, useEffect, useRef } from "react";
import ModalPseudo from "./components/ModalPseudo";
import ModalPrenom from "./components/ModalPrenom";
import PoupeesGrid from "./components/PoupeesGrid";
import PoupeeEditor from "./components/PoupeeEditor";
import usePoupee from "./hooks/usePoupee";
import useCreationPoupee from "./hooks/useCreationPoupee";
import useStylePicker from "./hooks/useStylePicker";
import { DEFAULT_TISSU } from "./constants/defaultTissu";
import { pseudoExiste, creerUtilisateurSiAbsent } from "./firebase/firestoreFunctions";

import './App.scss';

export default function App() {
  // ------------------- USER -------------------
  const [pseudo, setPseudo] = useState("");
  const [pseudoError, setPseudoError] = useState("");
  const hasPseudo = pseudo.trim() !== "";

  // ------------------- HOOK POUPEE -------------------
  const {
    poupees,
    idPoupee,
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

  // ------------------- PICKERS -------------------
  const { picker, openPicker, closePicker } = useStylePicker();

  // ------------------- STATE LOCAUX -------------------
  const [tissusZones, setTissusZones] = useState({});
  const [activePalette, setActivePalette] = useState(null);
  const [selectedAccessoireId, setSelectedAccessoireId] = useState(null);

  // ------------------- FONCTIONS UTILES -------------------
  const applyColor = (target, color) => {
    switch (target) {
      case "peau": setPeau(color); break;
      case "yeux": setYeux(color); break;
      case "levres": setLevres(color); break;
      case "cheveux": setCheveux(color); break;
      case "chaussures": setChaussuresColor(color); break;
      default: break;
    }
  };

  const showAccessoires = (state = "accessoires") => setActivePalette(state);

  const handleAddAccessoire = (item) => {
    const newAcc = {
      id: crypto.randomUUID(),
      type: item.type,
      component: item.component,
      x: 400,
      y: 400,
      scale: 1,
      rotation: 0,
      tissu: { ...DEFAULT_TISSU, instanceId: crypto.randomUUID() }
    };
    addAccessoire(newAcc);
    setSelectedAccessoireId(newAcc.id);
  };

  const handleDeleteAccessoire = (id) => deleteAccessoire(id);
  const handleUpdateAccessoire = (id, newProps) => updateAccessoire(id, newProps);
  const duplicateAccessoire = (clone) => addAccessoire(clone);

  const handleChangeAccessoireTissu = async (id, newTissu) => {
    updateAccessoire(id, { tissu: newTissu });
    await updateAccessoireTissu(id, newTissu);
  };

  const revenirGrille = () => {
    setPoupeeExiste(false);
    setIdPoupee("");
    cancelCreation();
  };

  const poupeeAffichee = isCreating
    ? creationData
    : { peau, yeux, levres, cheveux, nomCoiffure, chaussuresColor, nomChaussures, nomHaut, nomBas, prenom, tissuHaut, tissuBas, accessoires };

  // ------------------- MODALES PSEUDO -------------------
  const handlePseudoSubmit = async (pseudo, mode) => {
    const existed = await pseudoExiste(pseudo);
    if (mode === "create" && existed) return setPseudoError("Ce pseudo est déjà utilisé.");
    if (mode === "login" && !existed) return setPseudoError("Cet utilisateur n'existe pas.");
    if (mode === "create") await creerUtilisateurSiAbsent(pseudo);
    setPseudo(pseudo);
  };

  // ------------------- MODALES POUPEE -------------------
  const handleCancelPoupee = () => {
    cancelCreation();
    setPoupeeExiste(false);
    setIdPoupee("");
  };

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

  // ------------------- CHANGEMENT DE TISSU -------------------
  const handleChangeTissu = async (newTissu) => {
    if (!picker?.zoneId) return;

    const key = `${picker.target}-${picker.zoneId}`;
    setTissusZones(prev => ({
      ...prev,
      [key]: { ...newTissu, instanceId: `${idPoupee}-${key}` }
    }));

    if (picker.target === "bas") {
      const updated = { ...(tissuBas || {}), [picker.zoneId]: newTissu };
      await updateTissuBas(updated);
    } else if (picker.target === "haut") {
      const updated = { ...(tissuHaut || {}), [picker.zoneId]: newTissu };
      await updateTissuHaut(updated);
    } else if (picker.target === "accessoire") {
      await updateAccessoireTissu(picker.zoneId, newTissu);
    }
  };

  // ------------------- RENDER -------------------
  return (
    <div className="App zoomIn">
      {!hasPseudo && (
        <ModalPseudo
          visible={!hasPseudo}
          onSubmit={handlePseudoSubmit}
          error={pseudoError}
          setError={setPseudoError}
        />
      )}

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
              onAnnuler={handleCancelPoupee}
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
                poupeeActive={poupeeAffichee}
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
                selectedAccessoireId={selectedAccessoireId}
                setSelectedAccessoireId={setSelectedAccessoireId}
                handleAddAccessoire={handleAddAccessoire}
                handleDeleteAccessoire={handleDeleteAccessoire}
                handleUpdateAccessoire={handleUpdateAccessoire}
                duplicateAccessoire={duplicateAccessoire}
                handleChangeAccessoireTissu={handleChangeAccessoireTissu}
                revoirGrille={revenirGrille}
              />
            </>
          )}
        </>
      )}
    </div>
  );
}