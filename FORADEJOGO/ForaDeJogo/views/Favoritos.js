import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, } from 'react-native';
import { getFavoriteTeams, removeFavorite } from '../actions/FavoritosActions';
import AppBar from '../components/AppBar';

export default function Favoritos({ navigation }) {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadFavorites() {
    setLoading(true);
    const data = await getFavoriteTeams();
    setTeams(data);
    setLoading(false);
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadFavorites);
    return unsubscribe;
  }, [navigation]);

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>A carregar...</Text>
      </View>
    );
  }

  if (teams.length === 0) {
    return (
      <View style={styles.center}>
        <Text>Sem favoritos</Text>
      </View>
    );
  }

  return (
    <View>
      <AppBar title="Favoritos" />
      <FlatList
        data={teams}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <TouchableOpacity
              style={styles.info}
              onPress={() =>
                navigation.navigate('Equipa', { teamId: item.id })
              }
            >
              <Image
                source={{ uri: item.logos?.[0]?.href }}
                style={styles.logo}
              />
              <Text style={styles.name}>{item.displayName}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={async () => {
                await removeFavorite(item.id);
                loadFavorites();
              }}
            >
              <Text style={styles.remove}>✕</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logo: {
    width: 32,
    height: 32,
    marginRight: 12,
  },
  name: {
    fontSize: 16,
    color: '#000',
  },
  remove: {
    fontSize: 18,
    color: 'red',
    paddingHorizontal: 12,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
