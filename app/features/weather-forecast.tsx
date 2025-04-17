import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  useWindowDimensions,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import {
  ChevronLeft,
  Search,
  MapPin,
  Wind,
  Droplets,
} from 'lucide-react-native';
import axios from 'axios';

// OpenWeatherMap API key - consider moving to environment variables
const API_KEY = '6e6ff165ca3b76f29cd3966f9a80574b'; // Free tier API key
const API_BASE_URL = 'https://api.openweathermap.org/data/2.5';

interface WeatherData {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    temp_min: number;
    temp_max: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  wind: {
    speed: number;
  };
  sys: {
    country: string;
  };
}

interface ForecastData {
  list: {
    dt: number;
    main: {
      temp: number;
    };
    weather: {
      icon: string;
      description: string;
    }[];
    dt_txt: string;
  }[];
}

export default function WeatherForecastScreen() {
  const router = useRouter();
  const [city, setCity] = useState('London');
  const [searchText, setSearchText] = useState('');
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(
    null
  );
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState('');

  const { width } = useWindowDimensions();
  const isSmallDevice = width < 375;

  const fetchWeatherData = async (cityName: string) => {
    setIsLoading(true);
    setError('');
    try {
      // Fetch current weather
      const currentResponse = await axios.get(
        `${API_BASE_URL}/weather?q=${cityName}&appid=${API_KEY}&units=metric`
      );

      // Fetch 5-day forecast
      const forecastResponse = await axios.get(
        `${API_BASE_URL}/forecast?q=${cityName}&appid=${API_KEY}&units=metric`
      );

      setCurrentWeather(currentResponse.data);
      setForecast(forecastResponse.data);
      setCity(cityName);
      setLastUpdated(new Date().toLocaleString());
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setError('City not found. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchText.trim()) {
      fetchWeatherData(searchText);
      setSearchText('');
    }
  };

  useEffect(() => {
    fetchWeatherData(city);
  }, []);

  // Get daily forecast (one forecast per day)
  const getDailyForecast = () => {
    if (!forecast) return [];

    const dailyData: any = {};

    forecast.list.forEach((item) => {
      const date = new Date(item.dt * 1000).toLocaleDateString();
      if (!dailyData[date]) {
        dailyData[date] = item;
      }
    });

    return Object.values(dailyData).slice(0, 5);
  };

  const getWeatherIconUrl = (iconCode: string) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen
        options={{
          title: 'Weather Forecast',
          headerBackTitle: 'Tools',
        }}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ChevronLeft size={24} color="#0F172A" />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>

          <Text style={[styles.title, isSmallDevice && styles.smallTitle]}>
            Weather Forecast
          </Text>
          <Text style={styles.subtitle}>
            Check weather conditions worldwide
          </Text>

          <View style={styles.card}>
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                value={searchText}
                onChangeText={setSearchText}
                placeholder="Search for a city..."
                placeholderTextColor="#94A3B8"
                onSubmitEditing={handleSearch}
              />
              <TouchableOpacity
                style={styles.searchButton}
                onPress={handleSearch}
              >
                <Search size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3B82F6" />
              </View>
            ) : currentWeather ? (
              <View>
                <View style={styles.currentWeather}>
                  <View style={styles.locationContainer}>
                    <MapPin size={20} color="#3B82F6" />
                    <Text style={styles.locationText}>
                      {currentWeather.name}, {currentWeather.sys.country}
                    </Text>
                  </View>

                  <View style={styles.weatherMain}>
                    <Image
                      source={{
                        uri: getWeatherIconUrl(currentWeather.weather[0].icon),
                      }}
                      style={styles.weatherIcon}
                    />
                    <Text style={styles.temperature}>
                      {Math.round(currentWeather.main.temp)}°C
                    </Text>
                  </View>

                  <Text style={styles.weatherDescription}>
                    {currentWeather.weather[0].description
                      .charAt(0)
                      .toUpperCase() +
                      currentWeather.weather[0].description.slice(1)}
                  </Text>

                  <View style={styles.weatherDetails}>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Feels like</Text>
                      <Text style={styles.detailValue}>
                        {Math.round(currentWeather.main.feels_like)}°C
                      </Text>
                    </View>

                    <View style={styles.detailItem}>
                      <View style={styles.detailIconContainer}>
                        <Wind size={16} color="#3B82F6" />
                      </View>
                      <Text style={styles.detailLabel}>Wind</Text>
                      <Text style={styles.detailValue}>
                        {currentWeather.wind.speed} m/s
                      </Text>
                    </View>

                    <View style={styles.detailItem}>
                      <View style={styles.detailIconContainer}>
                        <Droplets size={16} color="#3B82F6" />
                      </View>
                      <Text style={styles.detailLabel}>Humidity</Text>
                      <Text style={styles.detailValue}>
                        {currentWeather.main.humidity}%
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.forecastContainer}>
                  <Text style={styles.forecastTitle}>5-Day Forecast</Text>
                  <View style={styles.forecastList}>
                    {getDailyForecast().map((item: any, index: number) => (
                      <View key={index} style={styles.forecastItem}>
                        <Text style={styles.forecastDay}>
                          {new Date(item.dt * 1000).toLocaleDateString(
                            'en-US',
                            { weekday: 'short' }
                          )}
                        </Text>
                        <Image
                          source={{
                            uri: getWeatherIconUrl(item.weather[0].icon),
                          }}
                          style={styles.forecastIcon}
                        />
                        <Text style={styles.forecastTemp}>
                          {Math.round(item.main.temp)}°C
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            ) : null}

            <TouchableOpacity
              style={styles.refreshButton}
              onPress={() => fetchWeatherData(city)}
              disabled={isLoading}
            >
              <Text style={styles.refreshText}>Refresh Weather</Text>
            </TouchableOpacity>

            {lastUpdated && (
              <Text style={styles.lastUpdated}>
                Last updated: {lastUpdated}
              </Text>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: Platform.OS === 'ios' ? 20 : 16,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0F172A',
  },
  smallTitle: {
    fontSize: 24,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    marginTop: 4,
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: Platform.OS === 'ios' ? 20 : 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    width: '100%',
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: Platform.OS === 'ios' ? 12 : 10,
    fontSize: 16,
    color: '#0F172A',
    height: Platform.OS === 'ios' ? 50 : 48,
  },
  searchButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    marginLeft: 8,
  },
  errorText: {
    color: '#EF4444',
    marginBottom: 16,
    textAlign: 'center',
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  currentWeather: {
    alignItems: 'center',
    marginBottom: 24,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0F172A',
    marginLeft: 6,
  },
  weatherMain: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  weatherIcon: {
    width: 80,
    height: 80,
  },
  temperature: {
    fontSize: 48,
    fontWeight: '700',
    color: '#0F172A',
  },
  weatherDescription: {
    fontSize: 18,
    color: '#64748B',
    marginTop: 4,
    marginBottom: 16,
    textTransform: 'capitalize',
  },
  weatherDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
  },
  detailItem: {
    alignItems: 'center',
  },
  detailIconContainer: {
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
  },
  forecastContainer: {
    marginBottom: 20,
  },
  forecastTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 12,
  },
  forecastList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  forecastItem: {
    alignItems: 'center',
    width: '18%',
  },
  forecastDay: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 4,
  },
  forecastIcon: {
    width: 40,
    height: 40,
  },
  forecastTemp: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
  },
  refreshButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    padding: Platform.OS === 'ios' ? 14 : 12,
    alignItems: 'center',
    marginTop: 8,
  },
  refreshText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  lastUpdated: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 12,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0F172A',
    marginLeft: 4,
  },
});
