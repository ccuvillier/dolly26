export default function duplicateAccessoireSVG(
    acc, 
    scale, 
    rotation, 
    localTissu, 
    duplicateCallback, 
    offset = 20) {
        
  // Cloner l'accessoire
  const clone = {
    ...acc,
    id: crypto.randomUUID(), // nouvel ID
    x: acc.x + offset,        // décalage X
    y: acc.y + offset,        // décalage Y
    scale: scale,             // scale actuel
    rotation: rotation,       // rotation actuelle
    tissu: { ...localTissu, instanceId: crypto.randomUUID() } // clone du tissu
  };

  // Appel de la fonction passée par props pour l'ajouter à la liste
  duplicateCallback(clone);

  return clone; // optionnel, peut être utilisé pour selection
}