import { createSlice } from '@reduxjs/toolkit';
//save1
//supersave
const initialState = {
  value: { firstName: 'utilisateur', token: null },
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateInfo: (state, action) => {
      state.value.firstName = action.payload.firstName;
      state.value.token = action.payload.token
    },
    
  },
});

export const {updateInfo } = userSlice.actions;
export default userSlice.reducer;
