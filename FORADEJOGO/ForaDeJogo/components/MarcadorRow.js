import { View, Text, Image, StyleSheet } from 'react-native';

export default function MarcadorRow({ item, position }) {
  return (
    <View style={styles.row}>
      <Text style={styles.pos}>{position}</Text>

      <View style={styles.player}>
        <Image source={{ uri: item.teamLogo }} style={styles.logo} />
        <Text numberOfLines={1} style={styles.name}>
          {item.playerName}
        </Text>
      </View>

      <Text style={styles.goals}>{item.goals}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  pos: {
    width: 25,
    textAlign: 'center',
  },
  player: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  name: {
    flexShrink: 1,
    fontSize: 14,
  },
  goals: {
    width: 40,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
