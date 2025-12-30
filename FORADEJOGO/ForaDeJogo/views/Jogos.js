import React, { useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import dayjs from 'dayjs';
import { SafeAreaView } from 'react-native-safe-area-context';

import DaySelector from '../components/DaySelector';
import LigaAccordion from '../components/LigaAccordion';

import JogosStore from '../stores/JogosStore';
import JogosActions from '../actions/JogosActions';

export default function Jogos() {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [leagues, setLeagues] = useState([]);

  useEffect(() => {
    const onChange = () => {
      setLeagues(JogosStore.getLeagues());
    };

    JogosStore.addChangeListener(onChange);
    return () => JogosStore.removeChangeListener(onChange);
  }, []);

  useEffect(() => {
    const dateStr = selectedDate.format('YYYYMMDD');
    JogosActions.fetchGamesByDate(dateStr);
  }, [selectedDate]);

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: 40 }}>

      <DaySelector
        selectedDate={selectedDate}
        onSelect={setSelectedDate}
      />

      <FlatList
        data={leagues}
        keyExtractor={(item) => item.league.code}
        renderItem={({ item }) => <LigaAccordion data={item} />}
        initialNumToRender={4}
        windowSize={5}
        removeClippedSubviews
        contentContainerStyle={{ paddingBottom: 120 }}
      />
    </SafeAreaView>
  );
}