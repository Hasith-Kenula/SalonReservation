import { useTheme } from '@/context/ThemeContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDistance } from 'geolib';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ColorValue, FlatList, StyleSheet, Switch, Text, View } from 'react-native';
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
  latitude: string | null;
  longitude: string | null;
  distance?: number; // Optional distance property
}
type Service = {
  serviceID: string;
  salonID: string;
  serviceName: string;
  servicePrice: number;
  durationMinutes: string
}
type User = {
  customerID: string;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  location: Coords;
}
type Coords = {
  latitude: string | null;
  longitude: string | null;
}
const SearchIcon = (color: ColorValue) => {
  return (
    <Ionicons name="search" size={24} color={color} />
  );
}
const Home = () => {
  const [salons, setSalons] = useState<Salon[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState('Loading...');
  const [user, setUser] = useState<User | null>(null);
  const { theme, toggleTheme, isDark } = useTheme();

  // Fetch salons, services from API and user data from local storage
  useEffect(() => {
    const fetchData = async () => {
      try {
        const salonsRes = await fetch('http://192.168.1.2:3000/salons');
        const salonsData = await salonsRes.json();

        const servicesRes = await fetch('http://192.168.1.2:3000/services');
        const servicesData = await servicesRes.json();

        setServices(servicesData.data || []);
        setSalons(salonsData.data || []);

        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser({
            ...parsedUser,
            location: {
              latitude: parsedUser.latitude || null,
              longitude: parsedUser.longitude || null,
            }
          });
        } else {
          setUser(null);
          console.warn('No user data found in local storage');
        }

        // if (user) {
        //   const salonWithDistance = salonData.map((salon: Salon) => {
        //     const distance = calculateDistance({
        //       latitude: salon.latitude,
        //       longitude: salon.longitude
        //     });
        //     return { ...salon, distance };
        //   });

        //   const sortedSalons = salonWithDistance.sort((a: any, b: any) => {
        //     const isNaN_A = isNaN(a.distance);
        //     const isNaN_B = isNaN(b.distance);
        //     if (isNaN_A && !isNaN_B) return 1; // Both are NaN, keep original order
        //     if (!isNaN_A && isNaN_B) return -1; // Both are NaN, keep original order
        //     if (isNaN_A && isNaN_B) return 0; // Both are NaN, keep original order
        //     return a.distance - b.distance; // Sort by distance
        //   });
        //   setSalons(sortedSalons);
        // } else {
        //   setSalons(salonData);
        //   console.warn('No user data found, setting salons without distance');
        // }

      } catch (err) {
        alert('Failed to load data.');
      } finally {
        setLoading(false);
        setLoadingText('No salons found.');
      }
    };
    fetchData();
  }, []);


  useEffect(() => {
    if (!user || salons.length === 0) return;

    const salonsWithDistance = salons.map(salon => {
      const distance = calculateDistance({
        latitude: salon.latitude,
        longitude: salon.longitude
      });

      return { ...salon, distance };
    });

    const sorted = salonsWithDistance.sort((a, b) => {
      const distanceA = a.distance; // Use Infinity if distance is NaN
      const distanceB = b.distance; // Use Infinity if distance is NaN

      const isNaN_A = isNaN(distanceA);
      const isNaN_B = isNaN(distanceB);

      if (isNaN_A && !isNaN_B) return 1; // Both are NaN, keep original order
      if (!isNaN_A && isNaN_B) return -1; // Both are NaN, keep original order
      if (isNaN_A && isNaN_B) return 0; // Both are NaN, keep original order
      return distanceA - distanceB; // Sort by distance
    });
    setSalons(sorted);
  }, [user, salons.length]);


  console.log('User data:', JSON.stringify(user));
  console.log('Salon data:', JSON.stringify(salons));
  // Group services by salonID
  const getSalonServices = (salonID: string) => {
    return services.filter((s) => s.salonID === salonID);
  }


  // Mock distance calculation (replace with real calculation if you have user location)
  const calculateDistance = (salonLocation: Coords): number => {
    try {
      const customerLatitude = parseFloat(user?.location?.latitude || '');
      const customerLogitude = parseFloat(user?.location?.longitude || '');

      const salonLatitude = parseFloat(salonLocation.latitude || '');
      const salonLongitude = parseFloat(salonLocation.longitude || '');

      if (isNaN(customerLatitude) || isNaN(customerLogitude) || isNaN(salonLatitude) || isNaN(salonLongitude)) {
        throw new Error('Invalid coordinates');
      }
      const distance = getDistance(
        { latitude: customerLatitude, longitude: customerLogitude },
        { latitude: salonLatitude, longitude: salonLongitude }
      );
      // Convert meters to kilometers and round to two decimals
      return parseFloat((distance / 1000).toFixed(2)); // Convert meters to kilometers

    } catch (error) {
      console.warn('Error calculating distance:', error);
      return NaN; // Return NaN if there's an error
    }
  }



  // Get price range for a salon's services
  const getPriceRange = (salonServices: Service[]) => {
    if (!salonServices.length) return '';
    const prices = salonServices.map((s) => Number(s.servicePrice));
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return min === max ? `LKR ${min}` : `LKR ${min} - ${max}`;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.tonal_a0, height: '100%' }}>
      <View style={Style.headings}>
        <Text style={[Style.title, { color: theme.colors.textColor }]}>Salons</Text>
      </View>
      <View style={{ paddingTop: 10, paddingHorizontal: 15, flex: 1 }}>
        <FocusableTextInput
          placeholder="Search for salons"
          placeholderTextColor={theme.colors.tonal_a50}
          color={theme.colors.textColor}
          Icon={SearchIcon(theme.colors.tonal_a50)}
          style={{ height: 40, borderWidth: 0, backgroundColor: theme.colors.tonal_a10, borderRadius: 15, shadowColor: 'transparent' }}
          IconPosition={'left'}
        />
        <Switch onValueChange={toggleTheme} value={isDark} />
        {loading && (<ActivityIndicator size="large" color="#3586DB" />)}
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
                distance={isNaN(item.distance!) ? 'NaN' : item.distance!.toFixed(2)} // Use distance if available
                rate={item.rate} // Placeholder for rating, set to null or 0 for now
                priceRange={getPriceRange(salonServices)}
              // Add more props as needed
              />
            );
          }}
          ListEmptyComponent={<Text style={{ color: '#888', textAlign: 'center' }}>{loadingText}</Text>}
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