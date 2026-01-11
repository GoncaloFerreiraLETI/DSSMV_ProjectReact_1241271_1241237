import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import AppBar from '../components/AppBar';
import AuthStore from '../stores/AuthStore';
import { getFavoriteTeams, removeFavorite } from '../actions/FavoritosActions';

export default function Favoritos({ navigation }) {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const onChange = () => setUserId(AuthStore.getUser()?.id ?? null);
    AuthStore.addChangeListener(onChange);
    onChange();
    return () => AuthStore.removeChangeListener(onChange);
  }, []);

  const loadFavorites = useCallback(async () => {
    if (!userId) {
      setTeams([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const data = await getFavoriteTeams(userId);
    setTeams(data);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    if (userId) loadFavorites();
    const unsubscribe = navigation.addListener('focus', () => loadFavorites());
    return unsubscribe;
  }, [navigation, userId, loadFavorites]);

  if (!userId) {
    return (
      <View style={styles.center}>
        <Text>Precisas de fazer login para ver os favoritos.</Text>
        <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginText}>Fazer Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loading) return <View style={styles.center}><Text>A carregar...</Text></View>;
  if (teams.length === 0) return <View style={styles.center}><Text>Sem favoritos</Text></View>;

  return (
    <View style={{ flex: 1 }}>
      <AppBar title="Favoritos" />
      <FlatList
        data={teams}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <TouchableOpacity style={styles.info} onPress={() => navigation.navigate('Equipa', { teamId: item.id })}>
              <Image source={{ uri: item.logos?.[0]?.href }} style={styles.logo} />
              <Text style={styles.name}>{item.displayName}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={async () => { await removeFavorite(userId, item.id); loadFavorites(); }}>
              <Text style={styles.remove}>✕</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  info: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  logo: { width: 32, height: 32, marginRight: 12 },
  name: { fontSize: 16, color: '#000' },
  remove: { fontSize: 18, color: 'red', paddingHorizontal: 12 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loginButton: { marginTop: 16, backgroundColor: '#222', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 10 },
  loginText: { color: '#fff', fontWeight: 'bold' },
});
