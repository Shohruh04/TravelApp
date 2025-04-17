import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, Calendar, Clock } from 'lucide-react-native';

const bookings = [
  {
    id: '1',
    hotelName: 'Maldives Resort',
    location: 'Male, Maldives',
    checkIn: '2024-03-15',
    checkOut: '2024-03-20',
    status: 'upcoming',
    image: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=500',
  },
  {
    id: '2',
    hotelName: 'Santorini Villa',
    location: 'Santorini, Greece',
    checkIn: '2024-04-10',
    checkOut: '2024-04-15',
    status: 'upcoming',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=500',
  },
];

export default function BookingsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Bookings</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.bookingsContainer}>
          {bookings.map((booking) => (
            <TouchableOpacity key={booking.id} style={styles.bookingCard}>
              <Image source={{ uri: booking.image }} style={styles.hotelImage} />
              <View style={styles.cardContent}>
                <Text style={styles.hotelName}>{booking.hotelName}</Text>
                <View style={styles.locationContainer}>
                  <MapPin size={14} color="#64748B" />
                  <Text style={styles.location}>{booking.location}</Text>
                </View>
                <View style={styles.dateContainer}>
                  <View style={styles.dateRow}>
                    <Calendar size={14} color="#64748B" />
                    <Text style={styles.dateLabel}>Check-in:</Text>
                    <Text style={styles.dateText}>{booking.checkIn}</Text>
                  </View>
                  <View style={styles.dateRow}>
                    <Clock size={14} color="#64748B" />
                    <Text style={styles.dateLabel}>Check-out:</Text>
                    <Text style={styles.dateText}>{booking.checkOut}</Text>
                  </View>
                </View>
                <View style={styles.statusContainer}>
                  <View style={[styles.statusBadge, styles.upcomingBadge]}>
                    <Text style={styles.statusText}>Upcoming</Text>
                  </View>
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
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
  },
  bookingsContainer: {
    padding: 20,
    gap: 16,
  },
  bookingCard: {
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
  dateContainer: {
    marginTop: 12,
    gap: 8,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateLabel: {
    fontSize: 14,
    color: '#64748B',
  },
  dateText: {
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '500',
  },
  statusContainer: {
    marginTop: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    alignSelf: 'flex-start',
  },
  upcomingBadge: {
    backgroundColor: '#E0F2FE',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#0EA5E9',
  },
});