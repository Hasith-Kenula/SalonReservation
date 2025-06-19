import { useTheme } from '@/context/ThemeContext';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { BlurView } from 'expo-blur';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const TabBar = ({ state, descriptors, navigation }: any) => {


  // const [visibleTabs, setVisibleTabs] = useState(['']);

  // useEffect(() => {
  //   const setTabs = async () => {
  //     const _role = await AsyncStorage.getItem('role');

  //     switch (_role) {
  //       case 'Customer':
  //         setVisibleTabs(['home', 'profile', 'reservation'])
  //         break;
  //       case 'Salon':
  //         setVisibleTabs(['salonHome', 'setting', 'profile', 'detail']);
  //         break;
  //       case 'Employee':
  //         setVisibleTabs(['employeeHome', 'setting', 'profile', 'detail']);
  //         break;
  //       default:
  //         setVisibleTabs(['home', 'setting', 'profile']);
  //         break;
  //     }
  //   }
  //   setTabs();
  // }, []);
  // console.log('Visible Tabs:', visibleTabs);
  const colors = {
    primary: '#2B6EC5',
    secondary: 'gray',
  }
  function getIcon(name: any, focused: boolean, color: string) {
    switch (name) {
      case 'home':
        return <AntDesign name='home' size={focused ? 26 : 24} color={color} />;
      case 'salonHome':
        return <AntDesign name='home' size={focused ? 26 : 24} color={color} />;
      case 'employeeHome':
        return <AntDesign name='home' size={focused ? 26 : 24} color={color} />;
      case 'setting':
        return <AntDesign name='setting' size={focused ? 26 : 24} color={color} />;
      case 'profile':
        return <AntDesign name='user' size={focused ? 26 : 24} color={color} />;
      case 'reservation':
        return <MaterialCommunityIcons name="calendar-clock-outline" size={focused ? 26 : 24} color={color} />// return <MaterialIcons name="schedule" size={20} color={focused ? colors.primary : colors.secondary} />
      default:
        return <MaterialIcons name="error" size={focused ? 26 : 24} color={color} />;
    }
  }
  const intensity = Platform.OS === 'android' ? 100 : 70
  const { theme, isDark } = useTheme();
  return (
    <View style={[Styles.wrapper, { backgroundColor: theme.colors.tonal_a10 }]}>
      <BlurView style={[Styles.container, { borderTopColor: theme.colors.blurViewTopBorder }]} intensity={intensity} tint={isDark ? 'dark' : 'light'}>
        {state.routes.map((route: any, index: any) => {

          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
                ? options.title
                : route.name;
          // if (!visibleTabs.includes(route.name)) return null;
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
              {getIcon(route.name, isFocused, isFocused ? theme.colors.tabBarFocused : theme.colors.tabBarUnfocused)}
              <Text style={{ color: isFocused ? theme.colors.tabBarFocused : theme.colors.tabBarUnfocused, fontSize: isFocused ? 15 : 14, }}
                numberOfLines={1}>

                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </BlurView>
    </View>
  )
}
const Styles = StyleSheet.create({
  wrapper: {
    backgroundColor: Platform.OS === 'android' ? 'rgba(255, 255, 255, 0.47)' : ''
  },
  container: {
    height: 70,
    width: '100%',
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    flexDirection: 'row',
    paddingBottom: 10,


    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderTopWidth: 1,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: -3 },
    // shadowOpacity: 0.1,
    // shadowRadius: 10,
    // elevation: 10,
    // backgroundColor: 'rgba(107, 41, 41, 0.86)',


  },
  Item: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
export default TabBar
