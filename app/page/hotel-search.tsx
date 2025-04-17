//@ts-nocheck

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Search, MapPin, Star, ChevronLeft } from 'lucide-react-native';
import { hotelApi } from '../services/api';

// Hotel interface for type-checking
interface Hotel {
  id: string;
  name: string;
  location: {
    city: string;
    country: string;
  };
  review_score: number;
  review_count: number;
  price: {
    value: number;
    currency: string;
  };
  image_url: string;
  latitude: number;
  longitude: number;
}

export default function HotelSearchScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [searchQuery, setSearchQuery] = useState(
    (params.query as string) || ''
  );
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [destinationId, setDestinationId] = useState('');

  // New state for destinations and UI mode
  const [destinations, setDestinations] = useState([]);
  const [showDestinationsList, setShowDestinationsList] = useState(false);

  const searchDestinations = async () => {
    if (!searchQuery.trim()) {
      Alert.alert('Error', 'Please enter a destination');
      return;
    }

    setLoading(true);
    setError('');
    setShowDestinationsList(false);
    setHotels([]);

    try {
      const response = await hotelApi.searchLocations(searchQuery);

      if (response.data && response.data.length > 0) {
        // Store the destinations and show them in the UI
        setDestinations(response.data);
        setShowDestinationsList(true);

        // If there's only one result and it's a city, can optionally auto-search
        // if (response.data.length === 1 && response.data[0].dest_type === 'city') {
        //   searchHotels(response.data[0].dest_id, response.data[0].search_type);
        // }
      } else {
        setError('No destinations found');
      }
    } catch (err) {
      console.error('Error searching destinations:', err);
      setError('Failed to search destinations');
    } finally {
      setLoading(false);
    }
  };

  // Function for when user selects a destination
  const handleDestinationSelect = (destination) => {
    setShowDestinationsList(false);
    searchHotels(destination.dest_id, destination.search_type);
  };

  const searchHotels = async (dest_id, search_type) => {
    setLoading(true);
    setError('');
    setDestinationId(dest_id);

    try {
      const response = await hotelApi.searchHotels({
        dest_id: dest_id,
        search_type: search_type,
        adults: '1',
        children_age: '0,17',
        room_qty: '1',
        page_number: '1',
        currency_code: 'USD',
      });

      if (response.data && response.data.data && response.data.data.hotels) {
        // Process the hotels data
        const processedHotels = response.data.data.hotels.map((item) => {
          const hotelData = item.property;
          return {
            id: hotelData.id.toString(),
            name: hotelData.name,
            location: {
              city: hotelData.wishlistName || '',
              country: '',
            },
            review_score: hotelData.reviewScore || 0,
            review_count: hotelData.reviewCount || 0,
            rating_word: hotelData.reviewScoreWord || '',
            price: {
              value: hotelData.priceBreakdown?.grossPrice?.value || 0,
              currency: hotelData.priceBreakdown?.grossPrice?.currency || 'USD',
            },
            image_url: hotelData.photoUrls ? hotelData.photoUrls[0] : '',
            latitude: hotelData.latitude,
            longitude: hotelData.longitude,
          };
        });

        setHotels(processedHotels);
      } else {
        setError('No hotels found');
        setHotels([]);
      }
    } catch (err) {
      console.error('Error searching hotels:', err);
      setError('Failed to search hotels');
      setHotels([]);
    } finally {
      setLoading(false);
    }
  };

  const renderHotelItem = ({ item }: { item: Hotel }) => (
    <TouchableOpacity
      style={styles.hotelCard}
      onPress={() =>
        router.push({
          pathname: '/page/hotel-details',
          params: {
            id: item.id,
            name: item.name,
            currency: item.price.currency,
          },
        })
      }
    >
      <Image source={{ uri: item.image_url }} style={styles.hotelImage} />
      <View style={styles.hotelInfo}>
        <Text style={styles.hotelName}>{item.name}</Text>
        <View style={styles.locationContainer}>
          <MapPin size={14} color="#64748B" />
          <Text style={styles.locationText}>
            {item.location.city}
            {item.location.country ? `, ${item.location.country}` : ''}
          </Text>
        </View>
        <View style={styles.ratingContainer}>
          {item.review_score > 0 && (
            <View style={styles.rating}>
              <Star size={14} color="#FBC02D" />
              <Text style={styles.ratingText}>
                {item.review_score.toFixed(1)}
              </Text>
            </View>
          )}
          <Text style={styles.price}>
            {item.price.currency === 'INR' ? '₹' : '$'}
            {item.price.value.toFixed(2)}
            <Text style={styles.perNight}>/night</Text>
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Find Hotels</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search destinations or hotels"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={searchDestinations}
          />
          <TouchableOpacity
            style={styles.searchButton}
            onPress={searchDestinations}
          >
            <Search size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0EA5E9" />
          <Text style={styles.loadingText}>Searching...</Text>
        </View>
      )}

      {error ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{error}</Text>
        </View>
      ) : null}

      {/* Show destinations list */}
      {showDestinationsList && destinations.length > 0 ? (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultTitle}>Select a destination:</Text>
          <FlatList
            data={destinations}
            keyExtractor={(item) => item.dest_id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.destinationItem}
                onPress={() => handleDestinationSelect(item)}
              >
                {item.image_url ? (
                  <Image
                    source={{ uri: item.image_url }}
                    style={styles.destinationImage}
                  />
                ) : (
                  <View style={styles.placeholderImage}>
                    <MapPin size={20} color="#94A3B8" />
                  </View>
                )}
                <View style={styles.destinationInfo}>
                  <Text style={styles.destinationName}>{item.name}</Text>
                  <Text style={styles.destinationLocation}>
                    {[item.city_name, item.region, item.country]
                      .filter(Boolean)
                      .join(', ')}
                  </Text>
                  <Text style={styles.destinationType}>
                    {item.dest_type === 'city'
                      ? 'City'
                      : item.dest_type === 'hotel'
                      ? 'Hotel'
                      : item.dest_type === 'airport'
                      ? 'Airport'
                      : item.dest_type}
                    {item.hotels_count > 0
                      ? ` • ${item.hotels_count} hotels`
                      : ''}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      ) : null}

      {/* Show hotels list when available */}
      {!showDestinationsList && hotels.length > 0 ? (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultTitle}>
            {hotels.length} {hotels.length === 1 ? 'hotel' : 'hotels'} found
          </Text>
          <FlatList
            data={hotels}
            keyExtractor={(item) => item.id}
            renderItem={renderHotelItem}
          />
        </View>
      ) : null}

      {!loading && !error && !showDestinationsList && hotels.length === 0 && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Search for a city, area, or specific hotel
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0F172A',
    marginLeft: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    margin: 16,
    marginTop: 0,
  },
  searchInputContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  searchInput: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchButton: {
    width: 48,
    height: 48,
    backgroundColor: '#0EA5E9',
    borderRadius: 8,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748B',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
  },
  resultsContainer: {
    flex: 1,
  },
  hotelCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  hotelImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  hotelInfo: {
    padding: 16,
  },
  hotelName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#B45309',
    marginLeft: 4,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0EA5E9',
  },
  perNight: {
    fontSize: 12,
    fontWeight: '400',
    color: '#64748B',
  },
  destinationItem: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    alignItems: 'center',
  },
  destinationImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  placeholderImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  destinationInfo: {
    flex: 1,
    marginLeft: 12,
  },
  destinationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 2,
  },
  destinationLocation: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 2,
  },
  destinationType: {
    fontSize: 12,
    color: '#64748B',
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
    padding: 12,
    backgroundColor: '#F8FAFC',
  },
});
