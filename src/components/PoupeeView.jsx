import React, { useState, useRef } from "react";
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
import { usePickerClick } from "../hooks/usePickerClick.js";

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
  duplicateAccessoire,

  openPicker,
  closePicker,
  showAccessoires,
  revoirGrille
}) {

  const viewportRef = useRef(null);

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

  /* GESTION DES DRAG ET CLICK */
  const peauClick = usePickerClick(openPicker, "color", "peau", peau);
  const levresClick = usePickerClick(openPicker, "color", "levres", levres);
  const yeuxClick = usePickerClick(openPicker, "color", "yeux", yeux);

  const hairClick = usePickerClick(openPicker, "color", "cheveux", cheveux);
  const chaussuresClick = usePickerClick(openPicker, "color", "chaussures", chaussuresColor);
  const hautClick = usePickerClick(openPicker, "tissu", "haut", tissuHaut);
  const basClick = usePickerClick(openPicker, "tissu", "bas", tissuBas);


  /* GESTION DU ZOOM AVEC INPUT TYPE RANGE */
  const transformWrapperRef = useRef(null);
  const [scale, setScale] = useState(1);
  const RESET_ZOOM = 1;

  const handleSliderChange = (e) => {
    const targetScale = parseFloat(e.target.value);
    const factor = Math.log(targetScale / scale);
    const { zoomIn, zoomOut } = transformWrapperRef.current;

    if (targetScale > scale) zoomIn(factor, 0);
    else zoomOut(-factor, 0);

    setScale(targetScale);
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
          ref={transformWrapperRef}
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
          onZoomStop={(ref) => {
            setScale(ref.state.scale); // récupère l'échelle courante
          }}
          minScale={0.5}  // limite du zoom arrière
          maxScale={3}    // limite du zoom avant
          onPanningStart={(e) => {document.getElementById("poupeeView").classList.add("dragging");}}
          onPanningStop={(e) => {document.getElementById("poupeeView").classList.remove("dragging");}}
        >

        {({ zoomIn, zoomOut, setTransform, resetTransform }) => (

          
          <>
            {/*<div id="zoomButtons">
              <button className="zoom" onMouseDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); zoomIn();}}>Zoom In</button>
              <button className="dezoom" onMouseDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); zoomOut();}}>Zoom Out</button>
              <button className="reset" onMouseDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); resetTransform();}}>Reset</button>
            </div>*/}

            <div id="zoomSlider" onMouseDown={(e) => e.stopPropagation()} onTouchStart={(e) => e.stopPropagation()}>

              <div className="rangeWrapper">
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.01"
                  value={scale}
                  onMouseDown={(e) => e.stopPropagation()}
                  onTouchStart={(e) => e.stopPropagation()}
                  onChange={handleSliderChange}
                />
              </div>

              <span className="zoomValue">{Math.round(scale * 100)}%</span>

              <button
                className="reset"
                onClick={(e) => {
                  e.stopPropagation();
                  resetTransform();
                  setScale(RESET_ZOOM);
                }}
              >
                Reset
              </button>

            </div>

            {/* Contenu zoomable */}
            <TransformComponent>
              <div
                onMouseDown={() => setSelected(null)}
                style={{
                  position: "absolute",
                  width: "100vw",
                  height: "100vh",
                  pointerEvents: "all"
                }}
              >
                
              <svg
                  ref={viewportRef}
                  id="poupee"
                  viewBox="0 0 800 800"
                  width="100%"
                  height="100%"
                  preserveAspectRatio="xMinYMin meet"
                >
                  {/* CORPS */}
                  <FilleNue
                    peau={peau}
                    yeux={yeux}
                    levres={levres}
                    //openPicker={openPicker}
                    onColorPeau={peauClick}
                    onColorLevres={levresClick}
                    onColorYeux={yeuxClick}
                  />

                  {/* CHEVEUX choisis (si carousel non actif) */}
                  {!activeCarousel || activeCarousel !== "coiffure" ? (
                    coiffureAAfficher && (
                      <g
                        id="coiffureChoisie"
                        style={{ cursor: "pointer", pointerEvents: "all" }}
                        onMouseDown={hairClick}
                      >
                        {React.createElement(coiffureAAfficher.component, {
                          color: cheveux,
                        })}
                      </g>
                    )
                  ) : null}

                  {/* BAS */}
                  {!activeCarousel || activeCarousel !== "bas" ? (
                    basAAfficher &&(
                      <g id="basChoisi" 
                        style={{ cursor: "pointer", pointerEvents: "all" }}
                        onMouseDown={basClick}
                        >
                        {React.createElement(basAAfficher.component, {
                          tissuBas: { ...tissuBas, instanceId: `${id}-bas` }
                        })}
                      </g>
                    )
                  ) : null}

                  {/* HAUT */}
                  {!activeCarousel || activeCarousel !== "haut" ? (
                    hautAAfficher &&(
                      <g id="hautChoisi"
                        style={{ cursor: "pointer", pointerEvents: "all" }}
                        onMouseDown={hautClick}
                      >
                        {React.createElement(hautAAfficher.component, {
                          tissuHaut: { ...tissuHaut, instanceId: `${id}-haut` }
                        })}
                      </g>
                    )
                  ) : null}

                  {/* CHAUSSURES */}
                   {!activeCarousel || activeCarousel !== "chaussures" ? (
                    chaussuresAAfficher &&(
                      <g id="chaussuresChoisies"
                        style={{ cursor: "pointer", pointerEvents: "all" }}
                        onMouseDown={chaussuresClick}
                      >
                        {React.createElement(chaussuresAAfficher.component, {
                          color: chaussuresColor
                        })}
                      </g>
                    )
                  ) : null}

                  {/* ACCESSOIRES */}
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
                      viewportRef={viewportRef}
                      duplicateAccessoire={duplicateAccessoire}
                    />
                  ))}


                </svg>



                {/* -------------  CAROUSELS  ------------ */}
                {/* COIFFURES */}
                {activeCarousel === "coiffure" && (
                  <div className="carouselWrapper">
                    <CarouselCoiffures
                      color={cheveux}
                      initialHairName={nomCoiffure}
                      onSelect={handleSelectHair}
                    />
                  </div>
                )}

                {/* BAS */}
                {activeCarousel === "bas" && (
                  <div className="carouselWrapper">
                    <CarouselBas
                      color={tissuBas.color}
                      initialBasName={nomBas}
                      onSelect={handleSelectBas}
                    />
                  </div>
                )}

                {/* HAUT */}
                {activeCarousel === "haut" && (
                  <div className="carouselWrapper">
                    <CarouselHauts
                      color={tissuHaut.color}
                      initialHautName={nomHaut}
                      onSelect={handleSelectHaut}
                    />
                  </div>
                )}

                {/* CHAUSSURES */}
                {activeCarousel === "chaussures" && (
                  <div className="carouselWrapper">
                     <CarouselChaussures
                        color={chaussuresColor}
                        initialChaussuresName={nomChaussures}
                        onSelect={handleSelectChaussures}
                      />
                  </div>
                )}

                {/* CAROUSEL ACCESSOIRES */}
                {activeCarousel === "accessoires" && (
                  <div className="carouselWrapper">
                    <CarouselAccessoires
                      items={accessoiresDispo}
                      onSelect={handleSelectAccessoire}
                    />
                  </div>
                )}
              </div>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>

    </div>
  );
}
