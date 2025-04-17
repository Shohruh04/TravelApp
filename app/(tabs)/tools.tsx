import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  DollarSign, 
  Cloud, 
  Languages, 
  Landmark, 
  FileText, 
  ArrowRight 
} from 'lucide-react-native';

const tools = [
  {
    id: '1',
    name: 'Currency Converter',
    description: 'Convert between different currencies',
    icon: DollarSign,
    color: '#22C55E',
  },
  {
    id: '2',
    name: 'Weather Forecast',
    description: 'Check local weather conditions',
    icon: Cloud,
    color: '#3B82F6',
  },
  {
    id: '3',
    name: 'Translator',
    description: 'Translate text between languages',
    icon: Languages,
    color: '#EC4899',
  },
  {
    id: '4',
    name: 'Attractions',
    description: 'Discover popular tourist spots',
    icon: Landmark,
    color: '#F59E0B',
  },
  {
    id: '5',
    name: 'Travel Tips',
    description: 'Visa info and local guidelines',
    icon: FileText,
    color: '#8B5CF6',
  },
];

export default function ToolsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Travel Tools</Text>
          <Text style={styles.subtitle}>Essential tools for your journey</Text>
        </View>

        <View style={styles.toolsGrid}>
          {tools.map((tool) => (
            <TouchableOpacity key={tool.id} style={styles.toolCard}>
              <View style={[styles.iconContainer, { backgroundColor: `${tool.color}15` }]}>
                <tool.icon size={24} color={tool.color} />
              </View>
              <View style={styles.toolInfo}>
                <Text style={styles.toolName}>{tool.name}</Text>
                <Text style={styles.toolDescription}>{tool.description}</Text>
              </View>
              <ArrowRight size={20} color="#64748B" />
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
    fontSize: 28,
    fontWeight: '700',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    marginTop: 4,
  },
  toolsGrid: {
    padding: 20,
  },
  toolCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toolInfo: {
    flex: 1,
    marginLeft: 16,
    marginRight: 12,
  },
  toolName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
  },
  toolDescription: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
  },
});