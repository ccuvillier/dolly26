import React, { useState } from "react";
import ModalPseudo from "./components/ModalPseudo";
import ModalPrenom from "./components/ModalPrenom";
import PoupeesGrid from "./components/PoupeesGrid";
import PoupeeView from "./components/PoupeeView";
import ColorPicker from "./ColorPicker.jsx";

import usePoupee from "./hooks/usePoupee";
import useColorPicker from "./hooks/useColorPicker";

import { creerUtilisateurSiAbsent } from "./firebase/firestoreFunctions";

import './App.scss';

export default function App() {
  const [pseudo, setPseudo] = useState("");
  const hasPseudo = pseudo.trim() !== "";

  const [modalVisible, setModalVisible] = useState(true); //Pour le pseudo
  const [carouselVisible, setCarouselVisible] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Hook des poupées
  const {
    poupees,
    idPoupee, setIdPoupee,
    prenom, setPrenom,
    peau, setPeau,
    yeux, setYeux,
    levres, setLevres,
    cheveux, setCheveux,
    nomCoiffure, setNomCoiffure,
    poupeeExiste, setPoupeeExiste,
    creerPoupee,
    chargerPoupee,
    updateNomCoiffure
  } = usePoupee(pseudo);

  // Revenir à la grille de poupées
  const revoirGrille = () => {
    setPoupeeExiste(false);
    setIdPoupee("");
    setIsCreating(false);
  };



//Ajouter une poupée
const [showModalPrenom, setShowModalPrenom] = useState(false);
const [nouveauPrenom, setNouveauPrenom] = useState("");
//const [nouveauNom, setNouveauNom] = useState("");

const handleAddPoupee = () => {
  setIsCreating(true);
  setShowModalPrenom(true);
};

const handleCreer = async () => {
  if (!nouveauPrenom) return;

  // 1) Création en base → récupère ID
  const id = await creerPoupee(nouveauPrenom);

  // 2) Charger la poupée dans les states locaux
  await chargerPoupee(id);

  // 3) Afficher la poupée
  setIdPoupee(id);
  setPoupeeExiste(true);

  // 4) Fermer la modale
  setShowModalPrenom(false);
  setNouveauPrenom("");
  //setNouveauNom("");
};





  // Hook ColorPicker
  const {
    pickerVisible, pickerX, pickerY,
    currentField, openColorPicker,
    applyColor, setPickerVisible
  } = useColorPicker(pseudo, idPoupee, peau, setPeau, yeux, setYeux, levres, setLevres, cheveux, setCheveux);


  // Sélection d'une coiffure depuis le carousel
  const selectHair = (hairName) => {
    updateNomCoiffure(hairName);
    setCarouselVisible(false);
  };

  // Affichage du prénom ou texte par défaut
  const titrePoupée = idPoupee ? `Mon amie ${idPoupee}` : "Ma meilleure amie";

  

  return (
    <div className="App">
      {/* Modal pseudo si non rempli */}
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

      {/* Après saisie du pseudo */}
      {hasPseudo && (
        <>
          {/* Affichage grille de poupées */}
          {!poupeeExiste && !showModalPrenom && !isCreating && (
            <PoupeesGrid
              poupees={poupees}
              creerPoupee={creerPoupee}
              chargerPoupee={chargerPoupee}
              onAddPoupee={handleAddPoupee}
            />
          )}

          {/* Modal pour nom + prénom */}
          {showModalPrenom && (
          
            <ModalPrenom
              visible={showModalPrenom}
              prenom={nouveauPrenom}
              setPrenom={setNouveauPrenom}
              exists={false}
              creer={handleCreer}
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

          {/* Affichage poupée sélectionnée ou en cours de création */}
          {(isCreating || poupeeExiste) && (
            <>
              <h1>{titrePoupée}</h1>

              <PoupeeView
                peau={peau}
                yeux={yeux}
                levres={levres}
                cheveux={cheveux}
                nomCoiffure={nomCoiffure}
                setNomCoiffure={setNomCoiffure}
                openColorPicker={openColorPicker}
                carouselVisible={carouselVisible}
                onSelectHair={selectHair}
                revoirGrille={revoirGrille}
              />

              {/* Color Picker */}
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
                    if (!currentField) return;  // sécurisation anti-bug
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
