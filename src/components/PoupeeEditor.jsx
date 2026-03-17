import React from "react";
import PoupeeView from "./PoupeeView";
import ColorfulPicker from "../ColorfulPicker.jsx";
import PaletteTissus from "./paletteTissus/PaletteTissus";
import PaletteAccessoires from "./paletteAccessoires/PaletteAccessoires.jsx";

export default function PoupeeEditor({
  poupeeAffichee,
  idPoupee,
  isCreating,
  tissusZones,
  setTissusZones,
  openPicker,
  closePicker,
  picker,
  applyColor,
  handleChangeTissu,
  activePalette,
  showAccessoires,
  selectedAccessoireId,
  setSelectedAccessoireId,
  onAddAccessoire,
  onUpdate,
  onDelete,
  onDuplicate,
  handleChangeAccessoireTissu,
  revoirGrille
}) {


  return (
    <>
      <PoupeeView
        id={idPoupee}
        {...poupeeAffichee}
        openPicker={openPicker}
        closePicker={closePicker}
        revoirGrille={revoirGrille}
        tissusZones={tissusZones}
        setTissusZones={setTissusZones}
        accessoires={poupeeAffichee.accessoires}
        selectedAccessoireId={selectedAccessoireId}
        setSelected={setSelectedAccessoireId}
        onUpdate={onUpdate}
        onDelete={onDelete}
        showAccessoires={showAccessoires}
        addClonedAccessoire={onDuplicate}
        handleChangeAccessoireTissu={handleChangeAccessoireTissu}
      />

      {/* COLOR PICKER */}
      {picker.visible && picker.type === "color" && (
        <ColorfulPicker
          x={picker.x}
          y={picker.y}
          currentColor={picker.value}
          target={picker.target}
          onChange={applyColor}
          onClose={closePicker}
          picker={picker}
        />
      )}

      {/* PALETTE TISSUS */}
      {picker.visible && picker.type === "tissu" && (
        <PaletteTissus
          x={picker.x}
          y={picker.y}
          target={picker.target}
          tissu={
                (picker.target === "bas" || picker.target === "haut")
                ? tissusZones[`${picker.target}-${picker.zoneId}`]
                : null
            }
          onChange={handleChangeTissu}
          onClose={closePicker}
          openPicker={openPicker}
          picker={picker}
        />
      )}

      {/* PALETTE ACCESSOIRES */}
      {activePalette === "accessoires" && (
        <PaletteAccessoires
          onAddAccessoire={onAddAccessoire}
          onClose={() => showAccessoires(null)}
        />
      )}

      {/* PALETTE TISSUS POUR ACCESSOIRE */}
      {picker.visible && picker.type === "accessoire" && (
        <PaletteTissus
          x={picker.x}
          y={picker.y}
          target={picker.target}
          id={picker.id} 
          tissu={picker.value}
          onChange={handleChangeTissu}
          onClose={closePicker}
          openPicker={openPicker}
          picker={picker}
        />
      )}
    </>
  );
}