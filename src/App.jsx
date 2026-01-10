import React, { useState } from "react";
import ModalPseudo from "./components/ModalPseudo";
import ModalPrenom from "./components/ModalPrenom";
import { createDefaultPoupee, DEFAULT_POUPEE } from "./constants/defaultPoupee";
import PoupeesGrid from "./components/PoupeesGrid";
import PoupeeView from "./components/PoupeeView";
import ColorPicker from "./ColorPicker.jsx";

import usePoupee from "./hooks/usePoupee";
import useColorPicker from "./hooks/useColorPicker";
import { savePoupeeField } from "./firebase/firestoreFunctions";
import { creerUtilisateurSiAbsent } from "./firebase/firestoreFunctions";

import './App.scss';

export default function App() {
  // ------------------- USER -------------------
  const [pseudo, setPseudo] = useState("");
  const hasPseudo = pseudo.trim() !== "";
  const [modalVisible, setModalVisible] = useState(true);
  const [carouselVisible, setCarouselVisible] = useState(false);

  // ------------------- CREATION -------------------
  const [isCreating, setIsCreating] = useState(false);
  const [creationData, setCreationData] = useState(createDefaultPoupee());
  const [showModalPrenom, setShowModalPrenom] = useState(false);
  const [nouveauPrenom, setNouveauPrenom] = useState("");


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
    poupeeExiste,
    setPoupeeExiste,
    creerPoupee,
    chargerPoupee,
    supprimerPoupee,
    renommerPoupee,
    updateNomCoiffure
  } = usePoupee(pseudo);

  // ------------------- COLOR PICKER -------------------
  const {
    pickerVisible,
    pickerX,
    pickerY,
    currentField,
    openColorPicker,
    applyColor,
    setPickerVisible
  } = useColorPicker(
    pseudo,
    idPoupee,
    peau, setPeau,
    yeux, setYeux,
    levres, setLevres,
    cheveux, setCheveux
  );

  // ------------------- GESTION MODALE POUPEE -------------------
  const handleAddPoupee = () => {
    setCreationData(createDefaultPoupee());
    setIsCreating(true);
    setShowModalPrenom(true);
    setNouveauPrenom("");
  };

  const handleCancelPoupee = () => {
    setIsCreating(false);
    setShowModalPrenom(false);
    setNouveauPrenom("");
    setPoupeeExiste(false);
    setIdPoupee("");
  };

  const handleCreer = async () => {
    if (!nouveauPrenom) return;

    // Création dans Firebase
    const id = await creerPoupee(nouveauPrenom);

    // Charger la poupée dans les states locaux
    await chargerPoupee(id);

    // Afficher la poupée
    setIdPoupee(id);
    setPoupeeExiste(true);

    // Fermer la modal
    setShowModalPrenom(false);
    setNouveauPrenom("");
    setIsCreating(false);
  };

  // ------------------- CARROUSEL -------------------
  const selectHair = async (hairName) => {
    if (isCreating) {
      setCreationData(prev => ({ ...prev, nomCoiffure: hairName }));
    } else {
      updateNomCoiffure(hairName);
      await savePoupeeField(prenom, "nomCoiffure", hairName);
    }
  };

  // ------------------- POUPEE AFFICHEE -------------------
  const poupeeAffichee = isCreating
    ? creationData
    : { peau, yeux, levres, cheveux, nomCoiffure, prenom };

  const titrePoupée = isCreating
    ? "Ma nouvelle amie"
    : idPoupee
      ? `Mon amie ${idPoupee}`
      : "Ma meilleure amie";

  // ------------------- RENDER -------------------
  return (
    <div className="App zoomIn">

      {/* MODAL PSEUDO */}
      {!hasPseudo && (
        <ModalPseudo
          visible={!hasPseudo}
          onSubmit={async (validatePseudo) => {
            setPseudo(validatePseudo);
            await creerUtilisateurSiAbsent(validatePseudo);
            setModalVisible(false);
          }}
        />
      )}

      {/* APRÈS PSEUDO */}
      {hasPseudo && (
        <>
          {/* GRILLE DE POUPEES */}
          {!poupeeExiste && !showModalPrenom && !isCreating && (
            <PoupeesGrid
              poupees={poupees}
              creerPoupee={creerPoupee}
              chargerPoupee={chargerPoupee}
              onAddPoupee={handleAddPoupee}
              supprimerPoupee={supprimerPoupee}
              renommerPoupee={renommerPoupee}
            />
          )}

          {/* MODAL PRENOM */}
          {showModalPrenom && (
            <ModalPrenom
              visible={showModalPrenom}
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
          {(isCreating || poupeeExiste) && (
            <>
              <h1>{titrePoupée}</h1>

              <PoupeeView
                {...poupeeAffichee}
                setNomCoiffure={isCreating
                  ? (value) => setCreationData(prev => ({ ...prev, nomCoiffure: value }))
                  : setNomCoiffure
                }
                openColorPicker={openColorPicker}
                carouselVisible={carouselVisible}
                onSelectHair={selectHair}
                revoirGrille={() => {
                  setPoupeeExiste(false);
                  setIdPoupee("");
                  setIsCreating(false);
                }}
              />

              {/* COLOR PICKER */}
              {pickerVisible && (
                <ColorPicker
                  x={pickerX}
                  y={pickerY}
                  currentColor={
                    currentField === "peau" ? peau :
                    currentField === "yeux" ? yeux :
                    currentField === "levres" ? levres :
                    currentField === "cheveux" ? cheveux :
                    "#FFFFFF"
                  }
                  onChange={(color) => {
                    if (!currentField) return;
                    applyColor(color);
                  }}
                  onClose={() => setPickerVisible(false)}
                />
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
