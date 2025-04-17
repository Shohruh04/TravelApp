import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Settings, CreditCard, Bell, Shield, CircleHelp as HelpCircle, LogOut } from 'lucide-react-native';

const menuItems = [
  {
    icon: Settings,
    title: 'Account Settings',
    description: 'Update your profile and preferences',
  },
  {
    icon: CreditCard,
    title: 'Payment Methods',
    description: 'Manage your payment options',
  },
  {
    icon: Bell,
    title: 'Notifications',
    description: 'Control your notification settings',
  },
  {
    icon: Shield,
    title: 'Privacy & Security',
    description: 'Manage your account security',
  },
  {
    icon: HelpCircle,
    title: 'Help & Support',
    description: 'Get help with your bookings',
  },
];

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.profileInfo}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400' }}
              style={styles.avatar}
            />
            <View style={styles.nameContainer}>
              <Text style={styles.name}>John Doe</Text>
              <Text style={styles.email}>john.doe@example.com</Text>
            </View>
          </View>
        </View>

        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem}>
              <View style={styles.menuIcon}>
                <item.icon size={24} color="#0F172A" />
              </View>
              <View style={styles.menuText}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuDescription}>{item.description}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutButton}>
          <LogOut size={24} color="#EF4444" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
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
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  nameContainer: {
    marginLeft: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
  },
  email: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  menuContainer: {
    padding: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuText: {
    marginLeft: 12,
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
  },
  menuDescription: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
  },
  logoutText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
  },
});