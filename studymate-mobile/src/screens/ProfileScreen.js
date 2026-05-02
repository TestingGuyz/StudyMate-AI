import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

const MENU_ITEMS = [
  { icon: 'person-outline', label: 'Edit Profile', color: '#3B82F6' },
  { icon: 'school-outline', label: 'My Subjects', color: '#8B5CF6' },
  { icon: 'trophy-outline', label: 'Achievements', color: '#F59E0B' },
  { icon: 'time-outline', label: 'Study History', color: '#10B981' },
  { icon: 'moon-outline', label: 'Dark Mode', color: '#6366F1' },
  { icon: 'notifications-outline', label: 'Notifications', color: '#EF4444' },
  { icon: 'help-circle-outline', label: 'Help & Support', color: '#14B8A6' },
  { icon: 'shield-checkmark-outline', label: 'Privacy Policy', color: '#6B7280' },
];

export default function ProfileScreen() {
  const { user, signOut } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: signOut },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{(user?.name || 'S')[0].toUpperCase()}</Text>
          </View>
          <Text style={styles.name}>{user?.name || 'Student'}</Text>
          <Text style={styles.info}>Class {user?.class} • {user?.board} Board</Text>
          
          {user?.weakSubjects?.length > 0 && (
            <View style={styles.weakSubjects}>
              <Text style={styles.weakLabel}>Focus Areas:</Text>
              <View style={styles.tags}>
                {user.weakSubjects.map((subject, i) => (
                  <View key={i} style={styles.tag}>
                    <Text style={styles.tagText}>{subject}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {user?.target && (
            <View style={styles.goalContainer}>
              <Ionicons name="trophy" size={16} color="#F59E0B" />
              <Text style={styles.goalText}><Text style={styles.goalLabel}>Goal: </Text>{user.target}</Text>
            </View>
          )}

          {user?.motive && (
            <View style={styles.motiveContainer}>
              <Ionicons name="heart" size={16} color="#EF4444" />
              <Text style={styles.motiveText}><Text style={styles.motiveLabel}>Why: </Text>{user.motive}</Text>
            </View>
          )}

          {user?.examDate && (
            <View style={styles.examDateContainer}>
              <Ionicons name="calendar" size={16} color="#10B981" />
              <Text style={styles.examDateText}>
                <Text style={styles.examDateLabel}>Exam: </Text>{user.examDate}
              </Text>
            </View>
          )}
        </View>

        {/* Stats */}
        <View style={styles.statsCard}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Quizzes</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statNumber}>0h</Text>
            <Text style={styles.statLabel}>Study Time</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
        </View>

        {/* Menu */}
        <View style={styles.menuCard}>
          {MENU_ITEMS.map((item, index) => (
            <TouchableOpacity
              key={item.label}
              style={[styles.menuItem, index === MENU_ITEMS.length - 1 && styles.menuItemLast]}
            >
              <View style={[styles.menuIcon, { backgroundColor: item.color + '20' }]}>
                <Ionicons name={item.icon} size={20} color={item.color} />
              </View>
              <Text style={styles.menuText}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
        </View>

        {/* App Info */}
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>StudyMate AI v1.0.0</Text>
          <Text style={styles.infoSubtext}>Built for Hackazrds 3.0</Text>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
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
    backgroundColor: '#fff',
    padding: 24,
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  info: {
    fontSize: 14,
    color: '#6B7280',
  },
  weakSubjects: {
    marginTop: 16,
    alignItems: 'center',
  },
  weakLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  tag: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  tagText: {
    fontSize: 12,
    color: '#92400E',
    fontWeight: '500',
  },
  goalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  goalText: {
    fontSize: 13,
    color: '#92400E',
  },
  goalLabel: {
    fontWeight: '600',
  },
  motiveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  motiveText: {
    fontSize: 13,
    color: '#991B1B',
  },
  motiveLabel: {
    fontWeight: '600',
  },
  examDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  examDateText: {
    fontSize: 13,
    color: '#065F46',
  },
  examDateLabel: {
    fontWeight: '600',
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    margin: 20,
    marginTop: 12,
    padding: 20,
    borderRadius: 16,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E5E7EB',
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
  menuCard: {
    backgroundColor: '#fff',
    margin: 20,
    marginTop: 0,
    borderRadius: 16,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
  },
  infoCard: {
    alignItems: 'center',
    padding: 20,
  },
  infoText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  infoSubtext: {
    fontSize: 12,
    color: '#D1D5DB',
    marginTop: 4,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    margin: 20,
    marginTop: 0,
    marginBottom: 40,
    padding: 14,
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
  },
});
