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
import SVGPart from "./SVGPart";

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
  accessoireActions,
  setSelectedAccessoireId,
  selectedAccessoireId,
  addClonedAccessoire,
  handleChangeAccessoireTissu,

  openPicker,
  closePicker,
  showAccessoires,
  revoirGrille
}) {

  const zonesTissus = {
    haut: { data: tissuHaut, set: setTissuHaut },
    bas: { data: tissuBas, set: setTissuBas }
  };
  

  const viewportRef = useRef(null);
  const [globalScale, setGlobalScale] = useState(1);
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
    setSelectedAccessoireId(null);
  };
  const showCarousel = () => { closeAll(); setActiveCarousel("coiffure"); };
  const showHaut = () => { closeAll(); setActiveCarousel("haut"); };
  const showBas = () => { closeAll(); setActiveCarousel("bas"); };
  const showChaussures = () => { closeAll(); setActiveCarousel("chaussures"); };
  const showAccessoiresMenu = () => { closeAll(); showAccessoires("accessoires"); };
  const handleRevoirGrille = () => { closeAll(); revoirGrille(); };

  // ----------------- CONSTRUIRE LES ZONES A COLORER -----------------
  useEffect(() => {
    const newZones = {};
    ["haut", "bas"].forEach(part => {
      const zones = (part === "haut" ? hautAAfficher : basAAfficher)?.zones ?? [];
      const tissuData = zonesTissus[part]?.data ?? {};
      zones.forEach(zone => {
        const key = `${part}-${zone}`;
        newZones[key] = {
          ...DEFAULT_TISSU,
          ...tissuData[zone],
          instanceId: `${id}-${key}`
        };
      });
    });

    setTissusZones(prev => {
      const prevStr = JSON.stringify(prev);
      const newStr = JSON.stringify(newZones);

      if (prevStr === newStr) return prev;

      return newZones;
    });
  }, [basAAfficher, hautAAfficher, zonesTissus, id, setTissusZones]);

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
  const pickers = {
    peau: usePickerClick(openPicker, "color", "peau", () => peau),
    levres: usePickerClick(openPicker, "color", "levres", () => levres),
    yeux: usePickerClick(openPicker, "color", "yeux", () => yeux),
    cheveux: usePickerClick(openPicker, "color", "cheveux", () => cheveux),
    chaussures: usePickerClick(openPicker, "color", "chaussures", () => chaussuresColor),

    bas: usePickerClick(openPicker, "tissu", "bas"),
    haut: usePickerClick(openPicker, "tissu", "haut")
  };

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
        onTransformed={(instance) => setGlobalScale(instance.state.scale)}
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
                onMouseDown={() => setSelectedAccessoireId(null)}
                style={{ position: "absolute", width: "100vw", height: "100vh", pointerEvents: "all" }}
              >
                <svg ref={viewportRef} id="poupee" viewBox="0 0 800 800" width="100%" height="100%" preserveAspectRatio="xMinYMin meet">
                  {/* CORPS */}
                  <FilleNue peau={peau} yeux={yeux} levres={levres} onColorPeau={pickers.peau} onColorLevres={pickers.levres} onColorYeux={pickers.yeux} />

                  {/* CHEVEUX */}
                  {activeCarousel !== "coiffure" ? (
                    <SVGPart type="cheveux" component={coiffureAAfficher?.component} color={cheveux} onMouseDown={pickers.cheveux} />
                  ) : null}

                  {/* BAS */}
                  {activeCarousel !== "bas" ? (
                    <SVGPart type="bas" component={basAAfficher?.component} zones={basAAfficher?.zones} tissusZones={tissusZones} onMouseDown={pickers.bas} />
                  ) : null}

                  {/* HAUT */}
                  {activeCarousel !== "haut" ? (
                    <SVGPart type="haut" component={hautAAfficher?.component} zones={hautAAfficher?.zones} tissusZones={tissusZones} onMouseDown={pickers.haut} />
                  ) : null}

                  {/* CHAUSSURES */}
                  {activeCarousel !== "chaussures" ? (
                    <SVGPart type="chaussures" component={chaussuresAAfficher?.component} color={chaussuresColor} onMouseDown={pickers.chaussures} />
                  ) : null}

                  {/* ACCESSOIRES */}
                  {accessoires?.map(acc => (
                    <Accessoire
                      key={acc.id}
                      acc={acc}
                      setSelectedAccessoireId={setSelectedAccessoireId}
                      selectedAccessoireId={selectedAccessoireId}
                      accessoireActions={accessoireActions}
                      onClosePicker={closePicker}
                      openPicker={openPicker}
                      tissuAccessoire={acc.tissu}
                      viewportRef={viewportRef}
                      globalScale={globalScale} 
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