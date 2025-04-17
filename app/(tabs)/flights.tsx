import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plane, Calendar, Users, Search } from 'lucide-react-native';

export default function FlightsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Find Flights</Text>
          <Text style={styles.subtitle}>Search for the best flight deals</Text>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.inputGroup}>
            <View style={styles.inputContainer}>
              <Plane size={20} color="#64748B" />
              <TextInput
                style={styles.input}
                placeholder="From"
                placeholderTextColor="#64748B"
              />
            </View>
            <View style={styles.inputContainer}>
              <Plane size={20} color="#64748B" style={{ transform: [{ rotate: '90deg' }] }} />
              <TextInput
                style={styles.input}
                placeholder="To"
                placeholderTextColor="#64748B"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.inputContainer}>
              <Calendar size={20} color="#64748B" />
              <TextInput
                style={styles.input}
                placeholder="Departure"
                placeholderTextColor="#64748B"
              />
            </View>
            <View style={styles.inputContainer}>
              <Calendar size={20} color="#64748B" />
              <TextInput
                style={styles.input}
                placeholder="Return"
                placeholderTextColor="#64748B"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Users size={20} color="#64748B" />
            <TextInput
              style={styles.input}
              placeholder="Passengers"
              placeholderTextColor="#64748B"
            />
          </View>

          <TouchableOpacity style={styles.searchButton}>
            <Search size={20} color="#FFFFFF" />
            <Text style={styles.searchButtonText}>Search Flights</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.popularSection}>
          <Text style={styles.sectionTitle}>Popular Destinations</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {['Dubai', 'London', 'New York', 'Tokyo', 'Paris'].map((city) => (
              <TouchableOpacity key={city} style={styles.destinationCard}>
                <Text style={styles.destinationName}>{city}</Text>
                <Text style={styles.destinationPrice}>from $299</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
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
    fontSize: 28,
    fontWeight: '700',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    marginTop: 4,
  },
  searchContainer: {
    margin: 20,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#0F172A',
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0EA5E9',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  popularSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 16,
  },
  destinationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    width: 140,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  destinationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
  },
  destinationPrice: {
    fontSize: 14,
    color: '#0EA5E9',
    marginTop: 4,
  },
});