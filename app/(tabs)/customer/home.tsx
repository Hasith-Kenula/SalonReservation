import { useTheme } from '@/context/ThemeContext';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FocusableTextInput from '../../../components/FocusableTextInput';
import SalonCard from '../../../components/SalonCard';


type Salon = {
  salonID: string;
  salonName: string;
  ownerName: string;
  address: string;
  phone: string;
  rate: number;
}
type Service = {
  serviceID: string;
  salonID: string;
  serviceName: string;
  servicePrice: number;
  durationMinutes: string
}
const Home = () => {
  const [salons, setSalons] = useState<Salon[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const { theme, toggleTheme, isDark } = useTheme();

  // Fetch salons and services from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const salonsRes = await fetch('http://192.168.1.2:3000/salons');
        const salonsData = await salonsRes.json();

        const servicesRes = await fetch('http://192.168.1.2:3000/services');
        const servicesData = await servicesRes.json();

        setSalons(salonsData.data || []);
        setServices(servicesData.data || []);
      } catch (err) {
        alert('Failed to load salons or services');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Group services by salonID
  const getSalonServices = (salonID: string) => {
    return services.filter((s) => s.salonID === salonID);
  }


  // Mock distance calculation (replace with real calculation if you have user location)
  const getDistance = (salon: Salon) => {
    // TODO: Replace with real distance calculation
    return Math.floor(Math.random() * 10) + 1; // 1-10 km
  };

  // Get price range for a salon's services
  const getPriceRange = (salonServices: Service[]) => {
    if (!salonServices.length) return '';
    const prices = salonServices.map((s) => Number(s.servicePrice));
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return min === max ? `LKR ${min}` : `LKR ${min} - ${max}`;
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#3586DB" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.tonal_a0, height: '100%' }}>
      <View style={Style.headings}>
        <Text style={[Style.title, { color: theme.colors.textColor }]}>Salons</Text>
      </View>
      <View style={{ paddingTop: 10, paddingHorizontal: 15, flex: 1 }}>
        <FocusableTextInput
          placeholder="Search for salons"
          placeholderTextColor="gray"
        />
        <Switch onValueChange={toggleTheme} value={isDark} />
        <FlatList
          style={{ marginBottom: 100, paddingTop: 10, }}
          data={salons}
          keyExtractor={(item) => item.salonID}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode='on-drag'
          keyboardShouldPersistTaps='handled'
          renderItem={({ item }) => {
            const salonServices = getSalonServices(item.salonID);
            return (
              <SalonCard
                salonID={item.salonID}
                name={item.salonName}
                address={item.address}
                ownerName={item.ownerName}
                services={salonServices.map(s => ({
                  serviceID: s.serviceID,
                  service: s.serviceName,
                  price: String(s.servicePrice),
                }))}
                distance={getDistance(item)}
                rate={item.rate} // Placeholder for rating, set to null or 0 for now
                priceRange={getPriceRange(salonServices)}
              // Add more props as needed
              />
            );
          }}
          ListEmptyComponent={<Text style={{ color: '#888', textAlign: 'center' }}>No salons found.</Text>}
        />
      </View>
    </SafeAreaView>
  );
};

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
    fontWeight: 'bold',
  },
  headings: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: 'rgba(131, 131, 131, 0.51)',
    borderBottomWidth: 1,
  },
});

export default Home;