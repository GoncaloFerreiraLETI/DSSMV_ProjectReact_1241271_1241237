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
import { supabase } from '../services/supabase';
import AppBar from '../components/AppBar';
import AuthStore from '../stores/AuthStore';


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
    const onChange = () => setUserId(AuthStore.getUser()?.id ?? null);
    AuthStore.addChangeListener(onChange);
    onChange();
    return () => AuthStore.removeChangeListener(onChange);
  }, []);

  useEffect(() => {
    if (!userId) {
      setSquads([]);
      setLoading(false);
      return;
    }
    async function fetchSquads() {
      setLoading(true);
      const { data, error } = await supabase
        .from('squads')
        .select('*')
        .eq('userId', userId);

      if (error) {
        console.error('Erro ao buscar plantéis:', error);
        setSquads([]);
      } else {
        setSquads(data);
      }
      setLoading(false);
    }
    fetchSquads();
  }, [userId]);

  async function fetchSquads() {
    if (!userId) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('squads')
      .select('*')
      .eq('userId', userId);

    if (error) {
      console.error('Erro ao buscar plantéis:', error);
      setSquads([]);
    } else {
      setSquads(data);
    }
    setLoading(false);
  }

  const renderSquadItem = ({ item }) => (
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
  );

  const renderCreateButton = () => (
    <TouchableOpacity
      style={styles.createButton}
      onPress={() => {
        // reset do popup
        setStep(1);
        setSelectedLeague(null);
        setTeams([]);
        setSelectedTeam(null);
        setSelectedFormation(null);
        setSquadName('');
        setModalVisible(true);
      }}
    >
      <Text style={styles.createButtonText}>Criar Novo Plantel</Text>
    </TouchableOpacity>
  );

  async function fetchTeamsFromLeague(leagueCode) {
    try {
      const res = await fetch(
        `https://sports.core.api.espn.com/v2/sports/soccer/leagues/${leagueCode}/seasons/2025/teams?lang=en&region=us`
      );
      const data = await res.json();

      const teamsData = await Promise.all(
        data.items.map(async (i) => {
          const teamRes = await fetch(i.$ref.replace('http://', 'https://'));
          const teamJson = await teamRes.json();
          return { id: teamJson.id, name: teamJson.name };
        })
      );

      setTeams(teamsData);
    } catch (err) {
      console.error('Erro ao buscar clubes da liga:', err);
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
    } else if (step === 4 && squadName.trim() !== '') {
      setCreating(true);
      const { data, error } = await supabase.from('squads').insert({
        userId: userId,
        teamId: selectedTeam.id,
        formation: selectedFormation,
        name: squadName,
      }).select().single();

      setCreating(false);

      if (error) {
        console.error('Erro ao criar plantel:', error);
        return;
      }

      setModalVisible(false);
      navigation.navigate('EditorPlantel', {
        squadId: data.id,
        clubId: selectedTeam.id,
        formation: selectedFormation,
        userId: userId,
      });

      fetchSquads();
    }
  }

  function handleCancelModal() {
    setModalVisible(false);
  }

  function renderStepContent() {
    if (step === 1) {
      return (
        <FlatList
          data={LEAGUES}
          keyExtractor={(item) => item.code}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.item,
                selectedLeague?.code === item.code && { borderColor: '#007bff', borderWidth: 2 },
              ]}
              onPress={() => setSelectedLeague(item)}
            >
              <Text>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      );
    } else if (step === 2) {
      return (
        <FlatList
          data={teams}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.item,
                selectedTeam?.id === item.id && { borderColor: '#007bff', borderWidth: 2 },
              ]}
              onPress={() => setSelectedTeam(item)}
            >
              <Text>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      );
    } else if (step === 3) {
      return (
        <FlatList
          data={FORMATIONS}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.item,
                selectedFormation === item && { borderColor: '#007bff', borderWidth: 2 },
              ]}
              onPress={() => setSelectedFormation(item)}
            >
              <Text>{item}</Text>
            </TouchableOpacity>
          )}
        />
      );
    } else if (step === 4) {
      return (
        <TextInput
          style={styles.input}
          placeholder="Nome do plantel"
          value={squadName}
          onChangeText={setSquadName}
        />
      );
    }
  }

  return (
    <View style={styles.container}>
      <AppBar title="Os Meus Plantéis" />

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={squads}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderSquadItem}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListFooterComponent={renderCreateButton}
        />
      )}

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Criar Plantel - Passo {step}/4</Text>

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

          <TouchableOpacity style={{ marginTop: 10 }} onPress={handleCancelModal}>
            <Text style={{ textAlign: 'center', color: '#222' }}>Cancelar</Text>
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
  formation: { fontWeight: 'bold', fontSize: 16, color: '#333' },
  name: { fontSize: 16, color: '#333' },
  createButton: {
    backgroundColor: '#007bff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  createButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

  modalContainer: { flex: 1, padding: 16, backgroundColor: '#f9f9f9' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  nextButton: {
    backgroundColor: '#28a745',
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 12,
  },
  nextButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    padding: 10,
    borderRadius: 6,
  },
});
