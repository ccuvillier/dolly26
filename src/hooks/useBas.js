import { useState } from "react";
import { bass } from "../components/CarouselBasData";
import { savePoupeeField } from "../firebase/firestoreFunctions";

export default function useBas(prenom) {
  const [carouselVisible, setCarouselVisible] = useState(false);
  const [selectedBasIndex, setSelectedBasIndex] = useState(null);

  const showCarousel = () => setCarouselVisible(true);
  const hideCarousel = () => setCarouselVisible(false);

  const selectBas = async (index) => {
    if (index == null || !bass[index]) return;
    setSelectedBasIndex(index);
    hideCarousel();

    const basName = bass[index].name;
    await savePoupeeField(prenom, "bas", basName);
  };

  return {
    carouselVisible,
    selectedBasIndex,
    showCarousel,
    hideCarousel,
    selectBas
  };
}
