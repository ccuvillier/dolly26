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
import SelectionAccessoires from "./paletteAccessoires/SelectionAccessoires";
import useGroupBBox from "../hooks/useGroupBBox.js";
import NodeRenderer from "./paletteAccessoires/NodeRenderer";

export default function PoupeeView(props) {
  const {
    id,
    peau, yeux, levres, cheveux,
    nomCoiffure, setNomCoiffure,
    chaussuresColor, nomChaussures, setNomChaussures,
    tissusZones, setTissusZones,
    nomHaut, setNomHaut, tissuHaut, setTissuHaut,
    nomBas, setNomBas, tissuBas, setTissuBas,
    accessoires, accessoireActions,
    selectedIds, setSelectedIds,
    openPicker, closePicker,
    showAccessoires, revoirGrille
  } = props;

  const { data, setData, onGroup, onUngroup } = accessoireActions;

  const zonesTissus = {
    haut: { data: tissuHaut, set: setTissuHaut },
    bas: { data: tissuBas, set: setTissuBas }
  };

  const viewportRef = useRef(null);
  const transformWrapperRef = useRef(null);
   const [activeCarousel, setActiveCarousel] = useState(null); // "coiffure" | "haut" | "bas" | "chaussures" | null


  const [globalScale, setGlobalScale] = useState(1);
  const [scale, setScale] = useState(1);
  const RESET_ZOOM = 1;
  const [dimensions, setDimensions] = useState({});
  const handleMeasure = (id, size) => {
    setDimensions(prev => ({ ...prev, [id]: size }));
  };

  // ================= ZONES TISSUS =================
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

  // ================= ZOOM =================
  const handleSliderChange = (e) => {
    const targetScale = parseFloat(e.target.value);
    const factor = Math.log(targetScale / scale);
    const { zoomIn, zoomOut } = transformWrapperRef.current;

    if (targetScale > scale) zoomIn(factor, 0);
    else zoomOut(-factor, 0);

    setScale(targetScale);
  };

  // ================= PICKERS =================
  const pickers = {
    peau: usePickerClick(openPicker, "color", "peau", () => peau),
    levres: usePickerClick(openPicker, "color", "levres", () => levres),
    yeux: usePickerClick(openPicker, "color", "yeux", () => yeux),
    cheveux: usePickerClick(openPicker, "color", "cheveux", () => cheveux),
    chaussures: usePickerClick(openPicker, "color", "chaussures", () => chaussuresColor),
    bas: usePickerClick(openPicker, "tissu", "bas"),
    haut: usePickerClick(openPicker, "tissu", "haut")
  };


  // ================= RENDU =================
  return (
    <div id="poupeeView" className="zoomIn">
      <Menu
        onShowCarousel={() => setActiveCarousel("coiffure")}
        onShowCarouselHauts={() => setActiveCarousel("haut")}
        onShowCarouselBas={() => setActiveCarousel("bas")}
        onShowCarouselChaussures={() => setActiveCarousel("chaussures")}
        onShowAccessoires={() => showAccessoires("accessoires")}
        onRevoirGrille={revoirGrille}
      />

      <TransformWrapper
        ref={transformWrapperRef}
        centerOnInit
        defaultScale={1}
        limitToBounds={false}
        wheel={{ step: 0.1 }}
        pinch={{ step: 5 }}
        doubleClick={{ disabled: true }}
        onZoomStop={(ref) => setScale(ref.state.scale)}
        onTransformed={(ref) => setGlobalScale(ref.state.scale)}
        minScale={0.5}
        maxScale={4}
        onPanningStart={() => document.getElementById("poupeeView")?.classList.add("dragging")}
        onPanningStop={() => document.getElementById("poupeeView")?.classList.remove("dragging")}
        panning={{ excluded: ["no-pan"] }}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            {/* Zoom slider */}
            <div id="zoomSlider" onMouseDown={(e) => e.stopPropagation()} onTouchStart={(e) => e.stopPropagation()}>
              <input
                type="range"
                min="0.5"
                max="4"
                step="0.01"
                value={scale}
                onChange={handleSliderChange}
              />
              <span className="zoomValue">{Math.round(scale * 100)}%</span>
              <button className="reset" onClick={(e) => { e.stopPropagation(); resetTransform(); setScale(RESET_ZOOM); }}>Reset</button>
            </div>

            <TransformComponent>
              <div
                onMouseDown={() => setSelectedIds([])}
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
                

                  <g className="accessoires-layer">
                    {data.accessoires
                      .filter(acc => !acc.parentGroupId) // nodes racines
                      .map(node => (
                        <NodeRenderer
                          key={node.id}
                          node={node}
                          data={data}
                          accessoireActions={accessoireActions}
                          selectedIds={selectedIds}
                          setSelectedIds={setSelectedIds}
                          globalScale={globalScale}
                          viewportRef={viewportRef}
                          openPicker={openPicker}
                          dimensions={dimensions}
                          onMeasure={handleMeasure}
                        />
                      ))}
                  </g>
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