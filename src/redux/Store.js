import {configureStore} from '@reduxjs/toolkit';
import propertyReducer from '../redux/PropertySlice';
import savedroPropertyReducer from '../redux/SavedPropertySlice';
const store = configureStore({
  reducer: {
    myProperties: savedroPropertyReducer,
  },
});

export default store;
