// StudyMate AI - Neo4j AuraDB Setup
// Run these commands in Neo4j Browser or AuraDB Query window

// ============================================
// 1. CONSTRAINTS (for data integrity)
// ============================================

// User email must be unique
CREATE CONSTRAINT user_email IF NOT EXISTS
FOR (u:User) REQUIRE u.email IS UNIQUE;

// User id must be unique
CREATE CONSTRAINT user_id IF NOT EXISTS
FOR (u:User) REQUIRE u.id IS UNIQUE;

// Quiz id must be unique
CREATE CONSTRAINT quiz_id IF NOT EXISTS
FOR (q:Quiz) REQUIRE q.id IS UNIQUE;

// Event id must be unique
CREATE CONSTRAINT event_id IF NOT EXISTS
FOR (e:Event) REQUIRE e.id IS UNIQUE;

// Performance composite key
CREATE CONSTRAINT performance_id IF NOT EXISTS
FOR (p:Performance) REQUIRE p.id IS UNIQUE;

// ============================================
// 2. INDEXES (for performance)
// ============================================

CREATE INDEX user_created_at IF NOT EXISTS
FOR (u:User) ON (u.createdAt);

CREATE INDEX quiz_user_date IF NOT EXISTS
FOR (q:Quiz) ON (q.userId, q.createdAt);

CREATE INDEX event_user_date IF NOT EXISTS
FOR (e:Event) ON (e.userId, e.date);

CREATE INDEX performance_user IF NOT EXISTS
FOR (p:Performance) ON (p.userId, p.subject);

// ============================================
// 3. SAMPLE DATA (for testing)
// ============================================

// Create a test user (password: "test123")
CREATE (u:User {
  id: 'test-user-001',
  email: 'test@example.com',
  password: 'test123',  // In production, use hashed passwords!
  name: 'Test Student',
  class: '10',
  board: 'ICSE',
  weakSubjects: ['Physics', 'Chemistry'],
  examDate: '2026-02-15',
  onboardingComplete: true,
  darkMode: false,
  createdAt: datetime(),
  updatedAt: datetime(),
  lastLogin: datetime()
})

// Create sample quizzes for test user
CREATE (q1:Quiz {
  id: 'quiz-001',
  subject: 'Physics',
  chapter: 'Motion',
  difficulty: 'Medium',
  questionType: 'MCQ',
  score: 8,
  totalQuestions: 10,
  percentage: 80,
  timeTaken: 300,
  wrongAnswers: '[{"question": "What is velocity?", "answer": "Speed with direction"}]',
  createdAt: datetime()
})
CREATE (u)-[:TOOK]->(q1)

CREATE (q2:Quiz {
  id: 'quiz-002',
  subject: 'Chemistry',
  chapter: 'Atoms',
  difficulty: 'Easy',
  questionType: 'MCQ',
  score: 9,
  totalQuestions: 10,
  percentage: 90,
  timeTaken: 240,
  wrongAnswers: '[]',
  createdAt: datetime()
})
CREATE (u)-[:TOOK]->(q2)

// Create sample events
CREATE (e1:Event {
  id: 'event-001',
  title: 'ICSE Board Exams Begin',
  type: 'exam',
  subject: 'All Subjects',
  date: '2026-02-15',
  createdAt: datetime()
})
CREATE (u)-[:HAS_EVENT]->(e1)

CREATE (e2:Event {
  id: 'event-002',
  title: 'Physics Revision',
  type: 'study',
  subject: 'Physics',
  date: date(),
  time: '14:00',
  createdAt: datetime()
})
CREATE (u)-[:HAS_EVENT]->(e2)

// Create performance tracking
CREATE (p1:Performance {
  id: 'perf-001',
  userId: 'test-user-001',
  subject: 'Physics',
  chapter: 'Motion',
  totalQuizzes: 5,
  totalScore: 400,
  averageScore: 80,
  status: 'green',
  lastPracticed: datetime()
})
CREATE (u)-[:HAS_PERFORMANCE]->(p1)

CREATE (p2:Performance {
  id: 'perf-002',
  userId: 'test-user-001',
  subject: 'Chemistry',
  chapter: 'Atoms',
  totalQuizzes: 3,
  totalScore: 210,
  averageScore: 70,
  status: 'yellow',
  lastPracticed: datetime()
})
CREATE (u)-[:HAS_PERFORMANCE]->(p2);

// ============================================
// 4. USEFUL QUERIES
// ============================================

// Get user with all related data
// MATCH (u:User {email: 'test@example.com'})
// OPTIONAL MATCH (u)-[:TOOK]->(q:Quiz)
// OPTIONAL MATCH (u)-[:HAS_EVENT]->(e:Event)
// OPTIONAL MATCH (u)-[:HAS_PERFORMANCE]->(p:Performance)
// RETURN u, collect(q) as quizzes, collect(e) as events, collect(p) as performance;

// Get user's weak subjects performance
// MATCH (u:User {id: 'test-user-001'})-[:HAS_PERFORMANCE]->(p:Performance)
// WHERE p.status IN ['red', 'yellow']
// RETURN p.subject, p.chapter, p.averageScore, p.status
// ORDER BY p.averageScore ASC;

// Get upcoming events
// MATCH (u:User {id: 'test-user-001'})-[:HAS_EVENT]->(e:Event)
// WHERE e.date >= date()
// RETURN e
// ORDER BY e.date ASC;

// Get quiz statistics
// MATCH (u:User {id: 'test-user-001'})-[:TOOK]->(q:Quiz)
// RETURN 
//   count(q) as totalQuizzes,
//   avg(q.percentage) as avgScore,
//   sum(q.timeTaken) as totalTime;

// ============================================
// 5. CLEAR DATA (for testing/reset)
// ============================================

// Delete all data:
// MATCH (n) DETACH DELETE n;

// Delete only test user:
// MATCH (u:User {email: 'test@example.com'})
// OPTIONAL MATCH (u)-[:TOOK]->(q:Quiz)
// OPTIONAL MATCH (u)-[:HAS_EVENT]->(e:Event)
// OPTIONAL MATCH (u)-[:HAS_PERFORMANCE]->(p:Performance)
// DETACH DELETE u, q, e, p;

// ============================================
// 6. GRAPH ANALYTICS QUERIES
// ============================================

// Find most practiced subjects
// MATCH (u:User)-[:TOOK]->(q:Quiz)
// RETURN q.subject, count(q) as quizCount
// ORDER BY quizCount DESC;

// Find study patterns (subjects often studied together)
// MATCH (u:User)-[:TOOK]->(q1:Quiz)
// MATCH (u)-[:TOOK]->(q2:Quiz)
// WHERE q1.subject < q2.subject
// RETURN q1.subject, q2.subject, count(*) as frequency
// ORDER BY frequency DESC
// LIMIT 10;

// Student similarity (students with similar weak subjects)
// MATCH (u1:User)-[:HAS_PERFORMANCE]->(p1:Performance)
// WHERE p1.status IN ['red', 'yellow']
// WITH u1, collect(p1.subject) as weakSubjects1
// MATCH (u2:User)-[:HAS_PERFORMANCE]->(p2:Performance)
// WHERE u1.id < u2.id AND p2.status IN ['red', 'yellow']
// WITH u1, u2, weakSubjects1, collect(p2.subject) as weakSubjects2
// RETURN u1.name, u2.name,
//        apoc.coll.intersection(weakSubjects1, weakSubjects2) as commonWeakSubjects
// ORDER BY size(commonWeakSubjects) DESC;

// ============================================
