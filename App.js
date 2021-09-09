import { StatusBar } from 'expo-status-bar';

import React from 'react';
import SignIn from './src/screens/SingIn';
import Signup from './src/screens/SignUp';
import Home from './src/screens/Home';
import New from './src/screens/New';
import Edit from './src/screens/Edit';
//import Splash from './src/screens/Splash';

import AppLoading from 'expo-app-loading';

import {
  useFonts,
  Roboto_400Regular,
  Roboto_900Black,
  Roboto_300Light,
  Roboto_500Medium,
  Roboto_700Bold,
  Roboto_100Thin,
} from '@expo-google-fonts/roboto';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {

  let [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_900Black,
    Roboto_300Light,
    Roboto_100Thin,
    Roboto_500Medium,
    Roboto_700Bold,
  });


  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
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
}
