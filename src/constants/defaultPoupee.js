import { DEFAULT_TISSU } from "./defaultTissu";

export const DEFAULT_POUPEE = {
  peau: "#FFE4D9",
  yeux: "#0000FF",
  levres: "#FF7A84",
  cheveux: "#FFFFFF",
  nomCoiffure: "",
  prenom: "",
  nomHaut: "",
  nomBas: "",
  tissuHaut: DEFAULT_TISSU,
  tissuBas: DEFAULT_TISSU
};
export const createDefaultPoupee = () => ({
  peau: "#FFE4D9",
  yeux: "#0000FF",
  levres: "#FF7A84",
  cheveux: "#FFFFFF",
  nomCoiffure: "",
  prenom: ""
});

