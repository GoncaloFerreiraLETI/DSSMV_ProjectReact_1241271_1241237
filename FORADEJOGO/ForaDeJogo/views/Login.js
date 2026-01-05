import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import AuthActions from '../actions/AuthActions';
import AuthStore from '../stores/AuthStore';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const onChange = () => {
      setLoading(AuthStore.isLoading());

      const error = AuthStore.getError();
      const user = AuthStore.getUser();

      if (error) Alert.alert('Erro', error);
      if (user) {
        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'Tabs',
              state: {
                routes: [{ name: 'Definições' }],
              },
            },
          ],
        });
      }
    };

    AuthStore.addChangeListener(onChange);
    return () => AuthStore.removeChangeListener(onChange);
  });

  function handleLogin() {
    if (!email || !password) {
      Alert.alert('Erro', 'Preenche todos os campos');
      return;
    }

    AuthActions.login(email, password);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Password"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'A entrar...' : 'Entrar'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Criar conta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 14,
    marginBottom: 14,
  },
  button: {
    backgroundColor: '#222',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  link: { marginTop: 20, textAlign: 'center', color: '#007AFF' },
});
