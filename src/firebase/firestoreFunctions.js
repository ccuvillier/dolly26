import { db } from "./firebase";
import { doc, setDoc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";

// Enregistrer une valeur d'un champ
export async function savePoupeeField(pseudo, idPoupee, fieldName, value) {
  const docRef = doc(db, "users", pseudo, "poupees", idPoupee)

  await setDoc(
    docRef,
    { [fieldName]: value },
    { merge: true } // NE PAS écraser les autres champs
  );
}

export async function creerUtilisateurSiAbsent(pseudo) {
  if (!pseudo) return;

  const userRef = doc(db, "users", pseudo);
  const snap = await getDoc(userRef);
  if (!snap.exists()) {
    await setDoc(userRef, { createdAt: new Date() });
    //console.log("Utilisateur créé :", pseudo);
  } else {
    //console.log("Utilisateur déjà existant :", pseudo);
  }
}


// Charger une poupée
export async function loadPoupee(idPoupee) {
  const docRef = doc(db, "poupees", idPoupee);
  const snap = await getDoc(docRef);

  return snap.exists() ? snap.data() : null;
}

// Supprimer une poupée
export async function supprimerPoupeeFirestore(pseudo, idPoupee) {
  if (!pseudo || !idPoupee) return;

  const ref = doc(db, "users", pseudo, "poupees", idPoupee);
  await deleteDoc(ref);
}
