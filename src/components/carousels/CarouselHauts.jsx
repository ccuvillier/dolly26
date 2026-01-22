import CarouselGeneric from "./CarouselGeneric";
import { hauts } from "./data/CarouselHautsData";

export default function CarouselHauts({ color, onSelect, initialHautName }) {
  return (
    <CarouselGeneric
      items={hauts}
      color={color}
      initialName={initialHautName}
      onSelect={onSelect}
      width={220}
      height={195}
      label="Choisir ce haut"
      Id="CarouselHauts"
    />
  );
}
