import CarouselGeneric from "./CarouselGeneric";
import { bass } from "./data/CarouselBasData";

export default function CarouselBas({ color, onSelect, initialBasName }) {
  return (
    <CarouselGeneric
      items={bass}
      color={color}
      initialName={initialBasName}
      onSelect={onSelect}
      label="Choisir ce bas"
      Id="CarouselBas"
    />
  );
}
