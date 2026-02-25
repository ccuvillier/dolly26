import { VETEMENTS_COMPONENTS } from "../carousels/data/componentsRegistry";

export function mapVetementsFromDB(item) {
  return {
    ...item,
    component: VETEMENTS_COMPONENTS[item.name] || null
  };
}