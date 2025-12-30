import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import LigaStore from '../stores/LigaStore';
import LigaActions from '../actions/LigaActions';
import AppBar from '../components/AppBar';

export default function LigaView({ navigation }) {
    const [leagues, setLeagues] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const onChange = () => {
            setLeagues(LigaStore.getLeagues());
            setLoading(false);
        };

        LigaStore.addChangeListener(onChange);
        LigaActions.fetchLeagues();

        return () => {
            LigaStore.removeChangeListener(onChange);
        };
    }, []);

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.itemContainer}
            onPress={() => navigation.navigate('DetalhesLiga', {
              leagueCode: item.code,
              leagueName: item.name,
            })}
        >
            {item.logo && <Image source={{ uri: item.logo }} style={styles.logo} />}
            <Text style={styles.name}>{item.name}</Text>
        </TouchableOpacity>
    );

    if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color="#0000ff" />;

    return (
      <View>
        <AppBar title="Ligas" />
        <FlatList
            data={leagues}
            keyExtractor={(item) => item.code}
            renderItem={renderItem}
            contentContainerStyle={{
                paddingBottom: 250,
            }}
        />
      </View>
    );
}

const styles = StyleSheet.create({
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e8e8e8',
        marginHorizontal: 25,
        marginVertical: 10,
        padding: 15,
        borderRadius: 10,
        height: 70,
    },
    logo: {
        width: 40,
        height: 40,
        marginRight: 10,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});
