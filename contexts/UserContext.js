import { createContext, useContext, useState } from "react";

// On crée un context utilisateur.
const UserContext = createContext();

// Composant ("Provider") qui englobe l’application ou une partie de l’arborescence et rend le contexte disponible.
export const UserProvider = ({ children }) => {
  // État local pour stocker le type de profil connecté
  const [profil, setProfil] = useState(null); // 'parent' ou 'babysitter'

  return (
    // Le provider permet de rendre les données disponibles à tous les composants enfants.
    <UserContext.Provider value={{ profil, setProfil }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook personnalisé pour utiliser le context où on veut.
export const useUser = () => useContext(UserContext);

// Avantages d’un Context
// - Permet de transmettre des données (user, thème, langue, token, etc.) à travers toute l’app sans avoir à utiliser les props manuellement.
// - Évite d’avoir des chaînes interminables de props juste pour transmettre une info à un composant profond.
// - Parfait pour stocker des infos rarement modifiées (ex. user connecté, configuration, thème, paramètres d’app).

// Limites d’un Context :
// - Quand la valeur du Context change, tous les composants qui l’utilisent se re-rendent,
// ce qui peut causer des problèmes de performance si la donnée change souvent.

// Pourquoi l’utiliser ici ?
// On utilise Context pour :
// - Partager le type de profil utilisateur (parent ou babysitter) à travers l’application.
// - Éviter de passer ce profil dans chaque écran via props.
// - Rendre la navigation plus simple : chaque composant peut savoir quel est le profil actuel en appelant useUser().
// - Le besoin est simple et global (juste stocker et distribuer un profil).
