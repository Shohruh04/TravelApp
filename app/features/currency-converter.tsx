import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { ArrowDown, RefreshCw, ChevronLeft } from 'lucide-react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';

// You might need to install:
// npm install @react-native-picker/picker

const API_KEY = 'fca_live_vcv3Z5HvJWb1FpSrTOIX527Np1UGdbcEK4MToqgj'; // Consider storing this in an environment variable
const API_BASE_URL = 'https://api.freecurrencyapi.com/v1/latest';
1;
interface ExchangeRates {
  [key: string]: number;
}

export default function CurrencyConverterScreen() {
  const router = useRouter();
  const [amount, setAmount] = useState('1');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [rates, setRates] = useState<ExchangeRates>({});
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('');

  const popularCurrencies = ['EUR', 'USD', 'CAD'];

  const { width, height } = useWindowDimensions();
  const isSmallDevice = width < 375;

  const fetchExchangeRates = async () => {
    setIsLoading(true);
    try {
      // Get all popular currencies except the base currency
      const currenciesToFetch = popularCurrencies
        .filter((currency) => currency !== fromCurrency)
        .join(',');

      // Using freecurrencyapi.com with axios - only request needed currencies
      const response = await axios.get(
        `${API_BASE_URL}?apikey=${API_KEY}&base_currency=${fromCurrency}&currencies=${currenciesToFetch}`
      );

      if (response.data && response.data.data) {
        setRates(response.data.data);
        setLastUpdated(new Date().toLocaleString());
      } else {
        console.error('Failed to fetch rates:', response.data);
      }
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExchangeRates();
  }, [fromCurrency]);

  const convertCurrency = () => {
    if (!rates || !rates[toCurrency]) return 0;

    const result = parseFloat(amount) * rates[toCurrency];
    return result.toFixed(2);
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen
        options={{
          title: 'Currency Converter',
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
            Currency Converter
          </Text>
          <Text style={styles.subtitle}>Get real-time exchange rates</Text>

          <View style={styles.card}>
            <Text style={styles.label}>Amount</Text>
            <TextInput
              style={styles.input}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              placeholder="Enter amount"
              placeholderTextColor="#94A3B8"
            />

            <Text style={styles.label}>From</Text>
            <View
              style={[
                styles.pickerContainer,
                Platform.OS === 'ios' && styles.iosPicker,
              ]}
            >
              <Picker
                selectedValue={fromCurrency}
                onValueChange={(itemValue) => setFromCurrency(itemValue)}
                style={[
                  styles.picker,
                  Platform.OS === 'android' && styles.androidPicker,
                ]}
                dropdownIconColor="#0F172A"
              >
                {popularCurrencies.map((currency) => (
                  <Picker.Item
                    key={currency}
                    label={currency}
                    value={currency}
                    color={Platform.OS === 'ios' ? '#0F172A' : undefined}
                  />
                ))}
              </Picker>
            </View>

            <TouchableOpacity
              style={styles.swapButton}
              onPress={swapCurrencies}
            >
              <ArrowDown size={isSmallDevice ? 16 : 20} color="#22C55E" />
            </TouchableOpacity>

            <Text style={styles.label}>To</Text>
            <View
              style={[
                styles.pickerContainer,
                Platform.OS === 'ios' && styles.iosPicker,
              ]}
            >
              <Picker
                selectedValue={toCurrency}
                onValueChange={(itemValue) => setToCurrency(itemValue)}
                style={[
                  styles.picker,
                  Platform.OS === 'android' && styles.androidPicker,
                ]}
                dropdownIconColor="#0F172A"
              >
                {popularCurrencies.map((currency) => (
                  <Picker.Item
                    key={currency}
                    label={currency}
                    value={currency}
                    color={Platform.OS === 'ios' ? '#0F172A' : undefined}
                  />
                ))}
              </Picker>
            </View>

            <View style={styles.resultContainer}>
              {isLoading ? (
                <ActivityIndicator size="large" color="#22C55E" />
              ) : (
                <>
                  <Text
                    style={[
                      styles.resultValue,
                      isSmallDevice && styles.smallResultValue,
                    ]}
                  >
                    {amount} {fromCurrency} = {convertCurrency()} {toCurrency}
                  </Text>
                  <Text style={styles.resultRate}>
                    1 {fromCurrency} = {rates[toCurrency]?.toFixed(4) || 0}{' '}
                    {toCurrency}
                  </Text>
                </>
              )}
            </View>

            <TouchableOpacity
              style={styles.refreshButton}
              onPress={fetchExchangeRates}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <RefreshCw size={isSmallDevice ? 16 : 18} color="#FFFFFF" />
              <Text style={styles.refreshText}>Refresh Rates</Text>
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
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: Platform.OS === 'ios' ? 12 : 10,
    fontSize: 16,
    color: '#0F172A',
    height: Platform.OS === 'ios' ? 50 : 48,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
  },
  iosPicker: {
    paddingHorizontal: 6,
  },
  picker: {
    height: Platform.OS === 'ios' ? 150 : 50,
  },
  androidPicker: {
    color: '#0F172A',
    backgroundColor: 'transparent',
  },
  swapButton: {
    alignSelf: 'center',
    backgroundColor: '#F1F5F9',
    padding: 10,
    borderRadius: 8,
    marginVertical: 8,
  },
  resultContainer: {
    marginTop: 24,
    marginBottom: 16,
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
  },
  resultValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
    textAlign: 'center',
  },
  smallResultValue: {
    fontSize: 18,
  },
  resultRate: {
    fontSize: 14,
    color: '#64748B',
  },
  refreshButton: {
    backgroundColor: '#22C55E',
    borderRadius: 8,
    padding: Platform.OS === 'ios' ? 14 : 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  refreshText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
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
