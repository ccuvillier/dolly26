import { useState } from "react";
import { hauts } from "../components/hautsData";
import { savePoupeeField } from "../firebase/firestoreFunctions";

export default function useHauts(prenom) {
  const [carouselVisible, setCarouselVisible] = useState(false);
  const [selectedHautIndex, setSelectedHautIndex] = useState(null);

  const showCarousel = () => setCarouselVisible(true);
  const hideCarousel = () => setCarouselVisible(false);

  const selectHaut = async (index) => {
    if (index == null || !hauts[index]) return;
    setSelectedHautIndex(index);
    hideCarousel();

    const hautName = hauts[index].name;
    await savePoupeeField(prenom, "haut", hautName);
  };

  return {
    carouselVisible,
    selectedHautIndex,
    showCarousel,
    hideCarousel,
    selectHaut
  };
}
