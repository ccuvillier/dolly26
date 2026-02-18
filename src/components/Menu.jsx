// Menu.jsx
import React from "react";


const Menu = ({ onShowCarousel, onRevoirGrille, onShowCarouselHauts, onShowCarouselBas, onShowCarouselChaussures, onShowAccessoires }) => {
  return (
    <div className="menu">
      <div className="hamburger-menu">
        <input id="menu__toggle" type="checkbox" />
        <label className="menu__btn" htmlFor="menu__toggle">
          <span></span>
        </label>
      

        <div className="menu__box">
          <button id="mesPoupees" onClick={onRevoirGrille}>Voir mes amies</button>
          <button id="coiffure" onClick={onShowCarousel}>Coiffure</button>
          <button id="hauts" onClick={onShowCarouselHauts}>Hauts</button>
          <button id="bas" onClick={onShowCarouselBas}>Bas</button>
          <button id="chaussures" onClick={onShowCarouselChaussures}>Chaussures</button>
          <button id="accessoires" onClick={onShowAccessoires}>Accessoires</button>
        </div>
      </div>
    </div>
  );
};

export default Menu;

