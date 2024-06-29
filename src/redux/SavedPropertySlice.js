import {createSlice} from '@reduxjs/toolkit';
const initialState = [];

export const SavedPropertySlice = createSlice({
  name: 'savedProperties',
  initialState: initialState,
  reducers: {
    addToSavedList: (state, action) => {
      state.push(action.payload);
    },
    removeFromSavedList: (state, action) => {
      return state.filter(property => property.id !== action.payload.id);
    },
  },
});

export const {addToSavedList, removeFromSavedList} = SavedPropertySlice.actions;
export default SavedPropertySlice.reducer;
