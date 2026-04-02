// Centralized mock data for demo mode (when DB is unavailable)

export interface MockLesson {
  id: string;
  moduleId: string;
  title: string;
  content: string;
  videoUrl?: string;
  duration: number | null;
  order: number;
  hasQuiz: boolean;
  quizData?: { questions: Array<{ q: string; options: string[]; correct: number; explanation: string }> };
}

export interface MockModule {
  id: string;
  courseId: string;
  title: string;
  order: number;
  lessons: MockLesson[];
}

export interface MockCourse {
  id: string;
  title: string;
  slug: string;
  description: string;
  longDescription: string | null;
  type: string;
  level: string;
  price: number;
  duration: number;
  tags: string[];
  published: boolean;
  thumbnailUrl: string | null;
  instructorName: string | null;
  instructorBio: string | null;
  modules: MockModule[];
  _count: { enrollments: number };
}

export interface MockEnrollment {
  userId: string;
  courseId: string;
  courseSlug: string;
  progress: number;
  status: string;
}

export interface MockPrototype {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  status: string;
  sandbox: { status: string } | null;
  updatedAt: string;
}

export interface MockCertificate {
  id: string;
  uniqueId: string;
  userId: string;
  courseId: string;
  courseTitle: string;
  recipientName: string;
  issuedAt: string;
  courseType: string;
  courseDuration: number;
}

export const MOCK_USER = {
  id: "user_demo",
  clerkId: "demo_clerk",
  email: "alex.rivera@student.edu",
  name: "Alex Rivera",
  avatarUrl: null,
  role: "STUDENT" as const,
  careerGoal: "Become a machine learning engineer",
  bio: "CS undergrad passionate about AI and building the future",
  company: null,
};

const COURSE_1_MODULES: MockModule[] = [
  {
    id: "mod_1_1",
    courseId: "course_1",
    title: "Mathematical Foundations for ML",
    order: 1,
    lessons: [
      { id: "les_1_1_1", moduleId: "mod_1_1", title: "Linear Algebra Essentials", order: 1, duration: 45, hasQuiz: false, content: "Linear algebra forms the backbone of machine learning. Every dataset can be represented as a matrix, and every transformation we apply during training is fundamentally a matrix operation. In this lesson, we explore vectors, matrices, and tensors as the building blocks of ML systems. A vector is an ordered list of numbers representing a point in space. Matrix multiplication is how we transform these vectors through our model layers. Understanding eigenvalues and eigenvectors is crucial for dimensionality reduction techniques like PCA. We work through concrete examples showing how SVD decomposition helps compress data while retaining important patterns." },
      { id: "les_1_1_2", moduleId: "mod_1_1", title: "Probability and Statistics for ML", order: 2, duration: 50, hasQuiz: false, content: "Probability theory provides the framework for reasoning under uncertainty, the central challenge of machine learning. We cover Bayes theorem, probability distributions, and statistical inference. Every ML model makes probabilistic predictions about unseen data. We start with conditional probability and Bayes theorem, then cover Gaussian distributions, maximum likelihood estimation, and the bias-variance tradeoff." },
      { id: "les_1_1_3", moduleId: "mod_1_1", title: "Calculus and Optimization", order: 3, duration: 40, hasQuiz: false, content: "Optimization is how machine learning models learn. Every training loop minimizes a loss function by adjusting model parameters. This lesson covers gradient descent and its variants — stochastic gradient descent, momentum, Adam, and RMSprop. We implement gradient descent from scratch in Python and visualize the optimization landscape." },
      { id: "les_1_1_4", moduleId: "mod_1_1", title: "Information Theory Basics", order: 4, duration: 35, hasQuiz: true, quizData: { questions: [{ q: "What does entropy measure?", options: ["Speed of computation", "Uncertainty in a random variable", "Network bandwidth", "Memory usage"], correct: 1, explanation: "Entropy quantifies the uncertainty or information content of a random variable." }] }, content: "Information theory, developed by Claude Shannon, is fundamental to modern ML. Entropy measures uncertainty, cross-entropy measures how well one distribution approximates another, and KL divergence measures information lost in approximation." },
    ],
  },
  {
    id: "mod_1_2",
    courseId: "course_1",
    title: "Core Machine Learning Algorithms",
    order: 2,
    lessons: [
      { id: "les_1_2_1", moduleId: "mod_1_2", title: "Supervised Learning: Regression", order: 1, duration: 55, hasQuiz: false, content: "Regression predicts continuous values. We cover linear regression, Ridge and Lasso regularization, polynomial regression, SVR, decision trees, and Random Forests. Evaluation metrics include MSE, RMSE, MAE, and R-squared." },
      { id: "les_1_2_2", moduleId: "mod_1_2", title: "Supervised Learning: Classification", order: 2, duration: 55, hasQuiz: false, content: "Classification assigns discrete labels. We cover logistic regression, SVMs with kernel trick, decision trees, Random Forests, and gradient boosted trees (XGBoost, LightGBM). Evaluation includes precision, recall, F1, ROC, and AUC." },
      { id: "les_1_2_3", moduleId: "mod_1_2", title: "Unsupervised Learning: Clustering", order: 3, duration: 45, hasQuiz: false, content: "Clustering groups similar data points without labels. K-Means, DBSCAN, hierarchical clustering, and Gaussian Mixture Models are covered with applications in customer segmentation and anomaly detection." },
      { id: "les_1_2_4", moduleId: "mod_1_2", title: "Dimensionality Reduction", order: 4, duration: 40, hasQuiz: false, content: "High-dimensional data requires reduction for visualization and modeling. We cover PCA, t-SNE, UMAP, and autoencoders, comparing their strengths for different use cases." },
    ],
  },
  {
    id: "mod_1_3",
    courseId: "course_1",
    title: "Deep Learning and Deployment",
    order: 3,
    lessons: [
      { id: "les_1_3_1", moduleId: "mod_1_3", title: "Neural Network Fundamentals", order: 1, duration: 50, hasQuiz: false, content: "Neural networks consist of layers of interconnected nodes. We cover activation functions (ReLU, sigmoid, tanh), backpropagation, weight initialization (Xavier, He), batch normalization, and dropout regularization." },
      { id: "les_1_3_2", moduleId: "mod_1_3", title: "Convolutional Neural Networks", order: 2, duration: 50, hasQuiz: false, content: "CNNs exploit spatial structure in images using learnable filters. We study LeNet, AlexNet, VGGNet, ResNet, and EfficientNet architectures, plus transfer learning for medical image classification." },
      { id: "les_1_3_3", moduleId: "mod_1_3", title: "Sequence Models and Transformers", order: 3, duration: 55, hasQuiz: false, content: "Sequential data requires models that understand order. RNNs, LSTMs, GRUs, and the Transformer architecture with self-attention are covered. We implement a small Transformer from scratch." },
      { id: "les_1_3_4", moduleId: "mod_1_3", title: "ML Operations and Deployment", order: 4, duration: 45, hasQuiz: false, content: "MLOps covers deploying, monitoring, and maintaining ML systems. We build a FastAPI serving endpoint, use MLflow for versioning, Docker for containerization, and discuss A/B testing and monitoring strategies." },
    ],
  },
];

const COURSE_2_MODULES: MockModule[] = [
  {
    id: "mod_2_1", courseId: "course_2", title: "Python Fundamentals", order: 1,
    lessons: [
      { id: "les_2_1_1", moduleId: "mod_2_1", title: "Getting Started with Python", order: 1, duration: 30, hasQuiz: false, content: "Python is the most popular language for data science. We set up Anaconda, explore Jupyter notebooks, and cover variables, data types, control flow, and functions." },
      { id: "les_2_1_2", moduleId: "mod_2_1", title: "Data Structures and Functions", order: 2, duration: 35, hasQuiz: false, content: "Lists, tuples, sets, dictionaries, comprehensions, lambda functions, map/filter/reduce, error handling, and file I/O for building data processing pipelines." },
      { id: "les_2_1_3", moduleId: "mod_2_1", title: "Object-Oriented Python", order: 3, duration: 35, hasQuiz: false, content: "Classes, inheritance, polymorphism, magic methods, context managers, decorators, and property decorators. We build a Dataset class for data operations." },
    ],
  },
  {
    id: "mod_2_2", courseId: "course_2", title: "Data Analysis Libraries", order: 2,
    lessons: [
      { id: "les_2_2_1", moduleId: "mod_2_2", title: "NumPy for Numerical Computing", order: 1, duration: 40, hasQuiz: false, content: "NumPy ndarray provides fast vectorized operations. Array creation, indexing, broadcasting, ufuncs, aggregation, linear algebra, and random number generation." },
      { id: "les_2_2_2", moduleId: "mod_2_2", title: "Pandas for Data Analysis", order: 2, duration: 45, hasQuiz: false, content: "DataFrame operations: reading data, indexing with loc/iloc, filtering, groupby, merge/join, pivot tables, missing data handling, string methods, and datetime functionality." },
      { id: "les_2_2_3", moduleId: "mod_2_2", title: "Data Visualization with Matplotlib and Seaborn", order: 3, duration: 40, hasQuiz: false, content: "Line charts, scatter plots, bar charts, histograms, box plots, heatmaps, FacetGrid, and building multi-panel dashboards with professional formatting." },
    ],
  },
];

const COURSE_3_MODULES: MockModule[] = [
  {
    id: "mod_3_1", courseId: "course_3", title: "Frontend Foundations", order: 1,
    lessons: [
      { id: "les_3_1_1", moduleId: "mod_3_1", title: "Modern HTML and Semantic Markup", order: 1, duration: 30, hasQuiz: false, content: "HTML5 semantic elements, form elements, responsive images, data attributes, and ARIA for accessibility." },
      { id: "les_3_1_2", moduleId: "mod_3_1", title: "CSS Layout and Responsive Design", order: 2, duration: 40, hasQuiz: false, content: "Box model, Flexbox, CSS Grid, media queries, custom properties, transitions, and animations." },
      { id: "les_3_1_3", moduleId: "mod_3_1", title: "JavaScript Essentials", order: 3, duration: 45, hasQuiz: false, content: "ES6+ features: let/const, template literals, destructuring, spread, arrow functions, promises, async/await, fetch API, array methods, modules, and classes." },
      { id: "les_3_1_4", moduleId: "mod_3_1", title: "TypeScript for Web Development", order: 4, duration: 40, hasQuiz: false, content: "Type annotations, interfaces, generics, utility types, enums, type narrowing, strict mode, and declaration files." },
    ],
  },
  {
    id: "mod_3_2", courseId: "course_3", title: "React Development", order: 2,
    lessons: [
      { id: "les_3_2_1", moduleId: "mod_3_2", title: "React Components and JSX", order: 1, duration: 40, hasQuiz: false, content: "Components, JSX, props, conditional rendering, list rendering, event handling, composition, and styling approaches." },
      { id: "les_3_2_2", moduleId: "mod_3_2", title: "State Management with Hooks", order: 2, duration: 45, hasQuiz: false, content: "useState, useEffect, useContext, useReducer, useMemo, useCallback, useRef, and custom hooks." },
      { id: "les_3_2_3", moduleId: "mod_3_2", title: "Routing and Data Fetching", order: 3, duration: 40, hasQuiz: false, content: "React Router, nested routes, programmatic navigation, SWR/React Query, pagination, and search patterns." },
      { id: "les_3_2_4", moduleId: "mod_3_2", title: "Forms and Validation", order: 4, duration: 35, hasQuiz: false, content: "Controlled components, React Hook Form, Zod validation, complex validation, file uploads, and multi-step forms." },
    ],
  },
  {
    id: "mod_3_3", courseId: "course_3", title: "Backend with Node.js", order: 3,
    lessons: [
      { id: "les_3_3_1", moduleId: "mod_3_3", title: "Node.js and Express Fundamentals", order: 1, duration: 40, hasQuiz: false, content: "Event-driven I/O, Express routing, middleware, request/response handling, and REST API design." },
      { id: "les_3_3_2", moduleId: "mod_3_3", title: "Database Integration with Prisma", order: 2, duration: 45, hasQuiz: false, content: "PostgreSQL, Prisma schema, CRUD operations, relations, transactions, migrations, and seeding." },
      { id: "les_3_3_3", moduleId: "mod_3_3", title: "Authentication and Authorization", order: 3, duration: 45, hasQuiz: false, content: "JWTs, bcrypt hashing, OAuth 2.0, role-based access control, rate limiting, and security best practices." },
      { id: "les_3_3_4", moduleId: "mod_3_3", title: "API Design and Testing", order: 4, duration: 40, hasQuiz: false, content: "REST principles, API versioning, input validation, CORS, unit/integration testing with Supertest." },
    ],
  },
  {
    id: "mod_3_4", courseId: "course_3", title: "Deployment and DevOps", order: 4,
    lessons: [
      { id: "les_3_4_1", moduleId: "mod_3_4", title: "Docker and Containerization", order: 1, duration: 35, hasQuiz: false, content: "Dockerfiles, multi-stage builds, Docker Compose, volumes, networking, and health checks." },
      { id: "les_3_4_2", moduleId: "mod_3_4", title: "CI/CD Pipelines", order: 2, duration: 35, hasQuiz: false, content: "GitHub Actions, matrix strategies, caching, branch protection, deployment strategies, and rollbacks." },
      { id: "les_3_4_3", moduleId: "mod_3_4", title: "Cloud Deployment", order: 3, duration: 40, hasQuiz: false, content: "Vercel for Next.js, AWS (EC2, RDS, S3, CloudFront, Lambda), Serverless Framework, and cost optimization." },
      { id: "les_3_4_4", moduleId: "mod_3_4", title: "Performance and Security", order: 4, duration: 35, hasQuiz: false, content: "Core Web Vitals, code splitting, image optimization, SSR/SSG, caching, HTTPS, CSP, CSRF, and security auditing." },
    ],
  },
];

const COURSE_4_MODULES: MockModule[] = [
  {
    id: "mod_4_1", courseId: "course_4", title: "Product Discovery", order: 1,
    lessons: [
      { id: "les_4_1_1", moduleId: "mod_4_1", title: "Understanding User Problems", order: 1, duration: 30, hasQuiz: false, content: "User interviews, The Mom Test, Jobs-to-be-Done theory, observation, surveys, and writing problem statements." },
      { id: "les_4_1_2", moduleId: "mod_4_1", title: "Market Analysis and Strategy", order: 2, duration: 30, hasQuiz: false, content: "TAM/SAM, competitive analysis, Porter's Five Forces, blue ocean strategy, positioning, and value proposition canvas." },
      { id: "les_4_1_3", moduleId: "mod_4_1", title: "Ideation and Solution Design", order: 3, duration: 25, hasQuiz: false, content: "Design sprints, assumption mapping, prototyping (paper, clickable, Wizard of Oz), and opportunity solution trees." },
      { id: "les_4_1_4", moduleId: "mod_4_1", title: "Product Metrics and Analytics", order: 4, duration: 25, hasQuiz: true, quizData: { questions: [{ q: "What does AARRR stand for?", options: ["Acquisition, Activation, Retention, Revenue, Referral", "Analysis, Action, Response, Results, Review", "Awareness, Adoption, Retention, Revenue, Reach", "Assessment, Alignment, Reporting, Results, ROI"], correct: 0, explanation: "AARRR (Pirate Metrics) stands for Acquisition, Activation, Retention, Revenue, Referral." }] }, content: "Pirate metrics (AARRR), North Star Metrics, cohort analysis, A/B testing, and leading vs lagging indicators." },
    ],
  },
  {
    id: "mod_4_2", courseId: "course_4", title: "Product Delivery", order: 2,
    lessons: [
      { id: "les_4_2_1", moduleId: "mod_4_2", title: "Roadmapping and Prioritization", order: 1, duration: 30, hasQuiz: false, content: "Outcome-based roadmaps, RICE scoring, ICE framework, Kano model, MoSCoW, and stack ranking." },
      { id: "les_4_2_2", moduleId: "mod_4_2", title: "Agile Product Development", order: 2, duration: 30, hasQuiz: false, content: "Scrum ceremonies, user stories, acceptance criteria, story points, velocity, Kanban, burndown charts, and retrospectives." },
      { id: "les_4_2_3", moduleId: "mod_4_2", title: "Stakeholder Management", order: 3, duration: 25, hasQuiz: false, content: "Stakeholder mapping, executive communication, engineering partnerships, managing up, and saying no gracefully." },
      { id: "les_4_2_4", moduleId: "mod_4_2", title: "Launch Strategy and Growth", order: 4, duration: 25, hasQuiz: false, content: "Launch tiers, beta programs, feature flags, product-led growth, viral loops, network effects, and retention optimization." },
      { id: "les_4_2_5", moduleId: "mod_4_2", title: "Product Strategy and Vision", order: 5, duration: 25, hasQuiz: false, content: "Vision, mission, strategy, Wardley Mapping, three horizons model, product principles, and business model design." },
      { id: "les_4_2_6", moduleId: "mod_4_2", title: "Certification Exam Prep", order: 6, duration: 20, hasQuiz: true, quizData: { questions: [{ q: "Which framework uses Reach, Impact, Confidence, Effort?", options: ["MoSCoW", "RICE", "ICE", "Kano"], correct: 1, explanation: "RICE scoring evaluates Reach, Impact, Confidence, and Effort." }] }, content: "Review of all key concepts, frameworks, and scenario-based practice questions." },
    ],
  },
];

const COURSE_5_MODULES: MockModule[] = [
  {
    id: "mod_5_1", courseId: "course_5", title: "Sprint Foundations", order: 1,
    lessons: [
      { id: "les_5_1_1", moduleId: "mod_5_1", title: "What is a Design Sprint?", order: 1, duration: 20, hasQuiz: false, content: "A five-day process for answering critical business questions through design, prototyping, and testing. Invented at Google Ventures, it compresses months of work into a focused week." },
      { id: "les_5_1_2", moduleId: "mod_5_1", title: "Sprint Planning and Preparation", order: 2, duration: 20, hasQuiz: false, content: "Defining the sprint challenge, recruiting test users, setting up the sprint room, gathering research, and creating the sprint brief." },
      { id: "les_5_1_3", moduleId: "mod_5_1", title: "Monday: Map and Target", order: 3, duration: 25, hasQuiz: false, content: "Long-term goal, sprint questions, expert interviews, How Might We notes, customer journey mapping, and choosing the target." },
    ],
  },
  {
    id: "mod_5_2", courseId: "course_5", title: "Sprint Execution", order: 2,
    lessons: [
      { id: "les_5_2_1", moduleId: "mod_5_2", title: "Tuesday & Wednesday: Sketch and Decide", order: 1, duration: 30, hasQuiz: false, content: "Lightning demos, four-step sketching, art museum review, speed critiques, storyboarding, and the Decider's role." },
      { id: "les_5_2_2", moduleId: "mod_5_2", title: "Thursday: Prototype", order: 2, duration: 25, hasQuiz: false, content: "Building a realistic prototype in Figma, the Goldilocks principle, roles (Maker, Collector, Stitcher), and trial runs." },
    ],
  },
];

export const MOCK_COURSES: MockCourse[] = [
  {
    id: "course_1", title: "AI & Machine Learning Fundamentals", slug: "ai-machine-learning-fundamentals",
    description: "Master the foundations of artificial intelligence and machine learning, from neural networks to deployment.",
    longDescription: "This comprehensive diploma covers everything from linear algebra foundations through deep learning architectures to production ML systems.",
    type: "DIPLOMA", level: "ADVANCED", price: 299, duration: 40,
    tags: ["AI", "Machine Learning", "Deep Learning", "Python", "TensorFlow"],
    published: true, thumbnailUrl: null, instructorName: "Dr. Elena Vasquez",
    instructorBio: "Former Google Brain researcher with 15 years in AI/ML.",
    modules: COURSE_1_MODULES, _count: { enrollments: 234 },
  },
  {
    id: "course_2", title: "Python for Data Science", slug: "python-data-science",
    description: "Learn Python programming from scratch with a focus on data analysis, visualization, and scientific computing.",
    longDescription: "Perfect for beginners transitioning into data roles. Covers Python fundamentals, NumPy, Pandas, and Matplotlib.",
    type: "SHORT_COURSE", level: "BEGINNER", price: 79, duration: 8,
    tags: ["Python", "Data Science", "Pandas", "NumPy", "Visualization"],
    published: true, thumbnailUrl: null, instructorName: "Marcus Thompson",
    instructorBio: "Senior Data Scientist at Netflix. Taught Python to 50,000+ students.",
    modules: COURSE_2_MODULES, _count: { enrollments: 1847 },
  },
  {
    id: "course_3", title: "Full-Stack Web Development", slug: "full-stack-web-development",
    description: "Build modern web applications from frontend to backend with React, Node.js, and databases.",
    longDescription: "A comprehensive diploma covering HTML/CSS, JavaScript, TypeScript, React, Node.js, databases, auth, testing, and deployment.",
    type: "DIPLOMA", level: "INTERMEDIATE", price: 349, duration: 60,
    tags: ["JavaScript", "React", "Node.js", "TypeScript", "PostgreSQL"],
    published: true, thumbnailUrl: null, instructorName: "David Kim",
    instructorBio: "Staff Engineer at Vercel, contributor to Next.js.",
    modules: COURSE_3_MODULES, _count: { enrollments: 892 },
  },
  {
    id: "course_4", title: "Product Management Certification", slug: "product-management-certification",
    description: "Master product strategy, user research, roadmapping, and stakeholder management.",
    longDescription: "Designed for aspiring and current product managers. Covers the complete product lifecycle from discovery through delivery.",
    type: "CERTIFICATION", level: "INTERMEDIATE", price: 199, duration: 20,
    tags: ["Product Management", "Strategy", "Agile", "User Research"],
    published: true, thumbnailUrl: null, instructorName: "Lisa Chang",
    instructorBio: "VP of Product at Spotify, previously PM Lead at Airbnb.",
    modules: COURSE_4_MODULES, _count: { enrollments: 567 },
  },
  {
    id: "course_5", title: "UX Design Sprint", slug: "ux-design-sprint",
    description: "Learn the Google Ventures design sprint methodology to rapidly solve design challenges.",
    longDescription: "A hands-on short course teaching design sprints for any product challenge.",
    type: "SHORT_COURSE", level: "BEGINNER", price: 59, duration: 6,
    tags: ["UX Design", "Design Sprint", "Prototyping", "User Research", "Figma"],
    published: true, thumbnailUrl: null, instructorName: "Aisha Patel",
    instructorBio: "Design Director at IDEO, Google Design Sprint certified facilitator.",
    modules: COURSE_5_MODULES, _count: { enrollments: 421 },
  },
];

export const MOCK_ENROLLMENTS: MockEnrollment[] = [
  { userId: "user_demo", courseId: "course_1", courseSlug: "ai-machine-learning-fundamentals", progress: 45, status: "ACTIVE" },
  { userId: "user_demo", courseId: "course_2", courseSlug: "python-data-science", progress: 100, status: "COMPLETED" },
  { userId: "user_demo", courseId: "course_3", courseSlug: "full-stack-web-development", progress: 30, status: "ACTIVE" },
];

export const MOCK_PROTOTYPES: MockPrototype[] = [
  {
    id: "proto_1", title: "SaaS Analytics Dashboard",
    description: "Real-time analytics dashboard for tracking SaaS metrics including MRR, churn, and customer health scores.",
    techStack: ["Next.js", "React", "Node.js", "PostgreSQL"], status: "ACTIVE",
    sandbox: { status: "RUNNING" }, updatedAt: "2026-03-28T10:00:00Z",
  },
  {
    id: "proto_2", title: "Carbon Footprint Tracker API",
    description: "REST API for calculating and tracking organizational carbon emissions across Scope 1, 2, and 3.",
    techStack: ["Python", "Go", "PostgreSQL"], status: "ACTIVE",
    sandbox: { status: "STOPPED" }, updatedAt: "2026-03-25T14:00:00Z",
  },
  {
    id: "proto_3", title: "ML Feature Store",
    description: "Centralized feature store for managing and serving ML features with versioning and lineage tracking.",
    techStack: ["Python", "Go", "React"], status: "PAUSED",
    sandbox: null, updatedAt: "2026-03-20T09:00:00Z",
  },
];

export const MOCK_CERTIFICATES: MockCertificate[] = [
  {
    id: "cert_1", uniqueId: "cert_alex_python", userId: "user_demo", courseId: "course_2",
    courseTitle: "Python for Data Science", recipientName: "Alex Rivera",
    issuedAt: "2026-03-15T00:00:00Z", courseType: "SHORT_COURSE", courseDuration: 8,
  },
];

export const MOCK_ADMIN_STATS = {
  totalUsers: 3961,
  totalCourses: 5,
  activeEnrollments: 2847,
  revenue: 284500,
  monthlyEnrollments: [
    { month: "May", count: 180 }, { month: "Jun", count: 220 }, { month: "Jul", count: 310 },
    { month: "Aug", count: 280 }, { month: "Sep", count: 350 }, { month: "Oct", count: 420 },
    { month: "Nov", count: 380 }, { month: "Dec", count: 290 }, { month: "Jan", count: 450 },
    { month: "Feb", count: 520 }, { month: "Mar", count: 610 }, { month: "Apr", count: 580 },
  ],
  revenueByCoruse: [
    { name: "AI & ML", revenue: 69966 },
    { name: "Python DS", revenue: 145913 },
    { name: "Full-Stack", revenue: 311308 },
    { name: "Product Mgmt", revenue: 112833 },
    { name: "UX Sprint", revenue: 24839 },
  ],
  courseTypeDistribution: [
    { name: "Diploma", value: 2, fill: "oklch(0.7 0.18 280)" },
    { name: "Short Course", value: 2, fill: "oklch(0.7 0.18 230)" },
    { name: "Certification", value: 1, fill: "oklch(0.7 0.18 160)" },
  ],
  recentActivity: [
    { user: "Sarah Chen", action: "Enrolled in AI & ML Fundamentals", time: "2 minutes ago" },
    { user: "Tom Nguyen", action: "Completed Full-Stack Module 3", time: "15 minutes ago" },
    { user: "Maria Gonzalez", action: "Started Python for Data Science", time: "1 hour ago" },
    { user: "Fatima Al-Rashid", action: "Earned PM Certification", time: "3 hours ago" },
    { user: "Liam Park", action: "Created new prototype", time: "5 hours ago" },
  ],
};

// Helper functions
export function getMockCourses(filters?: { type?: string; level?: string; search?: string }): MockCourse[] {
  let courses = MOCK_COURSES;
  if (filters?.type) courses = courses.filter((c) => c.type === filters.type);
  if (filters?.level) courses = courses.filter((c) => c.level === filters.level);
  if (filters?.search) {
    const s = filters.search.toLowerCase();
    courses = courses.filter((c) => c.title.toLowerCase().includes(s) || c.description.toLowerCase().includes(s));
  }
  return courses;
}

export function getMockCourseBySlug(slug: string): MockCourse | undefined {
  return MOCK_COURSES.find((c) => c.slug === slug);
}

export function getMockEnrollments(): Record<string, number> {
  return Object.fromEntries(MOCK_ENROLLMENTS.map((e) => [e.courseId, e.progress]));
}

export function getMockLesson(courseSlug: string, moduleId: string, lessonId: string) {
  const course = getMockCourseBySlug(courseSlug);
  if (!course) return null;
  const mod = course.modules.find((m) => m.id === moduleId);
  if (!mod) return null;
  return mod.lessons.find((l) => l.id === lessonId) ?? null;
}
