import React, { useState } from "react";
import Poupee from "./components/Poupee";
import CarouselCoiffures, { hairs } from "./components/CarouselCoiffures";
import ColorPicker from "./ColorPicker.jsx";
import Menu from "./components/Menu";
import ModalPrenom from "./components/ModalPrenom";

import usePoupee from "./hooks/usePoupee";
import useColorPicker from "./hooks/useColorPicker";
import useCoiffures from "./hooks/useCoiffures";

import './App.scss';

function App() {
  const [modalVisible, setModalVisible] = useState(true);

  // Hooks personnalisés
  const {
    prenom, setPrenom,
    peau, setPeau,
    yeux, setYeux,
    cheveux, setHairColor,
    nomCoiffure, setNomCoiffure,
    poupeeExiste,
    creerPoupee,
    chargerPoupee
  } = usePoupee();

  const {
    pickerVisible, pickerX, pickerY,
    currentField, openColorPicker,
    applyColor, setPickerVisible
  } = useColorPicker(peau, setPeau, yeux, setYeux, cheveux, setHairColor, prenom);

  const {
    carouselVisible,
    selectedHairIndex,
    showCarousel,
    selectHair
  } = useCoiffures(prenom, setNomCoiffure);

  const coiffure = hairs.find(h => h.name === nomCoiffure);

  return (
    <div className="App">
      <h1>{prenom ? `Mon amie ${prenom}` : "Ma meilleure amie"}</h1>

      {/* Modal prénom */}
      <ModalPrenom
        visible={modalVisible}
        prenom={prenom}
        setPrenom={setPrenom}
        exists={poupeeExiste}
        creer={() => { creerPoupee(); setModalVisible(false); }}
        charger={() => { chargerPoupee(); setModalVisible(false); }}
      />

      {/* Menu */}
      <Menu onShowCarousel={showCarousel} poupeeExiste={poupeeExiste} />

      {/* Poupée */}
      <Poupee
        peau={peau}
        yeux={yeux}
        openColorPicker={openColorPicker}
      />

      {/* Carousel ou coiffure choisie */}
      {carouselVisible ? (
        <CarouselCoiffures color={cheveux} onSelect={selectHair} />
      ) : coiffure?.component ? (
        <div id="coiffureChoisie" style={{ position: "relative" }}>
          {React.createElement(coiffure.component, {
            color: cheveux,
            width: 350,
            height: 290,
            onPickColor: (e) => openColorPicker(e, "cheveux")
          })}
        </div>
      ) : null}

      {/* Color Picker */}
      {pickerVisible && (
        <ColorPicker
          x={pickerX}
          y={pickerY}
          currentColor={
            currentField === "peau" ? peau :
            currentField === "yeux" ? yeux :
            cheveux
          }
          onChange={applyColor}
          onClose={() => setPickerVisible(false)}
        />


      )}
    </div>
  );
}

export default App;
