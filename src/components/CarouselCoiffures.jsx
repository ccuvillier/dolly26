import React, { useState, useRef } from "react";
import Slider from "react-slick";

import CheveuxAnglaises from "./images/CheveuxAnglaises.jsx";
import CheveuxChignon from "./images/cheveuxChignon";;
import CheveuxFrises from "./images/cheveuxFrises";

import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

export const hairs = [
  { name: "CheveuxAnglaises", component: CheveuxAnglaises },
  { name: "CheveuxChignon", component: CheveuxChignon },
  { name: "CheveuxFrises", component: CheveuxFrises }
];



export default function CarouselCoiffures({ color, openColorPicker, onSelect, initialHairName }) {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [carouselVisible, setCarouselVisible] = useState(true);
  //const [activeIndex, setActiveIndex] = useState(0);

  const sliderRef = useRef(null);

  // Définit l'index actif selon le nom de la coiffure initiale
  const initialIndex = initialHairName
    ? hairs.findIndex(h => h.name === initialHairName)
    : 0;
  
    
  const [activeIndex, setActiveIndex] = useState(initialIndex);


  const handleSelect = () => {
    setSelectedIndex(activeIndex);
    setCarouselVisible(false);
    onSelect(hairs[activeIndex].name); // envoie le nom au parent
  };


  const showCarousel = () => setCarouselVisible(true);

  // Si une coiffure est choisie et que le carousel est masqué
  if (!carouselVisible && selectedIndex !== null) {
    const SelectedHair = hairs[selectedIndex];
    return (
      <div style={{ position: "relative" }}>
        <SelectedHair color={color} width={350} height={290} onPickColor={openColorPicker} />

      </div>
    );
  }

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    afterChange: (current) => setActiveIndex(current), // met à jour l'index actif
    //beforeChange: (_, next) => setActiveIndex(next) // on mémorise directement l’index futur
  };

  // Force le slider sur l'index actif à chaque rendu
  if (sliderRef.current) {
    sliderRef.current.slickGoTo(activeIndex, true);
  }

  return (
    <div>
      <Slider ref={sliderRef} {...settings}>
        {hairs.map((HairComponent, index) => (
          <div key={index} style={{ cursor: "pointer" }}>
            <HairComponent.component
              color={color}
              width={350}
              height={290}
            />
          </div>
        ))}
      </Slider>

      {/* Bouton pour valider la coiffure sélectionnée */}
      <div className="formulaire">
        <button
          onClick={handleSelect}
        >
          Choisir cette coiffure
        </button>
      </div>
    </div>
  );
}
