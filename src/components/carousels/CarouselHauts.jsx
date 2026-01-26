import CarouselGeneric from "./CarouselGeneric";
import { hauts } from "./data/CarouselHautsData";

export default function CarouselHauts({ color, onSelect, initialHautName }) {
  return (
    <CarouselGeneric
      items={hauts}
      color={color}
      initialName={initialHautName}
      onSelect={onSelect}
      label="Choisir ce haut"
      Id="CarouselHauts"
    />
  );
}
