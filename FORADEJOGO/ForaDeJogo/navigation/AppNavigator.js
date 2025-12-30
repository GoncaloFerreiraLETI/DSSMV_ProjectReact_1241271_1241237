import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import BottomTabNavigator from './BottomTabNavigator';
import DetalhesLiga from '../views/DetalhesLiga';
import Equipa from '../views/Equipa';
import EditorPlantel from '../views/EditorPlantel';
import CriadorPlantel from '../views/CriadorPlantel';
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
          name="DetalhesJogo"
          component={DetalhesJogo}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Equipa"
          component={Equipa}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="EditorPlantel"
          component={EditorPlantel}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="CriadorPlantel"
          component={CriadorPlantel}
          options={{ headerShown: false }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}