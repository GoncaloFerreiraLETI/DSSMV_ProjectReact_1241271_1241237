import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';

import SquadStore from '../stores/SquadStore';
import {
  loadSquadPlayers,
  saveSquadPlayers,
  deleteSquad,
} from '../actions/SquadActions';

import { FORMATIONS } from '../constants/formations';

export default function EditorPlantel({ route, navigation }) {
  const { squadId, clubId, formation } = route.params;

  const [loading, setLoading] = useState(true);
  const [positions, setPositions] = useState([]);
  const [allPlayers, setAllPlayers] = useState([]);
  const [availablePlayers, setAvailablePlayers] = useState([]);
  const [squadPlayers, setSquadPlayers] = useState([]);
  const [selectedPositionIndex, setSelectedPositionIndex] = useState(null);

  useEffect(() => {
    const onChange = () => {
      setLoading(SquadStore.isLoading());
      setSquadPlayers(SquadStore.getSquadPlayers());
    };

    SquadStore.addChangeListener(onChange);
    onChange();

    return () => SquadStore.removeChangeListener(onChange);
  }, []);

  useEffect(() => {
    loadSquadPlayers(squadId);
  }, [squadId]);

  useEffect(() => {
    let mounted = true;

    async function loadPlayers() {
      try {
        const res = await fetch(
          `https://sports.core.api.espn.com/v2/sports/soccer/leagues/all/seasons/2025/teams/${clubId}/athletes`
        );
        const data = await res.json();

        if (!data?.items || !mounted) return;

        const players = await Promise.all(
          data.items.map(i =>
            fetch(i.$ref.replace('http://', 'https://')).then(r => r.json())
          )
        );

        if (mounted) {
          setAllPlayers(players.filter(Boolean));
        }
      } catch (e) {
        console.error('Erro ao carregar jogadores:', e);
      }
    }

    loadPlayers();

    return () => {
      mounted = false;
    };
  }, [clubId]);

  function buildPositions(formation) {
    const layout = FORMATIONS[formation];

    const countsTotal = {};
    layout.forEach(code => {
      countsTotal[code] = (countsTotal[code] || 0) + 1;
    });

    const counts = {};

    return layout.map(code => {
      counts[code] = (counts[code] || 0) + 1;

      let fullCode = code;
      const multipleAllowed = ['CB', 'CM', 'ST'];
      if (multipleAllowed.includes(code) && countsTotal[code] > 1) {
        fullCode = code + counts[code];
      }

      return { code, fullCode, player: null };
    });
  }

  useEffect(() => {
    if (!allPlayers.length) return;

    const basePositions = buildPositions(formation);
    const usedIds = [];

    const filled = basePositions.map(pos => {
      const row = squadPlayers.find(
        r => r.position?.toUpperCase() === pos.fullCode.toUpperCase()
      );

      if (!row) return pos;

      const player = allPlayers.find(
        p => String(p.id) === String(row.playerId)
      );

      if (!player) return pos;

      usedIds.push(player.id);
      return { ...pos, player };
    });

    setPositions(filled);
    setAvailablePlayers(allPlayers.filter(p => !usedIds.includes(p.id)));
    setLoading(false);
  }, [allPlayers, squadPlayers, formation]);

  function assignPlayer(player) {
    setPositions(prev => {
      const pos = prev[selectedPositionIndex];
      const copy = [...prev];
      copy[selectedPositionIndex] = { ...pos, player };
      return copy;
    });

    setAvailablePlayers(prev =>
      prev.filter(p => p.id !== player.id)
    );

    setSelectedPositionIndex(null);
  }

  function removePlayer(posIndex) {
    const pos = positions[posIndex];
    if (!pos.player) return;

    setAvailablePlayers(prev => [...prev, pos.player]);

    setPositions(prev => {
      const copy = [...prev];
      copy[posIndex] = { ...pos, player: null };
      return copy;
    });
  }

  async function save() {
    await saveSquadPlayers(squadId, positions);
    Alert.alert('Sucesso', 'Plantel guardado com sucesso');
  }

  function removeSquad() {
    Alert.alert('Apagar plantel', 'Tens a certeza?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Apagar',
        style: 'destructive',
        onPress: async () => {
          await deleteSquad(squadId);
          navigation.goBack();
        },
      },
    ]);
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Formação {formation}</Text>

      <FlatList
        data={positions}
        keyExtractor={(_, i) => String(i)}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={[
              styles.position,
              selectedPositionIndex === index && styles.selected,
            ]}
            onPress={() => setSelectedPositionIndex(index)}
          >
            <Text style={styles.posLabel}>{item.fullCode}</Text>

            {item.player ? (
              <View style={styles.selectedPlayer}>
                {item.player.flag?.href && (
                  <Image
                    source={{ uri: item.player.flag.href }}
                    style={styles.flag}
                  />
                )}
                <Text style={{ flex: 1 }}>
                  #{item.player.jersey || '-'} {item.player.displayName}
                </Text>

                <TouchableOpacity onPress={() => removePlayer(index)}>
                  <Image
                    source={require('../imgs/removeIcon.png')}
                    style={styles.removeIcon}
                  />
                </TouchableOpacity>
              </View>
            ) : (
              <Text style={{ color: '#999' }}>Vazio</Text>
            )}
          </TouchableOpacity>
        )}
      />

      {selectedPositionIndex !== null && (
        <>
          <Text style={styles.subtitle}>Escolher jogador</Text>

          <FlatList
            data={availablePlayers}
            keyExtractor={p => String(p.id)}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.player}
                onPress={() => assignPlayer(item)}
              >
                {item.flag?.href && (
                  <Image source={{ uri: item.flag.href }} style={styles.flag} />
                )}
                <Text>
                  <Text style={styles.jersey}>
                    #{item.jersey || '-'}
                  </Text>{' '}
                  {item.displayName}
                </Text>
              </TouchableOpacity>
            )}
          />
        </>
      )}

      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveBtn} onPress={save}>
          <Text style={styles.btnText}>Guardar alterações</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteBtn} onPress={removeSquad}>
          <Text style={styles.btnText}>Apagar plantel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  subtitle: { marginTop: 12, fontWeight: 'bold' },

  position: {
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 6,
    borderRadius: 6,
  },
  selected: { borderWidth: 2, borderColor: '#007bff' },
  posLabel: { fontWeight: 'bold' },

  selectedPlayer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  player: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#eee',
    marginBottom: 4,
    borderRadius: 6,
  },
  flag: { width: 24, height: 16, resizeMode: 'contain', marginRight: 8 },
  jersey: { fontWeight: 'bold' },
  removeIcon: { width: 12, height: 12, marginLeft: 8 },

  footer: { flexDirection: 'row', marginTop: 12 },
  saveBtn: {
    flex: 1,
    backgroundColor: '#007bff',
    padding: 14,
    borderRadius: 6,
    marginRight: 6,
    alignItems: 'center',
  },
  deleteBtn: {
    flex: 1,
    backgroundColor: '#dc3545',
    padding: 14,
    borderRadius: 6,
    marginLeft: 6,
    alignItems: 'center',
  },
  btnText: { color: '#fff', fontWeight: 'bold' },
});
