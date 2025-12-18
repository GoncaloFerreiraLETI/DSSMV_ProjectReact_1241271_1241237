import { View, StyleSheet } from 'react-native';
import { useLinkBuilder, useTheme } from '@react-navigation/native';
import { Text, PlatformPressable } from '@react-navigation/elements';
import Feather from 'react-native-vector-icons/FontAwesome6';
export function TabBar({ state, descriptors, navigation }) {
    const { colors } = useTheme();
    const { buildHref } = useLinkBuilder();

    const icons = {
        Ligas: 'flag-checkered',
        Favoritos: 'star',
        Home: 'house',
        Jogos: 'futbol',
        Definições: 'gear',
    };

    return (
        <View style={styles.tabbar}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];

                const label =
                    options.tabBarLabel ??
                    options.title ??
                    route.name;

                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    });
                };

                return (
                    <PlatformPressable
                        key={route.key}
                        href={buildHref(route.name)}
                        accessibilityState={isFocused ? { selected: true } : {}}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testID={options.tabBarButtonTestID}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        style={styles.tabbarItem}
                    >
                        <Feather
                            name={icons[route.name]}
                            size={24}
                            color={isFocused ? colors.primary : '#999'}
                        />
                        <Text
                            style={{
                                color: isFocused ? colors.primary : '#999',
                                fontSize: 12,
                            }}
                        >
                            {label}
                        </Text>
                    </PlatformPressable>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    tabbar: {
        position: 'absolute',
        bottom: 30,
        left: 20,
        right: 20,
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderRadius: 35,
        paddingVertical: 15,
        elevation: 5,
    },
    tabbarItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5,
    },
});



