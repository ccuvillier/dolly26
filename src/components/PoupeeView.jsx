import React, { useState, useEffect } from "react";
import FilleNue from "./FilleNue";
import { hairs } from "./carousels/data/coiffuresData";
import CarouselCoiffures from "./carousels/CarouselCoiffures.jsx";
import { hauts } from "./carousels/data/hautsData";
import CarouselHauts from "./carousels/CarouselHauts.jsx";
import { bass } from "./carousels/data/bassData";
import CarouselBas from "./carousels/CarouselBas.jsx";
import Menu from "./Menu.jsx";

export default function PoupeeView({
  id,
  peau,
  yeux,
  levres,
  cheveux,
  nomCoiffure,
  setNomCoiffure,
  nomHaut,
  setNomHaut,
  tissuHaut,
  setTissuHaut,
  nomBas,
  setNomBas,
  tissuBas,
  setTissuBas,
  openPicker,
  closePicker,
  revoirGrille
}) {

  const [activeCarousel, setActiveCarousel] = useState(null); 
  // valeurs possibles : "coiffure" | "haut" | "bas" | null

  /* Debug tissus reçus
  useEffect(() => {
    console.log("🔹 tissuHaut props", tissuHaut);
    console.log("🔹 tissuBas props", tissuBas);
  }, [tissuHaut, tissuBas]); */

  // ----------------- AFFICHAGE DES ÉLÉMENTS -----------------
  const coiffureAAfficher = nomCoiffure ? hairs.find(h => h.name === nomCoiffure) : null;
  const hautAAfficher = nomHaut ? hauts.find(h => h.name === nomHaut) : null;
  const basAAfficher = nomBas ? bass.find(h => h.name === nomBas) : null;

  const handleSelectHair = (name) => { setNomCoiffure(name); setActiveCarousel(null); };
  const handleSelectHaut = (name) => { setNomHaut(name); setActiveCarousel(null); };
  const handleSelectBas = (name) => { setNomBas(name); setActiveCarousel(null); };

  const showCarousel = () => setActiveCarousel("coiffure");
  const showHaut = () => setActiveCarousel("haut");
  const showBas = () => setActiveCarousel("bas");

  /*---------- FERMER LES PALETTES TISSUS ET COLOR ---------------*/
  const handleMenuAction = (action) => {
    closePicker();
    action();
  };

  return (
    <div id="poupeeView" className="zoomIn">
      {/* Menu */}
      <Menu
        onShowCarousel={() => handleMenuAction(showCarousel)}
        onShowCarouselHauts={() => handleMenuAction(showHaut)}
        onShowCarouselBas={() => handleMenuAction(showBas)}
        onRevoirGrille={() => handleMenuAction(revoirGrille)}
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

      {/* ------------------- COIFFURE ------------------- */}
      {activeCarousel === "coiffure" ? (
        <CarouselCoiffures
          color={cheveux}
          initialHairName={nomCoiffure}
          onSelect={handleSelectHair}
        />
      ) : coiffureAAfficher ? (
        <div id="coiffureChoisie">
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

      {/* ------------------- HAUT ------------------- */}
      {activeCarousel === "haut" ? (
        <CarouselHauts
          color={tissuHaut.color}   // couleur principale du tissu
          initialHautName={nomHaut}
          onSelect={handleSelectHaut}
        />
      ) : hautAAfficher ? (
        <div id="hautChoisi">
          {React.createElement(hautAAfficher.component, {
            tissuHaut: { ...tissuHaut, instanceId: `${id}-haut` },
            onPickColor: (e) => openPicker(e, {
              type: "tissu",
              target: "haut",
              value: tissuHaut
            }),
          })}
        </div>
      ) : null}

      {/* ------------------- BAS ------------------- */}
      {activeCarousel === "bas" ? (
        <CarouselBas
          color={tissuBas.color}
          initialBasName={nomBas}
          onSelect={handleSelectBas}
        />
      ) : basAAfficher ? (
        <div id="basChoisi">
          {React.createElement(basAAfficher.component, {
            tissuBas: { ...tissuBas, instanceId: `${id}-bas` },
            onPickColor: (e) => openPicker(e, {
              type: "tissu",
              target: "bas",
              value: tissuBas
            }),
          })}
        </div>
      ) : null}

    </div>
  );
}
