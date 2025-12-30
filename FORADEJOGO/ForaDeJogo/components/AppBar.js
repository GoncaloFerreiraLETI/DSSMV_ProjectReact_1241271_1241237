import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function AppBar({ title }) {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.appName}>FORADEJOGO</Text>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#f2f2f2',
    elevation: 0,
    marginBottom: 20,
    marginTop: 30,
  },
  appName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 4,
  },
});
