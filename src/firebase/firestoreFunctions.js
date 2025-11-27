import { db } from "./firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

// Enregistrer une valeur d'un champ
export async function savePoupeeField(prenom, fieldName, value) {
  const docRef = doc(db, "poupees", prenom);

  await setDoc(
    docRef,
    { [fieldName]: value },
    { merge: true } // NE PAS écraser les autres champs
  );
}

// Charger une poupée
export async function loadPoupee(prenom) {
  const docRef = doc(db, "poupees", prenom);
  const snap = await getDoc(docRef);

  return snap.exists() ? snap.data() : null;
}
