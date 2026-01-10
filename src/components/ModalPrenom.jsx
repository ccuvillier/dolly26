export default function ModalPrenom({ visible, prenom, setPrenom, exists, creer, charger, onAnnuler }) {
  if (!visible) return null;

  return (
    <div className="modal">
      <div>
        <input
          type="text"
          placeholder="Prénom de la poupée"
          value={prenom}
          onChange={(e) => setPrenom(e.target.value)}
        />

        {exists ? (
          <button onClick={charger}>Voir</button>
        ) : (
          <button onClick={creer}>Créer</button>
        )}
        <button className={"btnAnnuler"} onClick={onAnnuler}>Annuler</button>
      </div>
    </div>
  );
}
