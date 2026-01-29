import React, { useState, useEffect } from "react";
import ModalPseudo from "./components/ModalPseudo";
import ModalPrenom from "./components/ModalPrenom";
import { createDefaultPoupee, DEFAULT_POUPEE } from "./constants/defaultPoupee";
import PoupeesGrid from "./components/PoupeesGrid";
import PoupeeView from "./components/PoupeeView";
import ColorPicker from "./ColorPicker.jsx";

import useCreationPoupee from "./hooks/useCreationPoupee";
import usePoupee from "./hooks/usePoupee";
import { savePoupeeField } from "./firebase/firestoreFunctions";
import { pseudoExiste, creerUtilisateurSiAbsent } from "./firebase/firestoreFunctions";

import { DEFAULT_TISSU } from "./constants/defaultTissu";
import PaletteTissus from "./components/paletteTissus/PaletteTissus";
import useStylePicker from "./hooks/useStylePicker";


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
    nomBas, setNomBas,
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


  //-------------- PICKERS COLOR & TISSUS ----------------
  const {
    picker,
    openPicker,
    closePicker
  } = useStylePicker();

const applyColor = (target, color) => {
  switch (target) {
    case "peau": setPeau(color); break;
    case "yeux": setYeux(color); break;
    case "levres": setLevres(color); break;
    case "cheveux": setCheveux(color); break;
    case "haut": setNomHaut(prev => ({ ...prev, color })); break;
    case "bas": setNomBas(prev => ({ ...prev, color })); break;
    default: break;
  }
};


const [tissuBas, setTissuBas, tissuHaut, setTissuHaut] = useState(DEFAULT_TISSU);
const tissuSetters = {
  bas: {
    setTissu: setTissuBas
  },
  haut: {
    setTissu: setTissuHaut
  }
};

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const applyTissu = async (target, newTissuOrUpdater) => {
  const handlers = tissuSetters[target];
  if (!handlers) return;

  handlers.setTissu(prev => {
    const resolvedTissu =
      typeof newTissuOrUpdater === "function"
        ? newTissuOrUpdater(prev)
        : newTissuOrUpdater;

    // 🔥 Firebase reçoit TOUJOURS un objet
    if (!isCreating && idPoupee) {
      savePoupeeField(
        pseudo,
        idPoupee,
        `tissu${capitalize(target)}`,
        resolvedTissu
      );
    }

    return resolvedTissu;
  });
};


useEffect(() => {
  console.log("nomTissuBas =", tissuBas);
}, [tissuBas]);





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
    : { peau, yeux, levres, cheveux, nomCoiffure, nomHaut, nomBas, prenom };

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
                setNomBas={isCreating
                  ? (value) => setCreationData(prev => ({ ...prev, nomBas: value }))
                  : setNomBas
                }


                openPicker={openPicker}
                carouselVisible={carouselVisible}
                onSelectHair={selectHair}
                revoirGrille={revenirGrille}
                tissuBas={tissuBas}
                setTissuBas={setTissuBas}
              />

              {/* COLOR PICKER */}
              {picker.visible && picker.type === "color" && (
                <ColorPicker
                  x={picker.x}
                  y={picker.y}
                  currentColor={picker.value}
                  target={picker.target}
                  onChange={applyColor}
                  onClose={closePicker}
                />
              )}

              {picker.visible && picker.type === "tissu" && (
                <PaletteTissus
                  x={picker.x}
                  y={picker.y}
                  target={picker.target}
                  tissu={picker.value}
                  onChange={(newTissu) => {
                    applyTissu("bas", newTissu);
                  }}
                  onClose={closePicker}
                />
              )}


            </>
          )}
        </>
      )}
    </div>
  );
}
