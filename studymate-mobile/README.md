# StudyMate AI - Mobile App

React Native mobile app built with Expo for ICSE/CBSE Class 8-10 students.

## Features

- **Authentication**: Sign up with email/password + student details (name, class, board)
- **Onboarding**: Multi-step onboarding to collect weak subjects and exam date
- **Home**: Dashboard with exam countdown, stats, and quick actions
- **Focus Timer**: Pomodoro timer with work/break cycles
- **AI Explain**: Get AI-powered concept explanations
- **Calendar**: Custom calendar with events and reminders
- **Profile**: User profile and settings

## Tech Stack

- React Native (Expo SDK 50)
- React Navigation (Bottom Tabs + Native Stack)
- **Neo4j AuraDB** (Graph Database - Auth + Data Storage)
- Expo Secure Store (for session persistence)

## Project Structure

```
studymate-mobile/
├── App.js                    # Entry point
├── app.json                  # Expo config
├── package.json              # Dependencies
├── src/
│   ├── components/           # Reusable components
│   ├── context/
│   │   └── AuthContext.js    # Auth state + Neo4j client
│   ├── navigation/
│   │   └── MainTabNavigator.js
│   ├── screens/
│   │   ├── SplashScreen.js
│   │   ├── LoginScreen.js
│   │   ├── SignupScreen.js   # 2-step signup with student details
│   │   ├── OnboardingScreen.js # 3-step onboarding
│   │   ├── HomeScreen.js
│   │   ├── FocusScreen.js    # Pomodoro timer
│   │   ├── ExplainScreen.js  # AI concept explainer
│   │   ├── CalendarScreen.js # Custom calendar
│   │   └── ProfileScreen.js
│   └── services/
│       └── neo4j.js         # Neo4j driver & queries
└── assets/                   # App icons and splash
```

## Setup Instructions

### 1. Install Dependencies

```bash
cd studymate-mobile
npm install
```

### 2. Configure Neo4j AuraDB

1. Create a Neo4j AuraDB instance at https://console.neo4j.io/
2. Copy your connection URI and password
3. Update `src/services/neo4j.js`:
   ```javascript
   const NEO4J_URI = 'neo4j+s://your-instance.databases.neo4j.io';
   const NEO4J_USER = 'neo4j';
   const NEO4J_PASSWORD = 'your-password';
   ```

3. Run the Cypher setup in Neo4j Browser (see `neo4j-setup.cypher`)

### 3. Start Development

```bash
npx expo start
```

Press:
- `i` for iOS simulator
- `a` for Android emulator
- Scan QR code with Expo Go app on physical device

## Neo4j Graph Database Schema

### Node Types

**User** (Student profile)
```cypher
(:User {
  id: UUID,
  email: String,
  password: String,  // Store hashed in production!
  name: String,
  class: String,     // '8', '9', '10'
  board: String,     // 'ICSE', 'CBSE'
  weakSubjects: [String],
  examDate: Date,
  onboardingComplete: Boolean,
  darkMode: Boolean,
  createdAt: DateTime,
  updatedAt: DateTime,
  lastLogin: DateTime
})
```

**Quiz** (Quiz results)
```cypher
(:Quiz {
  id: UUID,
  subject: String,
  chapter: String,
  difficulty: String,
  questionType: String,
  score: Integer,
  totalQuestions: Integer,
  percentage: Integer,
  timeTaken: Integer,
  wrongAnswers: JSON String,
  createdAt: DateTime
})
```

**Event** (Calendar events)
```cypher
(:Event {
  id: UUID,
  title: String,
  type: String,      // 'study', 'exam', 'reminder'
  subject: String,
  date: Date,
  time: String,
  createdAt: DateTime
})
```

**Performance** (Chapter performance tracking)
```cypher
(:Performance {
  id: UUID,
  userId: String,
  subject: String,
  chapter: String,
  totalQuizzes: Integer,
  totalScore: Integer,
  averageScore: Integer,
  status: String,    // 'green', 'yellow', 'red'
  lastPracticed: DateTime
})
```

### Relationships

```cypher
// User takes quizzes
(u:User)-[:TOOK]->(q:Quiz)

// User has calendar events
(u:User)-[:HAS_EVENT]->(e:Event)

// User has performance tracking per chapter
(u:User)-[:HAS_PERFORMANCE]->(p:Performance)
```

### Constraints (run once)

```cypher
// User email must be unique
CREATE CONSTRAINT user_email IF NOT EXISTS
FOR (u:User) REQUIRE u.email IS UNIQUE;

// IDs must be unique
CREATE CONSTRAINT user_id IF NOT EXISTS
FOR (u:User) REQUIRE u.id IS UNIQUE;

CREATE CONSTRAINT quiz_id IF NOT EXISTS
FOR (q:Quiz) REQUIRE q.id IS UNIQUE;

CREATE CONSTRAINT event_id IF NOT EXISTS
FOR (e:Event) REQUIRE e.id IS UNIQUE;

CREATE CONSTRAINT performance_id IF NOT EXISTS
FOR (p:Performance) REQUIRE p.id IS UNIQUE;
```

### Indexes (for performance)

```cypher
CREATE INDEX quiz_user_date IF NOT EXISTS
FOR (q:Quiz) ON (q.userId, q.createdAt);

CREATE INDEX event_user_date IF NOT EXISTS
FOR (e:Event) ON (e.userId, e.date);

CREATE INDEX performance_user IF NOT EXISTS
FOR (p:Performance) ON (p.userId, p.subject);
```

## Key Cypher Queries

### Authentication
```cypher
// Sign up
CREATE (u:User {
  id: randomUUID(),
  email: $email,
  password: $password,  // Hash in production!
  name: $name,
  class: $class,
  board: $board,
  createdAt: datetime()
})
RETURN u

// Sign in
MATCH (u:User {email: $email, password: $password})
SET u.lastLogin = datetime()
RETURN u
```

### Dashboard Stats
```cypher
// Get user stats
MATCH (u:User {id: $userId})-[:TOOK]->(q:Quiz)
RETURN 
  count(q) as totalQuizzes,
  avg(q.percentage) as avgScore,
  sum(q.timeTaken) as totalTime
```

### Weak Topics
```cypher
// Get weak subjects (red/yellow status)
MATCH (u:User {id: $userId})-[:HAS_PERFORMANCE]->(p:Performance)
WHERE p.status IN ['red', 'yellow']
RETURN p.subject, p.chapter, p.averageScore
ORDER BY p.averageScore ASC
```

### Calendar Events
```cypher
// Get upcoming events
MATCH (u:User {id: $userId})-[:HAS_EVENT]->(e:Event)
WHERE e.date >= date()
RETURN e
ORDER BY e.date ASC
```

### Create Quiz (with performance update)
```cypher
MATCH (u:User {id: $userId})
CREATE (q:Quiz {
  id: randomUUID(),
  subject: $subject,
  chapter: $chapter,
  score: $score,
  percentage: $percentage,
  createdAt: datetime()
})
CREATE (u)-[:TOOK]->(q)

// Update or create performance
MERGE (p:Performance {userId: $userId, subject: $subject, chapter: $chapter})
ON CREATE SET
  p.totalQuizzes = 1,
  p.totalScore = $score,
  p.averageScore = $score,
  p.status = CASE WHEN $score >= 75 THEN 'green' WHEN $score >= 50 THEN 'yellow' ELSE 'red' END,
  p.lastPracticed = datetime()
ON MATCH SET
  p.totalQuizzes = p.totalQuizzes + 1,
  p.totalScore = p.totalScore + $score,
  p.averageScore = round((p.totalScore + $score) / (p.totalQuizzes + 1)),
  p.lastPracticed = datetime()
CREATE (u)-[:HAS_PERFORMANCE]->(p)
```

## Environment Variables

Create `.env` file:

```bash
EXPO_PUBLIC_NEO4J_URI=neo4j+s://your-instance.databases.neo4j.io
EXPO_PUBLIC_NEO4J_USER=neo4j
EXPO_PUBLIC_NEO4J_PASSWORD=your-password
```

## Build for Production

### iOS

```bash
npx expo prebuild -p ios
cd ios
pod install
# Open ios/studymate.xcworkspace in Xcode
# Configure signing and build
```

### Android

```bash
npx expo prebuild -p android
cd android
./gradlew assembleRelease
# APK will be in android/app/build/outputs/apk/release/
```

### EAS Build (Recommended)

```bash
npm install -g eas-cli
eas login
eas build --platform ios    # or android
```

## Web App vs Mobile App

| Feature | Web App (React) | Mobile App (React Native) |
|---------|-----------------|---------------------------|
| Storage | localStorage | Neo4j AuraDB |
| Auth | None (local) | Neo4j Custom Auth |
| AI | Groq API (direct) | Groq API (via backend) |
| Notifications | None | Push notifications |
| Offline | Limited | Better with caching |
| Data Sync | None | Cross-device sync |
| Data Model | Relational | **Graph** |

### Why Neo4j (Graph DB) vs Supabase (Relational)?

**Neo4j advantages for StudyMate:**
- **Relationship-focused**: Perfect for tracking student-subject-chapter relationships
- **Performance**: Fast queries for connected data (e.g., "students with similar weak subjects")
- **Flexibility**: Easy to add new relationships without schema changes
- **Recommendations**: Built-in graph algorithms for study recommendations
- **AuraDB Free**: Generous free tier for startups

**Example Graph Queries:**
```cypher
// Find students with similar weak subjects
MATCH (u1:User)-[:HAS_PERFORMANCE]->(p1:Performance)
WHERE p1.status = 'red'
WITH u1, collect(p1.subject) as weak1
MATCH (u2:User)-[:HAS_PERFORMANCE]->(p2:Performance)
WHERE u1.id < u2.id AND p2.status = 'red'
WITH u1, u2, weak1, collect(p2.subject) as weak2
RETURN u1.name, u2.name,
       apoc.coll.intersection(weak1, weak2) as commonSubjects

// Subject difficulty ranking
MATCH (u:User)-[:TOOK]->(q:Quiz)
WITH q.subject as subject, avg(q.percentage) as avgScore
RETURN subject, avgScore
ORDER BY avgScore ASC
```

The mobile app connects to **auth and database only** - it doesn't share localStorage with the web app.

## License

MIT - Built for Hackazrds 3.0
