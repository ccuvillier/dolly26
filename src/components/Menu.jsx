// Menu.jsx
import React from "react";


const Menu = ({ onShowCarousel, onRevoirGrille, onShowCarouselHauts, onShowCarouselBas }) => {
  return (
    <div className="menu">
      <button id="mesPoupees" onClick={onRevoirGrille}>Voir mes amies</button>
      <button id="coiffure" onClick={onShowCarousel}>Coiffure</button>
      <button id="hauts" onClick={onShowCarouselHauts}>Hauts</button>
      <button id="bas" onClick={onShowCarouselBas}>Bas</button>
    </div>
  );
};

export default Menu;

