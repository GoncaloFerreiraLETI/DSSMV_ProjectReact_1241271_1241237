import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import DetalhesLigaStore from '../stores/DetalhesLigaStore';
import DetalhesLigaActions from '../actions/DetalhesLigaActions';
import TableRow from '../components/TableRow';
import MarcadorRow from '../components/MarcadorRow';

export default function DetalhesLiga({ route }) {
  const { leagueCode, leagueName } = route.params;
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'geral', title: 'Geral' },
    { key: 'casa', title: 'Casa' },
    { key: 'fora', title: 'Fora' },
    { key: 'marcadores', title: 'Marcadores' },
  ]);

  const [table, setTable] = useState([]);
  const [homeTable, setHomeTable] = useState([]);
  const [awayTable, setAwayTable] = useState([]);
  const [topScorers, setTopScorers] = useState([]);

  useEffect(() => {
    const onChange = () => {
      setTable(DetalhesLigaStore.getTable());
      setHomeTable(DetalhesLigaStore.getHomeTable());
      setAwayTable(DetalhesLigaStore.getAwayTable());
      setTopScorers(DetalhesLigaStore.getTopScorers());
    };

    DetalhesLigaStore.addChangeListener(onChange);
    DetalhesLigaActions.fetchTable(leagueCode);

    return () => DetalhesLigaStore.removeChangeListener(onChange);
  }, [leagueCode]);

  const renderTable = (data) => (
    <>
      <View style={styles.headerRow}>
        <Text style={styles.pos}>#</Text>
        <Text style={styles.club}>Nome</Text>
        <Text style={styles.stat}>J</Text>
        <Text style={styles.stat}>DG</Text>
        <Text style={styles.stat}>PTS</Text>
      </View>
      <FlatList
        data={data}
        keyExtractor={(item) => item.teamId.toString()}
        renderItem={({ item, index }) => <TableRow item={item} position={index + 1} />}
        contentContainerStyle={{ paddingBottom: 120 }}
      />
    </>
  );

  const renderMarcadores = () => (
    <FlatList
      data={topScorers}
      keyExtractor={(item) => item.playerId.toString()}
      renderItem={({ item, index }) => <MarcadorRow player={item} position={index + 1} />}
      contentContainerStyle={{ paddingBottom: 120 }}
    />
  );

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'geral':
        return renderTable(table);
      case 'casa':
        return renderTable(homeTable);
      case 'fora':
        return renderTable(awayTable);
      case 'marcadores':
        return renderMarcadores();
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{leagueName}</Text>

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: Dimensions.get('window').width }}
        renderTabBar={props => (
          <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: 'blue' }}
            style={{ backgroundColor: '#f2f2f2' }}
            activeColor="black"
            inactiveColor="black"
            labelStyle={{ fontWeight: 'bold' }}
          />
        )}
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
