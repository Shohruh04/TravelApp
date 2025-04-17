import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, Star, Search, Calendar, Clock } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const popularDestinations = [
  {
    id: '1',
    name: 'Maldives Resort',
    location: 'Male, Maldives',
    rating: 4.8,
    price: 299,
    image: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=500',
  },
  {
    id: '2',
    name: 'Santorini Villa',
    location: 'Santorini, Greece',
    rating: 4.9,
    price: 399,
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=500',
  },
];

const trending = [
  {
    id: '1',
    name: 'Paris Luxury Suite',
    location: 'Paris, France',
    rating: 4.7,
    price: 259,
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=500',
  },
  {
    id: '2',
    name: 'Bali Beach Resort',
    location: 'Bali, Indonesia',
    rating: 4.6,
    price: 189,
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=500',
  },
];

export default function ExploreScreen() {
  const router = useRouter();
  const getGreeting = () => {
    const currentHour = new Date().getHours();

    if (currentHour >= 5 && currentHour < 12) {
      return 'Good Morning';
    } else if (currentHour >= 12 && currentHour < 18) {
      return 'Good Afternoon';
    } else {
      return 'Good Evening';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.greeting}>{getGreeting()}</Text>
          <Text style={styles.name}>Shohruh</Text>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color="#64748B" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search destinations, hotels"
              placeholderTextColor="#64748B"
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.bookingsButton}
          onPress={() => router.push('/page/bookings')}
        >
          <Calendar size={20} color="#FFFFFF" />
          <Text style={styles.bookingsButtonText}>My Bookings</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Popular Destinations</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.horizontalScroll}
        >
          {popularDestinations.map((item) => (
            <TouchableOpacity key={item.id} style={styles.destinationCard}>
              <Image
                source={{ uri: item.image }}
                style={styles.destinationImage}
              />
              <View style={styles.cardContent}>
                <Text style={styles.hotelName}>{item.name}</Text>
                <View style={styles.locationContainer}>
                  <MapPin size={14} color="#64748B" />
                  <Text style={styles.location}>{item.location}</Text>
                </View>
                <View style={styles.ratingPrice}>
                  <View style={styles.rating}>
                    <Star size={14} color="#FBC02D" />
                    <Text style={styles.ratingText}>{item.rating}</Text>
                  </View>
                  <Text style={styles.price}>
                    ${item.price}
                    <Text style={styles.perNight}>/night</Text>
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>Trending</Text>
        <View style={styles.trendingGrid}>
          {trending.map((item) => (
            <TouchableOpacity key={item.id} style={styles.trendingCard}>
              <Image
                source={{ uri: item.image }}
                style={styles.trendingImage}
              />
              <View style={styles.trendingContent}>
                <Text style={styles.hotelName}>{item.name}</Text>
                <View style={styles.locationContainer}>
                  <MapPin size={14} color="#64748B" />
                  <Text style={styles.location}>{item.location}</Text>
                </View>
                <View style={styles.ratingPrice}>
                  <View style={styles.rating}>
                    <Star size={14} color="#FBC02D" />
                    <Text style={styles.ratingText}>{item.rating}</Text>
                  </View>
                  <Text style={styles.price}>
                    ${item.price}
                    <Text style={styles.perNight}>/night</Text>
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    padding: 20,
  },
  greeting: {
    fontSize: 16,
    color: '#64748B',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0F172A',
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 16,
  },
  horizontalScroll: {
    paddingLeft: 20,
  },
  destinationCard: {
    width: 280,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  destinationImage: {
    width: '100%',
    height: 180,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  cardContent: {
    padding: 16,
  },
  hotelName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0F172A',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  location: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 4,
  },
  ratingPrice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0F172A',
    marginLeft: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0EA5E9',
  },
  perNight: {
    fontSize: 12,
    fontWeight: '400',
    color: '#64748B',
  },
  trendingGrid: {
    padding: 20,
    gap: 16,
  },
  trendingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  trendingImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  trendingContent: {
    padding: 16,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#0F172A',
  },
  bookingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0EA5E9',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 16,
  },
  bookingsButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
