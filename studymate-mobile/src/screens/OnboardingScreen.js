import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

const SUBJECTS = [
  'Physics',
  'Chemistry',
  'Mathematics',
  'Biology',
  'Computer Applications',
  'History',
  'Geography',
  'English',
];

export default function OnboardingScreen() {
  const [name, setName] = useState('');
  const [studentClass, setStudentClass] = useState('10');
  const [board, setBoard] = useState('ICSE');
  const [weakSubjects, setWeakSubjects] = useState([]);
  const [examDate, setExamDate] = useState('2026-02-15');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const { completeOnboarding } = useAuth();

  const toggleSubject = (subject) => {
    if (weakSubjects.includes(subject)) {
      setWeakSubjects(weakSubjects.filter((s) => s !== subject));
    } else {
      setWeakSubjects([...weakSubjects, subject]);
    }
  };

  const handleComplete = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    setLoading(true);

    const userData = {
      name,
      class: studentClass,
      board,
      weakSubjects,
      examDate,
    };

    const { error } = await completeOnboarding(userData);
    setLoading(false);

    if (error) {
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    }
  };

  const renderStep1 = () => (
    <>
      <Text style={styles.stepTitle}>Let's get to know you</Text>
      <Text style={styles.stepSubtitle}>Step 1 of 3</Text>

      <View style={styles.inputContainer}>
        <Ionicons name="person-outline" size={20} color="#6B7280" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Your Full Name"
          value={name}
          onChangeText={setName}
          placeholderTextColor="#9CA3AF"
        />
      </View>

      <Text style={styles.label}>Select Your Class</Text>
      <View style={styles.optionsRow}>
        {['8', '9', '10'].map((cls) => (
          <TouchableOpacity
            key={cls}
            style={[styles.option, studentClass === cls && styles.optionActive]}
            onPress={() => setStudentClass(cls)}
          >
            <Text style={[styles.optionText, studentClass === cls && styles.optionTextActive]}>
              Class {cls}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Select Your Board</Text>
      <View style={styles.optionsRow}>
        {['ICSE', 'CBSE'].map((brd) => (
          <TouchableOpacity
            key={brd}
            style={[styles.option, board === brd && styles.optionActive]}
            onPress={() => setBoard(brd)}
          >
            <Text style={[styles.optionText, board === brd && styles.optionTextActive]}>
              {brd}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={() => setStep(2)}>
        <Text style={styles.buttonText}>Continue</Text>
        <Ionicons name="arrow-forward" size={20} color="#fff" />
      </TouchableOpacity>
    </>
  );

  const renderStep2 = () => (
    <>
      <Text style={styles.stepTitle}>Your Weak Subjects</Text>
      <Text style={styles.stepSubtitle}>Step 2 of 3 - Select subjects you find difficult</Text>

      <View style={styles.subjectsGrid}>
        {SUBJECTS.map((subject) => (
          <TouchableOpacity
            key={subject}
            style={[styles.subjectCard, weakSubjects.includes(subject) && styles.subjectCardActive]}
            onPress={() => toggleSubject(subject)}
          >
            <View
              style={[
                styles.checkbox,
                weakSubjects.includes(subject) && styles.checkboxActive,
              ]}
            >
              {weakSubjects.includes(subject) && <Ionicons name="checkmark" size={16} color="#fff" />}
            </View>
            <Text
              style={[
                styles.subjectText,
                weakSubjects.includes(subject) && styles.subjectTextActive,
              ]}
            >
              {subject}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.backButton} onPress={() => setStep(1)}>
          <Ionicons name="arrow-back" size={20} color="#6B7280" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.buttonFlex]} onPress={() => setStep(3)}>
          <Text style={styles.buttonText}>Continue</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </>
  );

  const renderStep3 = () => (
    <>
      <Text style={styles.stepTitle}>Exam Date</Text>
      <Text style={styles.stepSubtitle}>Step 3 of 3 - When are your board exams?</Text>

      <View style={styles.dateContainer}>
        <Ionicons name="calendar-outline" size={32} color="#3B82F6" style={styles.dateIcon} />
        <Text style={styles.dateLabel}>Expected Exam Date</Text>
        <TextInput
          style={styles.dateInput}
          value={examDate}
          onChangeText={setExamDate}
          placeholder="YYYY-MM-DD"
          placeholderTextColor="#9CA3AF"
        />
        <Text style={styles.dateHint}>Format: YYYY-MM-DD (e.g., 2026-02-15)</Text>
      </View>

      <View style={styles.infoBox}>
        <Ionicons name="information-circle-outline" size={24} color="#3B82F6" />
        <Text style={styles.infoText}>
          This helps us create a personalized study plan and countdown for you.
        </Text>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.backButton} onPress={() => setStep(2)}>
          <Ionicons name="arrow-back" size={20} color="#6B7280" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.buttonFlex, loading && styles.buttonDisabled]}
          onPress={handleComplete}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.buttonText}>Get Started</Text>
              <Ionicons name="checkmark" size={20} color="#fff" />
            </>
          )}
        </TouchableOpacity>
      </View>
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Progress Bar */}
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${(step / 3) * 100}%` }]} />
        </View>

        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 24,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    marginBottom: 32,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 2,
    transition: 'width 0.3s',
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  stepSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 20,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  option: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  optionActive: {
    backgroundColor: '#EFF6FF',
    borderWidth: 2,
    borderColor: '#3B82F6',
  },
  optionText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  optionTextActive: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  subjectsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  subjectCard: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    borderWidth: 2,
    borderColor: 'transparent',
    gap: 8,
  },
  subjectCardActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#3B82F6',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  subjectText: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
  },
  subjectTextActive: {
    color: '#3B82F6',
    fontWeight: '500',
  },
  dateContainer: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    marginBottom: 20,
  },
  dateIcon: {
    marginBottom: 12,
  },
  dateLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  dateInput: {
    width: '100%',
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    fontSize: 18,
    textAlign: 'center',
    color: '#1F2937',
    fontWeight: '600',
  },
  dateHint: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 8,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    marginBottom: 24,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#3B82F6',
    lineHeight: 20,
  },
  button: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonFlex: {
    flex: 1,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  backButton: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
