import {View, Text} from 'react-native';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '../screens/Home';
import CityExpert from '../screens/CityExpert';
import Saved from '../screens/Saved';
import Investors from '../screens/Investors';
import Profile from '../screens/Profile';
import HomeIcon from 'react-native-vector-icons/FontAwesome';
import Heart from 'react-native-vector-icons/Octicons';
import User from 'react-native-vector-icons/FontAwesome';
import People from 'react-native-vector-icons/Ionicons';
import Case from 'react-native-vector-icons/Entypo';
import {Colors} from '../assets/theme';
const BottomTabNavigation = () => {
  const BottomTab = createBottomTabNavigator();
  return (
    <BottomTab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.orange,
        tabBarInactiveTintColor: Colors.black,
        tabBarLabelStyle: {
          fontSize: 12,
        },
      }}>
      <BottomTab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({focused}) => {
            return (
              <HomeIcon
                color={focused ? Colors.orange : Colors.black}
                size={25}
                name="home"
              />
            );
          },
        }}
      />
      <BottomTab.Screen
        name="City Expert"
        component={CityExpert}
        options={{
          tabBarIcon: ({focused}) => {
            return (
              <People
                color={focused ? Colors.orange : Colors.black}
                size={25}
                name="people-outline"
              />
            );
          },
        }}
      />
      <BottomTab.Screen
        name="Saved"
        component={Saved}
        options={{
          tabBarIcon: ({focused}) => {
            return focused ? (
              <Heart name="heart-fill" size={20} color={Colors.orange} />
            ) : (
              <Heart name="heart" size={20} color={Colors.black} />
            );
          },
        }}
      />
      <BottomTab.Screen
        name="Investors"
        component={Investors}
        options={{
          tabBarIcon: ({focused}) => {
            return (
              <Case
                color={focused ? Colors.orange : Colors.black}
                size={25}
                name="briefcase"
              />
            );
          },
        }}
      />
      <BottomTab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({focused}) => {
            return (
              <User
                color={focused ? Colors.orange : Colors.black}
                size={25}
                name="user-circle-o"
              />
            );
          },
        }}
      />
    </BottomTab.Navigator>
  );
};

export default BottomTabNavigation;
