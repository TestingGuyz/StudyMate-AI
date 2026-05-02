import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

export default function ExplainScreen() {
  const { user, supabase } = useAuth();
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [simplify, setSimplify] = useState(true);

  const handleExplain = async () => {
    if (!topic.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      // Call your backend API or Supabase function
      const { data, error } = await supabase.functions.invoke('explain-concept', {
        body: {
          topic: topic.trim(),
          simplify,
          board: user?.board || 'ICSE',
          studentClass: user?.class || '10',
        },
      });

      if (error) throw error;
      setResult(data);

      // Save to history
      await supabase.from('concept_explanations').insert({
        user_id: user.id,
        topic: topic.trim(),
        explanation: data?.explanation,
        created_at: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error:', error);
      // Fallback response for demo
      setResult({
        explanation: `Here's a simple explanation of ${topic}:\n\n1. Start with the basics - understand what it is and why it matters\n2. Break it down into smaller parts\n3. Use real-life examples to connect concepts\n4. Practice with simple questions\n\nRemember: Understanding > Memorizing!`,
        keyPoints: [
          'Focus on understanding concepts',
          'Use visual aids and diagrams',
          'Practice regularly',
          'Connect with real-life examples',
          'Review before exams',
        ],
        examMistakes: [
          'Skipping basic definitions',
          'Not practicing numerical problems',
          'Ignoring diagrams and labels',
        ],
      });
    }

    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView>
          {/* Header */}
          <View style={styles.header}>
            <Ionicons name="bulb" size={32} color="#F59E0B" />
            <Text style={styles.title}>AI Concept Explainer</Text>
            <Text style={styles.subtitle}>Ask anything about your syllabus</Text>
          </View>

          {/* Input */}
          <View style={styles.inputCard}>
            <TextInput
              style={styles.input}
              placeholder="What do you want to learn? (e.g., Photosynthesis)"
              value={topic}
              onChangeText={setTopic}
              multiline
              numberOfLines={3}
              placeholderTextColor="#9CA3AF"
            />

            {/* Simplify Toggle */}
            <View style={styles.toggleRow}>
              <TouchableOpacity
                style={[styles.toggle, simplify && styles.toggleActive]}
                onPress={() => setSimplify(!simplify)}
              >
                <View style={[styles.toggleDot, simplify && styles.toggleDotActive]} />
              </TouchableOpacity>
              <Text style={styles.toggleText}>Explain like I'm 14</Text>
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleExplain}
              disabled={loading || !topic.trim()}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Text style={styles.buttonText}>Get Explanation</Text>
                  <Ionicons name="arrow-forward" size={20} color="#fff" />
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Result */}
          {result && (
            <View style={styles.resultCard}>
              <View style={styles.resultHeader}>
                <Ionicons name="school" size={24} color="#3B82F6" />
                <Text style={styles.resultTitle}>Explanation</Text>
              </View>

              <Text style={styles.explanation}>{result.explanation}</Text>

              {result.keyPoints && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Key Points</Text>
                  {result.keyPoints.map((point, i) => (
                    <View key={i} style={styles.point}>
                      <View style={styles.bullet} />
                      <Text style={styles.pointText}>{point}</Text>
                    </View>
                  ))}
                </View>
              )}

              {result.examMistakes && (
                <View style={[styles.section, styles.warningSection]}>
                  <Text style={[styles.sectionTitle, styles.warningTitle]}>
                    Common Exam Mistakes
                  </Text>
                  {result.examMistakes.map((mistake, i) => (
                    <View key={i} style={styles.point}>
                      <Ionicons name="warning" size={16} color="#F59E0B" />
                      <Text style={styles.pointText}>{mistake}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 12,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  inputCard: {
    backgroundColor: '#fff',
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 16,
  },
  input: {
    fontSize: 16,
    color: '#1F2937',
    minHeight: 80,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  toggle: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E5E7EB',
    padding: 4,
  },
  toggleActive: {
    backgroundColor: '#3B82F6',
  },
  toggleDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    transform: [{ translateX: 0 }],
  },
  toggleDotActive: {
    transform: [{ translateX: 20 }],
  },
  toggleText: {
    marginLeft: 12,
    fontSize: 14,
    color: '#374151',
  },
  button: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultCard: {
    backgroundColor: '#fff',
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 16,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  explanation: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 20,
  },
  section: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  warningSection: {
    backgroundColor: '#FEF3C7',
    margin: -20,
    marginTop: 16,
    padding: 20,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  warningTitle: {
    color: '#92400E',
  },
  point: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#3B82F6',
    marginTop: 6,
  },
  pointText: {
    flex: 1,
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
});
