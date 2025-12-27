import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import EquipaActions from '../actions/EquipaActions';
import EquipaStore from '../stores/EquipaStore';

import PlantelTab from '../components/PlantelTab';
import ProxJogosTab from '../components/ProxJogosTab';

const Tab = createMaterialTopTabNavigator();

export default function Equipa({ route }) {
  const { teamId } = route.params;

  const [team, setTeam] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTeam({});
    setLoading(true);
    EquipaActions.fetchTeamRoster(teamId);

    const onChange = () => {
      const squad = EquipaStore.getSquad();
      setTeam(squad);
      setLoading(false);
    };

    const unsubscribe = EquipaStore.subscribe(onChange);

    const initialSquad = EquipaStore.getSquad();
    if (Object.keys(initialSquad).length > 0) {
      setTeam(initialSquad);
      setLoading(false);
    }

    return () => {
      unsubscribe();
    };
  }, [teamId]);


  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.name}>Plantel da Equipa</Text>
      </View>

      <Tab.Navigator>
        <Tab.Screen
          name="Plantel"
          children={() =>
            loading ? (
              <ActivityIndicator style={{ marginTop: 40 }} />
            ) : (
              <PlantelTab squad={team} />
            )
          }
        />
        <Tab.Screen
          name="Jogos"
          children={() => <ProxJogosTab teamId={teamId} />}
        />
      </Tab.Navigator>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', padding: 16 },
  name: { fontSize: 20, fontWeight: 'bold' },
});
