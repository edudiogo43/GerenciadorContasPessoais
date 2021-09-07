import { StatusBar } from 'expo-status-bar';

import React from 'react';
import SignIn from './src/screens/SingIn';
import Signup from './src/screens/SignUp';
import Home from './src/screens/Home';
import New from './src/screens/New';
import Edit from './src/screens/Edit';
//import Splash from './src/screens/Splash';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

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
        <Stack.Screen name="Edit" component={Edit}
          options={{
            headerShown: false,
            contentStyle: {
              backgroundColor: '#FFF'
            }
          }}
        />
        <Stack.Screen name="HomeScreen" component={Home}
          options={{
            headerShown: false,
            contentStyle: {
              backgroundColor: '#FFF'
            }
          }}
        />
        {/* <Stack.Screen name="SplashScreen" component={Splash}
          options={{
            headerShown: false,
            contentStyle: {
              backgroundColor: '#FFF'
            }
          }} 
        />*/}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
