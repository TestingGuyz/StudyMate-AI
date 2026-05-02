import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarScreen() {
  const { user, supabase } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', type: 'study', subject: '' });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const { data } = await supabase
      .from('events')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: true });
    
    if (data) setEvents(data);
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const getEventsForDate = (dateStr) => events.filter(e => e.date === dateStr);

  const addEvent = async () => {
    const dateStr = selectedDate.toISOString().split('T')[0];
    const event = {
      user_id: user.id,
      title: newEvent.title,
      type: newEvent.type,
      subject: newEvent.subject,
      date: dateStr,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase.from('events').insert(event).select().single();
    if (!error && data) {
      setEvents([...events, data]);
    }

    setNewEvent({ title: '', type: 'study', subject: '' });
    setShowAddModal(false);
  };

  const deleteEvent = async (id) => {
    await supabase.from('events').delete().eq('id', id);
    setEvents(events.filter(e => e.id !== id));
  };

  const navigateMonth = (direction) => {
    setCurrentDate(new Date(year, month + direction, 1));
  };

  const formatDateKey = (day) => `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  const upcoming = events
    .filter(e => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Calendar</Text>
          <TouchableOpacity style={styles.addButton} onPress={() => setShowAddModal(true)}>
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Exam Countdown */}
        {user?.examDate && (
          <View style={styles.countdownCard}>
            <Ionicons name="flag" size={28} color="#EF4444" />
            <View style={styles.countdownContent}>
              <Text style={styles.countdownLabel}>Board Exams</Text>
              <Text style={styles.countdownDate}>
                {Math.ceil((new Date(user.examDate) - new Date()) / (1000 * 60 * 60 * 24))} days left
              </Text>
            </View>
          </View>
        )}

        {/* Month Navigation */}
        <View style={styles.monthNav}>
          <TouchableOpacity onPress={() => navigateMonth(-1)}>
            <Ionicons name="chevron-back" size={24} color="#374151" />
          </TouchableOpacity>
          <Text style={styles.monthText}>{MONTHS[month]} {year}</Text>
          <TouchableOpacity onPress={() => navigateMonth(1)}>
            <Ionicons name="chevron-forward" size={24} color="#374151" />
          </TouchableOpacity>
        </View>

        {/* Calendar Grid */}
        <View style={styles.calendarCard}>
          <View style={styles.dayLabels}>
            {DAYS.map(d => (
              <Text key={d} style={styles.dayLabel}>{d}</Text>
            ))}
          </View>
          <View style={styles.daysGrid}>
            {Array.from({ length: firstDay }).map((_, i) => (
              <View key={`empty-${i}`} style={styles.dayCell} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateKey = formatDateKey(day);
              const dayEvents = getEventsForDate(dateKey);
              const isSelected = selectedDate.getDate() === day && 
                               selectedDate.getMonth() === month &&
                               selectedDate.getFullYear() === year;
              const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();

              return (
                <TouchableOpacity
                  key={day}
                  style={[
                    styles.dayCell,
                    isSelected && styles.dayCellSelected,
                    isToday && styles.dayCellToday,
                  ]}
                  onPress={() => setSelectedDate(new Date(year, month, day))}
                >
                  <Text style={[
                    styles.dayText,
                    isSelected && styles.dayTextSelected,
                    isToday && styles.dayTextToday,
                  ]}>{day}</Text>
                  {dayEvents.length > 0 && (
                    <View style={styles.eventDots}>
                      {dayEvents.slice(0, 3).map((e, j) => (
                        <View
                          key={j}
                          style={[
                            styles.eventDot,
                            { backgroundColor: e.type === 'exam' ? '#EF4444' : e.type === 'study' ? '#3B82F6' : '#10B981' },
                          ]}
                        />
                      ))}
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Selected Date Events */}
        <View style={styles.eventsCard}>
          <View style={styles.eventsHeader}>
            <Text style={styles.eventsTitle}>
              {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </Text>
            <TouchableOpacity
              style={styles.addEventButton}
              onPress={() => setShowAddModal(true)}
            >
              <Text style={styles.addEventText}>+ Add</Text>
            </TouchableOpacity>
          </View>

          {getEventsForDate(selectedDate.toISOString().split('T')[0]).length === 0 ? (
            <Text style={styles.noEvents}>No events for this day</Text>
          ) : (
            getEventsForDate(selectedDate.toISOString().split('T')[0]).map(event => (
              <View
                key={event.id}
                style={[
                  styles.eventItem,
                  { backgroundColor: event.type === 'exam' ? '#FEF2F2' : event.type === 'study' ? '#EFF6FF' : '#F0FDF4' },
                ]}
              >
                <View style={styles.eventContent}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  {event.subject && <Text style={styles.eventSubject}>{event.subject}</Text>}
                </View>
                <TouchableOpacity onPress={() => deleteEvent(event.id)}>
                  <Ionicons name="trash-outline" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

        {/* Upcoming */}
        <View style={styles.upcomingCard}>
          <Text style={styles.upcomingTitle}>Upcoming Events</Text>
          {upcoming.map(event => (
            <View key={event.id} style={styles.upcomingItem}>
              <View style={[
                styles.upcomingDot,
                { backgroundColor: event.type === 'exam' ? '#EF4444' : event.type === 'study' ? '#3B82F6' : '#10B981' },
              ]} />
              <View style={styles.upcomingContent}>
                <Text style={styles.upcomingEventTitle}>{event.title}</Text>
                <Text style={styles.upcomingDate}>
                  {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Add Event Modal */}
      <Modal visible={showAddModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Event</Text>
            
            <TextInput
              style={styles.modalInput}
              placeholder="Event title"
              value={newEvent.title}
              onChangeText={(text) => setNewEvent({ ...newEvent, title: text })}
            />

            <View style={styles.typeButtons}>
              {['study', 'exam', 'reminder'].map(type => (
                <TouchableOpacity
                  key={type}
                  style={[styles.typeButton, newEvent.type === type && styles.typeButtonActive]}
                  onPress={() => setNewEvent({ ...newEvent, type })}
                >
                  <Text style={[styles.typeText, newEvent.type === type && styles.typeTextActive]}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={styles.modalInput}
              placeholder="Subject (optional)"
              value={newEvent.subject}
              onChangeText={(text) => setNewEvent({ ...newEvent, subject: text })}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setShowAddModal(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={addEvent}>
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  countdownCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    margin: 20,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  countdownContent: {
    flex: 1,
  },
  countdownLabel: {
    fontSize: 14,
    color: '#991B1B',
    fontWeight: '500',
  },
  countdownDate: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#DC2626',
  },
  monthNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  monthText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  calendarCard: {
    backgroundColor: '#fff',
    margin: 20,
    marginTop: 0,
    padding: 16,
    borderRadius: 16,
  },
  dayLabels: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  dayLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  dayCellSelected: {
    backgroundColor: '#3B82F6',
  },
  dayCellToday: {
    borderWidth: 2,
    borderColor: '#3B82F6',
  },
  dayText: {
    fontSize: 14,
    color: '#374151',
  },
  dayTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  dayTextToday: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  eventDots: {
    flexDirection: 'row',
    gap: 2,
    position: 'absolute',
    bottom: 4,
  },
  eventDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  eventsCard: {
    backgroundColor: '#fff',
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 16,
  },
  eventsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  eventsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  addEventButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
  },
  addEventText: {
    color: '#3B82F6',
    fontSize: 14,
    fontWeight: '600',
  },
  noEvents: {
    textAlign: 'center',
    color: '#9CA3AF',
    paddingVertical: 20,
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    marginBottom: 8,
  },
  eventContent: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  eventSubject: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  upcomingCard: {
    backgroundColor: '#fff',
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 16,
    marginBottom: 40,
  },
  upcomingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  upcomingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  upcomingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  upcomingContent: {
    flex: 1,
  },
  upcomingEventTitle: {
    fontSize: 14,
    color: '#374151',
  },
  upcomingDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 20,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    marginBottom: 16,
  },
  typeButtons: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  typeButtonActive: {
    backgroundColor: '#3B82F6',
  },
  typeText: {
    color: '#6B7280',
    fontWeight: '500',
  },
  typeTextActive: {
    color: '#fff',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  cancelText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
