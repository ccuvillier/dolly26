import React, { useState, useEffect, useRef } from "react";
import FilleNue from "./FilleNue";
import { hairs } from "./carousels/data/coiffuresData";
import CarouselCoiffures from "./carousels/CarouselCoiffures.jsx";
import { hauts } from "./carousels/data/hautsData";
import CarouselHauts from "./carousels/CarouselHauts.jsx";
import { bass } from "./carousels/data/bassData";
import CarouselBas from "./carousels/CarouselBas.jsx";
import { chaussures } from "./carousels/data/chaussuresData";
import CarouselChaussures from "./carousels/CarouselChaussures";
import PaletteAccessoires from "./paletteAccessoires/PaletteAccessoires.jsx";
import Accessoire from "./paletteAccessoires/Accessoires.jsx";
import Menu from "./Menu.jsx";

export default function PoupeeView({
  id,
  peau,
  yeux,
  levres,
  cheveux,
  nomCoiffure,
  setNomCoiffure,
  chaussuresColor,
  nomChaussures,
  setNomChaussures,
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
  // valeurs possibles : "coiffure" | "haut" | "bas" | "chaussures" | "Accessoires" | null

  /* Debug tissus reçus
  useEffect(() => {
    console.log("🔹 tissuHaut props", tissuHaut);
    console.log("🔹 tissuBas props", tissuBas);
  }, [tissuHaut, tissuBas]); */

  // ----------------- AFFICHAGE DES ÉLÉMENTS -----------------
  const coiffureAAfficher = nomCoiffure ? hairs.find(h => h.name === nomCoiffure) : null;
  const hautAAfficher = nomHaut ? hauts.find(h => h.name === nomHaut) : null;
  const basAAfficher = nomBas ? bass.find(h => h.name === nomBas) : null;
  const chaussuresAAfficher = nomChaussures ? chaussures.find(h => h.name === nomChaussures) : null;

  const handleSelectHair = (name) => { setNomCoiffure(name); setActiveCarousel(null); };
  const handleSelectHaut = (name) => { setNomHaut(name); setActiveCarousel(null); };
  const handleSelectBas = (name) => { setNomBas(name); setActiveCarousel(null); };
  const handleSelectChaussures = (name) => { setNomChaussures(name); setActiveCarousel(null); };

  const showCarousel = () => setActiveCarousel("coiffure");
  const showHaut = () => setActiveCarousel("haut");
  const showBas = () => setActiveCarousel("bas");
  const showChaussures = () => setActiveCarousel("chaussures");
  const showAccessoires = () => { setActiveCarousel("accessoires");};
  const [palettePos, setPalettePos] = useState({ x: 0, y: 0 });

  /*---------- FERMER LES PALETTES TISSUS ET COLOR ---------------*/
  const handleMenuAction = (action, e) => {
    closePicker();
    action(e);
  };

  /*---------- AFFICHAGE DE LA PALETTE ACCESSOIRES ---------------*/
  const [accessoireActif, setAccessoireActif] = useState(null);
  const [accessoires, setAccessoires] = useState([]);
  const viewportRef = useRef(null);
  const handleAddAccessoire = (item) => {
    const rect = viewportRef.current.getBoundingClientRect(); // Placer les accessoires au centre

    const newAcc = {
      id: crypto.randomUUID(),
      type: item.type,
      component: item.component,
      x: rect.width / 2,
      y: rect.height / 2,
      scale: 1,
      rotation: 0,
      color: "#ffffff"
    };

    setAccessoires(prev => [...prev, newAcc]);
    setAccessoireActif(newAcc);
  };

  /*---------- DRAG AND DROP DES ACCESSOIRES ---------------*/
  const [draggingId, setDraggingId] = useState(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // mousedown sur l'accessoire
  const handleDragStart = (e, acc) => {
    setDraggingId(acc.id);

    setOffset({
      x: e.clientX - acc.x,
      y: e.clientY - acc.y
    });
  };

  // mouseMove sur le viewport
  const handleMouseMove = (e) => {
    if (!draggingId) return;

    setAccessoires(prev =>
      prev.map(acc =>
        acc.id === draggingId
          ? {
              ...acc,
              x: e.clientX - offset.x,
              y: e.clientY - offset.y
            }
          : acc
      )
    );
  };

  // mouseUp à la fin du drag
  const handleMouseUp = () => {
    setDraggingId(null);
  };

  // supprimer un accessoire
  const handleDeleteAccessoire = (id) => {
    setAccessoires(prev => prev.filter(acc => acc.id !== id));
    setAccessoireActif(null);
  };

  // mettre à jour l'accessoire
  const handleUpdateAccessoire = (id, newProps) => {
    setAccessoires(prev =>
      prev.map(acc => acc.id === id ? { ...acc, ...newProps } : acc)
    );
  };

  // click hors de l'accessoire
 const [selectedAccessoireId, setSelectedAccessoireId] = useState(null);

 useEffect(() => {
    const handleClickOutside = () => {
      setSelectedAccessoireId(null);
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);





  return (
    <div id="poupeeView" className="zoomIn" 
      ref={viewportRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Menu */}
      <Menu
        onShowCarousel={() => handleMenuAction(showCarousel)}
        onShowCarouselHauts={() => handleMenuAction(showHaut)}
        onShowCarouselBas={() => handleMenuAction(showBas)}
        onShowCarouselChaussures={() => handleMenuAction(showChaussures)}
        onShowAccessoires = {(e) => handleMenuAction(showAccessoires, e)}
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

      {/* ------------------- CHAUSSURES ------------------- */}
      {activeCarousel === "chaussures" ? (
        <CarouselChaussures
          color={chaussuresColor}
          initialChaussuresName={nomChaussures}
          onSelect={handleSelectChaussures}
        />
      ) : chaussuresAAfficher ? (
        <div id="chaussuresChoisies">
          {React.createElement(chaussuresAAfficher.component, {
            color: chaussuresColor,
            onPickColor: (e) => openPicker(e, {
              type: "color",
              target: "chaussures",
              value: chaussuresColor
            }),
          })}
        </div>
      ) : null}


      {/*----------- PALETTE ACCESSOIRES -------------*/}
      {activeCarousel === "accessoires" ? (
        <PaletteAccessoires
          x={palettePos.x}
          y={palettePos.y}
          onAddAccessoire={handleAddAccessoire}
          onClose={() => setActiveCarousel(null)}
        />
      ) : null}

      {accessoires.map(acc => (
        <Accessoire
          key={acc.id}
          acc={acc}
          isActive={accessoireActif?.id === acc.id}
          onDragStart={handleDragStart}
          onUpdate={handleUpdateAccessoire}
          onDelete={handleDeleteAccessoire}
          setSelected={setSelectedAccessoireId}
        />
      ))}
      

    </div>
  );
}
