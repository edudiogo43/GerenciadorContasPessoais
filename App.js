import { StatusBar } from 'expo-status-bar';

import React from 'react';
import { View } from 'react-native';
import SignIn from './src/screens/SingIn';
import Signup from './src/screens/SignUp';
import Home from './src/screens/Home';
import New from './src/screens/New';

import { Entypo } from '@expo/vector-icons';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TouchableOpacity } from 'react-native';

const Stack = createNativeStackNavigator();

const Tab = createBottomTabNavigator();

function TabScreen({ navigation, route }) {

  return (
    <Tab.Navigator >
      <Tab.Screen name="Home" component={Home}
        screenOptions={({ navigation }) => ({
          backgroundColor: '#FFF',
          style: { backgroundColor: '#FFF', }
        })}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarActiveBackgroundColor: '#9B51E0',
          tabBarIcon: ({ color, size }) => (

            <TouchableOpacity
              onPress={() => navigation.navigate("New")}
            >
              <View style={{
                width: 60,
                height: 60,
                backgroundColor: '#F2F2F2',
                borderRadius: 30,
                top: -20,
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <Entypo name="plus" size={40} color="#9B51E0" />
              </View>
            </TouchableOpacity>
          ),
        }} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SignIn">
        <Stack.Screen name="SignIn" component={SignIn}
          options={{
            headerShown: false,
            contentStyle: {
              backgroundColor: '#FFF'
            }
          }}
        />
        <Stack.Screen name="SignUp" component={Signup}
          options={{
            headerShown: false,
            contentStyle: {
              backgroundColor: '#FFF'
            }
          }}
        />
        <Stack.Screen name="New" component={New}
          options={{
            headerShown: false,
            contentStyle: {
              backgroundColor: '#FFF'
            }
          }}
        />
        <Stack.Screen name="HomeScreen" component={TabScreen}
          options={{
            headerShown: false,
            contentStyle: {
              backgroundColor: '#FFF'
            }
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
