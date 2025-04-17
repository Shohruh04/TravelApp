//@ts-nocheck
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  ChevronLeft,
  MapPin,
  Star,
  Calendar,
  Users,
  Heart,
  Check,
} from 'lucide-react-native';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { hotelApi } from '../services/api';

export default function HotelDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [isFavorite, setIsFavorite] = useState(false);
  const [checkInDate, setCheckInDate] = useState(new Date());
  const [checkOutDate, setCheckOutDate] = useState(
    new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
  );
  const [guests, setGuests] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hotelDetails, setHotelDetails] = useState(null);
  const [roomAvailability, setRoomAvailability] = useState([]);
  const [error, setError] = useState('');

  console.log('Hotel details params:', params);
  console.log('Hotel ID:', params.id);

  const fetchHotelDetails = async () => {
    setLoading(true);
    try {
      console.log('Fetching hotel details for ID:', params.id);

      // Format dates to YYYY-MM-DD
      const formatDate = (date) => {
        return date.toISOString().split('T')[0]; // returns YYYY-MM-DD
      };

      const response = await hotelApi.getHotelDetails(params.id, {
        adults: guests.toString(),
        children_age: '0,17',
        room_qty: '1',
        currency_code: params.currency || 'USD',
        arrival_date: formatDate(checkInDate),
        departure_date: formatDate(checkOutDate),
      });

      console.log('Hotel details API response:', response.data);

      if (response.data && response.data.status) {
        setHotelDetails(response.data.data);

        // After getting details, fetch room availability
        fetchRoomAvailability();
      } else {
        console.error(
          'Hotel details API returned an error or invalid data:',
          response.data
        );
        setError(
          'Could not load hotel details: ' +
            (response.data.message
              ? JSON.stringify(response.data.message)
              : 'Unknown error')
        );
        setLoading(false);
      }
    } catch (err) {
      console.error('Error fetching hotel details:', err);
      setError(
        'Failed to load hotel details: ' + (err.message || 'Unknown error')
      );
      setLoading(false);
    }
  };

  const fetchRoomAvailability = async () => {
    try {
      const formattedCheckIn = format(checkInDate, 'yyyy-MM-dd');
      const formattedCheckOut = format(checkOutDate, 'yyyy-MM-dd');

      const response = await hotelApi.getRoomAvailability(
        params.id,
        formattedCheckIn,
        formattedCheckOut,
        guests
      );

      if (
        response.data &&
        response.data.status &&
        response.data.data &&
        response.data.data.rooms
      ) {
        setRoomAvailability(response.data.data.rooms);
      } else {
        // Still show hotel details even if rooms aren't available
        console.log('No rooms available for the selected dates');
      }
    } catch (err) {
      console.error('Error fetching room availability:', err);
      // Don't set error state here, just log it - we still want to show hotel details
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotelDetails();
  }, [params.id]);

  // When dates or guests change, refetch room availability
  useEffect(() => {
    if (hotelDetails) {
      fetchRoomAvailability();
    }
  }, [checkInDate, checkOutDate, guests]);

  // Show the check-in date picker
  const showCheckInPicker = () => {
    DateTimePickerAndroid.open({
      value: checkInDate,
      onChange: (event, selectedDate) => {
        if (selectedDate) {
          setCheckInDate(selectedDate);

          // If check-out date is before or same as check-in, set it to check-in + 1 day
          if (checkOutDate <= selectedDate) {
            const newCheckOutDate = new Date(selectedDate);
            newCheckOutDate.setDate(selectedDate.getDate() + 1);
            setCheckOutDate(newCheckOutDate);
          }
        }
      },
      mode: 'date',
      minimumDate: new Date(),
    });
  };

  // Show the check-out date picker
  const showCheckOutPicker = () => {
    const minDate = new Date(checkInDate);
    minDate.setDate(checkInDate.getDate() + 1);

    DateTimePickerAndroid.open({
      value: checkOutDate,
      onChange: (event, selectedDate) => {
        if (selectedDate) {
          setCheckOutDate(selectedDate);
        }
      },
      mode: 'date',
      minimumDate: minDate,
    });
  };

  // Increment or decrement guest count
  const updateGuests = (increment) => {
    const newCount = guests + increment;
    if (newCount >= 1 && newCount <= 10) {
      setGuests(newCount);
    }
  };

  // Handle booking a room
  const handleBookRoom = (room) => {
    Alert.alert(
      'Booking Confirmation',
      `Would you like to book ${room.name} for ${guests} guest(s)?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Book Now',
          onPress: () => {
            Alert.alert('Success', 'Your booking has been confirmed!');
            router.back();
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ChevronLeft size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Loading...</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0EA5E9" />
          <Text style={styles.loadingText}>Loading hotel details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ChevronLeft size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Error</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={fetchHotelDetails}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {params.image ? (
          <Image
            source={{ uri: params.image }}
            style={styles.heroImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderImage} />
        )}

        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButtonOverlay}
            onPress={() => router.back()}
          >
            <ChevronLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() => setIsFavorite(!isFavorite)}
          >
            <Heart
              size={24}
              color={isFavorite ? '#EF4444' : '#FFFFFF'}
              fill={isFavorite ? '#EF4444' : 'none'}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.hotelName}>{params.name}</Text>

          {params.city && params.country ? (
            <View style={styles.locationContainer}>
              <MapPin size={16} color="#64748B" />
              <Text style={styles.locationText}>
                {params.city}, {params.country}
              </Text>
            </View>
          ) : null}

          {parseFloat(params.rating) > 0 ? (
            <View style={styles.ratingContainer}>
              <Star size={16} color="#FACC15" fill="#FACC15" />
              <Text style={styles.ratingText}>
                {params.rating} ({params.reviews} reviews)
              </Text>
            </View>
          ) : null}

          {hotelDetails?.description ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About</Text>
              <Text style={styles.descriptionText}>
                {hotelDetails.description}
              </Text>
            </View>
          ) : null}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Dates</Text>
            <View style={styles.dateSelector}>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={showCheckInPicker}
              >
                <Calendar size={20} color="#0EA5E9" />
                <View style={styles.dateTextContainer}>
                  <Text style={styles.dateLabel}>Check-in</Text>
                  <Text style={styles.dateValue}>
                    {format(checkInDate, 'MMM dd, yyyy')}
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.dateButton}
                onPress={showCheckOutPicker}
              >
                <Calendar size={20} color="#0EA5E9" />
                <View style={styles.dateTextContainer}>
                  <Text style={styles.dateLabel}>Check-out</Text>
                  <Text style={styles.dateValue}>
                    {format(checkOutDate, 'MMM dd, yyyy')}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Guests</Text>
            <View style={styles.guestSelector}>
              <TouchableOpacity
                style={styles.guestButton}
                onPress={() => updateGuests(-1)}
                disabled={guests <= 1}
              >
                <Text
                  style={[
                    styles.guestButtonText,
                    guests <= 1 && styles.disabledText,
                  ]}
                >
                  -
                </Text>
              </TouchableOpacity>

              <View style={styles.guestCountContainer}>
                <Users size={20} color="#0EA5E9" />
                <Text style={styles.guestCount}>{guests}</Text>
              </View>

              <TouchableOpacity
                style={styles.guestButton}
                onPress={() => updateGuests(1)}
                disabled={guests >= 10}
              >
                <Text
                  style={[
                    styles.guestButtonText,
                    guests >= 10 && styles.disabledText,
                  ]}
                >
                  +
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {roomAvailability && roomAvailability.length > 0 ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Available Rooms</Text>
              {roomAvailability.map((room, index) => (
                <View key={index} style={styles.roomCard}>
                  <View style={styles.roomInfo}>
                    <Text style={styles.roomName}>{room.name}</Text>
                    <View style={styles.amenitiesContainer}>
                      {room.amenities &&
                        room.amenities.slice(0, 3).map((amenity, i) => (
                          <View key={i} style={styles.amenityItem}>
                            <Check size={14} color="#10B981" />
                            <Text style={styles.amenityText}>{amenity}</Text>
                          </View>
                        ))}
                    </View>
                  </View>

                  <View style={styles.roomPriceContainer}>
                    <Text style={styles.roomPrice}>
                      {room.price.currency}
                      {room.price.value}
                      <Text style={styles.perNight}> /night</Text>
                    </Text>
                    <TouchableOpacity
                      style={styles.bookButton}
                      onPress={() => handleBookRoom(room)}
                    >
                      <Text style={styles.bookButtonText}>Book</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.noRoomsText}>
              No rooms available for the selected dates. Please try different
              dates.
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#64748B',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 20,
  },
  backButton: {
    padding: 16,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0EA5E9',
  },
  heroImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  placeholderImage: {
    width: '100%',
    height: 300,
    backgroundColor: '#E2E8F0',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  backButtonOverlay: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 16,
  },
  hotelName: {
    fontSize: 24,
    fontWeight: '700',
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
    marginBottom: 16,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#B45309',
    marginLeft: 4,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 16,
    color: '#334155',
    lineHeight: 24,
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  dateTextContainer: {
    marginLeft: 12,
  },
  dateLabel: {
    fontSize: 14,
    color: '#64748B',
  },
  dateValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0F172A',
    marginTop: 2,
  },
  guestSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  guestCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  guestButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  guestButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0EA5E9',
  },
  disabledText: {
    color: '#CBD5E1',
  },
  guestCount: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0F172A',
    marginHorizontal: 12,
  },
  roomCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  roomInfo: {
    flex: 1,
    marginRight: 16,
  },
  roomName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0F172A',
    marginBottom: 4,
  },
  amenitiesContainer: {
    marginTop: 8,
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  amenityText: {
    fontSize: 16,
    color: '#334155',
    marginLeft: 8,
  },
  roomPriceContainer: {
    alignItems: 'flex-end',
  },
  roomPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0EA5E9',
    marginBottom: 8,
  },
  perNight: {
    fontSize: 12,
    fontWeight: '400',
    color: '#64748B',
  },
  bookButton: {
    backgroundColor: '#0EA5E9',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  noRoomsText: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    padding: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0F172A',
  },
  retryButton: {
    backgroundColor: '#0EA5E9',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
