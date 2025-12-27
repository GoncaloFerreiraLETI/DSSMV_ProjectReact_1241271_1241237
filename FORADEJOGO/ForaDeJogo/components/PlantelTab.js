import React from 'react';
import { SectionList, Text, StyleSheet } from 'react-native';
import PlayerRow from '../components/PlayerRow';

export default function PlantelTab({ squad = {} }) {
  const sections = Object.keys(squad).map((position) => ({
    title: position,
    data: squad[position],
  }));

  return (
    <SectionList
      sections={sections}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <PlayerRow player={item} />}
      renderSectionHeader={({ section }) => (
        <Text style={styles.header}>{section.title}</Text>
      )}
      contentContainerStyle={{ paddingBottom: 120 }}
    />
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    fontWeight: 'bold',
    fontSize: 16,
  },
});
