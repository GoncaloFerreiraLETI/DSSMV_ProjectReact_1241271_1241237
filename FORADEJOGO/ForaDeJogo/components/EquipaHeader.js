import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default function EquipaHeader({ team }) {
  return (
    <View style={styles.container}>
      <Image source={{ uri: team.logos[0].href }} style={styles.logo} />
      <Text style={styles.name}>{team.displayName}</Text>
      <Text style={styles.rank}>{team.standingSummary}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', padding: 16 },
  logo: { width: 80, height: 80 },
  name: { fontSize: 20, fontWeight: 'bold', marginTop: 8 },
  rank: { fontSize: 12, color: '#888' },
});
