// Menu.jsx
import React from "react";


const Menu = ({ onShowCarousel, onRevoirGrille, onShowCarouselHauts, onShowCarouselBas, onShowCarouselChaussures }) => {
  return (
    <div className="menu">
      <button id="mesPoupees" onClick={onRevoirGrille}>Voir mes amies</button>
      <button id="coiffure" onClick={onShowCarousel}>Coiffure</button>
      <button id="hauts" onClick={onShowCarouselHauts}>Hauts</button>
      <button id="bas" onClick={onShowCarouselBas}>Bas</button>
      <button id="chaussures" onClick={onShowCarouselChaussures}>Chaussures</button>
    </div>
  );
};

export default Menu;

