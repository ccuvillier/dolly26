// PoupeeView.jsx
import React, { useState } from "react";
import FilleNue from "./FilleNue";
import { hairs } from "./CarouselCoiffuresData";
import CarouselCoiffures from "./CarouselCoiffures.jsx";
import { hauts } from "./CarouselHautsData.jsx";
import CarouselHauts from "./CarouselHauts.jsx";
import Menu from "./Menu.jsx";

export default function PoupeeView({
  peau,
  yeux,
  levres,
  cheveux,
  nomCoiffure,
  setNomCoiffure,
  colorHaut,
  nomHaut,
  setNomHaut,
  openColorPicker,
  revoirGrille
}) {

   const [carouselVisible, setCarouselVisible] = useState(false); 
   const [carouselHautsVisible, setCarouselHautsVisible] = useState(false);


  // Détermine la coiffure à afficher si carousel non visible
  const coiffureAAfficher = nomCoiffure
    ? hairs.find(h => h.name === nomCoiffure)
    : null;

  const handleSelect = (hairName) => {
    setNomCoiffure(hairName);    // met à jour le nom dans App.jsx
    setCarouselVisible(false);    // ferme le carousel
  };

  // Détermine le haut à afficher si carousel non visible
  const hautAAfficher = nomHaut
    ? hauts.find(h =>h.name === nomHaut)
    : null;

  const handleSelectHaut = (hautName) => {
    setNomHaut(hautName);
    setCarouselHautsVisible(false);
  }


  // Fonction pour passer à Menu
  const showCarousel = () => setCarouselVisible(true);
  const showHaut = () => setCarouselHautsVisible(true);

  return (
    
    <div id="poupeeView" className="zoomIn">
        {/* Menu */}
      <Menu  
        onShowCarousel={showCarousel} 
        onShowCarouselHauts={showHaut}
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
      {carouselVisible && !carouselHautsVisible ? (
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

      {/* Affichage carousel ou haut choisi */}
      {carouselHautsVisible && !carouselVisible ? (
        <CarouselHauts
          color={colorHaut}
          initialHautName={nomHaut}
          onSelect={handleSelectHaut}
        />
      ) : hautAAfficher ? (
        <div id="hautChoisi" style={{ position: "relative" }}>
          {React.createElement(hautAAfficher.component, {
            color: colorHaut,
            width: 220,
            height: 195,
            onPickColor: (e) => openColorPicker(e, "colorHaut"),
          })}
        </div>
      ) : null}
    </div>
  );
}
