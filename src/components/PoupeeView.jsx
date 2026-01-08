// PoupeeView.jsx
import React, { useState } from "react";
import FilleNue from "./FilleNue";
import { hairs } from "./CarouselCoiffuresData";
import CarouselCoiffures from "./CarouselCoiffures.jsx";
import Menu from "./Menu.jsx";

export default function PoupeeView({
  peau,
  yeux,
  levres,
  cheveux,
  nomCoiffure,
  setNomCoiffure,
  openColorPicker,
  revoirGrille
}) {

   const [carouselVisible, setCarouselVisible] = useState(false);


  // Détermine la coiffure à afficher si carousel non visible
  const coiffureAAfficher = nomCoiffure
    ? hairs.find(h => h.name === nomCoiffure)
    : null;

const handleSelect = (hairName) => {
    setNomCoiffure(hairName);    // met à jour le nom dans App.jsx
    setCarouselVisible(false);    // ferme le carousel
  };

  // Fonction pour passer à Menu
  const showCarousel = () => setCarouselVisible(true);

  return (
    
    <div id="poupeeView" className="zoomIn">
        {/* Menu */}
      <Menu 
        onShowCarousel={showCarousel} 
        onRevoirGrille={revoirGrille} 
      />

      {/* Poupée de base */}
      <div id="poupee">
        <FilleNue
          peau={peau}
          yeux={yeux}
          levres={levres}
          openColorPicker={openColorPicker}
        />
      </div>

      {/* Affichage carousel ou coiffure choisie */}
      {carouselVisible ? (
        <CarouselCoiffures
          color={cheveux}
          initialHairName={nomCoiffure}
          onSelect={handleSelect}
        />
      ) : coiffureAAfficher ? (
        <div id="coiffureChoisie" style={{ position: "relative" }}>
          {React.createElement(coiffureAAfficher.component, {
            color: cheveux,
            width: 350,
            height: 290,
            onPickColor: (e) => openColorPicker(e, "cheveux"),
          })}
        </div>
      ) : null}
    </div>
  );
}
