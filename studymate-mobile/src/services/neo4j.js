import neo4j from 'neo4j-driver';

// Neo4j AuraDB credentials
// Replace with your actual AuraDB credentials
const NEO4J_URI = 'neo4j+s://your-instance.databases.neo4j.io';
const NEO4J_USER = 'neo4j';
const NEO4J_PASSWORD = 'your-password';

let driver = null;

export const initNeo4j = () => {
  if (!driver) {
    driver = neo4j.driver(
      NEO4J_URI,
      neo4j.auth.basic(NEO4J_USER, NEO4J_PASSWORD)
    );
  }
  return driver;
};

export const neo4jDriver = initNeo4j();

export const verifyConnectivity = async () => {
  try {
    const serverInfo = await driver.verifyConnectivity();
    console.log('Connected to Neo4j:', serverInfo);
    return true;
  } catch (error) {
    console.error('Neo4j connection error:', error);
    return false;
  }
};

export const closeNeo4j = async () => {
  if (driver) {
    await driver.close();
    driver = null;
  }
};

// Helper to run queries
export const runQuery = async (query, params = {}) => {
  const session = driver.session();
  try {
    const result = await session.run(query, params);
    return result;
  } finally {
    await session.close();
  }
};

// Auth functions using Neo4j
export const neo4jAuth = {
  // Create new user with hashed password
  signUp: async (email, password, userData) => {
    const session = driver.session();
    try {
      // Check if user exists
      const checkResult = await session.run(
        'MATCH (u:User {email: $email}) RETURN u',
        { email }
      );
      
      if (checkResult.records.length > 0) {
        throw new Error('User already exists');
      }

      // Create new user node
      const result = await session.run(
        `
        CREATE (u:User {
          id: randomUUID(),
          email: $email,
          password: $password,
          name: $name,
          class: $class,
          board: $board,
          weakSubjects: $weakSubjects,
          examDate: $examDate,
          onboardingComplete: false,
          darkMode: false,
          createdAt: datetime(),
          updatedAt: datetime()
        })
        RETURN u
        `,
        {
          email,
          password, // In production, hash this!
          name: userData.name,
          class: userData.class,
          board: userData.board,
          weakSubjects: userData.weakSubjects || [],
          examDate: userData.examDate || null,
        }
      );

      const user = result.records[0].get('u').properties;
      return { data: { user }, error: null };
    } catch (error) {
      return { data: null, error };
    } finally {
      await session.close();
    }
  },

  // Sign in user
  signIn: async (email, password) => {
    const session = driver.session();
    try {
      const result = await session.run(
        `
        MATCH (u:User {email: $email, password: $password})
        SET u.lastLogin = datetime()
        RETURN u
        `,
        { email, password }
      );

      if (result.records.length === 0) {
        throw new Error('Invalid credentials');
      }

      const user = result.records[0].get('u').properties;
      return { data: { user }, error: null };
    } catch (error) {
      return { data: null, error };
    } finally {
      await session.close();
    }
  },

  // Get user by ID
  getUser: async (userId) => {
    const session = driver.session();
    try {
      const result = await session.run(
        'MATCH (u:User {id: $userId}) RETURN u',
        { userId }
      );

      if (result.records.length === 0) {
        return null;
      }

      return result.records[0].get('u').properties;
    } finally {
      await session.close();
    }
  },

  // Update user
  updateUser: async (userId, updates) => {
    const session = driver.session();
    try {
      const setClause = Object.entries(updates)
        .map(([key, _]) => `u.${key} = $${key}`)
        .join(', ');

      const result = await session.run(
        `
        MATCH (u:User {id: $userId})
        SET ${setClause}, u.updatedAt = datetime()
        RETURN u
        `,
        { userId, ...updates }
      );

      return result.records[0].get('u').properties;
    } finally {
      await session.close();
    }
  },

  // Complete onboarding
  completeOnboarding: async (userId, userData) => {
    const session = driver.session();
    try {
      const result = await session.run(
        `
        MATCH (u:User {id: $userId})
        SET u.name = $name,
            u.class = $class,
            u.board = $board,
            u.weakSubjects = $weakSubjects,
            u.examDate = $examDate,
            u.onboardingComplete = true,
            u.updatedAt = datetime()
        RETURN u
        `,
        {
          userId,
          name: userData.name,
          class: userData.class,
          board: userData.board,
          weakSubjects: userData.weakSubjects || [],
          examDate: userData.examDate,
        }
      );

      return result.records[0].get('u').properties;
    } finally {
      await session.close();
    }
  },
};

// Quiz functions
export const neo4jQuizzes = {
  createQuiz: async (userId, quizData) => {
    const session = driver.session();
    try {
      const result = await session.run(
        `
        MATCH (u:User {id: $userId})
        CREATE (q:Quiz {
          id: randomUUID(),
          subject: $subject,
          chapter: $chapter,
          difficulty: $difficulty,
          questionType: $questionType,
          score: $score,
          totalQuestions: $totalQuestions,
          percentage: $percentage,
          timeTaken: $timeTaken,
          wrongAnswers: $wrongAnswers,
          createdAt: datetime()
        })
        CREATE (u)-[:TOOK]->(q)
        RETURN q
        `,
        {
          userId,
          ...quizData,
          wrongAnswers: JSON.stringify(quizData.wrongAnswers || []),
        }
      );
      return result.records[0].get('q').properties;
    } finally {
      await session.close();
    }
  },

  getUserQuizzes: async (userId) => {
    const session = driver.session();
    try {
      const result = await session.run(
        `
        MATCH (u:User {id: $userId})-[:TOOK]->(q:Quiz)
        RETURN q
        ORDER BY q.createdAt DESC
        `,
        { userId }
      );
      return result.records.map(r => r.get('q').properties);
    } finally {
      await session.close();
    }
  },
};

// Events functions
export const neo4jEvents = {
  createEvent: async (userId, eventData) => {
    const session = driver.session();
    try {
      const result = await session.run(
        `
        MATCH (u:User {id: $userId})
        CREATE (e:Event {
          id: randomUUID(),
          title: $title,
          type: $type,
          subject: $subject,
          date: $date,
          time: $time,
          createdAt: datetime()
        })
        CREATE (u)-[:HAS_EVENT]->(e)
        RETURN e
        `,
        { userId, ...eventData }
      );
      return result.records[0].get('e').properties;
    } finally {
      await session.close();
    }
  },

  getUserEvents: async (userId) => {
    const session = driver.session();
    try {
      const result = await session.run(
        `
        MATCH (u:User {id: $userId})-[:HAS_EVENT]->(e:Event)
        RETURN e
        ORDER BY e.date ASC
        `,
        { userId }
      );
      return result.records.map(r => r.get('e').properties);
    } finally {
      await session.close();
    }
  },

  deleteEvent: async (eventId) => {
    const session = driver.session();
    try {
      await session.run(
        'MATCH (e:Event {id: $eventId}) DETACH DELETE e',
        { eventId }
      );
    } finally {
      await session.close();
    }
  },
};

// Performance tracking
export const neo4jPerformance = {
  updatePerformance: async (userId, subject, chapter, score) => {
    const session = driver.session();
    try {
      const result = await session.run(
        `
        MATCH (u:User {id: $userId})
        MERGE (p:Performance {userId: $userId, subject: $subject, chapter: $chapter})
        ON CREATE SET
          p.totalQuizzes = 1,
          p.totalScore = $score,
          p.averageScore = $score,
          p.status = CASE 
            WHEN $score >= 75 THEN 'green'
            WHEN $score >= 50 THEN 'yellow'
            ELSE 'red'
          END,
          p.lastPracticed = datetime()
        ON MATCH SET
          p.totalQuizzes = p.totalQuizzes + 1,
          p.totalScore = p.totalScore + $score,
          p.averageScore = round((p.totalScore + $score) / (p.totalQuizzes + 1)),
          p.status = CASE 
            WHEN round((p.totalScore + $score) / (p.totalQuizzes + 1)) >= 75 THEN 'green'
            WHEN round((p.totalScore + $score) / (p.totalQuizzes + 1)) >= 50 THEN 'yellow'
            ELSE 'red'
          END,
          p.lastPracticed = datetime()
        CREATE (u)-[:HAS_PERFORMANCE]->(p)
        RETURN p
        `,
        { userId, subject, chapter, score }
      );
      return result.records[0].get('p').properties;
    } finally {
      await session.close();
    }
  },

  getUserPerformance: async (userId) => {
    const session = driver.session();
    try {
      const result = await session.run(
        `
        MATCH (u:User {id: $userId})-[:HAS_PERFORMANCE]->(p:Performance)
        RETURN p
        `,
        { userId }
      );
      return result.records.map(r => r.get('p').properties);
    } finally {
      await session.close();
    }
  },
};
