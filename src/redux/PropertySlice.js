import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  properties: [],
};

export const PropertySlice = createSlice({
  name: 'properties',
  initialState: initialState,
  reducers: {
    allProperties: (state, action) => {
      state.properties = action.payload;
    },
  },
});

export const {allProperties} = PropertySlice.actions;

export default PropertySlice.reducer;
