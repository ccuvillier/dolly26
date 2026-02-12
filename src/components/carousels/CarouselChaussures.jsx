import CarouselGeneric from "./CarouselGeneric";
import { chaussures } from "./data/chaussuresData";

export default function CarouselChaussures({ color, onSelect, initialChaussuresName }) {

   return (
    <CarouselGeneric
          items={chaussures}
          color={color}
          initialName={initialChaussuresName}
          onSelect={onSelect}
          width={135}
          height={170}
          label="Choisir ces chaussures"
          Id="CarouselChaussures"
        />
  );
}
