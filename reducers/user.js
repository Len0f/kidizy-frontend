import { createSlice } from "@reduxjs/toolkit";

// Ici on définit l’état utilisateur stocké dans Redux.
const initialState = {
  value: { firstName: null, token: null, id: null, selectedBabysitterId: null },
};

// Un "slice" est une portion du store Redux, dédiée ici à l’utilisateur.
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Met à jour les informations de l’utilisateur
    updateInfo: (state, action) => {
      // On assigne directement les données reçues dans le payload
      state.value.firstName = action.payload.firstName;
      state.value.token = action.payload.token;
      state.value.id = action.payload.id;

      if (action.payload.firstName !== undefined) {
        state.value.firstName = action.payload.firstName;
      }
      if (action.payload.token !== undefined) {
        state.value.token = action.payload.token;
      }
    },

    // Stocke l’id du babysitter sélectionné
    selectedId: (state, action) => {
      state.value.selectedBabysitterId = action.payload;
    },

    // Réinitialise les infos utilisateur (utile pour la déconnexion)
    resetInfo: (state) => {
      state.value = { firstName: "utilisateur", token: null };
    },
  },
});

export const { updateInfo, resetInfo, selectedId } = userSlice.actions;
export default userSlice.reducer;
