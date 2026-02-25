import { accessoiresPalette } from "./accessoiresData";

export const ACCESSOIRES_COMPONENTS =
  Object.fromEntries(
    accessoiresPalette.map(acc => [acc.type, acc.component])
  );