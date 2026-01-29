// PoupeeView.jsx
import React, { useState } from "react";
import FilleNue from "./FilleNue";
import { hairs } from "./carousels/data/CarouselCoiffuresData";
import CarouselCoiffures from "./carousels/CarouselCoiffures.jsx";
import { hauts } from "./carousels/data/CarouselHautsData.jsx";
import CarouselHauts from "./carousels/CarouselHauts.jsx";
import { bass } from "./carousels/data/CarouselBasData.jsx";
import CarouselBas from "./carousels/CarouselBas.jsx";
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
  colorBas,
  nomBas,
  setNomBas,
  tissuBas,
  setTissuBas,
  openPicker,
  revoirGrille
}) {

  const [activeCarousel, setActiveCarousel] = useState(null);
  // valeurs possibles : "coiffure" | "haut" | "bas" | null


  // Détermine la coiffure à afficher si carousel non visible
  const coiffureAAfficher = nomCoiffure
    ? hairs.find(h => h.name === nomCoiffure)
    : null;

  const handleSelect = (hairName) => {
    setNomCoiffure(hairName);    // met à jour le nom dans App.jsx
    setActiveCarousel(null);    // ferme le carousel
  };

  // Détermine le haut à afficher si carousel non visible
  const hautAAfficher = nomHaut
    ? hauts.find(h =>h.name === nomHaut)
    : null;

  const handleSelectHaut = (hautName) => {
    setNomHaut(hautName);
    setActiveCarousel(null);
  }

  // Détermine le bas à afficher si carousel non visible
  const basAAfficher = nomBas
    ? bass.find(h =>h.name === nomBas)
    : null;
  
  const handleSelectBas = (basName) => {
    setNomBas(basName);
    setActiveCarousel(null);
  }


  // Fonction pour passer à Menu
  const showCarousel = () => setActiveCarousel("coiffure");
  const showHaut = () => setActiveCarousel("haut");
  const showBas = () => setActiveCarousel("bas");

  return (
    
    <div id="poupeeView" className="zoomIn">
        {/* Menu */}
      <Menu  
        onShowCarousel={showCarousel} 
        onShowCarouselHauts={showHaut}
        onShowCarouselBas={showBas}
        onRevoirGrille={revoirGrille}
      />

      {/* Poupée de base */}
      <div id="poupee">
        <FilleNue
          peau={peau}
          yeux={yeux}
          levres={levres}
          openPicker={openPicker}
        />
      </div>

      {/* Affichage carousel ou coiffure choisie */}
      {activeCarousel === "coiffure" ? (
        <CarouselCoiffures
          color={cheveux}
          initialHairName={nomCoiffure}
          onSelect={handleSelect}
        />
      ) : coiffureAAfficher ? (
        <div id="coiffureChoisie" style={{ position: "relative" }}>
          {React.createElement(coiffureAAfficher.component, {
            color: cheveux,
            onPickColor: (e) => openPicker(e, {
              type: "color",
              target: "cheveux",
              value: cheveux
            }),
          })}
        </div>
      ) : null}

      {/* Affichage carousel ou haut choisi */}
      {activeCarousel === "haut" ? (
        <CarouselHauts
          color={colorHaut}
          initialHautName={nomHaut}
          onSelect={handleSelectHaut}
        />
      ) : hautAAfficher ? (
        <div id="hautChoisi" style={{ position: "relative" }}>
          {React.createElement(hautAAfficher.component, {
            tissu: { name: nomHaut, color: colorHaut, isUni: true },
            onPickColor: (e) => openPicker(e, {
              type: "tissu",
              target: "Haut",
              value: tissuHaut
            })
          })}
        </div>
      ) : null}

      {/* Affichage carousel ou bas choisi */}
      {activeCarousel === "bas" ? (
        <CarouselBas
          color={colorBas}
          initialBasName={nomBas}
          onSelect={handleSelectBas}
        />
      ) : basAAfficher ? (
        <div id="basChoisi" style={{ position: "relative" }}>
          {React.createElement(basAAfficher.component, {
            tissuBas: tissuBas,
            onPickColor: (e) => openPicker(e, {
              type: "tissu",
              target: "bas",
              value: tissuBas
            })
          })}
        </div>
      ) : null}
    </div>
  );
}
