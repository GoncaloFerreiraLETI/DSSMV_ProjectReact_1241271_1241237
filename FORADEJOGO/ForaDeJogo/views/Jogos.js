import React, { useEffect, useState } from 'react';
import { View, FlatList, SafeAreaView } from 'react-native';
import dayjs from 'dayjs';

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
        keyExtractor={(item, index) => item.leagueCode ?? index.toString()}
        renderItem={({ item }) => <LigaAccordion data={item} />}
        contentContainerStyle={{
          paddingBottom: 120,
        }}
      />
    </SafeAreaView>
  );
}