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
    updateNomCoiffure,
    tissuHaut, updateTissuHaut,
    tissuBas, updateTissuBas,
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
    : { peau, yeux, levres, cheveux, nomCoiffure, nomHaut, nomBas, prenom, tissuHaut, tissuBas };

  const titrePoupée = isCreating
    ? "Ma nouvelle amie"
    : idPoupee
      ? `Mon amie ${idPoupee}`
      : "Ma meilleure amie";

  
/*------------GESTION DES TISSUS ------------- 
const [tissuHaut, setTissuHaut] = useState(poupeeAffichee?.tissuHaut ?? DEFAULT_TISSU);
const [tissuBas, setTissuBas] = useState(poupeeAffichee?.tissuBas ?? DEFAULT_TISSU);*/

useEffect(() => {
  if (!poupeeExiste || !idPoupee) return;

  // Cherche la poupée chargée dans ton tableau poupees
  const p = poupees.find(p => p.prenom === prenom || p.id === idPoupee);
  if (!p) return;

  setTissuHaut(prev =>
    JSON.stringify(prev) === JSON.stringify(p.tissuHaut)
      ? prev
      : { ...DEFAULT_TISSU, ...p.tissuHaut }
  );

  setTissuBas(prev =>
    JSON.stringify(prev) === JSON.stringify(p.tissuBas)
      ? prev
      : { ...DEFAULT_TISSU, ...p.tissuBas }
  );

}, [poupeeExiste, idPoupee, poupees]);



// Fonction merge safe pour PaletteTissus
const applyTissu = (target, patch) => {
  if (target === "haut") {
    setTissuHaut(prev => {
      const merged = { ...prev, ...patch };
      if (!isCreating && idPoupee) {
        savePoupeeField(pseudo, idPoupee, "tissuHaut", merged);
      }
      return merged;
    });
  } else if (target === "bas") {
    setTissuBas(prev => {
      const merged = { ...prev, ...patch };
      if (!isCreating && idPoupee) {
        savePoupeeField(pseudo, idPoupee, "tissuBas", merged);
      }
      return merged;
    });
  }
};

// Handler pour PaletteTissus
const handleChangeTissu = (newTissu) => {
  applyTissu(picker.target, newTissu);
};



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
          {console.log("APP → POUPEE VIEW PROPS :", {
  isCreating,
  poupeeAffichee,
  tissuHaut,
  tissuBas
})}
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
                setTissuBas={updateTissuBas}
                tissuHaut={tissuHaut}
                setTissuHaut={updateTissuHaut}
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
                  onChange={handleChangeTissu}
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
