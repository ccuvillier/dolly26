import React, { useEffect, useState, useRef } from "react";
import { hairs } from "./CarouselCoiffuresData";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";



export default function CarouselCoiffures({ color, openColorPicker, onSelect, initialHairName }) {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [carouselVisible, setCarouselVisible] = useState(true);

  const sliderRef = useRef(null);
  
   // Détermine l'index initial si le nom est connu
  const initialIndex = initialHairName
    ? hairs.findIndex(h => h.name === initialHairName)
    : 0;

  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [carouselReady, setCarouselReady] = useState(false); // pour contrôler le rendu du slider

  // Quand initialHairName est chargé ou changé, on met à jour l'index actif
  useEffect(() => {
    if (initialHairName) {
      const index = hairs.findIndex(h => h.name === initialHairName);
      if (index >= 0) {
        setActiveIndex(index);
        // Slider pas encore rendu → sliderRef.current est null
        setCarouselReady(true); 
      }
    } else {
      setCarouselReady(true); // pas de hairName → slider prêt
    }
  }, [initialHairName]);


  const handleSelect = () => {
    setSelectedIndex(activeIndex);
    setCarouselVisible(false);
    onSelect(hairs[activeIndex].name); // envoie le nom au parent
  };


  const showCarousel = () => setCarouselVisible(true);

  // Si une coiffure est choisie et que le carousel est masqué
  if (!carouselVisible && activeIndex !== null) {
    const SelectedHair = hairs[activeIndex];
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
    initialSlide: activeIndex, // utilisé seulement si sliderReady
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
