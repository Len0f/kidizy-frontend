import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: { firstName: null, token: null },
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
