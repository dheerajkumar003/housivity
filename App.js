import {View, Text} from 'react-native';
import React from 'react';
import {Provider} from 'react-redux';
import AppNavigator from './src/navigations/AppNavigator';
import store from './src/redux/Store';

const App = () => {
  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
};

export default App;
