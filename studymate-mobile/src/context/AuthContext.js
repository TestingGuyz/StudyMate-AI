import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { 
  neo4jDriver, 
  initNeo4j, 
  verifyConnectivity,
  neo4jAuth,
  neo4jQuizzes,
  neo4jEvents,
  neo4jPerformance
} from '../services/neo4j';

// Storage keys
const USER_KEY = 'studymate_user';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Initialize Neo4j connection
    initNeo4j();
    checkConnection();
    loadStoredUser();
  }, []);

  const checkConnection = async () => {
    const connected = await verifyConnectivity();
    setIsConnected(connected);
  };

  const loadStoredUser = async () => {
    try {
      const storedUser = await SecureStore.getItemAsync(USER_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.log('Error loading stored user:', error);
    } finally {
      setLoading(false);
    }
  };

  const storeUser = async (userData) => {
    try {
      if (userData) {
        await SecureStore.setItemAsync(USER_KEY, JSON.stringify(userData));
      } else {
        await SecureStore.deleteItemAsync(USER_KEY);
      }
    } catch (error) {
      console.log('Error storing user:', error);
    }
  };

  const signUp = async (email, password, userData) => {
    try {
      const { data, error } = await neo4jAuth.signUp(email, password, userData);
      if (error) throw error;
      
      const user = { ...data.user, email };
      setUser(user);
      await storeUser(user);
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const signIn = async (email, password) => {
    try {
      const { data, error } = await neo4jAuth.signIn(email, password);
      if (error) throw error;
      
      setUser(data.user);
      await storeUser(data.user);
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const signOut = async () => {
    setUser(null);
    await storeUser(null);
  };

  const completeOnboarding = async (userData) => {
    try {
      if (!user?.id) throw new Error('No user found');
      
      const updated = await neo4jAuth.completeOnboarding(user.id, userData);
      const newUser = { ...user, ...updated };
      setUser(newUser);
      await storeUser(newUser);
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const updateProfile = async (updates) => {
    try {
      if (!user?.id) throw new Error('No user found');
      
      const updated = await neo4jAuth.updateUser(user.id, updates);
      const newUser = { ...user, ...updated };
      setUser(newUser);
      await storeUser(newUser);
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  // Neo4j database helpers
  const createQuiz = async (quizData) => {
    if (!user?.id) throw new Error('Not authenticated');
    return neo4jQuizzes.createQuiz(user.id, quizData);
  };

  const getQuizzes = async () => {
    if (!user?.id) return [];
    return neo4jQuizzes.getUserQuizzes(user.id);
  };

  const createEvent = async (eventData) => {
    if (!user?.id) throw new Error('Not authenticated');
    return neo4jEvents.createEvent(user.id, eventData);
  };

  const getEvents = async () => {
    if (!user?.id) return [];
    return neo4jEvents.getUserEvents(user.id);
  };

  const deleteEvent = async (eventId) => {
    return neo4jEvents.deleteEvent(eventId);
  };

  const updatePerformance = async (subject, chapter, score) => {
    if (!user?.id) throw new Error('Not authenticated');
    return neo4jPerformance.updatePerformance(user.id, subject, chapter, score);
  };

  const getPerformance = async () => {
    if (!user?.id) return [];
    return neo4jPerformance.getUserPerformance(user.id);
  };

  const value = {
    user,
    loading,
    isConnected,
    signUp,
    signIn,
    signOut,
    completeOnboarding,
    updateProfile,
    // DB operations
    createQuiz,
    getQuizzes,
    createEvent,
    getEvents,
    deleteEvent,
    updatePerformance,
    getPerformance,
    // Neo4j driver for custom queries
    neo4jDriver,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
