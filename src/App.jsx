import React, { useState, useEffect } from "react";
import Poupee from "./components/Poupee.jsx";
import ColorPicker from "./ColorPicker.jsx";
import { doc, getDoc } from "firebase/firestore";
import { db } from './firebase/firebase';
import { savePoupeeField } from "./firebase/firestoreFunctions.js";

import './App.scss';

function App() {

  const [contentH1, setTitre] = useState("Ma meilleure amie");

  const [prenom, setPrenom] = useState("");
  const [peau, setPeau] = useState("#FFE4D9");
  const [yeux, setYeux] = useState("#0000FF");
  const [poupeeExiste, setPoupeeExiste] = useState(false);
  const [modalVisible, setModalVisible] = useState(true);

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
        setTitre('Mon amie ' + prenom +'');
        //alert(`Poupée "${prenom}" chargée !`);
        setModalVisible(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const showColorPicker = (e, fieldName) => {
    setPickerX(e.clientX);
    setPickerY(e.clientY);
    setCurrentField(fieldName);
    setTempColor(fieldName === "peau" ? peau : yeux);
    setPickerVisible(true);
  };

  const applyColor = async (colorHex) => {
    if (!currentField || !prenom) return;

    if (currentField === "peau") setPeau(colorHex);
    if (currentField === "yeux") setYeux(colorHex);

    await savePoupeeField(prenom, currentField, colorHex);
    setPickerVisible(false);
    setTempColor(null);
  };

  return (
    <div className="App">
      <h1>{contentH1}</h1>

      {/* Saisie du prénom et boutons */}
      <div className={`modal ${!modalVisible ? "displayNone" : ""}`}>
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

      {/* Affichage de la poupée */}
      <Poupee
        peau={currentField === "peau" ? tempColor || peau : peau}
        yeux={currentField === "yeux" ? tempColor || yeux : yeux}
        onPickColor={showColorPicker}
      />

      {/* Color Picker */}
      {pickerVisible && (
        <ColorPicker
          x={pickerX}
          y={pickerY}
          currentColor={tempColor}
          onValidate={applyColor}
          onClose={() => {
            setPickerVisible(false);
            setTempColor(null);
          }}
          onChange={(color) => setTempColor(color)}
        />
      )}
    </div>
  );
}

export default App;
