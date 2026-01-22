// Menu.jsx
import React from "react";

const Menu = ({ onShowCarousel, onRevoirGrille, onShowCarouselHauts }) => {
  //if (!poupeeExiste) return null; // ne rien afficher tant que la poupée n'existe pas

  return (
    <div className="menu">
      <button id="mesPoupees" onClick={onRevoirGrille}>Voir mes amies</button>
      <button id="coiffure" onClick={onShowCarousel}>Coiffure</button>
      <button id="hauts" onClick={onShowCarouselHauts}>Hauts</button>
    </div>
  );
};

export default Menu;

