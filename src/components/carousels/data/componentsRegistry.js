import { hauts } from "./hautsData";
import { bass } from "./bassData";
import { chaussures } from "./chaussuresData";
import { hairs } from "./coiffuresData";

export const COMPONENTS =
  Object.fromEntries(
    [
        ...hauts,
        ...bass,
        ...chaussures,
        ...hairs
    ].map(item => [item.name, item.component])
  );