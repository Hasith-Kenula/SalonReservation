import { FlatList, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import SalonCard from '../../components/SalonCard';



const index = () => {
  const salons = [
    {
      id: 1,
      name: 'Urden Salon',
      distance: '2',
      rating: 4.5,
      price: "100 - 200",
      services: ['Haircuts', 'Styling'],
    },
    {
      id: 2,
      name: 'Fresh Cuts',
      distance: '5',
      rating: 4.0,
      price: "50 - 100",
      services: ['Haircuts', 'Styling', 'Coloring'],
    },
    {
      id: 3,
      name: 'Glamour Salon',
      distance: '3',
      rating: 4.8,
      price: "150 - 300",
      services: ['Haircuts', 'Styling', 'Coloring', 'Nail Care'],
    },
    {
      id: 4,
      name: 'Beauty Bar',
      distance: '4',
      rating: 4.2,
      price: "80 - 150",
      services: ['Haircuts', 'Styling', 'Makeup'],
    },
    {
      id: 5,
      name: 'Chic Salon',
      distance: '6',
      rating: 4.6,
      price: "120 - 250",
      services: ['Haircuts', 'Styling', 'Coloring', 'Nail Care'],
    },
    {
      id: 6,
      name: 'Style Studio',
      distance: '7',
      rating: 4.3,
      price: "90 - 180",
      services: ['Haircuts', 'Styling', 'Coloring'],
    },
    {
      id: 7,
      name: 'Salon Luxe',
      distance: '8',
      rating: 4.7,
      price: "200 - 400",
      services: ['Haircuts', 'Styling', 'Coloring', 'Nail Care'],
    },
    {
      id: 8,
      name: 'Urban Cuts',
      distance: '9',
      rating: 4.1,
      price: "70 - 130",
      services: ['Haircuts', 'Styling'],
    },
    {
      id: 9,
      name: 'Salon Chic',
      distance: '10',
      rating: 4.4,
      price: "110 - 220",
      services: ['Haircuts', 'Styling', 'Coloring'],
    },
    {
      id: 10,
      name: 'Glamour Studio',
      distance: '11',
      rating: 4.9,
      price: "150 - 300",
      services: ['Haircuts', 'Styling', 'Makeup'],
    },
    // Add more salons as needed
  ]
  return (
    <SafeAreaView style={Style.container}>
      <StatusBar barStyle="dark-content" />
      <View>
        <Text>Salons</Text>
        <TextInput
          placeholder="Search for salons"
          placeholderTextColor="gray"
          style={{
            backgroundColor: '#f0f0f0',
            padding: 10,
            borderRadius: 5,
            borderWidth: 1,
            borderColor: '#ccc',
            marginBottom: 10,
          }}
        />
        <FlatList
          style={{ marginBottom: 100 }}
          data={salons}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode='on-drag'
          keyboardShouldPersistTaps='handled'
          renderItem={({ item }) => (
            <SalonCard
              name={item.name}
              distance={parseInt(item.distance)}
              price={item.price}
              rate={item.rating}
              services={item.services.join(', ')}
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
    marginTop: 20,
    marginHorizontal: 10,
  },
})

export default index