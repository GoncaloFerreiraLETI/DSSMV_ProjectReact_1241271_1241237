import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import DetalhesLigaStore from '../stores/DetalhesLigaStore';
import DetalhesLigaActions from '../actions/DetalhesLigaActions';
import TableRow from '../components/TableRow';

export default function DetalhesLiga({ route }) {
  const { leagueCode, leagueName } = route.params;
  const [table, setTable] = useState([]);

  useEffect(() => {
    const onChange = () => {
      setTable(DetalhesLigaStore.getTable());
    };

    DetalhesLigaStore.addChangeListener(onChange);
    DetalhesLigaActions.fetchTable(leagueCode);

    return () => DetalhesLigaStore.removeChangeListener(onChange);
  }, [leagueCode]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{leagueName}</Text>

      <View style={styles.headerRow}>
        <Text style={styles.pos}>#</Text>
        <Text style={styles.club}>Nome</Text>
        <Text style={styles.stat}>J</Text>
        <Text style={styles.stat}>DG</Text>
        <Text style={styles.stat}>PTS</Text>
      </View>

      <FlatList
        data={table}
        keyExtractor={(item) => item.teamId.toString()}
        renderItem={({ item, index }) => (
          <TableRow item={item} position={index + 1} />
        )}
        contentContainerStyle={{ paddingBottom: 120 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
    marginTop: 100,
    marginLeft: 10,
    marginRight: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16
  },
  headerRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 8
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10
  },
  pos: {
    width: 25,
    textAlign: 'center'
  },
  club: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  logo: {
    width: 24,
    height: 24,
    marginRight: 8
  },
  clubName: {
    flexShrink: 1
  },
  stat: {
    width: 40,
    textAlign: 'center'
  }
});


