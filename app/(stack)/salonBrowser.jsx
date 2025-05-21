import { FlatList, SafeAreaView, ScrollView, StyleSheet, Text, TextInput } from 'react-native'
import SalonCard from '../../components/SalonCard'

const SalonBrowser = () => {
  const salons = [
    {
      id: 1,
      name: 'Urden Salon',
      distance: '2',
      rating: 4.5,
      price: "100 - 200",
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
      price: "50 - 100",
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
      price: "150 - 300",
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
      price: "80 - 150",
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
      price: "120 - 250",
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
      price: "90 - 180",
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
      price: "200 - 400",
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
      price: "70 - 130",
      services: [
        { service: 'Haircuts', price: 70 },
        { service: 'Styling', price: 90 },
      ],
    },
    {
      id: 9,
      name: 'Salon Chic',
      distance: '10',
      rating: 4.4,
      price: "110 - 220",
      services: [
        { service: 'Haircuts', price: 120 },
        { service: 'Styling', price: 140 },
        { service: 'Coloring', price: 220 },
      ],
    },
    {
      id: 10,
      name: 'Glamour Studio',
      distance: '11',
      rating: 4.9,
      price: "150 - 300",
      services: [
        { service: 'Haircuts', price: 160 },
        { service: 'Styling', price: 180 },
        { service: 'Makeup', price: 300 },
      ],
    },
  ]
  return (
    <SafeAreaView style={Style.container}>
      <ScrollView>
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
              rate={item.rating}
              services={item.services.map(s => ({ service: s.service, price: String(s.price) }))}
            />
          )}
        />
      </ScrollView>
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
export default SalonBrowser