import React from "react";
import Slider from "react-slick";

// Import des coiffures SVG
import CheveuxAnglaises from "./images/CheveuxAnglaises.jsx";
/*import CheveuxChignon from "./images/cheveuxChignon";
import CheveuxFrises from "./images/CheveuxFrises";*/

// CSS du carousel
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

// Tableau des coiffures
const hairs = [CheveuxAnglaises]; // ajouter les autres coiffures ici

export default function CarouselCoiffures({ color, onSelect, handlePickColor }) {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  return (
    <Slider {...settings}>
      {hairs.map((HairComponent, index) => (
        <div key={index} style={{ cursor: "pointer" }}>
          {/* Optionnel : bouton pour changer de coiffure */}
          <button 
            style={{ position: "absolute", top: 10, left: 10, zIndex: 10 }}
            onClick={() => onSelect(index)}
          >
            Choisir
          </button>

          <HairComponent
            color={color}               // couleur courante des cheveux
            width={350}
            height={290}
            onPickColor={handlePickColor}  // le SVG gère le clic couleur
          />
        </div>
      ))}
    </Slider>
  );
}
