import React, { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function CarouselGeneric({
  items,
  color,
  initialName,
  onSelect,
  width,
  height,
  label = "Choisir",
  Id
}) {
  const sliderRef = useRef(null);

  const initialIndex = initialName
    ? items.findIndex(item => item.name === initialName)
    : 0;

  const [activeIndex, setActiveIndex] = useState(
    initialIndex >= 0 ? initialIndex : 0
  );

  // Sync si initialName change
  useEffect(() => {
    if (!initialName) return;
    const index = items.findIndex(item => item.name === initialName);
    if (index >= 0) setActiveIndex(index);
  }, [initialName, items]);

  // Appliquer l’index au slider
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
    afterChange: setActiveIndex
  };

  const handleSelect = () => {
    onSelect(items[activeIndex].name);
  };

  console.log(color);

  return (
    <div className="CarouselGeneric" id={Id}>
      <Slider ref={sliderRef} {...settings}>
        {items.map((Item, index) => (
          <div key={index}>
            <Item.component
              color={color}
              width={width}
              height={height}
            />
          </div>
        ))}
      </Slider>

      <div className="formulaire">
        <button onClick={handleSelect}>
          {label}
        </button>
      </div>
    </div>
  );
}
