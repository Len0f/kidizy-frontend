import { createContext, useContext, useState, useCallback } from 'react';

// On crée un context utilisateur.
const UserContext = createContext();

// Un composant (un wrapp) pour rendre accessible le contexte.
export const UserProvider = ({ children }) => {
    // Pour stocker le type de profil.
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