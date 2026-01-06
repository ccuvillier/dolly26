import React, { useEffect, useState, useRef } from "react";
import { hairs } from "./CarouselCoiffuresData";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

export default function CarouselCoiffures({ color, openColorPicker, onSelect, initialHairName }) {

  const sliderRef = useRef(null);

  // Trouve l'index initial correspondant au nom
  const initialIndex = initialHairName
    ? hairs.findIndex(h => h.name === initialHairName)
    : 0;

  const [activeIndex, setActiveIndex] = useState(initialIndex);

  // Met à jour activeIndex si initialHairName change
  useEffect(() => {
    if (initialHairName) {
      const index = hairs.findIndex(h => h.name === initialHairName);
      if (index >= 0) {
        setActiveIndex(index);
      }
    }
  }, [initialHairName]);

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

  const selectCoiffure = () => {
    onSelect(hairs[activeIndex].name); // renvoie au parent
    console.log(hairs[activeIndex].name);
  };

  return (
    <div>
      <Slider ref={sliderRef} {...settings}>
        {hairs.map((Hair, index) => (
          <div key={index} style={{ cursor: "pointer" }}>
            <Hair.component
              color={color}
              width={350}
              height={290}
            />
          </div>
        ))}
      </Slider>

      {/* Bouton pour valider la coiffure */}
      <div className="formulaire">
        <button onClick={selectCoiffure}>
          Choisir cette coiffure
        </button>
      </div>
    </div>
  );
}
