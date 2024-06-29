import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Colors} from '../assets/theme';

const Investors = () => {
  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.container}>
        <Text style={styles.title}>Investors</Text>
      </View>
    </SafeAreaView>
  );
};

export default Investors;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: Colors.black,
    fontSize: 14,
  },
});
