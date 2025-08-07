import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: { firstName: 'utilisateur', token: null },
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateInfo: (state, action) => {
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
