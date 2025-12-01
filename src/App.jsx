import React, { useState, useEffect } from "react";
import Poupee from "./components/Poupee.jsx";
import CarouselCoiffures from "./components/CarouselCoiffures";
import ColorPicker from "./ColorPicker.jsx";
import { doc, getDoc } from "firebase/firestore";
import { db } from './firebase/firebase';
import { savePoupeeField } from "./firebase/firestoreFunctions.js";

import './App.scss';

function App() {

  // Titre
  const [contentH1, setTitre] = useState("Ma meilleure amie");

  // Poupée
  const [prenom, setPrenom] = useState("");
  const [peau, setPeau] = useState("#FFE4D9");
  const [yeux, setYeux] = useState("#0000FF");
  const [poupeeExiste, setPoupeeExiste] = useState(false);
  const [modalVisible, setModalVisible] = useState(true);

  // coiffures
  const [hairColor, setHairColor] = useState("#FFFFFF");

  // ColorPicker
  const [pickerVisible, setPickerVisible] = useState(false);
  const [pickerX, setPickerX] = useState(0);
  const [pickerY, setPickerY] = useState(0);
  const [currentField, setCurrentField] = useState(null);
  const [tempColor, setTempColor] = useState(null);

  // Vérifie si la poupée existe à chaque changement de prénom
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

  const openColorPicker = (e, fieldName) => {
    const clientX = e?.clientX ?? window.innerWidth / 2;
    const clientY = e?.clientY ?? window.innerHeight / 2;

    setPickerX(clientX + window.scrollX);
    setPickerY(clientY + window.scrollY);

    setCurrentField(fieldName);

    // => on initialise tempColor avec la vraie couleur actuelle
    if (fieldName === "peau") setTempColor(peau);
    else if (fieldName === "yeux") setTempColor(yeux);
    else if (fieldName === "cheveux") setTempColor(hairColor);
    else setTempColor("#ffffff");

    setPickerVisible(true);
  };

  const applyColor = async (colorHex) => {
    console.log("APPLY COLOR TRIGGERED:", colorHex);
    if (!currentField || !prenom) return;

    if (currentField === "peau") setPeau(colorHex);
    if (currentField === "yeux") setYeux(colorHex);
    if (currentField === "cheveux") setHairColor(colorHex);

    await savePoupeeField(prenom, currentField, colorHex);

    setPickerVisible(false);
    //setTempColor(null);
  };

  // Fonction pour fournir la couleur réelle de chaque champ
  const getRealColor = () => {
    if (currentField === "peau") return tempColor ?? peau;
    if (currentField === "yeux") return tempColor ?? yeux;
    if (currentField === "cheveux") return tempColor ?? hairColor;
    return "#ffffff";
  };

  return (
    <div className="App">
      <h1>{contentH1}</h1>

      {/* Saisie du prénom et boutons */}
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

      {/* Affichage de la poupée */}
      <Poupee
        peau={currentField === "peau" ? (tempColor ?? peau) : peau}
        yeux={currentField === "yeux" ? (tempColor ?? yeux) : yeux}
        openColorPicker={openColorPicker}
      />

      {/* Affichage du carousel */}
      <CarouselCoiffures 
        color={currentField === "cheveux" ? (tempColor ?? hairColor) : hairColor} 
        onSelect={(index) => console.log("Coiffure choisie", index)}
        openColorPicker={openColorPicker}
      />

      {/* Color Picker */}
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
          onValidate={applyColor}
          onClose={() => {
            setPickerVisible(false);
            //setTempColor(null); // uniquement ici
          }}
          onChange={(color) => setTempColor(color)}
        />
      )}
    </div>
  );
}

export default App;
