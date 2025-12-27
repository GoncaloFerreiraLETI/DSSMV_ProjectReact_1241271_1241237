import React, { useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

import ProxJogosTab from './ProxJogosTab';
import JogosAntTab from './JogosAntTab';
import PlantelTab from './PlantelTab';

export default function EquipaTabs({ team }) {
  const [tab, setTab] = useState('next');

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row' }}>
        {['next', 'previous', 'squad'].map(t => (
          <TouchableOpacity
            key={t}
            onPress={() => setTab(t)}
            style={{ flex: 1, padding: 12 }}
          >
            <Text style={{ textAlign: 'center' }}>
              {t === 'next' ? 'Próximos' : t === 'previous' ? 'Anteriores' : 'Equipa'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {tab === 'next' && <ProxJogosTab team={team} />}
      {tab === 'previous' && <JogosAntTab team={team} />}
      {tab === 'squad' && <PlantelTab team={team} />}
    </View>
  );
}
