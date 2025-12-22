import React, { useMemo, useRef, useEffect } from 'react';
import { FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import dayjs from 'dayjs';

export default function DaySelector({ selectedDate, onSelect }) {
  const listRef = useRef(null);

  const days = useMemo(() => {
    const today = dayjs();
    return Array.from({ length: 15 }, (_, i) =>
      today.add(i - 7, 'day')
    );
  }, []);

  useEffect(() => {
    setTimeout(() => {
      listRef.current?.scrollToIndex({ index: 6, animated: false });
    }, 0);
  }, []);

  return (
    <FlatList
      ref={listRef}
      horizontal
      data={days}
      keyExtractor={(d) => d.format('YYYY-MM-DD')}
      showsHorizontalScrollIndicator={false}
      style={styles.list}
      contentContainerStyle={styles.listContent}
      getItemLayout={(_, index) => ({
        length: 60,
        offset: 60 * index,
        index,
      })}
      renderItem={({ item }) => {
        const isSelected = item.isSame(selectedDate, 'day');

        return (
          <TouchableOpacity
            style={[styles.day, isSelected && styles.selected]}
            onPress={() => onSelect(item)}
          >
            <Text style={[styles.weekday, isSelected && styles.selectedText]}>
              {item.format('ddd')}
            </Text>
            <Text style={[styles.date, isSelected && styles.selectedText]}>
              {item.format('DD')}
            </Text>
          </TouchableOpacity>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    maxHeight: 90,
  },
  listContent: {
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  day: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 6,
    borderRadius: 10,
    backgroundColor: '#f2f2f2',
  },
  selected: {
    backgroundColor: '#222',
  },
  weekday: {
    fontSize: 12,
    color: '#666',
  },
  date: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  selectedText: {
    color: '#fff',
  },
});

