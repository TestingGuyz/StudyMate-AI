import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Vibration,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const MODES = {
  pomodoro: { work: 25, break: 5, label: 'Pomodoro' },
  short: { work: 15, break: 3, label: 'Short' },
  long: { work: 50, break: 10, label: 'Deep Work' },
};

export default function FocusScreen() {
  const [mode, setMode] = useState('pomodoro');
  const [phase, setPhase] = useState('work'); // work, break
  const [timeLeft, setTimeLeft] = useState(MODES.pomodoro.work * 60);
  const [isActive, setIsActive] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleComplete();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  useEffect(() => {
    if (isActive) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isActive]);

  const handleComplete = () => {
    Vibration.vibrate([0, 500, 200, 500]);
    
    if (phase === 'work') {
      setCompletedSessions(s => s + 1);
      setPhase('break');
      setTimeLeft(MODES[mode].break * 60);
    } else {
      setPhase('work');
      setTimeLeft(MODES[mode].work * 60);
    }
    setIsActive(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const progress = phase === 'work'
    ? ((MODES[mode].work * 60 - timeLeft) / (MODES[mode].work * 60))
    : ((MODES[mode].break * 60 - timeLeft) / (MODES[mode].break * 60));

  const reset = () => {
    setIsActive(false);
    setPhase('work');
    setTimeLeft(MODES[mode].work * 60);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Mode Selector */}
      <View style={styles.modeSelector}>
        {Object.entries(MODES).map(([key, config]) => (
          <TouchableOpacity
            key={key}
            style={[styles.modeButton, mode === key && styles.modeButtonActive]}
            onPress={() => {
              setMode(key);
              reset();
            }}
          >
            <Text style={[styles.modeText, mode === key && styles.modeTextActive]}>
              {config.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Timer Circle */}
      <View style={styles.timerContainer}>
        <Animated.View
          style={[
            styles.timerCircle,
            {
              transform: [{ scale: pulseAnim }],
              borderColor: phase === 'work' ? '#3B82F6' : '#10B981',
            },
          ]}
        >
          <View style={styles.timerInner}>
            <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
            <Text style={[styles.phaseText, { color: phase === 'work' ? '#3B82F6' : '#10B981' }]}>
              {phase === 'work' ? 'Focus Time' : 'Break Time'}
            </Text>
          </View>
          
          {/* Progress Ring */}
          <View style={[styles.progressRing, { borderColor: phase === 'work' ? '#3B82F6' : '#10B981', opacity: 1 - progress }]} />
        </Animated.View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlButton} onPress={reset}>
          <Ionicons name="refresh" size={24} color="#6B7280" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.playButton,
            { backgroundColor: isActive ? '#EF4444' : '#3B82F6' },
          ]}
          onPress={() => setIsActive(!isActive)}
        >
          <Ionicons
            name={isActive ? 'pause' : 'play'}
            size={32}
            color="#fff"
            style={{ marginLeft: isActive ? 0 : 4 }}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.controlButton} onPress={handleComplete}>
          <Ionicons name="checkmark-done" size={24} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsCard}>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{completedSessions}</Text>
          <Text style={styles.statLabel}>Sessions</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={styles.statNumber}>
            {Math.floor(completedSessions * MODES[mode].work / 60)}h
          </Text>
          <Text style={styles.statLabel}>Focus Time</Text>
        </View>
      </View>

      {/* Tips */}
      <View style={styles.tipsCard}>
        <Ionicons name="bulb" size={20} color="#F59E0B" />
        <Text style={styles.tipsText}>
          {phase === 'work'
            ? 'Stay focused! Put your phone away.'
            : 'Take a break! Stretch and hydrate.'}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  modeSelector: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 4,
    marginBottom: 40,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  modeButtonActive: {
    backgroundColor: '#fff',
  },
  modeText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  modeTextActive: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  timerCircle: {
    width: 260,
    height: 260,
    borderRadius: 130,
    borderWidth: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerInner: {
    alignItems: 'center',
  },
  timerText: {
    fontSize: 56,
    fontWeight: 'bold',
    color: '#1F2937',
    fontVariant: ['tabular-nums'],
  },
  phaseText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  progressRing: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    borderWidth: 8,
    borderStyle: 'dashed',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    marginBottom: 32,
  },
  controlButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
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
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  tipsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 16,
  },
  tipsText: {
    flex: 1,
    fontSize: 14,
    color: '#92400E',
  },
});
