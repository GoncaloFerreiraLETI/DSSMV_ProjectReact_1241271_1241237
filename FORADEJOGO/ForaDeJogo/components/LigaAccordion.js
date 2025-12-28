import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import JogoRow from './JogoRow';

export default function LigaAccordion({ data }) {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => setOpen(!open)}
      >
        <Image source={{ uri: data.logo }} style={styles.logo} />
        <Text style={styles.title}>{data.league.name}</Text>
        <Text style={styles.leading}>{open ? 'v' : '>'}</Text>
      </TouchableOpacity>
      console.log('data.games', data.games);
      {open && data.games?.map((game) => (
        <JogoRow key={game.id} game={game} leagueCode={data.league.code} />
      ))}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderColor: '#ddd',
    marginHorizontal: 25,
    backgroundColor: '#e8e8e8',
    marginVertical: 10,
    borderRadius: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  logo: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  title: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 16,
  },
  leading: {
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8e8e8',
    marginHorizontal: 25,
    marginVertical: 10,
    padding: 15,
    borderRadius: 10,
    height: 70,
  },
  logo1: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});