import CarouselGeneric from "./CarouselGeneric";
import { hauts } from "./data/hautsData";

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
