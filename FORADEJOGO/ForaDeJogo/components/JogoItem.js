import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';

export default function JogoItem({ game }) {
  const navigation = useNavigation();

  const match = game.competitions[0];
  const home = match.competitors.find(c => c.homeAway === 'home');
  const away = match.competitors.find(c => c.homeAway === 'away');

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() =>
        navigation.navigate('DetalhesJogo', {
          game,
        })
      }
    >
      <Text style={styles.teams}>
        {home.team.displayName} vs {away.team.displayName}
      </Text>

      <Text style={styles.date}>
        {dayjs(game.date).format('DD/MM HH:mm')}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    marginVertical: 6,
    backgroundColor: '#eee',
    borderRadius: 8,
  },
  teams: {
    fontWeight: 'bold',
  },
  date: {
    color: '#666',
  },
});
