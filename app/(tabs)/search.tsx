import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, MapPin, Star, Filter } from 'lucide-react-native';

const searchResults = [
  {
    id: '1',
    name: 'Grand Hyatt',
    location: 'Dubai, UAE',
    rating: 4.8,
    price: 399,
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=500',
  },
  {
    id: '2',
    name: 'Ritz Carlton',
    location: 'New York, USA',
    rating: 4.9,
    price: 599,
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=500',
  },
  {
    id: '3',
    name: 'Four Seasons',
    location: 'Tokyo, Japan',
    rating: 4.7,
    price: 499,
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=500',
  },
];

export default function SearchScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Search size={20} color="#64748B" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search destinations, hotels"
            placeholderTextColor="#64748B"
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color="#0F172A" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.resultsContainer}>
          {searchResults.map((item) => (
            <TouchableOpacity key={item.id} style={styles.resultCard}>
              <Image source={{ uri: item.image }} style={styles.hotelImage} />
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
                  <Text style={styles.price}>${item.price}<Text style={styles.perNight}>/night</Text></Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#0F172A',
  },
  filterButton: {
    width: 48,
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultsContainer: {
    padding: 20,
    gap: 16,
  },
  resultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  hotelImage: {
    width: '100%',
    height: 200,
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
});