import CarouselGeneric from "./CarouselGeneric";
import { hairs } from "./data/CarouselCoiffuresData";

export default function CarouselCoiffures({ color, onSelect, initialHairName }) {

   return (
    <CarouselGeneric
          items={hairs}
          color={color}
          initialName={initialHairName}
          onSelect={onSelect}
          width={350}
          height={290}
          label="Choisir cette coiffure"
          Id="CarouseCoiffures"
        />
  );
}
