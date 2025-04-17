import { Tabs } from 'expo-router';
import {
  Compass,
  Search,
  Plane,
  Globe as Globe2,
  User,
} from 'lucide-react-native';
import {
  StyleSheet,
  Platform,
  Dimensions,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  // Adjust icon size based on screen width
  const getIconSize = () => {
    if (width < 375) return 20; // Smaller screens
    return 24; // Default size
  };

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          ...styles.tabBar,
          height: Platform.OS === 'ios' ? 90 : 70,
          paddingBottom: Platform.OS === 'ios' ? insets.bottom : 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#0EA5E9',
        tabBarInactiveTintColor: '#64748B',
        headerShown: false,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarIconStyle: { marginBottom: Platform.OS === 'ios' ? 0 : 4 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Explore',
          tabBarIcon: ({ size, color }) => (
            <Compass size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ size, color }) => <Search size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="flights"
        options={{
          title: 'Flights',
          tabBarIcon: ({ size, color }) => <Plane size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="tools"
        options={{
          title: 'Tools',
          tabBarIcon: ({ size, color }) => <Globe2 size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ size, color }) => <User size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  tabBarLabel: {
    fontSize: Platform.OS === 'ios' ? 11 : 12,
    fontWeight: '500',
    marginBottom: Platform.OS === 'ios' ? 5 : 3,
  },
});
