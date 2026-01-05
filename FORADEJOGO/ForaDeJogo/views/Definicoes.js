import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import dayjs from 'dayjs';

import AuthStore from '../stores/AuthStore';
import AuthActions from '../actions/AuthActions';
import AppBar from '../components/AppBar';

export default function Definicoes({ navigation }) {
  const [user, setUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 🔹 Escuta alterações do AuthStore
  useEffect(() => {
    const onChange = () => {
      const currentUser = AuthStore.getUser();
      setUser(currentUser);
      if (currentUser) {
        setUsername(currentUser.username);
        setEmail(currentUser.email);
      }
    };

    AuthStore.addChangeListener(onChange);
    onChange(); // atualiza logo ao abrir

    return () => AuthStore.removeChangeListener(onChange);
  }, []);

  // 🔹 Caso não esteja logado
  if (!user) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.infoText}>Não tens sessão iniciada</Text>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.loginButtonText}>Fazer Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 🔹 Salvar alterações
  const handleUpdate = async () => {
    if (!username || !email) {
      Alert.alert('Erro', 'Username e email não podem estar vazios');
      return;
    }

    try {
      await AuthActions.updateUser(user.id, {
        username,
        email,
        password: password || undefined, // só atualiza se preenchido
      });

      Alert.alert('Sucesso', 'Dados atualizados!');
      setPassword('');
      setModalVisible(false);
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível atualizar os dados');
    }
  };

  return (
    <View style={styles.container}>
      <AppBar title="Definições" />

      <View style={styles.card}>
        <Text style={styles.username}>{user.username}</Text>
        <Text style={styles.email}>{user.email}</Text>
        <Text style={styles.date}>
          Conta criada em {dayjs(user.created_at).format('DD/MM/YYYY')}
        </Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
        <Text>Editar dados</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.logout]}
        onPress={() => {
          AuthActions.logout();
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        }}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <TextInput
            value={username}
            onChangeText={setUsername}
            placeholder="Username"
            style={styles.input}
          />
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            style={styles.input}
          />
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            style={styles.input}
            secureTextEntry
          />

          <TouchableOpacity style={styles.saveButton} onPress={handleUpdate}>
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Salvar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ marginTop: 10 }}
            onPress={() => setModalVisible(false)}
          >
            <Text style={{ color: '#222', textAlign: 'center' }}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },

  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  infoText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },

  loginButton: {
    backgroundColor: '#222',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
  },

  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  card: {
    backgroundColor: '#222',
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
  },

  username: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },

  email: {
    color: '#bbb',
    marginTop: 4,
  },

  date: {
    color: '#888',
    fontSize: 12,
    marginTop: 8,
  },

  button: {
    padding: 16,
    backgroundColor: '#b1b1b1',
    borderRadius: 10,
    marginBottom: 12,
    alignItems: 'center',
  },

  logout: {
    backgroundColor: '#d00',
  },

  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  modalContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginVertical: 10,
    borderRadius: 8,
  },

  saveButton: {
    backgroundColor: '#222',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
});
