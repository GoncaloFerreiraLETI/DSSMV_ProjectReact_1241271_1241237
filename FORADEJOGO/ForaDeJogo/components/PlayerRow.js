import { View, Text, Image, StyleSheet } from 'react-native';

export default function PlayerRow({ player }) {
  return (
    <View style={styles.row}>
      <Image source={{ uri: player.flag.href }} style={styles.flag} />

      <Text style={styles.name} numberOfLines={1}>
        {player.displayName}
      </Text>

      <Text style={styles.number}>
        {player.jersey ?? '—'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20, // 20px início/fim
    paddingVertical: 12,
  },
  flag: {
    width: 24,
    height: 16,
    marginRight: 10, // 10px depois da bandeira
  },
  name: {
    flex: 1, // ocupa o espaço até ao número
    fontSize: 15,
  },
  number: {
    fontWeight: 'bold'
  }
});
