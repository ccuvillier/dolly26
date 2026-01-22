import React, { useEffect, useState, useRef } from "react";
import { hauts } from "./CarouselHautsData";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

export default function CarouselHauts({ color, openColorPicker, onSelect, initialHautName }) {

  const sliderRef = useRef(null);

  // Trouve l'index initial correspondant au nom
  const selectedIndex = initialHautName
    ? hauts.findIndex(h => h.name === initialHautName)
    : 0;

  const [activeIndex, setActiveIndex] = useState(selectedIndex);

  // Met à jour activeIndex si initiaHautName change
  useEffect(() => {
    if (initialHautName) {
      const index = hauts.findIndex(h => h.name === initialHautName);
      if (index >= 0) {
        setActiveIndex(index);
      }
    }
  }, [initialHautName]);

  // Applique activeIndex au slider
  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.slickGoTo(activeIndex, true);
    }
  }, [activeIndex]);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: activeIndex,
    afterChange: (current) => setActiveIndex(current),
  };

  const selectHaut = () => {
    onSelect(hauts[activeIndex].name); // renvoie au parent
    //console.log(haut[activeIndex].name);
  };

  return (
    <div id="CarouselHauts">
      <Slider ref={sliderRef} {...settings}>
        {hauts.map((Haut, index) => (
          <div key={index} style={{ cursor: "pointer" }}>
            <Haut.component
              color={color}
              width={220}
              height={195}
            />
          </div>
        ))}
      </Slider>

      {/* Bouton pour valider la coiffure */}
      <div className="formulaire">
        <button onClick={selectHaut}>
          Choisir ce haut
        </button>
      </div>
    </div>
  );
}
