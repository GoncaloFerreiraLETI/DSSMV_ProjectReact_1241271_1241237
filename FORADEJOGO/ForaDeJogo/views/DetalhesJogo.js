import React from 'react';
import { View, Text, Image, StyleSheet, FlatList } from 'react-native';
import dayjs from 'dayjs';

export default function DetalhesJogo({ route }) {
  const { game, leagueName } = route.params;
  const competitors = game.competitions?.[0]?.competitors || [];
  const [home, away] = competitors.length === 2 ? competitors : [{ team: {} }, { team: {} }];

  const events = game.competitions?.[0]?.details || [];

  return (
    <View style={styles.container}>
      <Text style={styles.league}>{leagueName}</Text>
      <Text style={styles.date}>
        {dayjs(game.date).format('DD/MM/YYYY HH:mm')}
      </Text>

      <View style={styles.teams}>
        <View style={styles.team}>
          <Image source={{ uri: home.team.logo ?? '' }} style={styles.logo} />
          <Text style={styles.teamName}>{home.team.displayName}</Text>
          <Text style={styles.score}>{home.score || '-'}</Text>
        </View>

        <Text style={styles.vs}>VS</Text>

        <View style={styles.team}>
          <Image source={{ uri: away.team.logo ?? '' }} style={styles.logo} />
          <Text style={styles.teamName}>{away.team.displayName}</Text>
          <Text style={styles.score}>{away.score || '-'}</Text>
        </View>
      </View>

      <Text style={styles.status}>
        {game.competitions?.[0]?.status?.type?.description || 'Scheduled'}
      </Text>


      {events.length > 0 && <Text style={styles.sectionTitle}>Sumário do Jogo</Text>}

      <FlatList
        data={events}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          const tipoEvento = item.type?.text?.toLowerCase() || '';
          const minuto = item.clock?.displayValue || '';
          const atleta = item.athletesInvolved?.[0]?.displayName || '';
          const teamId = item.team?.id || '';
          const isHome = teamId === game.competitions[0].competitors[0]?.team?.id;

          const emoji = tipoEvento.includes('goal')
            ? '⚽'
            : tipoEvento.includes('yellow')
            ? '🟨'
            : tipoEvento.includes('red')
            ? '🟥'
            : '';

          return (
            <View style={styles.eventRow}>
              <Text style={[styles.eventText, { textAlign: 'left' }]}>
                {isHome ? `${emoji} ${atleta}` : ''}
              </Text>
              <Text style={[styles.minute, { textAlign: 'center' }]}>{minuto}</Text>
              <Text style={[styles.eventText, { textAlign: 'right' }]}>
                {!isHome ? `${atleta} ${emoji}` : ''}
              </Text>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    paddingHorizontal: 16,
  },
  league: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  date: {
    marginVertical: 8,
    color: '#666',
    textAlign: 'center',
  },
  teams: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    justifyContent: 'center',
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
    textAlign: 'center',
  },
  sectionTitle: {
    marginTop: 30,
    marginBottom: 12,
    fontSize: 18,
    fontWeight: 'bold',
  },
  eventRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  minute: {
    width: 50,
    fontWeight: 'bold',
  },
  eventText: {
    flex: 1,
  },
});
