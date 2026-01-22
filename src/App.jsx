import React, { useState } from "react";
import ModalPseudo from "./components/ModalPseudo";
import ModalPrenom from "./components/ModalPrenom";
import { createDefaultPoupee, DEFAULT_POUPEE } from "./constants/defaultPoupee";
import PoupeesGrid from "./components/PoupeesGrid";
import PoupeeView from "./components/PoupeeView";
import ColorPicker from "./ColorPicker.jsx";

import useCreationPoupee from "./hooks/useCreationPoupee";
import usePoupee from "./hooks/usePoupee";
import useColorPicker from "./hooks/useColorPicker";
import { savePoupeeField } from "./firebase/firestoreFunctions";
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
    nomHaut, setNomHaut,
    poupeeExiste,
    setPoupeeExiste,
    creerPoupee,
    chargerPoupee,
    supprimerPoupee,
    renommerPoupee,
    updateNomCoiffure
  } = usePoupee(pseudo);

  //------------- HOOK CREATION POUPEE -------------
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

  // ------------------- GESTION MODALE PSEUDO -------------------
  const handlePseudoSubmit = async (pseudo, mode) => {
    // Vérifier si l'utilisateur existe
    const existed = await pseudoExiste(pseudo);

    if (mode === "create" && existed) {
      setPseudoError("Ce pseudo est déjà utilisé.");
      return;
    }

    if (mode === "login" && !existed) {
      setPseudoError("Cet utilisateur n'existe pas.");
      return;
    }

    if (mode === "create") {
      await creerUtilisateurSiAbsent(pseudo);
    }

    setPseudo(pseudo);
  };



  // ------------------- GESTION MODALE POUPEE -------------------
  const handleAddPoupee = startCreation;

  const handleCancelPoupee = () => {
    cancelCreation();
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
    cancelCreation();
  };

  //--------------REVENIR A LA LISTE DES POUPEES ---------
  const revenirGrille = () => {
    setPoupeeExiste(false);
    setIdPoupee("");
    cancelCreation();
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
    : { peau, yeux, levres, cheveux, nomCoiffure, nomHaut, prenom };

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
              //onAddPoupee={handleAddPoupee}
              supprimerPoupee={supprimerPoupee}
              renommerPoupee={renommerPoupee}
            />
          )}

          {/* MODAL PRENOM */}
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
                {...poupeeAffichee}
                setNomCoiffure={isCreating
                  ? (value) => setCreationData(prev => ({ ...prev, nomCoiffure: value }))
                  : setNomCoiffure
                }
                setNomHaut={isCreating
                  ? (value) => setCreationData(prev => ({ ...prev, nomHaut: value }))
                  : setNomHaut
                }


                openColorPicker={openColorPicker}
                carouselVisible={carouselVisible}
                onSelectHair={selectHair}
                revoirGrille={revenirGrille}
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
