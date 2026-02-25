import React, { useState, useRef } from "react";
import ModalPseudo from "./components/ModalPseudo";
import ModalPrenom from "./components/ModalPrenom";
import PoupeesGrid from "./components/PoupeesGrid";
import PoupeeView from "./components/PoupeeView";
import ColorfulPicker from "./ColorfulPicker.jsx";
import PaletteTissus from "./components/paletteTissus/PaletteTissus";
import PaletteAccessoires from "./components/paletteAccessoires/PaletteAccessoires.jsx";
import Accessoire from "./components/paletteAccessoires/Accessoires.jsx";
import { ACCESSOIRES_COMPONENTS } from "./components/paletteAccessoires/data/componentsRegistry";

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
    poupeeExiste,
    setPoupeeExiste,

    prenom,
    peau, setPeau,
    yeux, setYeux,
    levres, setLevres,
    cheveux, setCheveux,

    nomCoiffure, updateNomCoiffure, setNomCoiffure,
    nomHaut, updateTissuHaut, setNomHaut,
    nomBas, updateTissuBas, setNomBas,
    nomChaussures, updateNomChaussures, setNomChaussures,
    chaussuresColor, setChaussuresColor,

    tissuHaut, setTissuHaut,
    tissuBas, setTissuBas,

    accessoires,
    addAccessoire,
    updateAccessoire,
    deleteAccessoire,
    updateAccessoireTissu,

    creerPoupee,
    chargerPoupee,
    supprimerPoupee,
    renommerPoupee
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

  const applyColor = (target, color, id = null) => {
    switch (target) {
      case "peau": setPeau(color); break;
      case "yeux": setYeux(color); break;
      case "levres": setLevres(color); break;
      case "cheveux": setCheveux(color); break;
      case "chaussures": setChaussuresColor(color); break;
      case "haut": updateTissuHaut({ color, isUni: true }); break;
      case "bas": updateTissuBas({ color, isUni: true }); break;
      case "accessoire":
        if (id) updateAccessoireTissu(id, typeof color === "string" ? { color, isUni: true } : color);
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

  // ------------------- PALETTE TISSUS -------------------
  const applyTissu = (target, patch, id) => {
    const cleanPatch = { ...patch, ref: patch.ref ?? patch.name?.replace(/^tissu-/, "") };
    if (target === "haut") updateTissuHaut(cleanPatch);
    else if (target === "bas") updateTissuBas(cleanPatch);
    else if (target === "accessoire" && id) updateAccessoireTissu(id, cleanPatch);
  };
  const handleChangeTissu = (newTissu, id) => applyTissu(picker.target, newTissu, id);

  // ------------------- PALETTE ACCESSOIRES -------------------
  const [activePalette, setActivePalette] = useState(null);
  const [selectedAccessoireId, setSelectedAccessoireId] = useState(null);
  const viewportRef = useRef(null);

  const handleAddAccessoire = (item) => {
    const rect = viewportRef.current.getBoundingClientRect();
    const newAcc = {
      id: crypto.randomUUID(),
      type: item.type,
      component: ACCESSOIRES_COMPONENTS[item.type] || item.component || null,
      x: rect.width / 2,
      y: rect.height / 2,
      scale: 1,
      rotation: 0,
      tissu: { ...DEFAULT_TISSU, instanceId: crypto.randomUUID() }
    };
    addAccessoire(newAcc);
    setSelectedAccessoireId(newAcc.id);
  };

  const handleMoveAccessoire = (id, x, y) => updateAccessoire(id, { x, y });
  const handleDeleteAccessoire = (id) => deleteAccessoire(id);
  const handleUpdateAccessoire = (id, newProps) =>
    updateAccessoire(id, { ...newProps, component: ACCESSOIRES_COMPONENTS[newProps.type] || newProps.component });

  // ------------------- POUPEE AFFICHEE -------------------
  const poupeeAffichee = isCreating
    ? creationData
    : {
        prenom, peau, yeux, levres, cheveux,
        nomCoiffure, nomHaut, nomBas, nomChaussures,
        chaussuresColor, tissuHaut, tissuBas, accessoires
      };

  const titrePoupée = isCreating ? "Ma nouvelle amie" : idPoupee ? `Mon amie ${idPoupee}` : "Ma meilleure amie";

  // ------------------- RENDER -------------------
  return (
    <div
      className="App zoomIn"
      ref={viewportRef}
      onMouseDown={(e) => { if (e.target === viewportRef.current) setSelectedAccessoireId(null); }}
    >

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
              visible
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
                style={{ marginBottom: 10 }}
              />
            </ModalPrenom>
          )}

          {!showModalPrenom && (isCreating || poupeeExiste) && (
            <>
              <h1>{titrePoupée}</h1>

              <PoupeeView
                id={idPoupee}
                {...poupeeAffichee}
                openPicker={openPicker}
                closePicker={closePicker}
                revoirGrille={revenirGrille}
                selectedAccessoireId={selectedAccessoireId}
                setSelected={setSelectedAccessoireId}
                onUpdate={handleUpdateAccessoire}
                onMove={handleMoveAccessoire}
                onDelete={handleDeleteAccessoire}
                showAccessoires={() => setActivePalette("accessoires")}
                setNomCoiffure={setNomCoiffure}
                setNomHaut={setNomHaut}
                setNomBas={setNomBas}
                setNomChaussures={setNomChaussures}
              />

              {picker.visible && picker.type === "color" && (
                <ColorfulPicker
                  x={picker.x} y={picker.y}
                  currentColor={picker.value}
                  target={picker.target}
                  onChange={applyColor}
                  onClose={closePicker}
                  picker={picker}
                />
              )}

              {picker.visible && (picker.type === "tissu" || picker.type === "accessoire") && (
                <PaletteTissus
                  x={picker.x} y={picker.y}
                  target={picker.target}
                  id={picker.id}
                  tissu={picker.value}
                  onChange={handleChangeTissu}
                  onClose={closePicker}
                  openPicker={openPicker}
                  picker={picker}
                />
              )}

              {activePalette === "accessoires" && (
                <PaletteAccessoires
                  onAddAccessoire={handleAddAccessoire}
                  onClose={() => setActivePalette(null)}
                />
              )}

              {accessoires?.map(acc => (
                <Accessoire
                  key={acc.id}
                  acc={acc}
                  selectedAccessoireId={selectedAccessoireId}
                  setSelected={setSelectedAccessoireId}
                  onUpdate={handleUpdateAccessoire}
                  onMove={handleMoveAccessoire}
                  onDelete={handleDeleteAccessoire}
                  openPicker={openPicker}
                  tissuAccessoire={acc.tissu}
                />
              ))}
            </>
          )}
        </>
      )}
    </div>
  );
}