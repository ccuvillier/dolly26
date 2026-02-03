// hooks/useMergedTissu.js
import { DEFAULT_TISSU } from "../constants/defaultTissu";

/**
 * Hook pour merger un tissu reçu avec les valeurs par défaut.
 * @param {Object} tissu - tissuBas ou tissuHaut passé au composant
 * @returns {Object} mergedTissu
 */
export default function useMergedTissu(tissu) {
  return { ...DEFAULT_TISSU, ...tissu };
}
