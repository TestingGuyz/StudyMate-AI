export const SUBJECTS = {
  Physics: {
    color: 'physics',
    hex: '#3B82F6',
    icon: 'Atom',
    chapters: [
      'Measurements and Experimentation',
      'Motion in One Dimension',
      'Laws of Motion',
      'Forces',
      'Pressure and Floatation',
      'Work, Energy and Power',
      'Sound',
      'Light - Reflection and Refraction',
      'Electricity and Magnetism',
      'Heat'
    ]
  },
  Chemistry: {
    color: 'chemistry',
    hex: '#F59E0B',
    icon: 'FlaskConical',
    chapters: [
      'Matter and its Composition',
      'Atomic Structure and Chemical Bonding',
      'Acids, Bases and Salts',
      'Metals and Non-metals',
      'Carbon and its Compounds',
      'Periodic Table and Periodicity',
      'Study of Compounds',
      'Mole Concept and Stoichiometry'
    ]
  },
  Mathematics: {
    color: 'mathematics',
    hex: '#8B5CF6',
    icon: 'Calculator',
    chapters: [
      'Algebra - Factorisation and Quadratic Equations',
      'Geometry - Triangles and Circles',
      'Trigonometry',
      'Statistics and Probability',
      'Mensuration',
      'Commercial Mathematics',
      'Coordinate Geometry',
      'Linear Inequations'
    ]
  },
  Biology: {
    color: 'biology',
    hex: '#10B981',
    icon: 'Leaf',
    chapters: [
      'Cell Biology and Division',
      'Nutrition and Photosynthesis',
      'Respiration',
      'Transport in Plants and Animals',
      'Excretion',
      'Nervous System and Sense Organs',
      'Reproduction',
      'Ecology and Environment'
    ]
  },
  'Computer Applications': {
    color: 'computer',
    hex: '#6366F1',
    icon: 'Monitor',
    chapters: [
      'Algorithms and Flowcharts',
      'Java Basics and Data Types',
      'Conditional Statements and Loops',
      'Arrays and Strings',
      'OOP Concepts and Classes',
      'HTML and CSS Basics',
      'SQL and Database Concepts'
    ]
  },
  History: {
    color: 'history',
    hex: '#EF4444',
    icon: 'Landmark',
    chapters: [
      'The Harappan Civilization',
      'The Vedic Period',
      'Mauryan and Gupta Empires',
      'The Delhi Sultanate',
      'The Mughal Empire',
      'The British Raj and Revolt of 1857',
      'Indian National Movement',
      'World War I and II'
    ]
  },
  Geography: {
    color: 'geography',
    hex: '#14B8A6',
    icon: 'Globe2',
    chapters: [
      'Earth as a Planet',
      'Latitude, Longitude and Time',
      'Rotation and Revolution',
      'Landforms and Mountains',
      'Water Bodies and Oceans',
      'Climate and Weather',
      'Natural Vegetation',
      'Map Work and Interpretation'
    ]
  },
  English: {
    color: 'english',
    hex: '#EC4899',
    icon: 'BookOpen',
    chapters: [
      'Grammar - Tenses and Voice',
      'Grammar - Prepositions and Conjunctions',
      'Comprehension and Summary Writing',
      'Formal and Informal Letters',
      'Essay and Article Writing',
      'Poetry Analysis',
      'Prose and Drama',
      'Vocabulary and Idioms'
    ]
  }
};

export const SUBJECT_LIST = Object.keys(SUBJECTS);

export const getSubjectData = (subject) => SUBJECTS[subject];

export const getPerformanceColor = (percentage) => {
  if (percentage >= 75) return 'green';
  if (percentage >= 50) return 'yellow';
  return 'red';
};

export const getPerformanceBg = (percentage) => {
  if (percentage >= 75) return 'bg-green-500';
  if (percentage >= 50) return 'bg-yellow-500';
  return 'bg-red-500';
};

export const getGrade = (percentage) => {
  if (percentage >= 90) return { grade: 'A', label: 'Excellent!', color: 'text-green-600' };
  if (percentage >= 75) return { grade: 'B', label: 'Good job!', color: 'text-blue-600' };
  if (percentage >= 50) return { grade: 'C', label: 'Keep practicing', color: 'text-yellow-600' };
  return { grade: 'D', label: 'Needs improvement', color: 'text-red-600' };
};

export const DIFFICULTY_TIMER = {
  Easy: 30,
  Medium: 45,
  Hard: 60
};

export const SPACED_REPETITION_INTERVALS = [1, 3, 7, 14, 30]; // days

export const MOTIVATIONAL_QUOTES = [
  "The expert in anything was once a beginner. Keep going! 💪",
  "Success is the sum of small efforts repeated daily. 📚",
  "Don't watch the clock; do what it does — keep going! ⏰",
  "Every quiz you take makes you stronger! 🚀",
  "Your future self will thank you for studying today! ✨",
  "Small progress is still progress. Keep it up! 🌟",
  "The more you practice, the luckier you get! 🎯",
  "Believe in yourself and you're halfway there! 💫"
];
