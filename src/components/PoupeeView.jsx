import React, { useState, useRef, useEffect } from "react";
import FilleNue from "./FilleNue";
import CarouselCoiffures from "./carousels/CarouselCoiffures.jsx";
import CarouselHauts from "./carousels/CarouselHauts.jsx";
import CarouselBas from "./carousels/CarouselBas.jsx";
import CarouselChaussures from "./carousels/CarouselChaussures";
import Accessoire from "./paletteAccessoires/Accessoires.jsx";
import Menu from "./Menu.jsx";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { usePickerClick } from "../hooks/usePickerClick.js";
import { DEFAULT_TISSU } from "../constants/defaultTissu";
import { ComposantsPoupee } from "../utils/composantsPoupee.js";

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
  tissusZones,
  setTissusZones,
  nomHaut,
  setNomHaut,
  tissuHaut,
  setTissuHaut,
  nomBas,
  setNomBas,
  tissuBas,
  setTissuBas,
  
  accessoires,
  selectedAccessoireId,
  setSelected,
  onUpdate,
  onMove,
  onDelete,
  duplicateAccessoire,
  handleChangeAccessoireTissu,

  openPicker,
  closePicker,
  showAccessoires,
  revoirGrille
}) {

  const viewportRef = useRef(null);
  const [activeCarousel, setActiveCarousel] = useState(null); // "coiffure" | "haut" | "bas" | "chaussures" | null

  // ----------------- AFFICHAGE DES ÉLÉMENTS -----------------
  const coiffureAAfficher = nomCoiffure ? { component: ComposantsPoupee.cheveux[nomCoiffure] } : null;
  const hautAAfficher = nomHaut ? { component: ComposantsPoupee.hauts[nomHaut], zones: tissuHaut ? Object.keys(tissuHaut) : [] } : null;
  const basAAfficher = nomBas ? { component: ComposantsPoupee.bas[nomBas], zones: tissuBas ? Object.keys(tissuBas) : [] } : null;
  const chaussuresAAfficher = nomChaussures ? { component: ComposantsPoupee.chaussures[nomChaussures] } : null;

  const handleSelectHair = (name) => { setNomCoiffure(name); setActiveCarousel(null); };
  const handleSelectHaut = (name) => { setNomHaut(name); setActiveCarousel(null); };
  const handleSelectBas = (name) => { setNomBas(name); setActiveCarousel(null); };
  const handleSelectChaussures = (name) => { setNomChaussures(name); setActiveCarousel(null); };

  // ----------------- FERMER LES PALETTES -----------------
  const closeAll = () => {
    setActiveCarousel(null);
    showAccessoires(null);
    closePicker();
    setSelected(null);
  };
  const showCarousel = () => { closeAll(); setActiveCarousel("coiffure"); };
  const showHaut = () => { closeAll(); setActiveCarousel("haut"); };
  const showBas = () => { closeAll(); setActiveCarousel("bas"); };
  const showChaussures = () => { closeAll(); setActiveCarousel("chaussures"); };
  const showAccessoiresMenu = () => { closeAll(); showAccessoires("accessoires"); };
  const handleRevoirGrille = () => { closeAll(); revoirGrille(); };

  // ----------------- CONSTRUIRE LES ZONES A COLORER -----------------
  useEffect(() => {
    if (!basAAfficher?.zones && !hautAAfficher?.zones) return;

    setTissusZones(prev => {
      const newZones = {};

      basAAfficher?.zones.forEach(zone => {
        const key = `bas-${zone}`;
        const tissuBDD = tissuBas?.[zone];
        newZones[key] = {
          ...DEFAULT_TISSU,
          ...tissuBDD,
          instanceId: `${id}-${key}`
        };
      });

      hautAAfficher?.zones.forEach(zone => {
        const key = `haut-${zone}`;
        const tissuBDD = tissuHaut?.[zone];
        newZones[key] = {
          ...DEFAULT_TISSU,
          ...tissuBDD,
          instanceId: `${id}-${key}`
        };
      });

      const isEqual = Object.keys(newZones).every(
        k => JSON.stringify(prev[k]) === JSON.stringify(newZones[k])
      );
      if (isEqual) return prev;
      return newZones;
    });
  }, [basAAfficher, hautAAfficher, tissuBas, tissuHaut, id, setTissusZones]);

  // ----------------- GESTION DU ZOOM -----------------
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

  // ----------------- GESTION DES DRAG ET CLICK -----------------
  const peauClick = usePickerClick(openPicker, "color", "peau", () => peau);
  const levresClick = usePickerClick(openPicker, "color", "levres", () => levres);
  const yeuxClick = usePickerClick(openPicker, "color", "yeux", () => yeux);
  const hairClick = usePickerClick(openPicker, "color", "cheveux", () => cheveux);
  const chaussuresClick = usePickerClick(openPicker, "color", "chaussures", () => chaussuresColor);
  const basClick = usePickerClick(openPicker, "tissu", "bas");
  const hautClick = usePickerClick(openPicker, "tissu", "haut");

  // ----------------- RENDU -----------------
  return (
    <div id="poupeeView" className="zoomIn">
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
        wheel={{ step: 0.1, wheelDisabled: false }}
        pinch={{ step: 5 }}
        doubleClick={{ disabled: true }}
        onZoomStop={(ref) => setScale(ref.state.scale)}
        minScale={0.5}
        maxScale={3}
        onPanningStart={() => document.getElementById("poupeeView").classList.add("dragging")}
        onPanningStop={() => document.getElementById("poupeeView").classList.remove("dragging")}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            {/* Zoom slider */}
            <div id="zoomSlider" onMouseDown={(e) => e.stopPropagation()} onTouchStart={(e) => e.stopPropagation()}>
              <div className="rangeWrapper">
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.01"
                  value={scale}
                  onChange={handleSliderChange}
                />
              </div>
              <span className="zoomValue">{Math.round(scale * 100)}%</span>
              <button className="reset" onClick={(e) => { e.stopPropagation(); resetTransform(); setScale(RESET_ZOOM); }}>
                Reset
              </button>
            </div>

            <TransformComponent>
              <div
                onMouseDown={() => setSelected(null)}
                style={{ position: "absolute", width: "100vw", height: "100vh", pointerEvents: "all" }}
              >
                <svg ref={viewportRef} id="poupee" viewBox="0 0 800 800" width="100%" height="100%" preserveAspectRatio="xMinYMin meet">
                  {/* CORPS */}
                  <FilleNue peau={peau} yeux={yeux} levres={levres} onColorPeau={peauClick} onColorLevres={levresClick} onColorYeux={yeuxClick} />

                  {/* CHEVEUX */}
                  {!activeCarousel || activeCarousel !== "coiffure" ? coiffureAAfficher?.component && (
                    <g id="coiffureChoisie" style={{ cursor: "pointer", pointerEvents: "all" }} onMouseDown={hairClick}>
                      {React.createElement(coiffureAAfficher.component, { color: cheveux })}
                    </g>
                  ) : null}

                  {/* BAS */}
                  {!activeCarousel || activeCarousel !== "bas" ? basAAfficher?.component && (
                    <g id="basChoisi" style={{ cursor: "pointer", pointerEvents: "all" }}
                       onMouseDown={(e) => {
                         const zone = e.target.closest("[data-zone]")?.dataset.zone;
                         if (!zone) return;
                         basClick(e, zone);
                       }}
                    >
                      {React.createElement(basAAfficher.component, {
                        tissus: basAAfficher.zones?.reduce((acc, zone) => {
                          acc[zone] = tissusZones[`bas-${zone}`] ?? null;
                          return acc;
                        }, {}) || {}
                      })}
                    </g>
                  ) : null}

                  {/* HAUT */}
                  {!activeCarousel || activeCarousel !== "haut" ? hautAAfficher?.component && (
                    <g id="hautChoisi" style={{ cursor: "pointer", pointerEvents: "all" }}
                       onMouseDown={(e) => {
                         const zone = e.target.closest("[data-zone]")?.dataset.zone;
                         if (!zone) return;
                         hautClick(e, zone);
                       }}
                    >
                      {React.createElement(hautAAfficher.component, {
                        tissus: hautAAfficher.zones?.reduce((acc, zone) => {
                          acc[zone] = tissusZones[`haut-${zone}`] ?? null;
                          return acc;
                        }, {}) || {}
                      })}
                    </g>
                  ) : null}

                  {/* CHAUSSURES */}
                  {!activeCarousel || activeCarousel !== "chaussures" ? chaussuresAAfficher?.component && (
                    <g id="chaussuresChoisies" style={{ cursor: "pointer", pointerEvents: "all" }} onMouseDown={chaussuresClick}>
                      {React.createElement(chaussuresAAfficher.component, { color: chaussuresColor })}
                    </g>
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
                      handleChangeAccessoireTissu={handleChangeAccessoireTissu}
                    />
                  ))}
                </svg>

                {/* CAROUSELS */}
                {activeCarousel === "coiffure" && <div className="carouselWrapper"><CarouselCoiffures color={cheveux} initialHairName={nomCoiffure} onSelect={handleSelectHair} /></div>}
                {activeCarousel === "bas" && <div className="carouselWrapper"><CarouselBas color={tissuBas.color} initialBasName={nomBas} onSelect={handleSelectBas} /></div>}
                {activeCarousel === "haut" && <div className="carouselWrapper"><CarouselHauts color={tissuHaut.color} initialHautName={nomHaut} onSelect={handleSelectHaut} /></div>}
                {activeCarousel === "chaussures" && <div className="carouselWrapper"><CarouselChaussures color={chaussuresColor} initialChaussuresName={nomChaussures} onSelect={handleSelectChaussures} /></div>}
              </div>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </div>
  );
}