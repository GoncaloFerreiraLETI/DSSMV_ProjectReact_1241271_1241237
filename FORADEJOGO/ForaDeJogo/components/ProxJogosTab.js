import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';
import dayjs from 'dayjs';

import ProxJogosActions from '../actions/ProxJogosActions';
import ProxJogosStore from '../stores/ProxJogosStore';

export default function ProxJogosTab({ teamId }) {
  const [games, setGames] = useState([]);

  useEffect(() => {
    const onChange = () => setGames(ProxJogosStore.getGames());
    ProxJogosStore.subscribe(onChange);

    ProxJogosActions.fetchNextGames(teamId);
  }, [teamId]);

  const renderItem = ({ item }) => {
    const competition = item.competitions[0];
    const [home, away] = competition.competitors;
    const date = dayjs(competition.date);

    return (
      <View style={styles.row}>
        <Text style={styles.team}>{home.team.displayName}</Text>
        <Image source={{ uri: home.team.logos[0].href }} style={styles.logo} />

        <View style={styles.dateContainer}>
          <Text style={styles.date}>{date.format('DD/MM')}</Text>
          <Text style={styles.time}>{date.format('HH:mm')}</Text>
        </View>

        <Image source={{ uri: away.team.logos[0].href }} style={styles.logo} />
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
  time: {
    fontSize: 12,
  },

});
