import React, { useState, useEffect } from "react";
import Poupee from "./components/Poupee.jsx";
import CarouselCoiffures, { hairs } from "./components/CarouselCoiffures";
import ColorPicker from "./ColorPicker.jsx";
import { doc, getDoc } from "firebase/firestore";
import { db } from './firebase/firebase';
import { savePoupeeField } from "./firebase/firestoreFunctions.js";
import Menu from "./components/Menu.jsx";

import './App.scss';

function App() {
  const [contentH1, setTitre] = useState("Ma meilleure amie");

  // Poupée
  const [prenom, setPrenom] = useState("");
  const [peau, setPeau] = useState("#FFE4D9");
  const [yeux, setYeux] = useState("#0000FF");
  const [hairColor, setHairColor] = useState("#FFFFFF");
  const [poupeeExiste, setPoupeeExiste] = useState(false);
  const [modalVisible, setModalVisible] = useState(true);

  // ColorPicker
  const [pickerVisible, setPickerVisible] = useState(false);
  const [pickerX, setPickerX] = useState(0);
  const [pickerY, setPickerY] = useState(0);
  const [currentField, setCurrentField] = useState(null);
  const [tempColor, setTempColor] = useState(null);

  // Carousel / coiffure
  const [carouselVisible, setCarouselVisible] = useState(false);
  const [selectedHairIndex, setSelectedHairIndex] = useState(null);

  // Vérifie si la poupée existe
  useEffect(() => {
    if (!prenom) return setPoupeeExiste(false);

    const checkPoupee = async () => {
      try {
        const docRef = doc(db, "poupees", prenom);
        const docSnap = await getDoc(docRef);
        setPoupeeExiste(docSnap.exists());
      } catch (err) {
        console.error(err);
      }
    };

    checkPoupee();
  }, [prenom]);

  const creerPoupee = async () => {
    if (!prenom) return alert("Merci de saisir un prénom !");
    await savePoupeeField(prenom, "peau", peau);
    await savePoupeeField(prenom, "yeux", yeux);
    setPoupeeExiste(true);
    alert(`Poupée "${prenom}" créée !`);
    setModalVisible(false);
  };

  const voirPoupee = async () => {
    if (!prenom) return;
    try {
      const docRef = doc(db, "poupees", prenom);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.peau) setPeau(data.peau);
        if (data.yeux) setYeux(data.yeux);
        if (data.cheveux) setHairColor(data.cheveux);
        setTitre('Mon amie ' + prenom);
        setModalVisible(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Ouvrir le color picker pour la coiffure choisie
  const openColorPicker = (e, fieldName) => {
    const clientX = e?.clientX ?? window.innerWidth / 2;
    const clientY = e?.clientY ?? window.innerHeight / 2;

    setPickerX(clientX + window.scrollX);
    setPickerY(clientY + window.scrollY);
    setCurrentField(fieldName);

    // Initialise tempColor avec la couleur actuelle
      if (fieldName === "peau") setTempColor(peau);
      else if (fieldName === "yeux") setTempColor(yeux);
      else if (fieldName === "cheveux") setTempColor(hairColor);

    setPickerVisible(true);
  };

  // Applique la couleur en temps réel
  const applyColor = async (colorHex) => {
    if (!currentField || !prenom) return;

    if (currentField === "cheveux") setHairColor(colorHex);

    // Sauvegarde immédiate
    await savePoupeeField(prenom, currentField, colorHex);
  };

  // Gestion du carousel
  const showCarousel = () => setCarouselVisible(true);
  const handleSelectHair = (index) => {
    setSelectedHairIndex(index);
    setCarouselVisible(false);
  };

  return (
    <div className="App">
      <h1>{contentH1}</h1>

      {/* Saisie prénom */}
      <div className={`modal ${!modalVisible ? "displayNone" : ""}`}>
        <div>
          <input
            type="text"
            placeholder="Prénom de la poupée"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
          />
          {poupeeExiste ? (
            <button onClick={voirPoupee}>Voir</button>
          ) : (
            <button onClick={creerPoupee}>Créer</button>
          )}
        </div>
      </div>

      {/* Menu coiffure */}
      <Menu onShowCarousel={showCarousel} poupeeExiste={poupeeExiste} />

      {/* Affichage poupée */}
      <Poupee
        peau={peau}
        yeux={yeux}
        openColorPicker={openColorPicker}
      />

      {/* Affichage coiffure ou carousel */}
      {carouselVisible ? (
        <CarouselCoiffures 
          color={hairColor}
          onSelect={handleSelectHair} 
        />
      ) : selectedHairIndex !== null ? (
        <div id="coiffureChoisie" style={{ position: "relative" }}>
          {React.createElement(hairs[selectedHairIndex], {
            color: hairColor,
            width: 350,
            height: 290,
            onPickColor: (e) => openColorPicker(e, "cheveux")
          })}
        </div>
      ) : null}

      {/* Color Picker pour toutes les zones */}
      {pickerVisible && (
        <ColorPicker
          x={pickerX}
          y={pickerY}
          currentColor={
            currentField === "peau"
              ? peau
              : currentField === "yeux"
              ? yeux
              : currentField === "cheveux"
              ? hairColor
              : "#ffffff"
          }
          onChange={(color) => {
            // mise à jour temps réel selon la zone
            if (currentField === "peau") setPeau(color);
            else if (currentField === "yeux") setYeux(color);
            else if (currentField === "cheveux") setHairColor(color);

            // sauvegarde immédiate
            if (prenom && currentField) savePoupeeField(prenom, currentField, color);
          }}
          onClose={() => setPickerVisible(false)}
        />
      )}
    </div>
  );
}

export default App;
