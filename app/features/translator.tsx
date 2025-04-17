import React, { useState } from 'react';
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { ChevronLeft, Languages, ArrowDown } from 'lucide-react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';

// Update API to use Yandex Translate with CORS proxy for development
const isDev = __DEV__;
const CORS_PROXY = isDev ? 'https://cors-anywhere.herokuapp.com/' : '';
const API_BASE_URL = `${CORS_PROXY}https://translate.api.cloud.yandex.net/translate/v2/translate`;
const YANDEX_API_KEY = 'b1gshcpnl9jb54k4qoam';

// Language options
const languageOptions = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ar', name: 'Arabic' },
  { code: 'uz', name: 'Uzbek' },
];

export default function TranslatorScreen() {
  const router = useRouter();
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('en');
  const [targetLanguage, setTargetLanguage] = useState('es');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastTranslated, setLastTranslated] = useState('');
  const [showSourcePicker, setShowSourcePicker] = useState(false);
  const [showTargetPicker, setShowTargetPicker] = useState(false);

  const { width } = useWindowDimensions();
  const isSmallDevice = width < 375;

  const translateText = async () => {
    if (!sourceText.trim()) {
      setError('Please enter text to translate');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // For React Native, we can also use fetch which might handle CORS differently
      const response = await axios.post(
        API_BASE_URL,
        {
          texts: [sourceText],
          sourceLanguageCode: sourceLanguage,
          targetLanguageCode: targetLanguage,
          format: 'PLAIN_TEXT',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Api-Key ${YANDEX_API_KEY}`,
            // Add these headers to help with CORS
            Origin: 'http://localhost:8081',
            'X-Requested-With': 'XMLHttpRequest',
          },
        }
      );

      if (
        response.data &&
        response.data.translations &&
        response.data.translations.length > 0
      ) {
        setTranslatedText(response.data.translations[0].text);
        setLastTranslated(new Date().toLocaleString());
      } else {
        setError('Translation failed. Please try again.');
      }
    } catch (error) {
      console.error('Translation error:', error);
      setError('Translation service is unavailable. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const swapLanguages = () => {
    const temp = sourceLanguage;
    setSourceLanguage(targetLanguage);
    setTargetLanguage(temp);

    // Clear results when swapping
    setTranslatedText('');
  };

  const getLanguageName = (code) => {
    const language = languageOptions.find((lang) => lang.code === code);
    return language ? language.name : code;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen
        options={{
          title: 'Translator',
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
            Translator
          </Text>
          <Text style={styles.subtitle}>Translate text between languages</Text>

          <View style={styles.card}>
            {/* Language selector bar */}
            <View style={styles.languageBar}>
              <TouchableOpacity
                style={styles.languageSelector}
                onPress={() => setShowSourcePicker(true)}
              >
                <Text style={styles.languageName}>
                  {getLanguageName(sourceLanguage)}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.swapButtonNew}
                onPress={swapLanguages}
              >
                <ArrowDown
                  size={isSmallDevice ? 16 : 20}
                  color="#EC4899"
                  style={{ transform: [{ rotate: '90deg' }] }}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.languageSelector}
                onPress={() => setShowTargetPicker(true)}
              >
                <Text style={styles.languageName}>
                  {getLanguageName(targetLanguage)}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Source language picker modal */}
            {showSourcePicker && (
              <View style={styles.pickerModal}>
                <View style={styles.pickerHeader}>
                  <Text style={styles.pickerTitle}>Select source language</Text>
                  <TouchableOpacity onPress={() => setShowSourcePicker(false)}>
                    <Text style={styles.closeButton}>Close</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={sourceLanguage}
                    onValueChange={(itemValue) => {
                      setSourceLanguage(itemValue);
                      setShowSourcePicker(false);
                    }}
                    style={styles.picker}
                  >
                    {languageOptions.map((language) => (
                      <Picker.Item
                        key={language.code}
                        label={language.name}
                        value={language.code}
                      />
                    ))}
                  </Picker>
                </View>
              </View>
            )}

            {/* Target language picker modal */}
            {showTargetPicker && (
              <View style={styles.pickerModal}>
                <View style={styles.pickerHeader}>
                  <Text style={styles.pickerTitle}>Select target language</Text>
                  <TouchableOpacity onPress={() => setShowTargetPicker(false)}>
                    <Text style={styles.closeButton}>Close</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={targetLanguage}
                    onValueChange={(itemValue) => {
                      setTargetLanguage(itemValue);
                      setShowTargetPicker(false);
                    }}
                    style={styles.picker}
                  >
                    {languageOptions.map((language) => (
                      <Picker.Item
                        key={language.code}
                        label={language.name}
                        value={language.code}
                      />
                    ))}
                  </Picker>
                </View>
              </View>
            )}

            {/* Source text area */}
            <View style={styles.textSection}>
              <TextInput
                style={styles.textInput}
                value={sourceText}
                onChangeText={setSourceText}
                placeholder="Enter text to translate"
                placeholderTextColor="#94A3B8"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {/* Translated text area */}
            <View style={styles.textSection}>
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#EC4899" />
                </View>
              ) : translatedText ? (
                <View>
                  <Text style={styles.translatedText}>{translatedText}</Text>
                </View>
              ) : (
                <Text style={styles.placeholderText}>
                  Translation will appear here
                </Text>
              )}
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            {/* Action buttons */}
            <TouchableOpacity
              style={styles.translateButton}
              onPress={translateText}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <Languages size={isSmallDevice ? 16 : 18} color="#FFFFFF" />
              <Text style={styles.translateText}>Translate</Text>
            </TouchableOpacity>

            {lastTranslated && translatedText ? (
              <Text style={styles.lastUpdated}>
                Last translated: {lastTranslated}
              </Text>
            ) : null}
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
  // New style for language bar
  languageBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  languageSelector: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
  },
  languageName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
  },
  swapButtonNew: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  textSection: {
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 12,
    minHeight: 120,
  },
  pickerModal: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    zIndex: 1000,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  pickerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
  },
  closeButton: {
    fontSize: 16,
    color: '#EC4899',
    fontWeight: '500',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 8,
    marginTop: 16,
  },
  pickerContainer: {
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    maxHeight: 200,
  },
  picker: {
    height: Platform.OS === 'ios' ? 150 : 50,
  },
  textInput: {
    fontSize: 16,
    color: '#0F172A',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  placeholderText: {
    fontSize: 16,
    color: '#94A3B8',
    fontStyle: 'italic',
    padding: 8,
  },
  translateButton: {
    backgroundColor: '#EC4899',
    borderRadius: 8,
    padding: Platform.OS === 'ios' ? 14 : 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  translateText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  loadingContainer: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    height: 120,
  },
  translatedText: {
    fontSize: 16,
    color: '#0F172A',
    lineHeight: 24,
    padding: 8,
  },
  errorText: {
    color: '#EF4444',
    marginTop: 12,
    textAlign: 'center',
  },
  lastUpdated: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 16,
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
