import { useState } from "react";
import { hairs } from "../components/CarouselCoiffures";
import { savePoupeeField } from "../firebase/firestoreFunctions";

export default function useCoiffures(prenom) {
  const [carouselVisible, setCarouselVisible] = useState(false);
  const [selectedHairIndex, setSelectedHairIndex] = useState(null);

  const showCarousel = () => setCarouselVisible(true);

  const selectHair = async (index) => {
    setSelectedHairIndex(index);
    setCarouselVisible(false);

    const hairName = hairs[index].name;
    await savePoupeeField(prenom, "nomCoiffure", hairName);
  };

  return {
    carouselVisible,
    selectedHairIndex,
    showCarousel,
    selectHair
  };
}
