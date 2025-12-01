import React, { useState, useRef } from "react";
import Slider from "react-slick";

import CheveuxAnglaises from "./images/CheveuxAnglaises.jsx";
import CheveuxChignon from "./images/cheveuxChignon";

import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

export const hairs = [CheveuxAnglaises, CheveuxChignon];

export default function CarouselCoiffures({ color, openColorPicker, onSelect }) {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [carouselVisible, setCarouselVisible] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const sliderRef = useRef(null);

  const handleSelect = () => {
    setSelectedIndex(activeIndex);   // mémorise la coiffure choisie
    setCarouselVisible(false);       // masque le carousel
    onSelect(activeIndex);           // prévient le parent
  };

  const showCarousel = () => setCarouselVisible(true);

  // Si une coiffure est choisie et que le carousel est masqué
  if (!carouselVisible && selectedIndex !== null) {
    const SelectedHair = hairs[selectedIndex];
    return (
      <div style={{ position: "relative" }}>
        <SelectedHair color={color} width={350} height={290} onPickColor={openColorPicker} />
        <button
          onClick={showCarousel}
          style={{ position: "absolute", top: 10, left: 10, zIndex: 10 }}
        >
          Changer de coiffure
        </button>
      </div>
    );
  }

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    afterChange: (current) => setActiveIndex(current), // 🔑 met à jour l'index actif
  };

  return (
    <div>
      <Slider ref={sliderRef} {...settings}>
        {hairs.map((HairComponent, index) => (
          <div key={index} style={{ cursor: "pointer" }}>
            <HairComponent
              color={color}
              width={350}
              height={290}
              //onPickColor={openColorPicker}
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
