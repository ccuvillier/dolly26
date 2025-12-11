import React, { useState } from "react";
import Poupee from "./components/Poupee";
import CarouselCoiffures from "./components/CarouselCoiffures";
import { hairs } from "./components/CarouselCoiffuresData";
import ColorPicker from "./ColorPicker.jsx";
import Menu from "./components/Menu";
import ModalPrenom from "./components/ModalPrenom";

import usePoupee from "./hooks/usePoupee";
import useColorPicker from "./hooks/useColorPicker";
import useCoiffures from "./hooks/useCoiffures";

import './App.scss';

export default function App() {
  const [modalVisible, setModalVisible] = useState(true);

  // Hooks personnalisés
  const {
    prenom, setPrenom,
    peau, setPeau,
    yeux, setYeux,
    levres, setLevres,
    cheveux, setCheveux,
    nomCoiffure, setNomCoiffure,
    poupeeExiste,
    creerPoupee,
    chargerPoupee,
    updateNomCoiffure
  } = usePoupee();

  const {
    pickerVisible, pickerX, pickerY,
    currentField, openColorPicker,
    applyColor, setPickerVisible
  } = useColorPicker(peau, setPeau, yeux, setYeux, levres, setLevres, cheveux, setCheveux, prenom);

  const {
    selectedHairIndex,
  } = useCoiffures(prenom);//, setNomCoiffure


  const [carouselVisible, setCarouselVisible] = useState(false);

  const selectHair = (hairName) => {
    updateNomCoiffure(hairName); 
    setCarouselVisible(false);   // ✅ maintenant défini ici
  };

  const showCarousel = () => setCarouselVisible(true);




  // Détermine la coiffure à afficher
  const coiffureAAfficher = nomCoiffure 
    ? hairs.find(h => h.name === nomCoiffure) 
    : selectedHairIndex !== null 
      ? hairs[selectedHairIndex] 
      : null;

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
        levres={levres}
        openColorPicker={openColorPicker}
      />

      {/* Carousel ou coiffure choisie */}
      {carouselVisible ? (
        <CarouselCoiffures 
          color={cheveux} 
          onSelect={selectHair} 
          openColorPicker={(e) => openColorPicker(e, "cheveux")}
          initialHairName={nomCoiffure}
        />
      ) : (coiffureAAfficher) ? (
        <div id="coiffureChoisie" style={{ position: "relative" }}>
          {React.createElement(coiffureAAfficher.component, {
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
            currentField === "levres" ? levres :
            cheveux
          }
          onChange={applyColor}
          onClose={() => setPickerVisible(false)}
        />
      )}
    </div>
  );
}
