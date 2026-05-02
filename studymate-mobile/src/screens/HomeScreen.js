import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

const SUBJECTS = [
  { name: 'Physics', color: '#3B82F6', icon: 'atom' },
  { name: 'Chemistry', color: '#F59E0B', icon: 'flask' },
  { name: 'Mathematics', color: '#8B5CF6', icon: 'calculator' },
  { name: 'Biology', color: '#10B981', icon: 'leaf' },
  { name: 'Computer', color: '#6366F1', icon: 'desktop' },
  { name: 'History', color: '#EF4444', icon: 'time' },
  { name: 'Geography', color: '#14B8A6', icon: 'earth' },
  { name: 'English', color: '#EC4899', icon: 'book' },
];

export default function HomeScreen({ navigation }) {
  const { user, supabase } = useAuth();
  const [stats, setStats] = useState({
    quizzesTaken: 0,
    avgScore: 0,
    studyStreak: 0,
  });
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    // Fetch user's quiz stats from Supabase
    const { data: quizzes } = await supabase
      .from('quizzes')
      .select('*')
      .eq('user_id', user.id);

    if (quizzes) {
      const avgScore = quizzes.length
        ? Math.round(quizzes.reduce((sum, q) => sum + q.score, 0) / quizzes.length)
        : 0;

      setStats({
        quizzesTaken: quizzes.length,
        avgScore,
        studyStreak: 0, // Calculate from quiz dates
      });
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchStats();
    setRefreshing(false);
  };

  const getDaysUntilExam = () => {
    if (!user?.examDate) return null;
    const exam = new Date(user.examDate);
    const today = new Date();
    const diff = Math.ceil((exam - today) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, {user?.name || 'Student'}!</Text>
            <Text style={styles.subGreeting}>Class {user?.class} • {user?.board}</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{(user?.name || 'S')[0].toUpperCase()}</Text>
          </View>
        </View>

        {/* Exam Countdown */}
        {getDaysUntilExam() !== null && (
          <View style={styles.countdownCard}>
            <Ionicons name="calendar" size={24} color="#fff" />
            <View style={styles.countdownContent}>
              <Text style={styles.countdownLabel}>Board Exams in</Text>
              <Text style={styles.countdownNumber}>{getDaysUntilExam()} days</Text>
            </View>
          </View>
        )}

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.quizzesTaken}</Text>
            <Text style={styles.statLabel}>Quizzes</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.avgScore}%</Text>
            <Text style={styles.statLabel}>Avg Score</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.studyStreak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: '#EFF6FF' }]}
            onPress={() => navigation.navigate('Focus')}
          >
            <Ionicons name="timer" size={28} color="#3B82F6" />
            <Text style={styles.actionText}>Start Focus Session</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: '#F0FDF4' }]}
            onPress={() => navigation.navigate('Explain')}
          >
            <Ionicons name="bulb" size={28} color="#10B981" />
            <Text style={styles.actionText}>Ask AI</Text>
          </TouchableOpacity>
        </View>

        {/* Subjects */}
        <Text style={styles.sectionTitle}>Subjects</Text>
        <View style={styles.subjectsGrid}>
          {SUBJECTS.map((subject) => (
            <TouchableOpacity
              key={subject.name}
              style={[styles.subjectCard, { borderLeftColor: subject.color }]}
            >
              <View style={[styles.subjectIcon, { backgroundColor: subject.color + '20' }]}>
                <Ionicons name={subject.icon} size={24} color={subject.color} />
              </View>
              <Text style={styles.subjectName}>{subject.name}</Text>
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
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  subGreeting: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  countdownCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 16,
    gap: 16,
  },
  countdownContent: {
    flex: 1,
  },
  countdownLabel: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  countdownNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  actionCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginHorizontal: 20,
    marginBottom: 12,
  },
  subjectsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  subjectCard: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  subjectIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subjectName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
});
