import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import dayjs from 'dayjs';

const statTranslations = {
  possessionPct: 'Posse de bola',
  totalShots: 'Remates',
  shotsOnTarget: 'Remates à baliza',
  foulsCommitted: 'Faltas cometidas',
  wonCorners: 'Cantos',
  yellowCards: 'Cartões amarelos',
  redCards: 'Cartões vermelhos',
  goalAssists: 'Assists de golo',
  shotAssists: 'Assists de remate',
  totalGoals: 'Golos'
};


export default function DetalhesJogo({ route }) {
  const { game, leagueName } = route.params;
  const [activeTab, setActiveTab] = useState('summary');

  const competition = game.competitions?.[0];
  const competitors = competition?.competitors || [];
  const [home, away] = competitors.length === 2 ? competitors : [{ team: {} }, { team: {} }];

  const events = competition?.details || [];

  const homeStats = competitors[0]?.statistics || [];
  const awayStats = competitors[1]?.statistics || [];

  const getStatValue = (stats, name) =>
    stats.find(s => s.name === name)?.displayValue ?? '-';

  const statsList = homeStats
    .filter(stat => stat.name !== 'appearances')
    .map(stat => ({
      label: statTranslations[stat.name] || stat.name,
      home: stat.displayValue,
      away: getStatValue(awayStats, stat.name),
    }));


  return (
    <View style={styles.container}>
      <Text style={styles.league}>{leagueName}</Text>
      <Text style={styles.date}>{dayjs(game.date).format('DD/MM/YYYY HH:mm')}</Text>

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
        {competition?.status?.type?.description || 'Scheduled'}
      </Text>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'summary' && styles.activeTab]}
          onPress={() => setActiveTab('summary')}>
          <Text style={styles.tabText}>Sumário</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'stats' && styles.activeTab]}
          onPress={() => setActiveTab('stats')}>
          <Text style={styles.tabText}>Estatísticas</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'summary' && (
        <>
          {events.length > 0 && <Text style={styles.sectionTitle}>Sumário do Jogo</Text>}

          <FlatList
            data={events}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => {
              const tipoEvento = item.type?.text?.toLowerCase() || '';
              const minuto = item.clock?.displayValue || '';
              const atleta = item.athletesInvolved?.[0]?.displayName || '';
              const teamId = item.team?.id || '';
              const isHome = teamId === competitors[0]?.team?.id;

              const emoji =
                tipoEvento.includes('goal') ? '⚽' :
                tipoEvento.includes('yellow') ? '🟨' :
                tipoEvento.includes('red') ? '🟥' : '';

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
        </>
      )}

      {activeTab === 'stats' && (
        <>
          <Text style={styles.sectionTitle}>Estatísticas</Text>

          <FlatList
            data={statsList}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.eventRow}>
                <Text style={[styles.eventText, { textAlign: 'left' }]}>{item.home}</Text>
                <Text style={[styles.minute, { textAlign: 'center' }]}>{item.label}</Text>
                <Text style={[styles.eventText, { textAlign: 'right' }]}>{item.away}</Text>
              </View>
            )}
          />
        </>
      )}
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

  /* ABAS */
  tabs: {
    flexDirection: 'row',
    marginTop: 24,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },

  tab: {
    flex: 1,
    paddingVertical: 10,
  },

  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#000',
  },

  tabText: {
    textAlign: 'center',
    fontWeight: 'bold',
  },

  sectionTitle: {
    marginTop: 20,
    marginBottom: 12,
    fontSize: 18,
    fontWeight: 'bold',
  },

  eventRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },

  minute: {
    width: 70,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  eventText: {
    flex: 1,
  },
});
