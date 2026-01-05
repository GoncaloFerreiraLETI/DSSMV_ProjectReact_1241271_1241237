import React, { useEffect, useState, useCallback } from 'react';
import { View, ActivityIndicator, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import EquipaActions from '../actions/EquipaActions';
import EquipaStore from '../stores/EquipaStore';
import PlantelTab from '../components/PlantelTab';
import ProxJogosTab from '../components/ProxJogosTab';
import AppBar from '../components/AppBar';
import AuthStore from '../stores/AuthStore';
import { addFavorite, removeFavorite, getFavoriteTeams } from '../actions/FavoritosActions';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Tab = createMaterialTopTabNavigator();

export default function Equipa({ route }) {
  const { teamId } = route.params;
  const [team, setTeam] = useState({});
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    const onChange = () => setUserId(AuthStore.getUser()?.id ?? null);
    AuthStore.addChangeListener(onChange);
    onChange();
    return () => AuthStore.removeChangeListener(onChange);
  }, []);

  useEffect(() => {
    setTeam({});
    setLoading(true);
    EquipaActions.fetchTeamRoster(teamId);

    const onChange = () => { setTeam(EquipaStore.getSquad()); setLoading(false); };
    const unsubscribe = EquipaStore.subscribe(onChange);
    if (Object.keys(EquipaStore.getSquad()).length > 0) { onChange(); }
    return () => unsubscribe();
  }, [teamId]);

  const checkFavorite = useCallback(async () => {
    if (!userId) return;
    const favs = await getFavoriteTeams(userId);
    setIsFav(favs.some((t) => t.id === teamId));
  }, [userId, teamId]);

  useEffect(() => { checkFavorite(); }, [checkFavorite]);

  const toggleFavorite = async () => {
    if (!userId) return;
    if (isFav) await removeFavorite(userId, teamId);
    else await addFavorite(userId, teamId);
    checkFavorite();
  };

  return (
    <View style={{ flex: 1 }}>
      <AppBar title="Equipa" />
      <View style={styles.headerContainer}>
        <Text style={styles.name}>{team.displayName || 'Plantel da Equipa'}</Text>
        <TouchableOpacity onPress={toggleFavorite} style={styles.starButton}>
          <Icon name={isFav ? 'star' : 'star-border'} size={28} color="#ffd700" />
        </TouchableOpacity>
      </View>

      <Tab.Navigator style={styles.tabContainer}>
        <Tab.Screen name="Plantel" children={() => loading ? <ActivityIndicator style={{ marginTop: 40 }} /> : <PlantelTab squad={team} />} />
        <Tab.Screen name="Jogos" children={() => <ProxJogosTab teamId={teamId} />} />
        <Tab.Screen name="Resultados" children={() => <Text>Resultados</Text>} />
      </Tab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  name: { fontSize: 20, fontWeight: 'bold' },
  tabContainer: { marginHorizontal: 20, borderRadius: 10 },
  headerContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  starButton: { padding: 8 },
});
