// PoupeesGrid.jsx
import React, { useState } from "react";
import PoupeePreview from "./PoupeePreview";




export default function PoupeesGrid({ poupees, creerPoupee, chargerPoupee, onAddPoupee, supprimerPoupee, renommerPoupee }) {
  const [activeMenu, setActiveMenu] = useState(null);

  const openMenu = (id, button) => {
    if (!button) return;

    setActiveMenu(prev => (prev === id ? null : id));

    // Fermer tous les menus
    document.querySelectorAll(".menuPoupee nav").forEach(menu => {
      menu.style.display = "none";
    });

    const menu = document.getElementById(id);
    if (!menu) return;

    const rect = button.getBoundingClientRect();

    menu.style.top = `${rect.bottom + 6}px`;
    menu.style.left = `${rect.right - 110}px`;
    menu.style.display = "block";

  };



  return (
    <div className="zoomIn">
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
                className="poupee-card"
                key={p.id}
                onClick={() => chargerPoupee(p.id)}
            >
                <div className="menuPoupee" onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation()
                  }
                }>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      openMenu(`menu-${p.id}`, e.currentTarget);

                    }} 
                    ><span></span><span></span><span></span>Show</button>

                  {activeMenu === `menu-${p.id}` && (

                    <nav id={`menu-${p.id}`}>
                      <button onClick={() => setActiveMenu(null)}>X</button>

                      <ul>
                        <li><button onClick={() => supprimerPoupee(p.id)}>Supprimer</button></li>
                        {/*<li>
                          <button
                            onClick={() => {
                              const nouveauPrenom = prompt("Nouveau prénom ?");
                              if (nouveauPrenom) {
                                renommerPoupee(p.id, nouveauPrenom);
                              }
                            }}
                          >
                            Renommer
                          </button>
                        </li>*/}
                      </ul>
                    </nav>
                  )}
                </div>

                <PoupeePreview data={p.data} id={p.id} renommerPoupee={renommerPoupee}
                 />
            </div>
        ))}
      </div>

       
    </div>
  );
}
