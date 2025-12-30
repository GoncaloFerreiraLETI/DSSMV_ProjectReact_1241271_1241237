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

import { supabase } from '../services/supabase';
import { FORMATIONS } from '../constants/formations';

export default function EditorPlantel({ route, navigation }) {
  const { squadId, clubId, formation, userId } = route.params;

  const [loading, setLoading] = useState(true);
  const [allPlayers, setAllPlayers] = useState([]);
  const [availablePlayers, setAvailablePlayers] = useState([]);
  const [positions, setPositions] = useState([]);
  const [selectedPositionIndex, setSelectedPositionIndex] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      setLoading(true);

      const basePositions = buildPositions(formation);
      if (!isMounted) return;
      setPositions(basePositions);

      const players = await fetchPlayersFromApi(clubId);
      if (!isMounted) return;

      setAllPlayers(players);

      const { data } = await supabase
        .from('squad_players')
        .select('*')
        .eq('squadId', squadId);

      if (!isMounted) return;

      let usedIds = [];

      const filled = basePositions.map(pos => {
        const row = data?.find(r => r.position?.toUpperCase() === pos.fullCode.toUpperCase());
        if (!row) return pos;

        const player = players.find(p => String(p.id) === String(row.playerId));
        if (!player) return pos;

        usedIds.push(player.id);
        return { ...pos, player };
      });

      setPositions(filled);

      setAvailablePlayers(players.filter(p => !usedIds.includes(p.id)));

      setLoading(false);
    }

    load();

    return () => {
      isMounted = false;
    };
  }, [clubId, formation, squadId]);

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
      if (multipleAllowed.includes(code)) {
        if (countsTotal[code] > 1) {
          fullCode = code + counts[code];
        }
      }

      return { code, fullCode, player: null };
    });
  }



  async function fetchPlayersFromApi(clubId) {
    const res = await fetch(
      `https://sports.core.api.espn.com/v2/sports/soccer/leagues/all/seasons/2025/teams/${clubId}/athletes`
    );

    const data = await res.json();

    const players = await Promise.all(
      data.items.map(i =>
        fetch(i.$ref.replace('http://', 'https://')).then(r => r.json())
      )
    );

    return players;
  }

  function assignPlayer(player) {
    setPositions(prev => {
      const pos = prev[selectedPositionIndex];

      let newAvailable = [...availablePlayers];
      if (pos.player) newAvailable.push(pos.player);
      newAvailable = newAvailable.filter(p => p.id !== player.id);
      setAvailablePlayers(newAvailable);

      const copy = [...prev];
      copy[selectedPositionIndex] = { ...pos, player };
      return copy;
    });

    setSelectedPositionIndex(null);
  }

  function removePlayer(posIndex) {
    const pos = positions[posIndex];
    if (!pos.player) return;

    setAvailablePlayers(a => [...a, pos.player]);

    setPositions(p => {
      const copy = [...p];
      copy[posIndex] = { ...pos, player: null };
      return copy;
    });
  }

  async function saveSquad() {
    setLoading(true);

    const { data: dbRows } = await supabase
      .from('squad_players')
      .select('*')
      .eq('squadId', squadId);

    const dbByPosition = {};
    dbRows.forEach(r => {
      dbByPosition[r.position] = r;
    });

    for (const pos of positions) {
      const dbRow = dbByPosition[pos.fullCode];

      if (!pos.player && dbRow) {
        await supabase
          .from('squad_players')
          .delete()
          .eq('id', dbRow.id);
      }

      if (pos.player && !dbRow) {
        await supabase
          .from('squad_players')
          .insert({
            squadId,
            playerId: pos.player.id,
            position: pos.fullCode,
          });
      }

      if (pos.player && dbRow && String(dbRow.playerId) !== String(pos.player.id)) {
        await supabase
          .from('squad_players')
          .update({ playerId: pos.player.id })
          .eq('id', dbRow.id);
      }
    }

    setLoading(false);
    Alert.alert('Sucesso', 'Plantel guardado com sucesso');
  }


  async function deleteSquad() {
    Alert.alert(
      'Apagar plantel',
      'Tens a certeza?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Apagar',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            await supabase
              .from('squad_players')
              .delete()
              .eq('squadId', squadId);

            await supabase
              .from('squads')
              .delete()
              .eq('id', squadId);

            setPositions(buildPositions(formation));
            setAvailablePlayers(allPlayers);
            setLoading(false);

            navigation.navigate('CriadorPlantel', {
              userId: userId,
            })
          },
        },
      ]
    );
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
            style={[styles.position, selectedPositionIndex === index && styles.selected]}
            onPress={() => setSelectedPositionIndex(index)}
          >
            <Text style={styles.posLabel}>{item.fullCode}</Text>

            {item.player ? (
              <View style={styles.selectedPlayer}>
                {item.player.flag?.href && (
                  <Image source={{ uri: item.player.flag.href }} style={styles.flag} />
                )}

                <Text style={{ flex: 1 }}>
                  #{item.player.jersey || '-'} {item.player.displayName}
                </Text>

                <TouchableOpacity onPress={() => removePlayer(index)}>
                  <Image source={require('../imgs/removeIcon.png')} style={styles.removeIcon} />
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
            keyExtractor={i => String(i.id)}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.player} onPress={() => assignPlayer(item)}>
                {item.flag?.href && <Image source={{ uri: item.flag.href }} style={styles.flag} />}
                <Text>
                  <Text style={styles.jersey}>#{item.jersey || '-'}</Text> {item.displayName}
                </Text>
              </TouchableOpacity>
            )}
          />
        </>
      )}

      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveBtn} onPress={saveSquad}>
          <Text style={styles.btnText}>Guardar alterações</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteBtn} onPress={deleteSquad}>
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

  position: { backgroundColor: '#fff', padding: 12, marginBottom: 6, borderRadius: 6 },
  selected: { borderWidth: 2, borderColor: '#007bff' },
  posLabel: { fontWeight: 'bold' },

  selectedPlayer: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  player: { flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: '#eee', marginBottom: 4, borderRadius: 6 },
  flag: { width: 24, height: 16, resizeMode: 'contain', marginRight: 8 },
  jersey: { fontWeight: 'bold' },
  removeIcon: { width: 12, height: 12, marginLeft: 8 },

  footer: { flexDirection: 'row', marginTop: 12 },
  saveBtn: { flex: 1, backgroundColor: '#007bff', padding: 14, borderRadius: 6, marginRight: 6, alignItems: 'center' },
  deleteBtn: { flex: 1, backgroundColor: '#dc3545', padding: 14, borderRadius: 6, marginLeft: 6, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold' },
});
