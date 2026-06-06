// Mock Data for ECETX Application
const mockData = {
  branches: [
    { id: 'ece', name: 'Electronics & Communication Engineering', icon: '📡', color: '#FF6B6B' },
    { id: 'eee', name: 'Electrical & Electronics Engineering', icon: '⚡', color: '#4ECDC4' },
    { id: 'cme', name: 'Computer Science & Engineering', icon: '💻', color: '#45B7D1' },
    { id: 'civil', name: 'Civil Engineering', icon: '🏗️', color: '#F7B731' },
    { id: 'mechanical', name: 'Mechanical Engineering', icon: '⚙️', color: '#5F27CD' }
  ],

  courses: [
    {
      id: 1,
      title: 'Digital Electronics Fundamentals',
      branch: 'ece',
      category: 'Core',
      level: 'Beginner',
      chapters: 12,
      duration: '24 hrs',
      students: 2340,
      rating: 4.8,
      image: '📚',
      progress: 65,
      description: 'Master digital electronics from basics to advanced applications'
    },
    {
      id: 2,
      title: 'Circuit Theory & Analysis',
      branch: 'ece',
      category: 'Core',
      level: 'Intermediate',
      chapters: 15,
      duration: '30 hrs',
      students: 1890,
      rating: 4.7,
      image: '⚡',
      progress: 45,
      description: 'Complete circuit analysis and theory'
    },
    {
      id: 3,
      title: 'Power Systems Engineering',
      branch: 'eee',
      category: 'Core',
      level: 'Advanced',
      chapters: 18,
      duration: '36 hrs',
      students: 1540,
      rating: 4.9,
      image: '🔌',
      progress: 30,
      description: 'Advanced power systems and grid analysis'
    },
    {
      id: 4,
      title: 'Data Structures & Algorithms',
      branch: 'cme',
      category: 'Core',
      level: 'Intermediate',
      chapters: 20,
      duration: '40 hrs',
      students: 3200,
      rating: 4.9,
      image: '💾',
      progress: 78,
      description: 'DSA with practical coding examples'
    },
    {
      id: 5,
      title: 'Structural Analysis',
      branch: 'civil',
      category: 'Core',
      level: 'Intermediate',
      chapters: 14,
      duration: '28 hrs',
      students: 980,
      rating: 4.6,
      image: '🏢',
      progress: 52,
      description: 'Structural design and analysis fundamentals'
    },
    {
      id: 6,
      title: 'Thermodynamics',
      branch: 'mechanical',
      category: 'Core',
      level: 'Intermediate',
      chapters: 16,
      duration: '32 hrs',
      students: 1450,
      rating: 4.7,
      image: '🔥',
      progress: 61,
      description: 'Thermodynamics principles and applications'
    }
  ],

  topics: [
    {
      id: 1,
      courseId: 1,
      title: 'Binary Number System',
      chapter: 1,
      duration: '45 min',
      videoLink: '#',
      notes: 'Complete binary conversion guide',
      problems: 15,
      completed: true
    },
    {
      id: 2,
      courseId: 1,
      title: 'Logic Gates',
      chapter: 2,
      duration: '60 min',
      videoLink: '#',
      notes: 'All logic gates explained with truth tables',
      problems: 20,
      completed: false
    },
    {
      id: 3,
      courseId: 1,
      title: 'Boolean Algebra',
      chapter: 3,
      duration: '50 min',
      videoLink: '#',
      notes: 'Boolean laws and simplification',
      problems: 18,
      completed: false
    }
  ],

  mockTests: [
    {
      id: 1,
      title: 'Digital Electronics - Full Mock Test 1',
      branch: 'ece',
      totalQuestions: 100,
      duration: 120,
      level: 'Advanced',
      totalMarks: 300,
      passMarks: 180,
      attempts: 1543,
      avgScore: 156,
      yourScore: null,
      date: '2024-01-15'
    },
    {
      id: 2,
      title: 'Circuit Theory - Chapter Test 2',
      branch: 'ece',
      totalQuestions: 50,
      duration: 60,
      level: 'Intermediate',
      totalMarks: 150,
      passMarks: 90,
      attempts: 892,
      avgScore: 98,
      yourScore: 110,
      date: '2024-01-10'
    },
    {
      id: 3,
      title: 'Power Systems - Full Mock Test',
      branch: 'eee',
      totalQuestions: 80,
      duration: 90,
      level: 'Advanced',
      totalMarks: 240,
      passMarks: 144,
      attempts: 654,
      avgScore: 145,
      yourScore: null,
      date: '2024-01-12'
    }
  ],

  leaderboard: [
    { rank: 1, name: 'Ravi Kumar', score: 8950, branch: 'cme', avatar: '👨‍💻', streak: 45 },
    { rank: 2, name: 'Priya Sharma', score: 8720, branch: 'ece', avatar: '👩‍💻', streak: 38 },
    { rank: 3, name: 'Arjun Singh', score: 8540, branch: 'mechanical', avatar: '👨‍🔧', streak: 32 },
    { rank: 4, name: 'Ananya Patel', score: 8320, branch: 'eee', avatar: '⚡', streak: 28 },
    { rank: 5, name: 'Nikhil Desai', score: 8150, branch: 'civil', avatar: '🏗️', streak: 25 },
    { rank: 6, name: 'Sophia Khan', score: 7980, branch: 'cme', avatar: '👩‍🎓', streak: 22 },
    { rank: 7, name: 'Vikram Reddy', score: 7840, branch: 'ece', avatar: '📡', streak: 19 },
    { rank: 8, name: 'Neha Verma', score: 7620, branch: 'eee', avatar: '💡', streak: 16 },
    { rank: 9, name: 'Harsh Patel', score: 7450, branch: 'mechanical', avatar: '🔧', streak: 14 },
    { rank: 10, name: 'Divya Singh', score: 7280, branch: 'civil', avatar: '📐', streak: 11 }
  ],

  userProfile: {
    id: 'user123',
    name: 'John Doe',
    email: 'john@example.com',
    branch: 'ece',
    joinDate: '2023-06-15',
    avatar: '👨‍🎓',
    totalScore: 6540,
    rank: 234,
    streakDays: 12,
    coursesEnrolled: 6,
    coursesCompleted: 2,
    totalStudyHours: 156,
    accuracy: 78.5,
    badges: [
      { name: 'Fast Learner', icon: '⚡' },
      { name: 'Problem Solver', icon: '🧩' },
      { name: '30 Day Streak', icon: '🔥' }
    ]
  },

  questions: [
    {
      id: 1,
      question: 'What is the binary equivalent of decimal 25?',
      options: ['11001', '11010', '10011', '10101'],
      correct: 0,
      category: 'Number Systems'
    },
    {
      id: 2,
      question: 'Which logic gate produces output 1 only when both inputs are 1?',
      options: ['OR', 'AND', 'NOR', 'NAND'],
      correct: 1,
      category: 'Logic Gates'
    },
    {
      id: 3,
      question: 'Simplify A + AB using Boolean algebra:',
      options: ['A', 'B', 'AB', 'A+B'],
      correct: 0,
      category: 'Boolean Algebra'
    }
  ],

  analyticsData: {
    thisWeek: [30, 45, 35, 60, 50, 80, 75],
    totalMinutesStudied: 4560,
    averagePerDay: 65,
    strengths: ['Digital Electronics', 'Boolean Algebra'],
    weaknesses: ['Signal Processing', 'Microcontrollers'],
    testPerformance: 78.5,
    practiceScore: 82.3
  }
};

// Utility functions
function getCoursesByBranch(branchId) {
  return mockData.courses.filter(course => course.branch === branchId);
}

function getTopicsByCourse(courseId) {
  return mockData.topics.filter(topic => topic.courseId === courseId);
}

function getMockTestsByBranch(branchId) {
  return mockData.mockTests.filter(test => test.branch === branchId);
}

function getBranchById(branchId) {
  return mockData.branches.find(branch => branch.id === branchId);
}

function getCourseById(courseId) {
  return mockData.courses.find(course => course.id === courseId);
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = mockData;
}
