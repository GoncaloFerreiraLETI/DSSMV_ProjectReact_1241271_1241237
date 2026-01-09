import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';
import dayjs from 'dayjs';

import ResultadosJogosActions from '../actions/ResultadosJogosActions';
import ResultadosJogosStore from '../stores/ResultadosJogosStore';

export default function ResultadosJogosTab({ teamId }) {
  const [games, setGames] = useState([]);

  useEffect(() => {
    const onChange = () => setGames(ResultadosJogosStore.getGames());
    ResultadosJogosStore.subscribe(onChange);

    ResultadosJogosActions.fetchResultsGames(teamId);
  }, [teamId]);

  const renderItem = ({ item }) => {
    if (
      !item.competitions ||
      item.competitions.length === 0 ||
      !item.competitions[0].competitors ||
      item.competitions[0].competitors.length < 2
    ) {
      return null;
    }

    const competition = item.competitions[0];
    const [home, away] = competition.competitors;
    const date = dayjs(competition.date);
    const scoreHome = home.score.value;
    const scoreAway = away.score.value;
    const score = scoreHome + "-" + scoreAway;

    return (
      <View style={styles.row}>
        <Text style={styles.team}>{home.team.displayName}</Text>
        <Image source={{ uri: home.team.logos?.[0]?.href }} style={styles.logo} />

        <View style={styles.dateContainer}>
          <Text style={styles.date}>{date.format('DD/MM')}</Text>
          <Text style={styles.score}>{score}</Text>
        </View>

        <Image source={{ uri: away.team.logos?.[0]?.href }} style={styles.logo} />
        <Text style={styles.team}>{away.team.displayName}</Text>
      </View>
    );
  };



  return (
    <FlatList
      data={games}
      keyExtractor={item => item.id}
      renderItem={renderItem}
      contentContainerStyle={{ paddingBottom: 120 }}
    />
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginVertical: 5,
    marginHorizontal: 15,
    backgroundColor: '#c2c2cc',
    borderRadius: 10
  },
  team: {
    flex: 1,
    fontSize: 14,
  },
  logo: {
    width: 24,
    height: 24,
    marginHorizontal: 4
  },
  dateContainer: {
    width: 60,
    alignItems: 'center'
  },
  date: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  score: {
    fontSize: 12,
  },

});
