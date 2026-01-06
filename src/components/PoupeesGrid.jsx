// PoupeesGrid.jsx
import React, { useState } from "react";
import PoupeePreview from "./PoupeePreview";

export default function PoupeesGrid({ poupees, creerPoupee, chargerPoupee, onAddPoupee }) {
  /*const [modalVisible, setModalVisible] = useState(false);
  const [nouveauNom, setNouveauNom] = useState("");
  const [prenomNouvelle, setPrenomNouvelle] = useState("");

  const openModal = () => {
    setNouveauNom("");
    setPrenomNouvelle("");
    setModalVisible(true);
  };

  const handleCreer = () => {
    if (!nouveauNom.trim()) return;
    creerPoupee(nouveauNom.trim(), prenomNouvelle.trim());
    setModalVisible(false);
  };*/

  return (
    <div>
      <h1>Mes amies</h1>

      <div className="poupees-grid">

        {/* ajouter */}
        <div className="poupee-card add-card" onClick={onAddPoupee}> {/*onClick={openModal}*/}
            <div>
                <div className="plus">+</div>
                <p>Créer une nouvelle poupée</p>
            </div> 

        </div>

        {/* Cartes poupées */}
        {poupees.map((p) => (
            <div
                key={p.id}
                className="poupee-card"
                onClick={() => chargerPoupee(p.id)}
            >
                <PoupeePreview data={p.data} id={p.id} />
            </div>
        ))}
      </div>

       
    </div>
  );
}
