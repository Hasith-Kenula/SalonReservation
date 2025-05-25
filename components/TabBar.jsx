import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const TabBar = ({ state, descriptors, navigation }) => {


  const [visibleTabs, setVisibleTabs] = useState(['']);

  useEffect(() => {
    const setTabs = async () => {
      const _role = await AsyncStorage.getItem('role');

      switch (_role) {

        case 'Customer':
          setVisibleTabs(['home', 'profile', 'reservation'])
          break;
        case 'Salon':
          setVisibleTabs(['salonHome', 'setting', 'profile', 'detail']);
          break;
        default:
          setVisibleTabs(['home', 'setting', 'profile']);
          break;
      }
    }
    setTabs();
  }, []);
  console.log(state.routes);
  const colors = {
    primary: '#2B6EC5',
    secondary: 'gray',
  }
  function getIcon(name, focused) {
    switch (name) {
      case 'home':
        return <AntDesign name='home' size={focused ? 26 : 24} color={focused ? colors.primary : colors.secondary} />;
      case 'salonHome':
        return <AntDesign name='home' size={focused ? 26 : 24} color={focused ? colors.primary : colors.secondary} />;
      case 'setting':
        return <AntDesign name='setting' size={focused ? 26 : 24} color={focused ? colors.primary : colors.secondary} />;
      case 'profile':
        return <AntDesign name='user' size={focused ? 26 : 24} color={focused ? colors.primary : colors.secondary} />;
      case 'reservation':
        return <MaterialCommunityIcons name="calendar-clock-outline" size={focused ? 26 : 24} color={focused ? colors.primary : colors.secondary} />// return <MaterialIcons name="schedule" size={20} color={focused ? colors.primary : colors.secondary} />
      default:
        return <MaterialIcons name="error" size={focused ? 26 : 24} color={focused ? colors.primary : colors.secondary} />;
    }
  }
  return (
    <View style={Styles.container}>
      {state.routes.map((route, index) => {

        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;
        if (!visibleTabs.includes(route.name)) return null;
        if (['_sitemap', '+not-found'].includes(route.name)) return null;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={route.name}
            accessibilityRole='button'
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={Styles.Item}
          >
            {getIcon(route.name, isFocused)}
            <Text style={{ color: isFocused ? colors.primary : colors.secondary, fontSize: isFocused ? 15 : 14, }}
              numberOfLines={1}>

              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  )
}
const Styles = StyleSheet.create({
  container: {
    height: 80,
    width: '100%',
    flex: 1,
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    paddingBottom: 10,
    backgroundColor: 'white',

  },
  Item: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
export default TabBar
