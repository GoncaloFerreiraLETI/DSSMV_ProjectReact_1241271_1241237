import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Ligas from '../views/Ligas';
import Favoritos from '../views/Favoritos';
import CriadorPlantel from '../views/CriadorPlantel';
import Jogos from '../views/Jogos';
import Definicoes from '../views/Definicoes';
import DetalhesLiga from '../views/DetalhesLiga';

import { TabBar } from './TabBar';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
            }}
            tabBar={(props) => <TabBar {...props} />}
        >
            <Tab.Screen name="Ligas" component={Ligas} />
            <Tab.Screen name="Favoritos" component={Favoritos} />
            <Tab.Screen name="Home" component={CriadorPlantel} />
            <Tab.Screen name="Jogos" component={Jogos} />
            <Tab.Screen name="Definições" component={Definicoes} />
        </Tab.Navigator>
    );
}

