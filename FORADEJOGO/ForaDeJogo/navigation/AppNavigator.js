import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import BottomTabNavigator from './BottomTabNavigator';
import DetalhesLiga from '../views/DetalhesLiga';
import Equipa from '../views/Equipa'
import DetalhesJogo from '../views/DetalhesJogo';


const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>

        <Stack.Screen
          name="Tabs"
          component={BottomTabNavigator}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="DetalhesLiga"
          component={DetalhesLiga}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Equipa"
          component={Equipa}
          options={{ headerShown: false }}
        />

        <Stack.Screen
            name="DetalhesJogo"
            component={DetalhesJogo}
            options={{ headerShown: false }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
