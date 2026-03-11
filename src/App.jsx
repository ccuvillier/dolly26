import React, { useState, useEffect, useRef } from "react";
import ModalPseudo from "./components/ModalPseudo";
import ModalPrenom from "./components/ModalPrenom";
import PoupeesGrid from "./components/PoupeesGrid";
import PoupeeView from "./components/PoupeeView";
import ColorfulPicker from "./ColorfulPicker.jsx";
import PaletteTissus from "./components/paletteTissus/PaletteTissus";
import PaletteAccessoires from "./components/paletteAccessoires/PaletteAccessoires.jsx";
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
  const [carouselVisible, setCarouselVisible] = useState(false);

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

  // Appliquer une couleur à un élément
  const applyColor = (target, color, id = null) => {
    switch (target) {
      case "peau": setPeau(color); break;
      case "yeux": setYeux(color); break;
      case "levres": setLevres(color); break;
      case "cheveux": setCheveux(color); break;
      case "chaussures": setChaussuresColor(color); break;
      case "haut": setNomHaut(prev => ({ ...prev, color })); break;
      case "bas": setNomBas(prev => ({ ...prev, color })); break;
      case "accessoire":
        setAccessoires(prev =>
          prev.map(acc => acc.id === id ? { ...acc, 
            tissu:
              typeof color === "string"
                ? { ...acc.tissu, color, isUni: true }
                : color } : acc)
        );
      break;
      default: break;
    }
  };

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

  const revenirGrille = () => {
    setPoupeeExiste(false);
    setIdPoupee("");
    cancelCreation();
  };

  // ------------------- CARROUSEL COIFFURE - CHAUSSURES -------------------
  const selectHair = async (hairName) => {
    if (isCreating) setCreationData(prev => ({ ...prev, nomCoiffure: hairName }));
    else {
      updateNomCoiffure(hairName);
      await savePoupeeField(prenom, "nomCoiffure", hairName);
    }
  };
  const selectChaussures = async (chaussuresName) => {
    if (isCreating) setCreationData(prev => ({ ...prev, nomChaussures: chaussuresName }));
    else {
      updateNomChaussures(chaussuresName);
      await savePoupeeField(prenom, "nomChaussures", chaussuresName);
    }
  };

  // ------------------- POUPEE AFFICHEE -------------------
  const poupeeAffichee = isCreating
    ? creationData
    : { peau, yeux, levres, cheveux, nomCoiffure, chaussuresColor, nomChaussures, nomHaut, nomBas, prenom, tissuHaut, tissuBas };

  const titrePoupée = isCreating
    ? "Ma nouvelle amie"
    : idPoupee ? `Mon amie ${idPoupee}` : "Ma meilleure amie";

  // ------------------- CHARGEMENT DES TISSUS DEPUIS FIREBASE -------------------
  useEffect(() => {
    if (!poupeeExiste || !idPoupee) return;

    const p = poupees.find(p => p.data.prenom === prenom || p.id === idPoupee);
    if (!p) return;

    const loadedTissuHaut = p.data.tissuHaut ?? {};
    const loadedTissuBas = p.data.tissuBas ?? {};

    setTissuHaut(loadedTissuHaut);
    setTissuBas(loadedTissuBas);

    const rebuiltZones = {};

    Object.entries(loadedTissuBas).forEach(([zone, tissu]) => {
      rebuiltZones[`bas-${zone}`] = tissu;
    });

    Object.entries(loadedTissuHaut).forEach(([zone, tissu]) => {
      rebuiltZones[`haut-${zone}`] = tissu;
    });

    setTissusZones(rebuiltZones);

  }, [poupeeExiste, idPoupee, poupees, prenom]);

  // ------------------- GESTION PALETTE TISSUS -------------------
  const applyTissu = (target, patch, id) => {
    const cleanPatch = {
      ...patch,
      ref: patch.ref ?? patch.name.replace(/^tissu-/, "")
    };

    if (target === "haut") {
      const zone = picker.target; // zone1 zone2 etc
      updateTissuHaut({
        [zone]: cleanPatch
      });
    } 

    else if (target === "bas") {
      const zone = picker.target; // zone1 zone2 etc
      updateTissuBas({
        [zone]: cleanPatch
      });
    } 

    else if (target === "accessoire") { updateAccessoireTissu(id, cleanPatch); }
  };

  //const handleChangeTissu = (newTissu, id) => {applyTissu(picker.target, newTissu, id)}; 
  // State central pour toutes les zones
  const [tissusZones, setTissusZones] = useState({});

  // Appliquer le tissu sélectionné depuis la palette
  const handleChangeTissu = async (newTissu) => {
    if (!picker?.zoneId) return;

    const key = `${picker.target}-${picker.zoneId}`;

    // Mise à jour locale pour le rendu
    setTissusZones(prev => ({
      ...prev,
      [key]: { ...newTissu, instanceId: `${idPoupee}-${key}` }
    }));

    // Mise à jour Firestore selon le type
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


  // ------------ GESTION DE LA PALETTE ACCESSOIRES ----------//
  const [activePalette, setActivePalette] = useState(null); 
  const showAccessoires = (state = "accessoires") => setActivePalette(state);
  const [selectedAccessoireId, setSelectedAccessoireId] = useState(null);
  const documentRef = useRef(null);

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


  // supprimer un accessoire
  const handleDeleteAccessoire = (id) => {
    deleteAccessoire(id);
  };

  // mettre à jour l'accessoire
  const handleUpdateAccessoire = (id, newProps) => {
    updateAccessoire(id, newProps);
  };

  // dupliquer l'accessoire
  const duplicateAccessoire = (clone) => {
    //console.log("Duplication : ajout du clone avec id", clone.id);
    addAccessoire(clone);
  };


  // ------------------- RENDER -------------------
  return (
    <div className="App zoomIn" ref={documentRef}>

      {/* MODALE PSEUDO */}
      {!hasPseudo && (
        <ModalPseudo
          visible={!hasPseudo}
          onSubmit={handlePseudoSubmit}
          error={pseudoError}
          setError={setPseudoError}
        />
      )}

      {/* APRÈS PSEUDO */}
      {hasPseudo && (
        <>
          {/* GRILLE DE POUPEES */}
          {!poupeeExiste && !showModalPrenom && !isCreating && (
            <PoupeesGrid
              poupees={poupees}
              onAddPoupee={startCreation}
              chargerPoupee={chargerPoupee}
              supprimerPoupee={supprimerPoupee}
              renommerPoupee={renommerPoupee}
            />
          )}

          {/* MODALE PRENOM */}
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

          {/* POUPEE VIEW */}
          {!showModalPrenom && (isCreating || poupeeExiste) && (
            <>
              <h1>{titrePoupée}</h1>
              <PoupeeView
                id={idPoupee}
                {...poupeeAffichee}
                setNomCoiffure={isCreating
                  ? (value) => setCreationData(prev => ({ ...prev, nomCoiffure: value }))
                  : setNomCoiffure
                }
                setNomHaut={isCreating
                  ? (value) => setCreationData(prev => ({ ...prev, nomHaut: value }))
                  : setNomHaut
                }
                setNomBas={isCreating
                  ? (value) => setCreationData(prev => ({ ...prev, nomBas: value }))
                  : setNomBas
                }
                setNomChaussures={isCreating
                  ? (value) => setCreationData(prev => ({ ...prev, nomChaussures: value }))
                  : setNomChaussures
                }
                openPicker={openPicker}
                closePicker={closePicker}
                revoirGrille={revenirGrille}
                tissusZones={tissusZones}
                setTissusZones={setTissusZones}
                tissuBas={{ ...tissuBas, instanceId: idPoupee }}
                setTissuBas={updateTissuBas}
                tissuHaut={tissuHaut}
                setTissuHaut={updateTissuHaut}
                accessoires={accessoires}
                selectedAccessoireId={selectedAccessoireId}
                setSelected={setSelectedAccessoireId}
                onUpdate={handleUpdateAccessoire}
                onDelete={handleDeleteAccessoire}
                showAccessoires={showAccessoires}
                duplicateAccessoire={duplicateAccessoire}
              />

              {/* COLOR PICKER */}
              {picker.visible && picker.type === "color" && (
                <ColorfulPicker
                  x={picker.x}
                  y={picker.y}
                  currentColor={picker.value}
                  target={picker.target}
                  onChange={applyColor}
                  onClose={closePicker}
                  picker={picker}
                />
              )}

              {/* PALETTE TISSUS */}
              {picker.visible && picker.type === "tissu" && (
                <PaletteTissus
                  x={picker.x}
                  y={picker.y}
                  target={picker.target}
                 tissu={
                    (picker.target === "bas" || picker.target === "haut")
                      ? tissusZones[`${picker.target}-${picker.zoneId}`]
                      : DEFAULT_TISSU
                  }
                  onChange={handleChangeTissu}
                  onClose={closePicker}
                  openPicker={openPicker}
                  picker={picker}
                />
              )}

              {/* PALETTE ACCESSOIRES */}
              {activePalette === "accessoires" && (
                <PaletteAccessoires
                  onAddAccessoire={handleAddAccessoire}
                  onClose={() => setActivePalette(null)}
                />
              )}

              

              {/* PALETTE TISSUS POUR ACCESSOIRE */}
              {picker.visible && picker.type === "accessoire" && (
                <PaletteTissus
                  x={picker.x}
                  y={picker.y}
                  target={picker.target}
                  id={picker.id} 
                  tissu={picker.value}
                  onChange={handleChangeTissu}
                  onClose={closePicker}
                  openPicker={openPicker}
                  picker={picker}
                />
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
