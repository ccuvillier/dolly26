import React, { useState } from "react";
import FilleNue from "./FilleNue";
import { hairs } from "./carousels/data/coiffuresData";
import CarouselCoiffures from "./carousels/CarouselCoiffures.jsx";
import { hauts } from "./carousels/data/hautsData";
import CarouselHauts from "./carousels/CarouselHauts.jsx";
import { bass } from "./carousels/data/bassData";
import CarouselBas from "./carousels/CarouselBas.jsx";
import { chaussures } from "./carousels/data/chaussuresData";
import CarouselChaussures from "./carousels/CarouselChaussures";
import Accessoire from "./paletteAccessoires/Accessoires.jsx";
import Menu from "./Menu.jsx";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

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
  
  //accessoires
  accessoires,
  selectedAccessoireId,
  setSelected,
  onUpdate,
  onMove,
  onDelete,

  openPicker,
  closePicker,
  showAccessoires,
  revoirGrille
}) {

  const [activeCarousel, setActiveCarousel] = useState(null); 
  // valeurs possibles : "coiffure" | "haut" | "bas" | "chaussures" | null


  // ----------------- AFFICHAGE DES ÉLÉMENTS -----------------
  const coiffureAAfficher = nomCoiffure ? hairs.find(h => h.name === nomCoiffure) : null;
  const hautAAfficher = nomHaut ? hauts.find(h => h.name === nomHaut) : null;
  const basAAfficher = nomBas ? bass.find(h => h.name === nomBas) : null;
  const chaussuresAAfficher = nomChaussures ? chaussures.find(h => h.name === nomChaussures) : null;

  const handleSelectHair = (name) => { setNomCoiffure(name); setActiveCarousel(null); };
  const handleSelectHaut = (name) => { setNomHaut(name); setActiveCarousel(null); };
  const handleSelectBas = (name) => { setNomBas(name); setActiveCarousel(null); };
  const handleSelectChaussures = (name) => { setNomChaussures(name); setActiveCarousel(null); };




  /*---------- FERMER LES PALETTES ACCESSOIRES - TISSUS ET COLOR ---------------*/
  const closeAll = () => {
    setActiveCarousel(null);
    showAccessoires(null);
    closePicker();
    setSelected(null);
  };

  const showCarousel = () => {
    closeAll();
    setActiveCarousel("coiffure");
  };

  const showHaut = () => {
    closeAll();
    setActiveCarousel("haut");
  };

  const showBas = () => {
    closeAll();
    setActiveCarousel("bas");
  };

  const showChaussures = () => {
    closeAll();
    setActiveCarousel("chaussures");
  };

  const showAccessoiresMenu = () => {
    closeAll();
    showAccessoires("accessoires");
  };

  const handleRevoirGrille = () => {
    closeAll();
    revoirGrille();
  };

  


  return (
    <div id="poupeeView" className="zoomIn">
      {/* Menu */}
      <Menu
        onShowCarousel={showCarousel}
        onShowCarouselHauts={showHaut}
        onShowCarouselBas={showBas}
        onShowCarouselChaussures={showChaussures}
        onShowAccessoires={showAccessoiresMenu}
        onRevoirGrille={handleRevoirGrille}
      />


        <TransformWrapper
          centerOnInit={true}
          defaultScale={1}
          defaultPositionX={0}
          defaultPositionY={0}
          limitToBounds={false}
          wheel={{
            step: 0.1,
            wheelDisabled: false
          }}
          pinch={{ step: 5 }}
          doubleClick={{ disabled: true }}
          minScale={0.5}  // limite du zoom arrière
          maxScale={3}    // limite du zoom avant
          onPanningStart={() => document.getElementById("poupeeView").classList.add("dragging")}
          onPanningStop={() => document.getElementById("poupeeView").classList.remove("dragging")}
        >

        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            <div id="zoomButtons">
              <button className="zoom" onMouseDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); zoomIn();}}>Zoom In</button>
              <button className="dezoom" onMouseDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); zoomOut();}}>Zoom Out</button>
              <button className="reset" onMouseDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); resetTransform();}}>Reset</button>
            </div>

          {/* Contenu zoomable */}
            <TransformComponent
            wrapperStyle={{
              width: "100%",
              height: "100%"
            }}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}>
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                  pointerEvents: "all"
                }}
              >
                

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

              {/* -------------- ACCESSOIRES ---------------------- */}
              {accessoires?.map(acc => (
                <Accessoire
                  key={acc.id}
                  acc={acc}
                  selectedAccessoireId={selectedAccessoireId}
                  onUpdate={onUpdate}
                  onDelete={onDelete}
                  setSelected={setSelected}
                  onClosePicker={closePicker}
                  openPicker={openPicker}
                  tissuAccessoire={acc.tissu}
                />
              ))}
              </div>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>

    </div>
  );
}
