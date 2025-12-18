import { View, Text, Image, StyleSheet } from 'react-native';

function TableRow({ item, position }) {
  return (
    <View style={styles.row}>
      <Text style={styles.pos}>{position}</Text>

      <View style={styles.club}>
        <Image source={{ uri: item.logo }} style={styles.logo} />
        <Text numberOfLines={1} style={styles.clubName}>
          {item.teamName}
        </Text>
      </View>

      <Text style={styles.stat}>{item.games}</Text>
      <Text style={styles.stat}>{item.goalDiff}</Text>
      <Text style={styles.stat}>{item.points}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10
  },
  pos: {
    width: 25,
    textAlign: 'center'
  },
  club: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  logo: {
    width: 24,
    height: 24,
    marginRight: 8
  },
  clubName: {
    flexShrink: 1
  },
  stat: {
    width: 40,
    textAlign: 'center'
  }
});

export default TableRow;
