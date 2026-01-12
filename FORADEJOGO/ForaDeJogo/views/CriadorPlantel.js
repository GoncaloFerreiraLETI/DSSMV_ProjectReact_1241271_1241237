import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
  TextInput,
} from 'react-native';

import AppBar from '../components/AppBar';
import AuthStore from '../stores/AuthStore';
import SquadStore from '../stores/SquadStore';
import { loadSquads, createSquad } from '../actions/SquadActions';

const LEAGUES = [
  { code: 'eng.1', name: 'Premier League' },
  { code: 'eng.2', name: 'Championship' },
  { code: 'esp.1', name: 'La Liga' },
  { code: 'ger.1', name: 'Bundesliga' },
  { code: 'ita.1', name: 'Serie A' },
  { code: 'fra.1', name: 'Ligue 1' },
  { code: 'por.1', name: 'Primeira Liga' },
  { code: 'bra.1', name: 'Brasileirão' },
];

const FORMATIONS = ['4-3-3', '4-4-2', '4-5-1', '3-4-3', '3-5-2'];

export default function CriadorPlantel({ navigation }) {
  const [userId, setUserId] = useState(null);
  const [squads, setSquads] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [step, setStep] = useState(1);

  const [selectedLeague, setSelectedLeague] = useState(null);
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedFormation, setSelectedFormation] = useState(null);
  const [squadName, setSquadName] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const onAuthChange = () => {
      const id = AuthStore.getUser()?.id ?? null;
      setUserId(id);
    };

    AuthStore.addChangeListener(onAuthChange);
    onAuthChange();

    return () => AuthStore.removeChangeListener(onAuthChange);
  }, []);

  useEffect(() => {
    if (userId) {
      loadSquads(userId);
    } else {
      setSquads([]);
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    const onChange = () => {
      setSquads(SquadStore.getSquads());
      setLoading(SquadStore.isLoading());
    };

    SquadStore.addChangeListener(onChange);
    onChange();

    return () => SquadStore.removeChangeListener(onChange);
  }, []);

  async function fetchTeamsFromLeague(leagueCode) {
    try {
      const res = await fetch(
        `https://sports.core.api.espn.com/v2/sports/soccer/leagues/${leagueCode}/seasons/2025/teams`
      );
      const data = await res.json();

      const teamsData = await Promise.all(
        data.items.map(async i => {
          const team = await fetch(i.$ref.replace('http://', 'https://')).then(r =>
            r.json()
          );
          return { id: team.id, name: team.name };
        })
      );

      setTeams(teamsData);
    } catch (e) {
      console.error('Erro ao buscar clubes:', e);
    }
  }

  async function handleNext() {
    if (step === 1 && selectedLeague) {
      await fetchTeamsFromLeague(selectedLeague.code);
      setStep(2);
    } else if (step === 2 && selectedTeam) {
      setStep(3);
    } else if (step === 3 && selectedFormation) {
      setStep(4);
    } else if (step === 4 && squadName.trim()) {
      setCreating(true);

      const squad = await createSquad({
        userId,
        teamId: selectedTeam.id,
        formation: selectedFormation,
        name: squadName,
      });

      setCreating(false);
      setModalVisible(false);

      if (squad) {
        navigation.navigate('EditorPlantel', {
          squadId: squad.id,
          clubId: selectedTeam.id,
          formation: selectedFormation,
          userId,
        });
      }
    }
  }

  function renderStepContent() {
    if (step === 1) {
      return (
        <FlatList
          data={LEAGUES}
          keyExtractor={i => i.code}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.item,
                selectedLeague?.code === item.code && styles.selected,
              ]}
              onPress={() => setSelectedLeague(item)}
            >
              <Text>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      );
    }

    if (step === 2) {
      return (
        <FlatList
          data={teams}
          keyExtractor={i => String(i.id)}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.item,
                selectedTeam?.id === item.id && styles.selected,
              ]}
              onPress={() => setSelectedTeam(item)}
            >
              <Text>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      );
    }

    if (step === 3) {
      return (
        <FlatList
          data={FORMATIONS}
          keyExtractor={i => i}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.item,
                selectedFormation === item && styles.selected,
              ]}
              onPress={() => setSelectedFormation(item)}
            >
              <Text>{item}</Text>
            </TouchableOpacity>
          )}
        />
      );
    }

    if (step === 4) {
      return (
        <TextInput
          style={styles.input}
          placeholder="Nome do plantel"
          value={squadName}
          onChangeText={setSquadName}
        />
      );
    }

    return null;
  }

  return (
    <View style={styles.container}>
      <AppBar title="Os Meus Plantéis" />

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={squads}
          keyExtractor={i => String(i.id)}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() =>
                navigation.navigate('EditorPlantel', {
                  squadId: item.id,
                  clubId: item.teamId,
                  formation: item.formation,
                  userId: item.userId,
                })
              }
            >
              <Text style={styles.formation}>{item.formation}</Text>
              <Text style={styles.name}>{item.name}</Text>
            </TouchableOpacity>
          )}
          ListFooterComponent={
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => {
                setStep(1);
                setSelectedLeague(null);
                setTeams([]);
                setSelectedTeam(null);
                setSelectedFormation(null);
                setSquadName('');
                setModalVisible(true);
              }}
            >
              <Text style={styles.createButtonText}>
                Criar Novo Plantel
              </Text>
            </TouchableOpacity>
          }
        />
      )}

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>
            Criar Plantel – Passo {step}/4
          </Text>

          {renderStepContent()}

          <TouchableOpacity
            style={[styles.nextButton, creating && { opacity: 0.6 }]}
            onPress={handleNext}
            disabled={creating}
          >
            <Text style={styles.nextButtonText}>
              {step === 4 ? 'Criar Plantel' : 'Próximo'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setModalVisible(false)}>
            <Text style={{ textAlign: 'center', marginTop: 10 }}>
              Cancelar
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f2f2f2' },

  item: {
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 6,
    borderRadius: 6,
  },

  selected: {
    borderWidth: 2,
    borderColor: '#007bff',
  },

  formation: { fontWeight: 'bold', fontSize: 16 },
  name: { fontSize: 16 },

  createButton: {
    backgroundColor: '#007bff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },

  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  modalContainer: { flex: 1, padding: 16, backgroundColor: '#f9f9f9' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },

  nextButton: {
    backgroundColor: '#28a745',
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 12,
  },

  nextButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  input: {
    borderWidth: 1,
    borderColor: '#999',
    padding: 10,
    borderRadius: 6,
  },
});
