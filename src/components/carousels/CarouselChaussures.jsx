import CarouselGeneric from "./CarouselGeneric";
import { chaussures } from "./data/chaussuresData";

export default function CarouselChaussures({ color, onSelect, initialChaussuresName }) {

   return (
    <CarouselGeneric
          items={chaussures}
          color={color}
          initialName={initialChaussuresName}
          onSelect={onSelect}

          label="Choisir ces chaussures"
          Id="CarouselChaussures"
        />
  );
}
