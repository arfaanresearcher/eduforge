import { PrismaClient, Role, CourseType, CourseLevel, EnrollmentStatus, PrototypeStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding EduForge database...");

  // --- Users ---
  const admin = await prisma.user.upsert({
    where: { clerkId: "admin_seed" },
    update: {},
    create: {
      clerkId: "admin_seed",
      email: "admin@eduforge.com",
      name: "EduForge Admin",
      role: Role.ADMIN,
      bio: "Platform administrator",
    },
  });

  const companyUsers = await Promise.all([
    prisma.user.upsert({
      where: { clerkId: "company_seed_1" },
      update: {},
      create: {
        clerkId: "company_seed_1",
        email: "sarah.chen@techcorp.com",
        name: "Sarah Chen",
        role: Role.COMPANY,
        company: "TechCorp Solutions",
        bio: "CTO building next-gen SaaS tools",
        careerGoal: "Scale engineering team to 50 developers",
      },
    }),
    prisma.user.upsert({
      where: { clerkId: "company_seed_2" },
      update: {},
      create: {
        clerkId: "company_seed_2",
        email: "james.okafor@greeninnovate.io",
        name: "James Okafor",
        role: Role.COMPANY,
        company: "GreenInnovate",
        bio: "Sustainability tech startup founder",
        careerGoal: "Launch carbon tracking platform by Q3",
      },
    }),
    prisma.user.upsert({
      where: { clerkId: "company_seed_3" },
      update: {},
      create: {
        clerkId: "company_seed_3",
        email: "priya.sharma@dataflow.ai",
        name: "Priya Sharma",
        role: Role.COMPANY,
        company: "DataFlow AI",
        bio: "ML infrastructure architect",
        careerGoal: "Build production-ready ML pipelines",
      },
    }),
  ]);

  const studentUsers = await Promise.all([
    prisma.user.upsert({
      where: { clerkId: "student_seed_1" },
      update: {},
      create: {
        clerkId: "student_seed_1",
        email: "alex.rivera@student.edu",
        name: "Alex Rivera",
        role: Role.STUDENT,
        careerGoal: "Become a machine learning engineer",
        bio: "CS undergrad passionate about AI",
      },
    }),
    prisma.user.upsert({
      where: { clerkId: "student_seed_2" },
      update: {},
      create: {
        clerkId: "student_seed_2",
        email: "maria.gonzalez@learner.com",
        name: "Maria Gonzalez",
        role: Role.STUDENT,
        careerGoal: "Transition from marketing to data science",
        bio: "Marketing professional learning Python and analytics",
      },
    }),
    prisma.user.upsert({
      where: { clerkId: "student_seed_3" },
      update: {},
      create: {
        clerkId: "student_seed_3",
        email: "tom.nguyen@email.com",
        name: "Tom Nguyen",
        role: Role.STUDENT,
        careerGoal: "Build full-stack web applications",
        bio: "Self-taught developer working through web dev fundamentals",
      },
    }),
    prisma.user.upsert({
      where: { clerkId: "student_seed_4" },
      update: {},
      create: {
        clerkId: "student_seed_4",
        email: "fatima.al-rashid@student.ae",
        name: "Fatima Al-Rashid",
        role: Role.STUDENT,
        careerGoal: "Lead product teams at a tech company",
        bio: "Business graduate interested in product management",
      },
    }),
    prisma.user.upsert({
      where: { clerkId: "student_seed_5" },
      update: {},
      create: {
        clerkId: "student_seed_5",
        email: "liam.park@design.studio",
        name: "Liam Park",
        role: Role.STUDENT,
        careerGoal: "Become a UX design lead",
        bio: "Graphic designer expanding into UX/UI",
      },
    }),
  ]);

  // --- Courses ---
  const course1 = await prisma.course.upsert({
    where: { slug: "ai-machine-learning-fundamentals" },
    update: {},
    create: {
      title: "AI & Machine Learning Fundamentals",
      slug: "ai-machine-learning-fundamentals",
      description: "Master the foundations of artificial intelligence and machine learning, from neural networks to deployment.",
      longDescription: "This comprehensive diploma covers everything from linear algebra foundations through deep learning architectures to production ML systems. You will work with real datasets, build models from scratch, and learn to deploy them at scale.",
      type: CourseType.DIPLOMA,
      level: CourseLevel.ADVANCED,
      price: 299,
      duration: 40,
      tags: ["AI", "Machine Learning", "Deep Learning", "Python", "TensorFlow"],
      published: true,
      instructorName: "Dr. Elena Vasquez",
      instructorBio: "Former Google Brain researcher with 15 years in AI/ML. Published 40+ papers on deep learning architectures.",
      modules: {
        create: [
          {
            title: "Mathematical Foundations for ML",
            order: 1,
            lessons: {
              create: [
                {
                  title: "Linear Algebra Essentials",
                  order: 1,
                  duration: 45,
                  content: "Linear algebra forms the backbone of machine learning. Every dataset can be represented as a matrix, and every transformation we apply during training is fundamentally a matrix operation. In this lesson, we explore vectors, matrices, and tensors as the building blocks of ML systems. A vector is an ordered list of numbers representing a point in space. When we talk about feature vectors in ML, we mean a collection of numerical features that describe a single data point. Matrix multiplication is how we transform these vectors through our model layers. Understanding eigenvalues and eigenvectors is crucial for dimensionality reduction techniques like PCA. We will work through concrete examples showing how SVD decomposition helps us compress data while retaining the most important patterns. By the end of this lesson, you will be comfortable manipulating matrices and understanding their geometric interpretations in the context of data transformations.",
                },
                {
                  title: "Probability and Statistics for ML",
                  order: 2,
                  duration: 50,
                  content: "Probability theory provides the framework for reasoning under uncertainty, which is the central challenge of machine learning. In this lesson, we cover Bayes theorem, probability distributions, and statistical inference as they apply to building predictive models. Every ML model is essentially making probabilistic predictions about unseen data based on patterns learned from training data. We start with conditional probability and Bayes theorem, showing how prior beliefs are updated with new evidence. Gaussian distributions appear everywhere in ML, from the central limit theorem that justifies many of our assumptions to the noise models in regression. We cover maximum likelihood estimation, which is the foundation of how most models learn their parameters. Understanding the bias-variance tradeoff requires solid statistical intuition about sampling variability. We conclude with hypothesis testing concepts that help us evaluate whether our models are genuinely learning patterns or just memorizing noise in the training data.",
                },
                {
                  title: "Calculus and Optimization",
                  order: 3,
                  duration: 40,
                  content: "Optimization is how machine learning models learn. Every training loop is an optimization problem where we minimize a loss function by adjusting model parameters. This lesson covers the calculus concepts essential for understanding gradient descent and its variants. We begin with partial derivatives and the gradient, which tells us the direction of steepest ascent for any multivariable function. The chain rule is particularly important because it enables backpropagation, the algorithm that trains neural networks. We work through gradient descent step by step, showing how learning rate affects convergence. Stochastic gradient descent introduces randomness that helps escape local minima and scales to massive datasets. We explore momentum-based methods like Adam and RMSprop that adaptively adjust learning rates per parameter. Understanding convexity helps us know when we can guarantee finding the global optimum versus settling for a good local solution. Practical exercises include implementing gradient descent from scratch in Python and visualizing the optimization landscape for simple models.",
                },
                {
                  title: "Information Theory Basics",
                  order: 4,
                  duration: 35,
                  content: "Information theory, originally developed by Claude Shannon for communication systems, has become fundamental to modern machine learning. Entropy measures the uncertainty or information content of a random variable. Cross-entropy loss, the most common classification loss function, comes directly from information theory. In this lesson, we build intuition for entropy, mutual information, and KL divergence. Entropy quantifies how surprised we should be by outcomes from a distribution. Low entropy means predictable outcomes while high entropy means maximum uncertainty. Cross-entropy between two distributions measures how well one distribution approximates another, which is exactly what we want when training a classifier. KL divergence measures the information lost when we approximate one distribution with another, making it central to variational methods and generative models. Mutual information tells us how much knowing one variable reduces uncertainty about another, which is valuable for feature selection. We connect these concepts to practical applications including decision tree splitting criteria, variational autoencoders, and the information bottleneck theory of deep learning.",
                },
              ],
            },
          },
          {
            title: "Core Machine Learning Algorithms",
            order: 2,
            lessons: {
              create: [
                {
                  title: "Supervised Learning: Regression",
                  order: 1,
                  duration: 55,
                  content: "Supervised learning with continuous targets is regression. We start with linear regression, the simplest yet most interpretable model, and build toward more powerful nonlinear methods. Linear regression fits a hyperplane to data by minimizing squared residuals. We derive the closed-form solution using the normal equation and compare it to gradient descent for large datasets. Regularization through Ridge (L2) and Lasso (L1) regression prevents overfitting by penalizing large coefficients. Lasso has the special property of producing sparse solutions, effectively performing feature selection. We then cover polynomial regression, which extends linear regression to capture nonlinear relationships by transforming features. Support Vector Regression uses the kernel trick to fit complex functions while maintaining good generalization through the margin concept. Decision tree regression and Random Forests provide highly flexible nonlinear modeling with built-in feature importance. We evaluate regression models using MSE, RMSE, MAE, and R-squared, discussing when each metric is most appropriate. Cross-validation ensures our evaluation reflects true generalization rather than overfitting to a particular train-test split.",
                },
                {
                  title: "Supervised Learning: Classification",
                  order: 2,
                  duration: 55,
                  content: "Classification assigns discrete labels to data points. Logistic regression, despite its name, is the foundational classification algorithm. It models the probability of class membership using the sigmoid function applied to a linear combination of features. We extend this to multiclass settings using softmax regression. Support Vector Machines find the maximum-margin hyperplane that separates classes, providing strong generalization guarantees. The kernel trick allows SVMs to handle nonlinear decision boundaries by implicitly mapping data to higher dimensions. Decision trees recursively partition the feature space using information gain or Gini impurity criteria. Random Forests aggregate many decorrelated trees through bagging, dramatically reducing variance. Gradient Boosted Trees like XGBoost and LightGBM build trees sequentially, each correcting the errors of the ensemble so far, and consistently win tabular data competitions. We cover evaluation metrics beyond accuracy including precision, recall, F1-score, ROC curves, and AUC, explaining when each matters. Imbalanced classification requires special techniques like SMOTE oversampling, class weighting, and threshold tuning that we explore with real-world fraud detection data.",
                },
                {
                  title: "Unsupervised Learning: Clustering",
                  order: 3,
                  duration: 45,
                  content: "Unsupervised learning discovers hidden structure in data without labels. Clustering groups similar data points together based on distance or density metrics. K-Means is the workhorse clustering algorithm. It iteratively assigns points to the nearest centroid and updates centroids to cluster means until convergence. Choosing K requires techniques like the elbow method and silhouette analysis. K-Means assumes spherical clusters of similar size, which limits its applicability. DBSCAN overcomes this by finding clusters of arbitrary shape based on density. Points in dense regions form clusters while sparse regions become boundaries. It automatically determines the number of clusters and identifies outliers. Hierarchical clustering builds a tree of nested clusters through agglomerative (bottom-up) or divisive (top-down) approaches. The dendrogram visualization helps us choose the right number of clusters. Gaussian Mixture Models generalize K-Means by modeling each cluster as a Gaussian distribution, allowing soft assignments and handling elliptical clusters. We apply these methods to customer segmentation, image compression, and anomaly detection scenarios, evaluating results using internal metrics since we lack ground truth labels.",
                },
                {
                  title: "Dimensionality Reduction",
                  order: 4,
                  duration: 40,
                  content: "High-dimensional data is challenging to visualize, store, and model effectively. Dimensionality reduction projects data to lower dimensions while preserving important structure. Principal Component Analysis finds orthogonal directions of maximum variance in the data. The first principal component captures the most variance, the second captures the most remaining variance orthogonal to the first, and so on. PCA is a linear method that works well when the important variation lies along linear subspaces. We implement PCA through eigendecomposition of the covariance matrix and connect it to SVD. T-SNE is a nonlinear technique specifically designed for visualization. It preserves local neighborhood structure, making it excellent for revealing clusters in two or three dimensions. However, t-SNE is stochastic and not suitable for downstream modeling. UMAP offers similar nonlinear visualization capability with better preservation of global structure and much faster computation. Autoencoders use neural networks to learn compressed representations by training an encoder-decoder pair to reconstruct input data through a bottleneck layer. We compare these methods on image and text datasets, discussing computational costs, interpretability, and when to choose each approach.",
                },
              ],
            },
          },
          {
            title: "Deep Learning and Deployment",
            order: 3,
            lessons: {
              create: [
                {
                  title: "Neural Network Fundamentals",
                  order: 1,
                  duration: 50,
                  content: "Neural networks are the foundation of deep learning. A neural network consists of layers of interconnected nodes (neurons) where each connection has a learnable weight. The input layer receives feature values, hidden layers transform the data through weighted sums and nonlinear activation functions, and the output layer produces predictions. Activation functions like ReLU, sigmoid, and tanh introduce nonlinearity that allows networks to learn complex patterns. Without nonlinearity, stacking layers would just produce another linear transformation. Backpropagation uses the chain rule to compute gradients of the loss with respect to every weight in the network. These gradients then drive gradient descent to update weights. Weight initialization matters enormously. Xavier and He initialization prevent the vanishing and exploding gradient problems that plagued early deep networks. Batch normalization stabilizes training by normalizing activations within each layer. Dropout randomly zeroes neurons during training, acting as an effective regularizer. We build a feedforward network from scratch in NumPy, then reimplement it in PyTorch to appreciate how frameworks automate gradient computation and GPU acceleration.",
                },
                {
                  title: "Convolutional Neural Networks",
                  order: 2,
                  duration: 50,
                  content: "Convolutional Neural Networks revolutionized computer vision by exploiting the spatial structure of images. Instead of fully connecting every pixel to every neuron, CNNs use small learnable filters that slide across the image, detecting local patterns like edges, textures, and shapes. A convolutional layer applies multiple filters to produce feature maps. Each filter learns to detect a specific pattern regardless of where it appears in the image, providing translation invariance. Pooling layers downsample feature maps to reduce spatial dimensions and computational cost while retaining the most important information. Max pooling takes the maximum value in each local region. Modern architectures stack many convolutional layers to learn hierarchical features. Early layers detect simple edges, middle layers combine edges into textures and parts, and deep layers recognize complex objects. We study landmark architectures including LeNet, AlexNet, VGGNet, ResNet, and EfficientNet. ResNets introduced skip connections that allow training networks with hundreds of layers by solving the degradation problem. Transfer learning leverages pretrained CNN features for new tasks with limited data. We fine-tune ImageNet-pretrained models for medical image classification, demonstrating how transfer learning dramatically reduces data requirements.",
                },
                {
                  title: "Sequence Models and Transformers",
                  order: 3,
                  duration: 55,
                  content: "Sequential data like text, audio, and time series requires models that understand order and context. Recurrent Neural Networks process sequences one element at a time, maintaining a hidden state that captures information from previous steps. However, vanilla RNNs struggle with long-range dependencies due to vanishing gradients. LSTMs add gating mechanisms that control information flow, allowing the network to selectively remember and forget, making them effective for longer sequences. GRUs simplify the LSTM architecture while maintaining similar performance. The Transformer architecture revolutionized sequence modeling by replacing recurrence with self-attention. Self-attention computes relevance scores between all pairs of positions in a sequence, allowing direct modeling of long-range dependencies. Multi-head attention runs multiple attention operations in parallel, each learning different types of relationships. Positional encodings inject sequence order information since attention is inherently order-invariant. The encoder-decoder Transformer architecture powers machine translation while decoder-only variants power large language models. We implement a small Transformer from scratch, train it on a text dataset, and discuss the scaling laws that drive modern LLM development. Practical applications include sentiment analysis, named entity recognition, and text generation.",
                },
                {
                  title: "ML Operations and Deployment",
                  order: 4,
                  duration: 45,
                  content: "Building a model is only half the battle. MLOps covers the practices and tools for deploying, monitoring, and maintaining ML systems in production. We start with model serialization using formats like ONNX and TorchScript that decouple models from their training frameworks. Containerization with Docker packages models with their dependencies for reproducible deployment. We build a REST API using FastAPI that serves predictions with proper input validation, error handling, and logging. Model versioning with tools like MLflow tracks experiments, parameters, metrics, and artifacts so you can reproduce any result. Feature stores ensure consistency between training and serving feature pipelines. A/B testing and canary deployments allow safe rollout of new models to production traffic. Model monitoring tracks prediction distribution shift, latency, and accuracy degradation over time. When data drift is detected, automated retraining pipelines can refresh models with recent data. We cover CI/CD for ML including automated testing of data quality, model performance, and API contracts. Infrastructure options range from serverless functions for low-traffic endpoints to Kubernetes-orchestrated GPU clusters for high-throughput serving. Cost optimization balances model accuracy against inference latency and compute costs for different deployment scenarios.",
                },
              ],
            },
          },
        ],
      },
    },
  });

  const course2 = await prisma.course.upsert({
    where: { slug: "python-data-science" },
    update: {},
    create: {
      title: "Python for Data Science",
      slug: "python-data-science",
      description: "Learn Python programming from scratch with a focus on data analysis, visualization, and scientific computing.",
      longDescription: "Perfect for beginners transitioning into data roles. Covers Python fundamentals, NumPy, Pandas, Matplotlib, and introductory statistics through hands-on projects.",
      type: CourseType.SHORT_COURSE,
      level: CourseLevel.BEGINNER,
      price: 79,
      duration: 8,
      tags: ["Python", "Data Science", "Pandas", "NumPy", "Visualization"],
      published: true,
      instructorName: "Marcus Thompson",
      instructorBio: "Senior Data Scientist at Netflix. Taught Python to 50,000+ students online.",
      modules: {
        create: [
          {
            title: "Python Fundamentals",
            order: 1,
            lessons: {
              create: [
                {
                  title: "Getting Started with Python",
                  order: 1,
                  duration: 30,
                  content: "Python is the most popular language for data science because of its readability, vast ecosystem, and gentle learning curve. In this lesson, we set up your development environment and write your first Python programs. We install Python via Anaconda, which bundles the most common data science libraries. Jupyter notebooks provide an interactive environment where you can mix code, visualizations, and text. Variables in Python are dynamically typed, meaning you do not need to declare types. We cover the basic data types including integers, floats, strings, and booleans. String formatting with f-strings makes it easy to build readable output. Lists are ordered, mutable collections that you will use constantly. Dictionaries map keys to values and are the foundation for working with structured data. Control flow with if/elif/else statements and for/while loops lets you build logic. Functions encapsulate reusable logic with parameters and return values. We practice with exercises that process simple datasets, calculate statistics, and format reports.",
                },
                {
                  title: "Data Structures and Functions",
                  order: 2,
                  duration: 35,
                  content: "Effective data science requires mastery of Python data structures. Lists support slicing, comprehensions, and built-in methods like sort, append, and extend. List comprehensions provide a concise way to transform and filter data in a single expression. Tuples are immutable sequences useful for fixed collections and as dictionary keys. Sets provide fast membership testing and set operations like union, intersection, and difference. Dictionaries are the workhorse data structure, and dictionary comprehensions make them easy to construct programmatically. We cover nested data structures, which mirror the JSON format common in APIs and data files. Functions are first-class objects in Python. We write functions with default arguments, keyword arguments, and variable-length argument lists. Lambda functions provide inline function definitions for simple operations. The map, filter, and reduce functions enable functional programming patterns. Error handling with try/except blocks makes your code robust against unexpected inputs. File I/O lets you read CSV files, JSON data, and text files. We build a complete data processing pipeline that reads a CSV file, cleans the data, computes summary statistics, and writes results to a new file.",
                },
                {
                  title: "Object-Oriented Python",
                  order: 3,
                  duration: 35,
                  content: "Object-oriented programming organizes code around objects that combine data and behavior. Classes define blueprints for objects with attributes storing state and methods defining behavior. The __init__ method initializes new instances with their starting state. We build a DataRecord class that represents a row of data with methods for validation and transformation. Inheritance lets you create specialized versions of existing classes, reducing code duplication. Polymorphism allows different classes to respond to the same method calls in their own way. Magic methods like __str__, __repr__, __len__, and __eq__ let your objects work naturally with Python built-in functions and operators. Context managers with __enter__ and __exit__ ensure resources like files are properly cleaned up. Decorators modify function behavior without changing their source code, useful for logging, timing, and caching. Property decorators let you define computed attributes with getter and setter methods. We apply OOP to build a Dataset class that wraps a list of records with methods for filtering, grouping, aggregating, and exporting. This exercise demonstrates how well-designed classes make complex data operations readable and maintainable.",
                },
              ],
            },
          },
          {
            title: "Data Analysis Libraries",
            order: 2,
            lessons: {
              create: [
                {
                  title: "NumPy for Numerical Computing",
                  order: 1,
                  duration: 40,
                  content: "NumPy is the foundation of the Python data science stack. Its ndarray provides fast, memory-efficient multi-dimensional arrays with vectorized operations that avoid slow Python loops. Creating arrays from lists, using arange, linspace, zeros, ones, and random generation functions gives you flexible initialization options. Array indexing and slicing extends Python list syntax to multiple dimensions. Boolean indexing selects elements matching a condition, enabling expressive data filtering. Broadcasting automatically aligns arrays of different shapes for element-wise operations, eliminating the need for explicit loops. We cover essential operations including reshaping, transposing, concatenating, and splitting arrays. Universal functions (ufuncs) like add, multiply, sin, and exp operate element-wise at C speed. Aggregation functions including sum, mean, std, min, max, and argmax reduce arrays along specified axes. Linear algebra operations including dot products, matrix multiplication, eigendecomposition, and solving linear systems use np.linalg. Random number generation with np.random supports simulations and statistical sampling. We benchmark NumPy against pure Python loops to demonstrate the dramatic speed improvement, and work through a complete example computing portfolio statistics from stock return data.",
                },
                {
                  title: "Pandas for Data Analysis",
                  order: 2,
                  duration: 45,
                  content: "Pandas provides the DataFrame, the central data structure for tabular data analysis in Python. A DataFrame is a two-dimensional labeled data structure with columns of potentially different types, like a spreadsheet or SQL table in Python. Reading data from CSV, Excel, JSON, and SQL databases is straightforward with pd.read_csv and related functions. The Series is a one-dimensional labeled array representing a single column. Indexing with loc for label-based and iloc for position-based access gives you precise control over data selection. Boolean filtering with conditions like df[df['price'] > 100] selects rows matching criteria. The groupby method splits data into groups, applies functions, and combines results, replicating SQL GROUP BY functionality. Aggregation with agg allows multiple functions per column. Merge and join operations combine DataFrames like SQL joins with inner, outer, left, and right options. Pivot tables reshape data for cross-tabulation analysis. Handling missing data with fillna, dropna, and interpolation methods is essential for real-world datasets. String methods accessed through .str provide vectorized text processing. DateTime functionality parses dates and enables time-based filtering, resampling, and rolling window calculations. We analyze a real e-commerce dataset to answer business questions about customer behavior, revenue trends, and product performance.",
                },
                {
                  title: "Data Visualization with Matplotlib and Seaborn",
                  order: 3,
                  duration: 40,
                  content: "Visualization transforms raw numbers into insights. Matplotlib is Python's foundational plotting library, offering complete control over every visual element. We start with the pyplot interface for quick plots including line charts, scatter plots, bar charts, histograms, and box plots. Customizing titles, labels, colors, markers, and legends makes charts publication-ready. Subplots arrange multiple charts in grid layouts for comparison. The object-oriented API with Figure and Axes objects provides finer control for complex layouts. Seaborn builds on Matplotlib with a higher-level interface optimized for statistical visualization. Distribution plots including histplot, kdeplot, and ecdfplot reveal data shape and spread. Categorical plots including boxplot, violinplot, swarmplot, and countplot compare distributions across groups. Relational plots including scatterplot, lineplot, and relplot show relationships between variables. Heatmaps visualize correlation matrices and pivot tables with color-coded values. The FacetGrid creates small multiples that show the same relationship across subsets of data. We follow visualization best practices including choosing appropriate chart types, using color effectively, avoiding chartjunk, and telling a clear data story. The capstone exercise creates a multi-panel dashboard analyzing global climate data with professional formatting and annotations.",
                },
              ],
            },
          },
        ],
      },
    },
  });

  const course3 = await prisma.course.upsert({
    where: { slug: "full-stack-web-development" },
    update: {},
    create: {
      title: "Full-Stack Web Development",
      slug: "full-stack-web-development",
      description: "Build modern web applications from frontend to backend with React, Node.js, and databases.",
      longDescription: "A comprehensive diploma covering HTML/CSS, JavaScript, TypeScript, React, Node.js, databases, authentication, testing, and deployment. Build multiple real-world projects throughout the course.",
      type: CourseType.DIPLOMA,
      level: CourseLevel.INTERMEDIATE,
      price: 349,
      duration: 60,
      tags: ["JavaScript", "React", "Node.js", "TypeScript", "PostgreSQL", "Web Development"],
      published: true,
      instructorName: "David Kim",
      instructorBio: "Staff Engineer at Vercel, contributor to Next.js. 12 years building web applications at scale.",
      modules: {
        create: [
          {
            title: "Frontend Foundations",
            order: 1,
            lessons: {
              create: [
                {
                  title: "Modern HTML and Semantic Markup",
                  order: 1,
                  duration: 30,
                  content: "HTML is the structural foundation of every web page. Modern HTML5 introduced semantic elements that convey meaning about the content they contain, improving accessibility and SEO. The header element wraps introductory content or navigation, while main contains the central content unique to the page. The nav element groups navigation links, article represents self-contained content, and section groups thematically related content. The aside element marks tangential content like sidebars. Form elements have expanded significantly with new input types including email, url, tel, date, range, and color that provide built-in validation and appropriate mobile keyboards. The details and summary elements create native disclosure widgets without JavaScript. The picture element and srcset attribute enable responsive images that adapt to screen size and resolution. Data attributes store custom metadata on elements for JavaScript access. ARIA attributes enhance accessibility when semantic HTML alone is insufficient, providing screen readers with the context they need. We build a complete multi-page website structure using semantic markup, forms with validation, and accessible navigation patterns.",
                },
                {
                  title: "CSS Layout and Responsive Design",
                  order: 2,
                  duration: 40,
                  content: "CSS controls the visual presentation of web pages. The box model defines how elements occupy space with content, padding, border, and margin. Box-sizing border-box simplifies layout by including padding and border in element dimensions. Flexbox provides one-dimensional layout with powerful alignment and distribution capabilities. Setting display flex on a container gives you control over direction, wrapping, justification, and alignment of child elements. The flex shorthand property controls how items grow, shrink, and their base size. CSS Grid provides two-dimensional layout for complex page structures. Grid-template-columns and grid-template-rows define the track structure, while grid-area places items precisely. The fr unit distributes available space proportionally. Auto-fill and auto-fit with minmax create responsive grids without media queries. Media queries adapt layouts to different viewport sizes, forming the basis of responsive design. Mobile-first design starts with the smallest screen and adds complexity for larger viewports. CSS custom properties enable dynamic theming and reduce repetition. Transitions and animations add polish with GPU-accelerated transforms. We build a responsive portfolio layout that adapts seamlessly from mobile through tablet to desktop using modern CSS techniques.",
                },
                {
                  title: "JavaScript Essentials",
                  order: 3,
                  duration: 45,
                  content: "JavaScript is the programming language of the web, running in every browser and on servers via Node.js. Modern JavaScript uses let and const for block-scoped variable declarations. Template literals with backtick syntax enable string interpolation and multi-line strings. Destructuring extracts values from arrays and objects into named variables concisely. The spread operator copies and merges arrays and objects. Arrow functions provide compact syntax and lexically bind the this keyword, solving a major source of bugs. Promises represent the eventual result of asynchronous operations, replacing callback-based patterns. Async/await syntax makes asynchronous code read like synchronous code while maintaining non-blocking behavior. The fetch API makes HTTP requests from the browser, returning promises that resolve to Response objects. Array methods including map, filter, reduce, find, some, and every enable functional data transformation without mutating the original array. Modules with import and export organize code into reusable pieces. Classes provide a cleaner syntax for object-oriented patterns with constructors, methods, getters, setters, and inheritance via extends. Error handling with try/catch/finally ensures graceful failure. The event loop model explains how JavaScript handles concurrency with a single thread, and understanding it prevents common bugs in asynchronous code.",
                },
                {
                  title: "TypeScript for Web Development",
                  order: 4,
                  duration: 40,
                  content: "TypeScript adds static typing to JavaScript, catching errors at compile time rather than runtime. Type annotations declare the expected types of variables, function parameters, and return values. Basic types include string, number, boolean, null, undefined, and any. Arrays are typed as string[] or Array<string>. Union types with the pipe operator allow a value to be one of several types. Interfaces define the shape of objects, specifying required and optional properties. Type aliases create reusable type definitions for complex structures. Generics parameterize types, letting you write functions and classes that work with any type while maintaining type safety. The Record, Partial, Required, Pick, and Omit utility types transform existing types into new shapes. Enums define a set of named constants for improved readability. Type narrowing with typeof, instanceof, and discriminated unions helps TypeScript understand which specific type you are working with in conditional branches. Strict mode enables all strict type checking options for maximum safety. Declaration files with the .d.ts extension provide type information for JavaScript libraries. We convert a JavaScript project to TypeScript incrementally, demonstrating the practical benefits of type safety for catching bugs, improving IDE autocompletion, and serving as living documentation.",
                },
              ],
            },
          },
          {
            title: "React Development",
            order: 2,
            lessons: {
              create: [
                {
                  title: "React Components and JSX",
                  order: 1,
                  duration: 40,
                  content: "React is a JavaScript library for building user interfaces through composable components. A component is a function that returns JSX, a syntax extension that looks like HTML but compiles to JavaScript function calls. Components receive data through props, which are read-only and flow from parent to child. JSX expressions use curly braces to embed JavaScript values, enabling dynamic rendering. Conditional rendering uses ternary operators, logical AND, or early returns to show different content based on state. List rendering uses array map to transform data arrays into JSX elements, requiring a unique key prop for efficient updates. Fragment syntax with empty angle brackets groups multiple elements without adding extra DOM nodes. Event handling attaches functions to JSX elements via props like onClick and onChange. Component composition builds complex UIs from simple pieces, with children prop enabling wrapper components. Style approaches include CSS modules for scoped class names, inline styles with JavaScript objects, and utility-first CSS with Tailwind. We build a complete task management interface with components for task lists, task items, filters, and a creation form, demonstrating how to decompose a UI into a reusable component hierarchy.",
                },
                {
                  title: "State Management with Hooks",
                  order: 2,
                  duration: 45,
                  content: "Hooks let function components manage state and side effects. useState returns a state value and setter function, triggering re-renders when the state changes. State updates can be direct values or updater functions when the new state depends on the previous state. useEffect runs side effects after render, handling data fetching, subscriptions, and DOM manipulation. The dependency array controls when effects re-run: empty array means mount only, specific values mean re-run when they change. Cleanup functions returned from useEffect prevent memory leaks by running before the next effect or on unmount. useContext consumes values from a React context, enabling data sharing without prop drilling through intermediate components. useReducer manages complex state logic with actions and a reducer function, similar to Redux patterns. useMemo caches expensive computations between renders when dependencies have not changed. useCallback caches function references to prevent unnecessary re-renders of child components that receive callbacks as props. useRef provides a mutable reference that persists across renders without causing re-renders, useful for DOM access and storing previous values. Custom hooks extract reusable stateful logic into functions prefixed with use, promoting code reuse across components. We build custom hooks for data fetching, form handling, local storage persistence, and debounced search, demonstrating how hooks compose together elegantly.",
                },
                {
                  title: "Routing and Data Fetching",
                  order: 3,
                  duration: 40,
                  content: "Single-page applications need client-side routing to navigate between views without full page reloads. React Router provides declarative routing with Route components that render based on the current URL path. The BrowserRouter wraps your application to enable routing. Route definitions map URL patterns to components, with path parameters using colon syntax for dynamic segments. The Link component navigates without page reloads, and NavLink adds active state styling. Nested routes with Outlet render child routes within parent layouts, enabling shared navigation and sidebars. Programmatic navigation with useNavigate redirects after form submissions or authentication. Data fetching in React typically happens in useEffect hooks on mount. Loading and error states provide feedback while requests are in progress. SWR and React Query libraries add caching, revalidation, optimistic updates, and request deduplication on top of basic fetching. Server state differs from client state and benefits from specialized management. Pagination, infinite scroll, and search-as-you-type patterns handle large datasets. We build a multi-page application with authentication-protected routes, dynamic product detail pages, and a search interface with debounced queries and cached results.",
                },
                {
                  title: "Forms and Validation",
                  order: 4,
                  duration: 35,
                  content: "Forms are the primary way users input data in web applications. Controlled components synchronize form element values with React state, giving you full control over the input behavior. The onChange handler updates state on every keystroke, and the value prop reflects state back to the input. Select elements, checkboxes, radio buttons, and textareas each have slightly different controlled patterns. Form submission intercepts the default browser behavior with preventDefault and processes the data in JavaScript. React Hook Form reduces boilerplate by managing form state internally, only re-rendering changed fields. The register function connects inputs to the form, and handleSubmit validates before calling your submission function. Zod schema validation defines type-safe validation rules that generate TypeScript types automatically. Integrating Zod with React Hook Form via the zodResolver provides declarative validation with automatic error messages. Complex validation including cross-field validation, async validation for username availability, and conditional fields are straightforward with schema composition. File upload handling reads files with FileReader or uploads them directly via FormData. We build a complete multi-step registration form with real-time validation feedback, file upload for profile pictures, and submission to an API endpoint with error handling.",
                },
              ],
            },
          },
          {
            title: "Backend with Node.js",
            order: 3,
            lessons: {
              create: [
                {
                  title: "Node.js and Express Fundamentals",
                  order: 1,
                  duration: 40,
                  content: "Node.js runs JavaScript on the server, enabling full-stack development with a single language. The event-driven, non-blocking I/O model handles thousands of concurrent connections efficiently. Express is the most popular Node.js web framework, providing routing, middleware, and request/response utilities. Creating an Express application starts with initializing an app instance and defining route handlers for different HTTP methods and paths. Middleware functions process requests before they reach route handlers, enabling logging, authentication, CORS, body parsing, and error handling. The middleware chain calls next to pass control to the next function. Route parameters extract values from URL segments, and query parameters from the URL search string. Request body parsing with express.json middleware handles JSON payloads from API clients. Response methods including json, send, status, and redirect control what the client receives. Router objects group related routes into modular files. Environment variables with dotenv keep sensitive configuration out of source code. Error handling middleware with four parameters catches errors from route handlers and sends appropriate responses. We build a REST API for a bookstore with CRUD endpoints, input validation, error handling, and organized route modules.",
                },
                {
                  title: "Database Integration with Prisma",
                  order: 2,
                  duration: 45,
                  content: "Databases persist application data beyond server restarts. PostgreSQL is a powerful open-source relational database with strong data integrity guarantees. Prisma provides a type-safe database client generated from your schema definition. The schema.prisma file defines your data models with fields, types, relations, and constraints. Running prisma generate creates the TypeScript client with full autocompletion for every model and operation. CRUD operations use intuitive methods: create, findUnique, findMany, update, delete, and upsert. Where clauses filter records with conditions including equals, contains, startsWith, gt, lt, and combined with AND/OR/NOT. Relations are queried with include to load related records or select to pick specific fields. Transactions ensure multiple operations succeed or fail together with prisma.$transaction. Migrations track schema changes over time, generating SQL that can be applied to any environment reproducibly. Seeding populates the database with initial data for development and testing. Pagination with skip and take efficiently handles large result sets. Aggregation operations including count, sum, avg, min, and max compute statistics. Raw SQL queries handle complex cases that the query builder cannot express. We design and implement a database schema for an e-commerce application with users, products, orders, and reviews, including complex queries for analytics dashboards.",
                },
                {
                  title: "Authentication and Authorization",
                  order: 3,
                  duration: 45,
                  content: "Authentication verifies who a user is, while authorization determines what they can access. JSON Web Tokens encode user claims into a signed string that the server can verify without database lookups. JWTs contain three parts: a header specifying the algorithm, a payload with claims like user ID and expiration, and a signature preventing tampering. The server creates tokens on login and the client sends them in the Authorization header on subsequent requests. Middleware extracts and verifies the token, attaching user data to the request object. Refresh tokens with longer expiration allow obtaining new access tokens without re-authenticating. Password hashing with bcrypt applies a one-way function with salt, storing only the hash in the database so plaintext passwords are never persisted. OAuth 2.0 delegates authentication to providers like Google, GitHub, and Apple, reducing friction and security responsibility. The authorization code flow redirects users to the provider, which redirects back with a code exchanged for tokens. Role-based access control assigns roles to users and checks permissions in middleware. Resource-level authorization ensures users can only access their own data. Rate limiting prevents brute-force attacks by restricting the number of requests per IP or user. We implement a complete authentication system with registration, login, JWT tokens, refresh rotation, role-based middleware, and password reset via email.",
                },
                {
                  title: "API Design and Testing",
                  order: 4,
                  duration: 40,
                  content: "Well-designed APIs are intuitive, consistent, and maintainable. REST principles organize endpoints around resources with standard HTTP methods: GET for reading, POST for creating, PUT/PATCH for updating, and DELETE for removing. URL structure uses plural nouns for collections and IDs for specific resources. Consistent response formats include status codes, data payloads, and error objects with codes and messages. API versioning through URL prefixes or headers enables backward-compatible evolution. Input validation rejects malformed requests before they reach business logic, with clear error messages identifying which fields are invalid. Pagination, filtering, sorting, and field selection handle large datasets efficiently. CORS headers control which domains can access your API from browsers. Testing ensures your API works correctly across all scenarios. Unit tests verify individual functions in isolation using mocking to replace external dependencies. Integration tests verify that components work together correctly, testing route handlers with a real or test database. Supertest makes HTTP assertions against Express applications without starting a server. Test fixtures create reproducible data states for consistent test results. Code coverage measures which lines execute during tests, revealing untested paths. We write a comprehensive test suite for our bookstore API covering success cases, validation errors, authentication requirements, and edge cases like concurrent modifications.",
                },
              ],
            },
          },
          {
            title: "Deployment and DevOps",
            order: 4,
            lessons: {
              create: [
                {
                  title: "Docker and Containerization",
                  order: 1,
                  duration: 35,
                  content: "Docker packages applications with their dependencies into portable containers that run identically everywhere. A Dockerfile defines the steps to build an image: choosing a base image, copying source code, installing dependencies, and specifying the startup command. Multi-stage builds separate the build environment from the runtime image, producing smaller final images. The .dockerignore file excludes unnecessary files from the build context, speeding up builds and reducing image size. Docker Compose orchestrates multiple containers for local development, defining services, networks, and volumes in a YAML file. A typical web application compose file includes the application server, database, Redis cache, and reverse proxy. Volume mounts persist data between container restarts and enable live code reloading during development. Environment variables configure containers without rebuilding images. Health checks monitor container readiness and trigger restarts on failure. Networking between containers uses service names as hostnames. Docker Hub and container registries store and distribute images. We containerize our full-stack application with separate services for the Node.js API, React frontend, PostgreSQL database, and Redis, connected through Docker Compose with proper networking, volumes, and environment configuration.",
                },
                {
                  title: "CI/CD Pipelines",
                  order: 2,
                  duration: 35,
                  content: "Continuous Integration and Continuous Deployment automate the process of testing, building, and deploying code changes. GitHub Actions provides CI/CD workflows triggered by events like pushes, pull requests, and schedules. Workflow files in .github/workflows define jobs that run on virtual machines with steps for checkout, setup, testing, building, and deploying. Matrix strategies test across multiple Node.js versions and operating systems simultaneously. Caching node_modules between runs dramatically speeds up pipelines. Branch protection rules require passing CI checks before merging pull requests, preventing broken code from reaching the main branch. Environment secrets securely store API keys and deployment credentials. Deployment strategies include rolling updates that gradually replace old instances, blue-green deployments that switch traffic between two identical environments, and canary releases that route a small percentage of traffic to the new version. Infrastructure as code with Terraform or Pulumi manages cloud resources reproducibly. Monitoring and alerting with tools like Datadog or Grafana detect issues in production. Rollback procedures quickly revert to a known good state when problems are detected. We build a complete CI/CD pipeline that runs linting, type checking, unit tests, and integration tests on every pull request, then deploys to staging on merge and production on release tag.",
                },
                {
                  title: "Cloud Deployment with Vercel and AWS",
                  order: 3,
                  duration: 40,
                  content: "Cloud platforms provide the infrastructure to run web applications at scale. Vercel optimizes for Next.js deployments with automatic preview deployments for every pull request, global CDN distribution, and serverless functions. Connecting a GitHub repository enables zero-configuration deployments on every push. Environment variables are configured per deployment environment. AWS provides lower-level building blocks for more complex architectures. EC2 instances run application servers with full control over the operating system and network. RDS manages PostgreSQL databases with automated backups, replication, and failover. S3 stores static files and user uploads with high durability and availability. CloudFront CDN caches and distributes content from edge locations worldwide. Lambda functions run code without managing servers, scaling automatically with demand. API Gateway routes HTTP requests to Lambda functions with throttling and authentication. IAM roles and policies control which services can access which resources. The Serverless Framework simplifies deploying Lambda-based applications. Cost optimization involves choosing the right instance types, using reserved capacity for predictable workloads, and setting up billing alerts. We deploy our application to both Vercel and AWS, comparing the developer experience, cost, performance, and operational complexity of each approach.",
                },
                {
                  title: "Performance and Security",
                  order: 4,
                  duration: 35,
                  content: "Performance directly impacts user experience and business metrics. Core Web Vitals measure loading speed, interactivity, and visual stability. Code splitting with dynamic imports loads only the JavaScript needed for the current page. Image optimization with next/image provides automatic resizing, format conversion, and lazy loading. Server-side rendering generates HTML on the server for fast initial page loads and better SEO. Static site generation pre-renders pages at build time for maximum performance. Caching strategies at multiple levels including browser cache, CDN cache, API cache, and database query cache reduce response times. Database query optimization with indexes, query analysis with EXPLAIN, and connection pooling handle growing data volumes. Security protects your application and users from attacks. HTTPS encrypts all traffic between clients and servers. Content Security Policy headers prevent cross-site scripting by controlling which resources can load. CSRF tokens prevent forged requests from malicious sites. SQL injection is prevented by parameterized queries, which Prisma handles automatically. Rate limiting prevents abuse and denial-of-service attacks. Input sanitization removes malicious content from user submissions. Dependency auditing with npm audit identifies known vulnerabilities in your packages. Security headers including X-Frame-Options, X-Content-Type-Options, and Strict-Transport-Security add layers of protection. We audit our application for performance bottlenecks and security vulnerabilities, implementing fixes that measurably improve both.",
                },
              ],
            },
          },
        ],
      },
    },
  });

  const course4 = await prisma.course.upsert({
    where: { slug: "product-management-certification" },
    update: {},
    create: {
      title: "Product Management Certification",
      slug: "product-management-certification",
      description: "Master product strategy, user research, roadmapping, and stakeholder management to lead successful products.",
      longDescription: "Designed for aspiring and current product managers. Covers the complete product lifecycle from discovery through delivery, with frameworks used at top tech companies.",
      type: CourseType.CERTIFICATION,
      level: CourseLevel.INTERMEDIATE,
      price: 199,
      duration: 20,
      tags: ["Product Management", "Strategy", "Agile", "User Research", "Roadmapping"],
      published: true,
      instructorName: "Lisa Chang",
      instructorBio: "VP of Product at Spotify, previously PM Lead at Airbnb. Built products used by 100M+ users.",
      modules: {
        create: [
          {
            title: "Product Discovery",
            order: 1,
            lessons: {
              create: [
                {
                  title: "Understanding User Problems",
                  order: 1,
                  duration: 30,
                  content: "Great products solve real problems for real people. Product discovery is the process of understanding what to build before investing engineering resources. The biggest risk in product development is not building the wrong thing, but building the right thing for the wrong problem. User interviews are the foundation of discovery. Structured interviews with open-ended questions reveal motivations, frustrations, and workarounds that users have developed. The Mom Test framework helps you ask questions that even your mother would answer honestly, avoiding leading questions that confirm your biases. Jobs-to-be-done theory reframes user needs as the progress people want to make in their lives. Users do not want a quarter-inch drill, they want a quarter-inch hole, and understanding this difference changes what you build. Observation and contextual inquiry watch users in their natural environment, revealing behaviors they cannot articulate. Survey design complements qualitative research with quantitative data about the prevalence and severity of problems. Problem statements synthesize research into clear descriptions of who has the problem, what the problem is, and why it matters. We practice conducting user interviews, analyzing transcripts for patterns, and writing problem statements that focus engineering efforts on the highest-impact opportunities.",
                },
                {
                  title: "Market Analysis and Competitive Strategy",
                  order: 2,
                  duration: 30,
                  content: "Market analysis determines whether a problem is worth solving commercially. Total addressable market estimates the revenue opportunity if you captured every potential customer. Serviceable addressable market narrows this to the segment you can realistically reach with your business model and distribution channels. Competitive analysis maps existing solutions on dimensions that matter to customers. Direct competitors solve the same problem for the same customers. Indirect competitors solve the same problem differently, and substitutes meet the same underlying need through different means. Porter's Five Forces framework analyzes competitive intensity through the bargaining power of buyers and suppliers, the threat of new entrants and substitutes, and rivalry among existing competitors. Blue ocean strategy looks for uncontested market spaces where competition is irrelevant because you have redefined the value proposition. Positioning defines how your product is different and better for a specific audience. The value proposition canvas maps customer jobs, pains, and gains against your product features, pain relievers, and gain creators. Market timing matters enormously because being too early is functionally the same as being wrong. We analyze real market opportunities using these frameworks, building a market assessment document that would convince stakeholders to invest in pursuing the opportunity.",
                },
                {
                  title: "Ideation and Solution Design",
                  order: 3,
                  duration: 25,
                  content: "With a validated problem and market opportunity, ideation generates potential solutions. Divergent thinking generates many ideas without judgment, while convergent thinking evaluates and selects the best options. Design sprints compress months of work into five days of structured ideation, prototyping, and testing. Monday maps the problem space, Tuesday sketches solutions individually, Wednesday decides which concepts to pursue, Thursday builds a realistic prototype, and Friday tests with real users. Assumption mapping identifies the riskiest assumptions underlying each solution concept. The riskiest assumptions are those that are both critical to success and highly uncertain. Prototyping tests these assumptions cheaply before building production software. Paper prototypes and wireframes test information architecture and flow. Clickable prototypes built in Figma or similar tools test interaction patterns and visual design. Wizard of Oz prototypes simulate functionality manually behind the scenes. Concierge prototypes deliver the value manually to validate demand before automating. The opportunity solution tree organizes the relationship between outcomes, opportunities, and solutions, ensuring every feature traces back to a user need and business objective. We run a mini design sprint on a product concept, producing a tested prototype with evidence of desirability.",
                },
                {
                  title: "Product Metrics and Analytics",
                  order: 4,
                  duration: 25,
                  hasQuiz: true,
                  quizData: {
                    questions: [
                      { q: "What does the 'A' in AARRR metrics stand for?", options: ["Activation", "Analytics", "Attribution", "Automation"], correct: 0, explanation: "AARRR stands for Acquisition, Activation, Retention, Revenue, Referral - the pirate metrics framework." },
                      { q: "Which metric best measures product-market fit?", options: ["Daily Active Users", "Revenue growth", "Retention rate", "Sign-up conversion"], correct: 2, explanation: "Retention rate is the strongest signal of product-market fit because it shows users continue finding value over time." },
                      { q: "What is a North Star Metric?", options: ["The most important company KPI", "A single metric reflecting core product value delivered to customers", "Total revenue", "The metric your CEO cares about most"], correct: 1, explanation: "A North Star Metric captures the core value your product delivers to customers, aligning teams around user value rather than business vanity metrics." },
                    ],
                  },
                  content: "Metrics quantify product performance and guide decisions with data rather than opinions. The pirate metrics framework organizes the customer lifecycle into Acquisition, Activation, Retention, Revenue, and Referral stages. Each stage has specific metrics that diagnose where users are succeeding or dropping off. Acquisition metrics measure how effectively you attract new users through various channels. Activation metrics track whether new users experience the core product value quickly enough. Retention metrics show whether users continue finding value over time, making it the strongest signal of product-market fit. Revenue metrics connect user behavior to business outcomes. Referral metrics measure organic growth through word-of-mouth. The North Star Metric is a single measure that captures the core value your product delivers to customers. For a streaming service it might be hours watched, for a marketplace it might be transactions completed. Leading indicators predict future changes in lagging indicators, enabling proactive responses. Cohort analysis groups users by when they joined, revealing whether product changes actually improve outcomes for new users versus existing ones. A/B testing compares variants with statistical rigor to determine which version performs better. Sample size calculations, statistical significance, and practical significance all matter for valid conclusions. We define a metrics framework for a sample product, set up a dashboard with leading and lagging indicators, and design an A/B test to validate a feature hypothesis.",
                },
              ],
            },
          },
          {
            title: "Product Delivery",
            order: 2,
            lessons: {
              create: [
                {
                  title: "Roadmapping and Prioritization",
                  order: 1,
                  duration: 30,
                  content: "Roadmaps communicate the strategic direction of product development to stakeholders. Outcome-based roadmaps focus on the results you want to achieve rather than specific features, giving teams flexibility in how they solve problems. Time horizons typically cover now (committed, high confidence), next (planned, medium confidence), and later (exploratory, low confidence). Theme-based roadmaps organize work around strategic themes rather than timelines, reducing the pressure to commit to specific dates. Prioritization frameworks bring objectivity to the inherently subjective process of deciding what to build next. RICE scoring evaluates opportunities on Reach (how many users affected), Impact (how much each user is affected), Confidence (how certain you are of your estimates), and Effort (how much work is required). The ICE framework simplifies this to Impact, Confidence, and Ease. Opportunity scoring compares the importance of a need with current satisfaction, highlighting underserved needs with high potential. The Kano model categorizes features as basic expectations, performance features, and delighters that surprise and delight. MoSCoW prioritization classifies requirements as Must have, Should have, Could have, and Won't have for a given release. Stack ranking forces relative ordering that eliminates ties and requires explicit tradeoff decisions. We create a product roadmap for a hypothetical product, applying multiple prioritization frameworks and making explicit tradeoff decisions with clear rationale.",
                },
                {
                  title: "Agile Product Development",
                  order: 2,
                  duration: 30,
                  content: "Agile methodologies deliver value iteratively, gathering feedback continuously rather than waiting months for a big reveal. Scrum organizes work into fixed-length sprints, typically two weeks, with ceremonies including planning, daily standups, reviews, and retrospectives. The product backlog is an ordered list of everything the team might work on, maintained by the product manager. Sprint planning selects items from the backlog that the team commits to completing during the sprint. User stories describe features from the user perspective: As a [user type], I want to [action] so that I [benefit]. Acceptance criteria define what done means for each story, making completion objective. Story points estimate relative complexity rather than absolute time, with planning poker building team consensus. Velocity measures how many points a team completes per sprint, enabling capacity planning for future sprints. Kanban visualizes workflow as cards moving through columns, with work-in-progress limits preventing overload. Burndown charts track remaining work against the sprint timeline, revealing early if the team is on track. Retrospectives inspect what went well, what could improve, and what actions to take, driving continuous team improvement. The definition of done ensures quality standards are met before work is considered complete, typically including code review, testing, documentation, and deployment readiness. We practice writing user stories, estimating with story points, planning a sprint, and conducting a retrospective on a simulated project.",
                },
                {
                  title: "Stakeholder Management",
                  order: 3,
                  duration: 25,
                  content: "Product managers operate at the intersection of business, technology, and user experience, managing relationships across all three domains. Stakeholder mapping identifies everyone who influences or is affected by your product decisions, categorizing them by power and interest level. High-power, high-interest stakeholders need close management with regular updates and input opportunities. Executive communication requires framing product decisions in terms of business impact, market position, and strategic alignment. Data-driven narratives that connect feature investments to metric improvements are more persuasive than opinion-based arguments. Engineering partnerships require mutual respect and collaborative problem-solving. The best product managers deeply understand technical constraints and tradeoffs, allowing them to propose solutions that are both desirable and feasible. Design collaboration ensures solutions are usable and emotionally resonant. Sales and customer success teams provide direct customer feedback and competitive intelligence that should inform product decisions. Managing up means proactively communicating progress, risks, and decisions to leadership before they ask. Saying no gracefully is a critical skill because you will always have more requests than capacity. Explaining why through the lens of strategy and data helps stakeholders understand prioritization decisions even when they disagree. We practice stakeholder communication through role-playing exercises including executive reviews, engineering discussions about technical debt, and sales requests for custom features.",
                },
                {
                  title: "Launch Strategy and Growth",
                  order: 4,
                  duration: 25,
                  content: "Product launches orchestrate the coordination between product, marketing, sales, support, and operations to maximize impact. Launch tiers categorize releases by impact level, with major launches getting full marketing support and minor releases requiring only changelog updates. Beta programs give early access to engaged users who provide feedback before general availability. Launch checklists ensure nothing falls through the cracks, covering documentation, training, monitoring, rollback plans, and communication. Feature flags enable progressive rollout, starting with internal users, then beta testers, then a percentage of production traffic, and finally general availability. This reduces risk by catching issues before they affect everyone. Growth strategy extends beyond the initial launch to drive ongoing adoption and engagement. Product-led growth uses the product itself as the primary driver of acquisition and expansion. Viral loops build sharing and invitation mechanics into the core product experience. Network effects increase the product value as more users join, creating a defensible competitive advantage. Retention optimization through onboarding improvements, engagement hooks, and re-engagement campaigns prevents the leaky bucket problem where new users leave as fast as they arrive. Expansion revenue from existing customers through upselling and cross-selling is typically more efficient than acquiring new customers. We develop a complete launch plan for a product feature including phased rollout strategy, success metrics, communication plan, and post-launch optimization roadmap.",
                },
                {
                  title: "Product Strategy and Vision",
                  order: 5,
                  duration: 25,
                  content: "Product strategy connects company vision to execution, answering why you are building what you are building. Vision describes the future state of the world your product enables, inspiring the team and attracting customers who share that aspiration. Mission defines the specific role your product plays in achieving that vision. Strategy identifies the key choices and tradeoffs that differentiate your approach from alternatives. A good strategy is specific about who you serve, what unique value you provide, and what you explicitly choose not to do. Playing to win versus playing not to lose creates fundamentally different strategic postures. Strategic frameworks like Wardley Mapping visualize the evolution of components in your value chain from genesis through custom-built to product and commodity. This reveals where to invest in differentiation and where to leverage existing solutions. The three horizons model balances investment between the current core business, emerging opportunities, and transformational bets. Product principles codify your team values and decision-making heuristics, reducing the need for constant alignment discussions. Business model design ensures your product strategy creates sustainable value capture alongside value creation. Unit economics including customer acquisition cost, lifetime value, and payback period determine whether growth creates or destroys value. We develop a complete product strategy document including vision, mission, strategic choices, principles, and a business model canvas validated against market research.",
                },
                {
                  title: "Certification Exam Preparation",
                  order: 6,
                  duration: 20,
                  hasQuiz: true,
                  quizData: {
                    questions: [
                      { q: "Which prioritization framework uses Reach, Impact, Confidence, and Effort?", options: ["MoSCoW", "RICE", "ICE", "Kano"], correct: 1, explanation: "RICE scoring evaluates Reach, Impact, Confidence, and Effort to quantitatively compare opportunities." },
                      { q: "In the Jobs-to-be-Done framework, what are users primarily hiring products for?", options: ["Features and functionality", "Progress they want to make in their lives", "Cost savings", "Brand status"], correct: 1, explanation: "JTBD theory says users hire products to make progress in specific circumstances of their lives, not for features." },
                    ],
                  },
                  content: "This final lesson reviews all key concepts covered throughout the certification program and prepares you for the assessment. Product management spans the entire product lifecycle from discovery through delivery and growth. The discovery phase ensures you are solving real problems for real users with viable business models. User interviews, market analysis, and rapid prototyping validate assumptions before significant investment. The delivery phase translates validated opportunities into shipped products through agile development, clear requirements, and effective cross-functional collaboration. Metrics and analytics provide objective feedback on product performance, enabling data-driven iterations. Strategy ties everything together by defining the choices that differentiate your product and create sustainable competitive advantages. The best product managers combine analytical rigor with customer empathy, strategic thinking with execution focus, and technical understanding with business acumen. Continuous learning through industry publications, peer networks, and reflection on outcomes ensures you grow alongside the rapidly evolving product landscape. Review the key frameworks, practice applying them to new scenarios, and prepare for scenario-based questions that test your judgment in ambiguous situations typical of real product management.",
                },
              ],
            },
          },
        ],
      },
    },
  });

  const course5 = await prisma.course.upsert({
    where: { slug: "ux-design-sprint" },
    update: {},
    create: {
      title: "UX Design Sprint",
      slug: "ux-design-sprint",
      description: "Learn the Google Ventures design sprint methodology to rapidly solve design challenges and test ideas.",
      longDescription: "A hands-on short course that teaches you to run design sprints for any product challenge. You will practice user research, sketching, prototyping, and testing in a compressed timeframe.",
      type: CourseType.SHORT_COURSE,
      level: CourseLevel.BEGINNER,
      price: 59,
      duration: 6,
      tags: ["UX Design", "Design Sprint", "Prototyping", "User Research", "Figma"],
      published: true,
      instructorName: "Aisha Patel",
      instructorBio: "Design Director at IDEO, Google Design Sprint certified facilitator. Led 100+ sprints across industries.",
      modules: {
        create: [
          {
            title: "Sprint Foundations",
            order: 1,
            lessons: {
              create: [
                {
                  title: "What is a Design Sprint?",
                  order: 1,
                  duration: 20,
                  content: "A design sprint is a five-day process for answering critical business questions through design, prototyping, and testing ideas with customers. Invented at Google Ventures, it compresses months of debate, design, and testing into a single focused week. The sprint is not about building a finished product but about learning whether an idea is worth pursuing before investing significant resources. Sprints work because they create urgency, focus the team on a single challenge, and test with real users rather than relying on internal opinions. The structure forces decisions that might otherwise be delayed indefinitely. A sprint team includes a Decider with authority to make final calls, the product manager, designer, engineer, marketing representative, and any relevant domain expert, typically five to seven people. The Facilitator guides the process, manages time, and ensures every voice is heard. The challenge should be significant enough to warrant five days of focused effort, typically a major strategic question or a complex user experience problem. Success depends on commitment from the full team, a clearly defined challenge, and access to users for Friday testing. We examine case studies from companies that used sprints to validate new products, redesign existing features, and explore expansion opportunities, analyzing what made each sprint successful or where they went wrong.",
                },
                {
                  title: "Sprint Planning and Preparation",
                  order: 2,
                  duration: 20,
                  content: "Successful sprints require careful preparation before day one. Defining the sprint challenge frames the problem narrowly enough to make progress in five days but broadly enough that the solution space is not artificially constrained. Good challenges start with 'How might we' and focus on a specific user need or business outcome. Recruiting test users in advance is critical because Friday testing cannot happen without them. Five users are typically sufficient to identify the most significant usability issues. Screen for users who match your target audience and have relevant experience with the problem space. The sprint room needs a large whiteboard or wall space for sticky notes, a timer for structured exercises, art supplies for sketching, and minimal technology distractions. Laptops should be closed except during designated working time. Gathering existing research, analytics data, competitive analysis, and customer feedback before the sprint ensures the team starts with shared context rather than spending sprint time on basic research. Expert interviews on Monday supplement this preparation with insights from customer-facing teams, technical experts, and industry specialists. The sprint brief documents the challenge, team members, schedule, recruited users, and success criteria, distributed to participants before day one so everyone arrives prepared to contribute.",
                },
                {
                  title: "Monday: Map and Target",
                  order: 3,
                  duration: 25,
                  content: "Monday is about building shared understanding and choosing where to focus. The sprint starts with the Decider defining the long-term goal and sprint questions. The long-term goal describes the optimistic outcome if everything goes well. Sprint questions articulate the biggest risks and unknowns that the sprint should address. Expert interviews bring outside perspectives into the room. Each expert gets fifteen minutes to share what they know about the customer, the technology, the market, or the business constraints. Note-takers capture insights as How Might We questions on sticky notes, one idea per note. These HMW notes are organized by theme on the wall, creating a visual map of the opportunity space. The team creates a simple map of the customer journey showing the key steps from discovery through achieving their goal. This is not a detailed user flow but a high-level visualization that everyone can reference throughout the week. The Decider then chooses a target customer and a target moment in the journey to focus on for the rest of the sprint. This decision narrows the scope to something achievable in the remaining four days. The target should address the most important sprint question and represent the highest risk or highest opportunity area. Monday afternoon is often the most challenging because ambiguity is highest and the team has not yet developed shared understanding.",
                },
              ],
            },
          },
          {
            title: "Sprint Execution",
            order: 2,
            lessons: {
              create: [
                {
                  title: "Tuesday and Wednesday: Sketch, Decide, Storyboard",
                  order: 1,
                  duration: 30,
                  content: "Tuesday shifts from understanding to generating solutions. Rather than traditional brainstorming where the loudest voice wins, the sprint uses structured sketching exercises that give every team member equal creative input. Lightning demos review inspiring solutions from other products and industries, expanding the solution space beyond the obvious. Each team member captures ideas from demos as quick sketches. The four-step sketching process starts with notes reviewing all the information gathered on Monday. Next, rough ideas capture initial thoughts as simple drawings. Crazy eights force rapid ideation by sketching eight variations in eight minutes, pushing past obvious first ideas. Finally, each person creates a detailed solution sketch that stands on its own without verbal explanation, with annotations and titles. Wednesday morning starts with the art museum, where all solution sketches are displayed on the wall. The team silently reviews each sketch, placing dot stickers on ideas they find compelling. A structured discussion of the most-voted concepts ensures every sketch gets fair consideration. Speed critiques capture the strengths of each approach. The Decider then makes the final call on which concept to pursue, possibly combining elements from multiple sketches. The afternoon creates a storyboard, a step-by-step plan for the prototype. This six to twelve panel comic-strip-style sequence shows exactly what the user will experience during Friday testing, from the opening screen through the key interactions to the resolution.",
                },
                {
                  title: "Thursday: Prototype",
                  order: 2,
                  duration: 25,
                  content: "Thursday transforms the storyboard into a realistic prototype that feels real enough for Friday testing. The prototype does not need to work fully, it needs to appear real to someone using it for the first time. This is the Goldilocks principle: just enough fidelity to test your assumptions, not so much that you waste time on details that do not affect the test outcome. Figma is the preferred tool for digital product prototypes because it produces realistic interactive screens quickly. One team member acts as the Maker, the most skilled prototyper who builds the screens. One or two members act as Collectors, gathering real content, images, and copy rather than using placeholder text that breaks immersion. One member writes the interview script and discussion guide for Friday testing. The stitcher connects all the prototype screens together with realistic transitions and interactions. The prototype should cover the complete scenario from the storyboard so testers experience the full flow. If the solution involves multiple touchpoints like email and web, create enough of each to test the key moments. A trial run in the afternoon lets the team experience the prototype as a tester would, catching confusing flows, dead ends, and technical glitches before real testing. This dry run often reveals critical improvements that take minutes to fix but would have confused every tester.",
                },
              ],
            },
          },
        ],
      },
    },
  });

  // --- Enrollments ---
  const allCourses = [course1, course2, course3, course4, course5];
  const allStudents = studentUsers;

  const enrollmentData = [
    { userId: allStudents[0].id, courseId: course1.id, progress: 45, status: EnrollmentStatus.ACTIVE },
    { userId: allStudents[0].id, courseId: course2.id, progress: 100, status: EnrollmentStatus.COMPLETED },
    { userId: allStudents[1].id, courseId: course2.id, progress: 60, status: EnrollmentStatus.ACTIVE },
    { userId: allStudents[1].id, courseId: course4.id, progress: 20, status: EnrollmentStatus.ACTIVE },
    { userId: allStudents[2].id, courseId: course3.id, progress: 75, status: EnrollmentStatus.ACTIVE },
    { userId: allStudents[2].id, courseId: course5.id, progress: 100, status: EnrollmentStatus.COMPLETED },
    { userId: allStudents[3].id, courseId: course4.id, progress: 90, status: EnrollmentStatus.ACTIVE },
    { userId: allStudents[3].id, courseId: course1.id, progress: 10, status: EnrollmentStatus.ACTIVE },
    { userId: allStudents[4].id, courseId: course5.id, progress: 50, status: EnrollmentStatus.ACTIVE },
    { userId: allStudents[4].id, courseId: course3.id, progress: 30, status: EnrollmentStatus.ACTIVE },
  ];

  for (const e of enrollmentData) {
    await prisma.enrollment.upsert({
      where: { userId_courseId: { userId: e.userId, courseId: e.courseId } },
      update: {},
      create: {
        userId: e.userId,
        courseId: e.courseId,
        progress: e.progress,
        status: e.status,
        completedAt: e.status === EnrollmentStatus.COMPLETED ? new Date() : null,
      },
    });
  }

  // --- Prototypes ---
  await prisma.prototype.createMany({
    skipDuplicates: true,
    data: [
      {
        userId: companyUsers[0].id,
        title: "SaaS Analytics Dashboard",
        description: "Real-time analytics dashboard for tracking SaaS metrics including MRR, churn, and customer health scores.",
        techStack: ["Next.js", "React", "Node.js", "PostgreSQL"],
        status: PrototypeStatus.ACTIVE,
      },
      {
        userId: companyUsers[1].id,
        title: "Carbon Footprint Tracker API",
        description: "REST API for calculating and tracking organizational carbon emissions across Scope 1, 2, and 3.",
        techStack: ["Python", "Go", "PostgreSQL"],
        status: PrototypeStatus.ACTIVE,
      },
      {
        userId: companyUsers[2].id,
        title: "ML Feature Store",
        description: "Centralized feature store for managing and serving ML features with versioning and lineage tracking.",
        techStack: ["Python", "Go", "React"],
        status: PrototypeStatus.PAUSED,
      },
    ],
  });

  console.log("Seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
