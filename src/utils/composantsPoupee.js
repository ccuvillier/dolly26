// composantsPoupee.js
import { hairs } from "../components/carousels/data/coiffuresData";
import { hauts } from "../components/carousels/data/hautsData";
import { bass } from "../components/carousels/data/bassData";
import { chaussures } from "../components/carousels/data/chaussuresData";
import { accessoiresInstances } from "../components/paletteAccessoires/data/accessoiresData";
import { tissus } from "../components/paletteTissus/data/tissusData";

export const ComposantsPoupee = {
  cheveux: hairs.reduce((acc, h) => {
    acc[h.name] = h.component;
    return acc;
  }, {}),
  hauts: hauts.reduce((acc, h) => {
    acc[h.name] = h.component;
    return acc;
  }, {}),
  bas: bass.reduce((acc, b) => {
    acc[b.name] = b.component;
    return acc;
  }, {}),
  chaussures: chaussures.reduce((acc, c) => {
    acc[c.name] = c.component;
    return acc;
  }, {}),
  accessoires: accessoiresInstances.reduce((acc, a) => {
    acc[a.name] = a.component;
    return acc;
  }, {}),
  tissus: Object.fromEntries(
    Object.values(tissus).map(t => [t.name, t])
  )
};