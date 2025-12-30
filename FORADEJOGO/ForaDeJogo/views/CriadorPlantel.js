import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { supabase } from '../services/supabase';
import AppBar from '../components/AppBar';

const USER_ID = '1';

export default function CriadorPlantel({ navigation }) {
  const [squads, setSquads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSquads();
  }, []);

  async function fetchSquads() {
    setLoading(true);
    const { data, error } = await supabase
      .from('squads')
      .select('*')
      .eq('userId', USER_ID);

    if (error) {
      console.error('Erro ao buscar plantéis:', error);
      setSquads([]);
    } else {
      setSquads(data);
    }
    setLoading(false);
  }

  const renderItem = ({ item }) => (
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

  return (
    <View style={styles.container}>
      <AppBar title="Os Meus Plantéis" />

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={squads}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListFooterComponent={
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => navigation.navigate('EditorPlantel')}
            >
              <Text style={styles.createButtonText}>Criar Novo Plantel</Text>
            </TouchableOpacity>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f2f2f2',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  formation: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  name: {
    fontSize: 16,
    color: '#333',
  },
  createButton: {
    backgroundColor: '#007bff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 100,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
