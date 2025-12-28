import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import dayjs from 'dayjs';

export default function DetalhesJogo({ route }) {
  const { game, leagueName } = route.params;
  const competitors = game.competitors || [];
  const [home, away] = competitors.length === 2 ? competitors : [{}, {}];


  return (
    <View style={styles.container}>
      <Text style={styles.league}>{leagueName}</Text>
      <Text style={styles.date}>
        {dayjs(game.date).format('DD/MM/YYYY HH:mm')}
      </Text>

      <View style={styles.teams}>
        <View style={styles.team}>
          <Image source={{ uri: home.logo ?? '' }} style={styles.logo} />
          <Text style={styles.teamName}>{home.displayName}</Text>
          <Text style={styles.score}>{home.score || '-'}</Text>
        </View>

        <Text style={styles.vs}>VS</Text>

        <View style={styles.team}>
          <Image source={{ uri: away.logo ?? '' }} style={styles.logo} />
          <Text style={styles.teamName}>{away.displayName}</Text>
          <Text style={styles.score}>{away.score || '-'}</Text>
        </View>
      </View>

      <Text style={styles.status}>
        {game.fullStatus?.type?.description || 'Scheduled'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    alignItems: 'center',
  },
  league: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  date: {
    marginVertical: 8,
    color: '#666',
  },
  teams: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
  },
  team: {
    alignItems: 'center',
    width: 120,
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 8,
  },
  teamName: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  score: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 4,
  },
  vs: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 12,
  },
  status: {
    marginTop: 20,
    fontSize: 14,
    color: '#666',
  },
});
