// PoupeesGrid.jsx
import React, { useState } from "react";
import PoupeePreview from "./PoupeePreview";

const openMenu = (id, button) => {

  // Fermer tous les menus
  const menus = document.querySelectorAll(".menuPoupee nav[popover]");
  menus.forEach(menu => {
    if (menu.showPopover && menu.hidePopover) {
      menu.hidePopover(); // méthode native popover si disponible
    } else {
      menu.style.display = "none"; // fallback si tu gères manuellement
    }
  });



  const menu = document.getElementById(id);
  if (!menu) return;
  const rect = button.getBoundingClientRect();

  menu.style.top = `${rect.top}px`;
  menu.style.left = `${rect.right - 110}px`;

  //menu.showPopover();

  if (menu.showPopover) {
    menu.showPopover();
  } else {
    menu.style.display = "block"; // fallback
  }
};


export default function PoupeesGrid({ poupees, creerPoupee, chargerPoupee, onAddPoupee, supprimerPoupee }) {

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
                <div className="menuPoupee" onClick={(e) => e.stopPropagation()}>
                  <button 
                    onClick={(e) =>
                      openMenu(`menu-${p.id}`, e.currentTarget)
                    } 
                    ><span></span><span></span><span></span>Show</button>

                  <nav popover="manual" id={`menu-${p.id}`} style={{ position: "fixed" }}>
                    <button popovertargetaction="hide" popovertarget={`menu-${p.id}`}>X</button>

                    <ul>
                      <li><button onClick={() => supprimerPoupee(p.id)}>Supprimer</button></li>
                      <li><button onClick={() => renommerPoupee(p.id)}>Renommer</button></li>
                    </ul>
                  </nav>
                </div>

                <PoupeePreview data={p.data} id={p.id} 
                 />
            </div>
        ))}
      </div>

       
    </div>
  );
}
