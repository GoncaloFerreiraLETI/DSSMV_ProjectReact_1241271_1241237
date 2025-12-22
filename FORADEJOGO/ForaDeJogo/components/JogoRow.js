import { View, Text, Image, StyleSheet } from 'react-native';
import dayjs from 'dayjs';

export default function JogoRow({ game }) {
  const competition = game.competitions[0];
  const [home, away] = competition.competitors;

  return (
    <View style={styles.row}>
      <View style={styles.left}>
        <Text
          style={styles.team}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.6} // reduz até 60% do tamanho original
        >
          {home.team.displayName}
        </Text>
        <Image source={{ uri: home.team.logo }} style={styles.logo} />
      </View>

      <Text style={styles.time}>
        {dayjs(competition.date).format('HH:mm')}
      </Text>

      <View style={styles.right}>
        <Image source={{ uri: away.team.logo }} style={styles.logo} />
        <Text
          style={styles.team}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.6}
        >
          {away.team.displayName}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-start',
  },
  team: {
    fontSize: 12,
    marginHorizontal: 4,
  },
  logo: {
    width: 20,
    height: 20,
    marginHorizontal: 4,
  },
  time: {
    width: 50,
    textAlign: 'center',
  },
});