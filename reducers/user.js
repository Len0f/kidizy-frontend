import { createSlice } from '@reduxjs/toolkit';
//save1
//supersave
const initialState = {
  value: { firstName: null, token: null, id:null, selectedBabysitterId: null },
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateInfo: (state, action) => {

      state.value.firstName = action.payload.firstName;
      state.value.token = action.payload.token;
      state.value.id = action.payload.id

      if (action.payload.firstName !== undefined) {
        state.value.firstName = action.payload.firstName;
      }
      if (action.payload.token !== undefined) {
        state.value.token = action.payload.token;
      }
      
    },
    
    resetInfo: (state) => {
      state.value = { firstName: 'utilisateur', token: null };
    }
  },
});

export const { updateInfo, resetInfo } = userSlice.actions;
export default userSlice.reducer;
