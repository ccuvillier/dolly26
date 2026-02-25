import { ACCESSOIRES_COMPONENTS } from "../paletteAccessoires/data/componentsRegistry";

export function mapAccessoireFromDB(acc) {
  return {
    ...acc,
    component: ACCESSOIRES_COMPONENTS[acc.type] || null
  };
}