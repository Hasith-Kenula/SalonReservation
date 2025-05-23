import { useRouter } from 'expo-router';
import { FlatList, SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';
import FocusableTextInput from '../../components/FocusableTextInput';
import SalonCard from '../../components/SalonCard';


const index = () => {
  const router = useRouter();
  // useEffect(() => {
  //   const checkLoginStatus = async () => {
  //     const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
  //     if (!(isLoggedIn === 'true')) {
  //       router.replace('/login');
  //     }
  //   }
  //   checkLoginStatus();
  // }, [])

  const salons = [
    {
      id: 1,
      name: 'Urden Salon',
      distance: '2',
      rating: 4.5,
      services: [
        { service: 'Haircuts', price: 100 },
        { service: 'Styling', price: 120 },
      ],
    },
    {
      id: 2,
      name: 'Fresh Cuts',
      distance: '5',
      rating: 4.0,
      services: [
        { service: 'Haircuts', price: 60 },
        { service: 'Styling', price: 80 },
        { service: 'Coloring', price: 100 },
      ],
    },
    {
      id: 3,
      name: 'Glamour Salon',
      distance: '3',
      rating: 4.8,
      services: [
        { service: 'Haircuts', price: 150 },
        { service: 'Styling', price: 180 },
        { service: 'Coloring', price: 220 },
        { service: 'Nail Care', price: 200 },
      ],
    },
    {
      id: 4,
      name: 'Beauty Bar',
      distance: '4',
      rating: 4.2,
      services: [
        { service: 'Haircuts', price: 90 },
        { service: 'Styling', price: 110 },
        { service: 'Makeup', price: 150 },
      ],
    },
    {
      id: 5,
      name: 'Chic Salon',
      distance: '6',
      rating: 4.6,
      services: [
        { service: 'Haircuts', price: 130 },
        { service: 'Styling', price: 150 },
        { service: 'Coloring', price: 200 },
        { service: 'Nail Care', price: 180 },
      ],
    },
    {
      id: 6,
      name: 'Style Studio',
      distance: '7',
      rating: 4.3,
      services: [
        { service: 'Haircuts', price: 100 },
        { service: 'Styling', price: 120 },
        { service: 'Coloring', price: 180 },
      ],
    },
    {
      id: 7,
      name: 'Salon Luxe',
      distance: '8',
      rating: 4.7,
      services: [
        { service: 'Haircuts', price: 220 },
        { service: 'Styling', price: 250 },
        { service: 'Coloring', price: 300 },
        { service: 'Nail Care', price: 280 },
      ],
    },
    {
      id: 8,
      name: 'Urban Cuts',
      distance: '9',
      rating: 4.1,
      services: [
        { service: 'Haircuts', price: "70" },
        { service: 'Styling', price: "90" },
      ],
    },
    {
      id: 9,
      name: 'Salon Chic',
      distance: '10',
      rating: 4.4,
      services: [
        { service: 'Haircuts', price: "120" },
        { service: 'Styling', price: "140" },
        { service: 'Coloring', price: "220" },
      ],
    },
    {
      id: 10,
      name: 'Glamour Studio',
      distance: '11',
      rating: 4.9,
      services: [
        { service: 'Haircuts', price: "160" },
        { service: 'Styling', price: "180" },
        { service: 'Makeup', price: "300" },
      ],
    },
  ]
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white', height: '100%' }}>
      <StatusBar barStyle="dark-content" />
      <View style={Style.headings}>
        <Text style={Style.title}>Salons</Text>
      </View>
      <View style={{ paddingTop: 10, paddingHorizontal: 15, }}>
        <FocusableTextInput
          placeholder="Search for salons"
          placeholderTextColor="gray"
        />
        <FlatList
          style={{ marginBottom: 100, paddingTop: 10 }}
          data={salons}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode='on-drag'
          keyboardShouldPersistTaps='handled'
          renderItem={({ item }) => (
            <SalonCard
              name={item.name}
              distance={parseInt(item.distance)}
              rate={item.rating}
              services={item.services.map(s => ({ service: s.service, price: String(s.price) }))} // Convert prices to integers

            />
          )}
        />
      </View>
    </SafeAreaView>
  )
}
const Style = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  title: {
    alignSelf: 'flex-start',
    marginLeft: 10,
    fontSize: 30,
    paddingBottom: 10,
    //color: '#3586DB',
    fontWeight: 'bold',
  },
  headings: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: 'rgba(131, 131, 131, 0.51)',
    borderBottomWidth: 1,
  },
})

export default index