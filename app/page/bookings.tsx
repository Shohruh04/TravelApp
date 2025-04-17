import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, Calendar, Clock, ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const bookings = [
  {
    id: '1',
    destination: 'Male, Maldives',
    hotel: 'Maldives Resort',
    image: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=500',
    date: 'June 12 - June 18, 2023',
    time: '12:00 PM',
    status: 'Upcoming',
  },
  {
    id: '2',
    destination: 'Santorini, Greece',
    hotel: 'Santorini Villa',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=500',
    date: 'July 3 - July 10, 2023',
    time: '10:30 AM',
    status: 'Upcoming',
  },
];

export default function BookingsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.title}>My Bookings</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.bookingsContainer}>
          {bookings.map((booking) => (
            <View key={booking.id} style={styles.bookingCard}>
              <Image
                source={{ uri: booking.image }}
                style={styles.bookingImage}
              />
              <View style={styles.bookingContent}>
                <View style={styles.statusContainer}>
                  <Text
                    style={[
                      styles.statusText,
                      booking.status === 'Upcoming'
                        ? styles.upcomingStatus
                        : styles.completedStatus,
                    ]}
                  >
                    {booking.status}
                  </Text>
                </View>
                <Text style={styles.hotelName}>{booking.hotel}</Text>
                <View style={styles.locationContainer}>
                  <MapPin size={14} color="#64748B" />
                  <Text style={styles.locationText}>{booking.destination}</Text>
                </View>
                <View style={styles.bookingDetails}>
                  <View style={styles.detailItem}>
                    <Calendar size={14} color="#64748B" />
                    <Text style={styles.detailText}>{booking.date}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Clock size={14} color="#64748B" />
                    <Text style={styles.detailText}>{booking.time}</Text>
                  </View>
                </View>
              </View>
            </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  bookingsContainer: {
    padding: 16,
  },
  bookingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  bookingImage: {
    width: '100%',
    height: 150,
  },
  bookingContent: {
    padding: 16,
  },
  statusContainer: {
    position: 'absolute',
    top: -30,
    right: 16,
    zIndex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  upcomingStatus: {
    color: '#0EA5E9',
  },
  completedStatus: {
    color: '#64748B',
  },
  hotelName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationText: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 4,
  },
  bookingDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 4,
  },
});
