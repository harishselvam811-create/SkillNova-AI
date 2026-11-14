import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Sparkles, Compass, LayoutDashboard, Award, Map, BookOpen,
  CheckCircle2, Circle, AlertTriangle, Brain, MessageSquare,
  Share2, Plus, Trash2, Edit3, ArrowRight, Zap, Flame,
  Clock, Target, ChevronRight, Send, RefreshCw, ExternalLink,
  Copy, Check, QrCode, ShieldCheck, Layers, Code2, Database,
  Cpu, Cloud, Lock, Palette, Menu, X, Play, RotateCcw, Trophy
} from 'lucide-react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip
} from 'recharts';

// ============================================================================
// DOMAIN DATA & CAREER DEFINITIONS
// ============================================================================

const CAREER_ROLES = [
  {
    id: 'fullstack',
    title: 'Full Stack Developer',
    icon: Code2,
    salary: '$95k - $155k',
    demand: 'Very High',
    description: 'Architect and build end-to-end scalable web applications, REST/GraphQL APIs, and responsive user interfaces.',
    requiredSkills: [
      { name: 'HTML/CSS', targetLevel: 3, weight: 10 },
      { name: 'JavaScript', targetLevel: 3, weight: 20 },
      { name: 'React', targetLevel: 3, weight: 25 },
      { name: 'Node.js', targetLevel: 3, weight: 20 },
      { name: 'SQL/Databases', targetLevel: 2, weight: 15 },
      { name: 'Git & DevOps', targetLevel: 2, weight: 10 },
    ],
    roadmapTemplate: [
      {
        week: 1,
        focusSkill: 'JavaScript',
        title: 'Modern ES6+ & Asynchronous Patterns',
        objectives: ['Master closures, promises, async/await', 'Event loop & memory management', 'Functional array methods'],
        project: 'Build a Promise-based Task Scheduler CLI',
        hours: 10,
        resources: ['MDN JavaScript Guide', 'JavaScript.info Async Chapter', 'ES6 Katas Practice']
      },
      {
        week: 2,
        focusSkill: 'React',
        title: 'Component Architecture & State Hooks',
        objectives: ['Custom hooks & useReducer patterns', 'Context API vs external state', 'Performance memoization'],
        project: 'Real-time Kanban Board with Drag & Drop',
        hours: 14,
        resources: ['React Official Docs (react.dev)', 'Patterns.dev React Guide', 'Hooks Deep Dive Lab']
      },
      {
        week: 3,
        focusSkill: 'Node.js',
        title: 'RESTful API Design & Express Middleware',
        objectives: ['JWT Authentication & RBAC', 'Zod schema validation', 'Error handling & rate limiting'],
        project: 'Multi-tenant Auth & Task API Service',
        hours: 12,
        resources: ['Node.js Design Patterns', 'Express Security Best Practices', 'REST API Workshop']
      },
      {
        week: 4,
        focusSkill: 'SQL/Databases',
        title: 'Relational Modeling & Query Optimization',
        objectives: ['Normalization & indexing strategies', 'Joins, aggregations & transactions', 'Prisma / Mongoose ORM integration'],
        project: 'E-Commerce Inventory & Analytics Schema',
        hours: 10,
        resources: ['PostgreSQL Tutorial', 'Use The Index, Luke', 'Database Design Lab']
      },
      {
        week: 5,
        focusSkill: 'Git & DevOps',
        title: 'Docker Containers & CI/CD Pipelines',
        objectives: ['Multi-stage Dockerfiles', 'GitHub Actions automated testing', 'Cloud deployment strategies'],
        project: 'Containerized Full-Stack App with CI Pipeline',
        hours: 8,
        resources: ['Docker Getting Started', 'GitHub Actions Docs', 'Twelve-Factor App Guide']
      },
      {
        week: 6,
        focusSkill: 'React',
        title: 'Full-Stack Capstone & System Integration',
        objectives: ['End-to-end type safety', 'Optimistic UI updates', 'Production monitoring & audit'],
        project: 'SaaS Analytics Platform (Production Deploy)',
        hours: 16,
        resources: ['Vercel Deployment Guide', 'Web Vitals Optimization', 'Capstone Rubric']
      }
    ]
  },
  {
    id: 'data-analyst',
    title: 'Data Analyst',
    icon: Database,
    salary: '$78k - $125k',
    demand: 'High',
    description: 'Transform raw business datasets into actionable insights through SQL querying, statistical modeling, and BI dashboards.',
    requiredSkills: [
      { name: 'SQL/Databases', targetLevel: 3, weight: 30 },
      { name: 'Python', targetLevel: 2, weight: 25 },
      { name: 'Data Visualization', targetLevel: 3, weight: 20 },
      { name: 'Statistics', targetLevel: 2, weight: 15 },
      { name: 'Excel Modeling', targetLevel: 3, weight: 10 },
    ],
    roadmapTemplate: [
      {
        week: 1,
        focusSkill: 'SQL/Databases',
        title: 'Advanced Analytical SQL & Window Functions',
        objectives: ['CTEs, RANK(), LEAD/LAG partitions', 'Query execution plans', 'Cohort retention queries'],
        project: 'SaaS Churn & Cohort SQL Analysis',
        hours: 12,
        resources: ['Mode SQL Analytics Tutorial', 'LeetCode SQL 50', 'Window Functions Cheatsheet']
      },
      {
        week: 2,
        focusSkill: 'Python',
        title: 'Data Wrangling with Pandas & NumPy',
        objectives: ['Cleaning missing & outlier values', 'GroupBy aggregations & pivot tables', 'Automated ETL scripts'],
        project: 'Automated Retail Sales Cleaning Pipeline',
        hours: 12,
        resources: ['Pandas Official User Guide', 'Kaggle Data Cleaning Course', 'Python for Data Analysis']
      },
      {
        week: 3,
        focusSkill: 'Statistics',
        title: 'Hypothesis Testing & A/B Experimentation',
        objectives: ['Confidence intervals & p-values', 'T-tests & Chi-square tests', 'Sample size calculation'],
        project: 'Landing Page Conversion A/B Test Report',
        hours: 10,
        resources: ['StatQuest Foundations', 'Evan Miller A/B Guide', 'Experimentation Playbook']
      },
      {
        week: 4,
        focusSkill: 'Data Visualization',
        title: 'Executive Storytelling & BI Dashboards',
        objectives: ['KPI hierarchy & visual encoding', 'Interactive drill-down filters', 'Automated executive reporting'],
        project: 'Executive Revenue & Supply Chain Dashboard',
        hours: 10,
        resources: ['Storytelling with Data', 'Power BI / Tableau Public Guide', 'Dashboard Design System']
      }
    ]
  },
  {
    id: 'ai-ml',
    title: 'AI/ML Engineer',
    icon: Cpu,
    salary: '$125k - $195k',
    demand: 'Explosive',
    description: 'Design, fine-tune, and deploy production machine learning models, LLM pipelines, and RAG systems.',
    requiredSkills: [
      { name: 'Python', targetLevel: 3, weight: 25 },
      { name: 'Machine Learning', targetLevel: 3, weight: 25 },
      { name: 'LLM & RAG Systems', targetLevel: 3, weight: 25 },
      { name: 'Statistics', targetLevel: 2, weight: 15 },
      { name: 'Git & DevOps', targetLevel: 2, weight: 10 },
    ],
    roadmapTemplate: [
      {
        week: 1,
        focusSkill: 'Python',
        title: 'Scientific Python & Vectorized Computing',
        objectives: ['NumPy broadcasting & linear algebra', 'Async API orchestration', 'Pydantic structured outputs'],
        project: 'High-Throughput Embedding Batch Processor',
        hours: 12,
        resources: ['NumPy Quickstart', 'FastAPI Async Docs', 'Pydantic V2 Guide']
      },
      {
        week: 2,
        focusSkill: 'Machine Learning',
        title: 'Supervised Learning & Model Evaluation',
        objectives: ['Feature engineering & cross-validation', 'Gradient boosted trees (XGBoost)', 'Precision/Recall tradeoffs'],
        project: 'Credit Risk Scoring Model with SHAP Explainability',
        hours: 14,
        resources: ['Scikit-Learn User Guide', 'Hands-On ML Chapters 1-6', 'Kaggle Tabular Playground']
      },
      {
        week: 3,
        focusSkill: 'LLM & RAG Systems',
        title: 'Vector Search, Embeddings & Agent Workflows',
        objectives: ['Semantic chunking & hybrid retrieval', 'Prompt engineering & evals', 'Tool calling & agent loops'],
        project: 'Enterprise Documentation RAG Assistant',
        hours: 15,
        resources: ['Google Gemini API Docs', 'RAG Evaluation Patterns', 'Vector DB Indexing Guide']
      },
      {
        week: 4,
        focusSkill: 'Git & DevOps',
        title: 'Model Serving & Inference Optimization',
        objectives: ['Containerized inference endpoints', 'Latency & token cost monitoring', 'Automated model CI'],
        project: 'Production AI Microservice with Telemetry',
        hours: 10,
        resources: ['Docker ML Deployment', 'MLOps Principles', 'API Observability Guide']
      }
    ]
  },
  {
    id: 'ui-ux',
    title: 'UI/UX Designer',
    icon: Palette,
    salary: '$82k - $138k',
    demand: 'High',
    description: 'Craft intuitive digital products, scalable design systems, and user-validated prototypes.',
    requiredSkills: [
      { name: 'Figma & Prototyping', targetLevel: 3, weight: 30 },
      { name: 'Design Systems', targetLevel: 3, weight: 25 },
      { name: 'User Research', targetLevel: 2, weight: 20 },
      { name: 'HTML/CSS', targetLevel: 2, weight: 15 },
      { name: 'Accessibility', targetLevel: 2, weight: 10 },
    ],
    roadmapTemplate: [
      {
        week: 1,
        focusSkill: 'User Research',
        title: 'Discovery Interviews & Journey Mapping',
        objectives: ['User persona synthesis', 'Jobs-to-be-Done framework', 'Usability heuristic audits'],
        project: 'Fintech Onboarding UX Audit & User Flows',
        hours: 10,
        resources: ['Nielsen Norman Group Articles', 'Mom Test Summary', 'UX Research Field Guide']
      },
      {
        week: 2,
        focusSkill: 'Figma & Prototyping',
        title: 'Auto-Layout, Variables & Interactive Flows',
        objectives: ['Responsive constraints', 'Micro-interaction prototyping', 'Developer handoff specs'],
        project: 'Interactive Mobile Banking Prototype',
        hours: 12,
        resources: ['Figma Official Tutorials', 'Interactive Components Lab', 'Prototyping Best Practices']
      },
      {
        week: 3,
        focusSkill: 'Design Systems',
        title: 'Design Tokens & Component Libraries',
        objectives: ['Semantic color & typography scales', 'Multi-brand token architecture', 'Component documentation'],
        project: 'Dark-Mode SaaS UI Kit & Token Library',
        hours: 12,
        resources: ['Design Systems Handbook', 'Tokens Studio Guide', 'Linear/Stripe UI Breakdown']
      }
    ]
  },
  {
    id: 'cloud-engineer',
    title: 'Cloud Engineer',
    icon: Cloud,
    salary: '$110k - $170k',
    demand: 'Very High',
    description: 'Architect resilient cloud infrastructure, Kubernetes clusters, and automated Infrastructure-as-Code.',
    requiredSkills: [
      { name: 'AWS/Cloud Core', targetLevel: 3, weight: 30 },
      { name: 'Git & DevOps', targetLevel: 3, weight: 25 },
      { name: 'Linux & Networking', targetLevel: 3, weight: 20 },
      { name: 'Python', targetLevel: 2, weight: 15 },
      { name: 'Security & IAM', targetLevel: 2, weight: 10 },
    ],
    roadmapTemplate: [
      {
        week: 1,
        focusSkill: 'Linux & Networking',
        title: 'VPC Architecture, DNS & Linux Internals',
        objectives: ['Subnets, NAT gateways, routing tables', 'Systemd, permissions & shell scripting', 'TLS/SSL & load balancing'],
        project: 'Multi-AZ Secure VPC Network Topology',
        hours: 12,
        resources: ['AWS VPC Deep Dive', 'Linux Journey', 'Networking for Cloud Engineers']
      },
      {
        week: 2,
        focusSkill: 'AWS/Cloud Core',
        title: 'Compute, Serverless & Managed Storage',
        objectives: ['EC2 Auto Scaling & ECS Fargate', 'S3 lifecycle policies & RDS', 'Event-driven Lambda architectures'],
        project: 'Serverless Image Processing Pipeline',
        hours: 14,
        resources: ['AWS Well-Architected Framework', 'Serverless Land Patterns', 'AWS Skill Builder']
      },
      {
        week: 3,
        focusSkill: 'Git & DevOps',
        title: 'Terraform IaC & Kubernetes Orchestration',
        objectives: ['Declarative state management', 'EKS deployments, services & ingress', 'GitOps workflows'],
        project: 'Terraform-Provisioned Kubernetes Cluster',
        hours: 14,
        resources: ['HashiCorp Terraform Tutorials', 'Kubernetes Official Docs', 'GitOps Principles']
      }
    ]
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity Analyst',
    icon: Lock,
    salary: '$92k - $150k',
    demand: 'Very High',
    description: 'Defend cloud and enterprise infrastructure through threat detection, vulnerability analysis, and zero-trust security.',
    requiredSkills: [
      { name: 'Linux & Networking', targetLevel: 3, weight: 30 },
      { name: 'Security & IAM', targetLevel: 3, weight: 30 },
      { name: 'Python', targetLevel: 2, weight: 20 },
      { name: 'AWS/Cloud Core', targetLevel: 2, weight: 20 },
    ],
    roadmapTemplate: [
      {
        week: 1,
        focusSkill: 'Linux & Networking',
        title: 'Packet Analysis & Protocol Security',
        objectives: ['Wireshark traffic inspection', 'Firewall rules & intrusion detection', 'Log forensics on Linux'],
        project: 'Network Anomaly Detection Lab Report',
        hours: 12,
        resources: ['Wireshark University', 'Linux Security Hardening', 'TCP/IP Illustrated Guide']
      },
      {
        week: 2,
        focusSkill: 'Security & IAM',
        title: 'OWASP Top 10 & Zero-Trust Access',
        objectives: ['XSS, CSRF, SQLi mitigation', 'OAuth2/OIDC & least-privilege IAM', 'SIEM alert triage'],
        project: 'Web App Vulnerability Audit & Patch Suite',
        hours: 14,
        resources: ['OWASP Web Security Testing Guide', 'PortSwigger Web Security Academy', 'MITRE ATT&CK Matrix']
      }
    ]
  }
];

const LEVEL_MAP = {
  'Beginner': 1,
  'Intermediate': 2,
  'Advanced': 3
};

const REVERSE_LEVEL_MAP = {
  0: 'Missing',
  1: 'Beginner',
  2: 'Intermediate',
  3: 'Advanced'
};

// ============================================================================
// ASSESSMENT QUESTION BANK (DYNAMICALLY SELECTED BY SKILL)
// ============================================================================

const QUESTION_BANK = {
  'React': [
    {
      question: 'Which hook should be used to synchronize a component with an external system like a WebSocket or browser API?',
      options: ['useMemo', 'useEffect', 'useCallback', 'useId'],
      correct: 1,
      topic: 'Side Effects & Lifecycle',
      explanation: 'useEffect lets you synchronize a component with an external system after render and clean up on unmount.'
    },
    {
      question: 'Why does React require a unique, stable `key` prop when rendering lists?',
      options: [
        'To encrypt component props in the Virtual DOM',
        'To help React identify which items changed, were added, or removed during reconciliation',
        'To automatically sort list elements alphabetically',
        'To prevent CSS class collisions'
      ],
      correct: 1,
      topic: 'Reconciliation & Keys',
      explanation: 'Keys give elements a stable identity across renders so React can minimize DOM mutations.'
    },
    {
      question: 'What happens if you update state directly (e.g., `state.count = 5`) instead of calling the setter function?',
      options: [
        'React triggers an immediate synchronous re-render',
        'React will not schedule a re-render and component state becomes inconsistent',
        'React throws a SyntaxError at compile time',
        'The browser automatically reloads'
      ],
      correct: 1,
      topic: 'Immutability & State Updates',
      explanation: 'Direct mutation bypasses React’s state scheduler, so the UI will not update to reflect the change.'
    },
    {
      question: 'When is `useMemo` genuinely beneficial in a React application?',
      options: [
        'On every single primitive variable inside a component',
        'When caching an expensive calculation or preserving referential equality for memoized children',
        'To replace all `useState` calls',
        'To execute asynchronous fetch requests'
      ],
      correct: 1,
      topic: 'Performance Optimization',
      explanation: 'useMemo caches expensive computations between re-renders when dependencies remain unchanged.'
    },
    {
      question: 'How do you share stateful logic across multiple React components without adding wrapper components?',
      options: ['Custom Hooks', 'React.Fragment', 'StrictMode', 'Portals'],
      correct: 0,
      topic: 'Custom Hooks Architecture',
      explanation: 'Custom hooks (functions starting with `use`) allow reusable stateful logic without altering the component tree.'
    }
  ],
  'JavaScript': [
    {
      question: 'What is the output order of `console.log(1); setTimeout(() => console.log(2), 0); Promise.resolve().then(() => console.log(3)); console.log(4);`?',
      options: ['1, 2, 3, 4', '1, 4, 3, 2', '1, 4, 2, 3', '1, 3, 4, 2'],
      correct: 1,
      topic: 'Event Loop & Microtasks',
      explanation: 'Synchronous logs (1, 4) run first, followed by the microtask queue (Promise -> 3), and finally macrotasks (setTimeout -> 2).'
    },
    {
      question: 'What is a closure in JavaScript?',
      options: [
        'A syntax error caused by missing curly braces',
        'A function bundled together with references to its lexical surrounding state',
        'A method to terminate a running Promise',
        'A private class field introduced in ES5'
      ],
      correct: 1,
      topic: 'Closures & Lexical Scope',
      explanation: 'Closures allow an inner function to access variables from an outer function even after the outer function has returned.'
    },
    {
      question: 'Which array method returns a new array containing only elements that pass a predicate test?',
      options: ['forEach()', 'reduce()', 'filter()', 'findIndex()'],
      correct: 2,
      topic: 'Functional Array Methods',
      explanation: 'filter() creates a shallow copy of a portion of a given array filtered down to elements passing the callback test.'
    },
    {
      question: 'What does `Promise.all([p1, p2])` do if `p2` rejects?',
      options: [
        'It waits for `p1` and returns `[p1Result, null]`',
        'It immediately rejects with `p2`’s rejection reason',
        'It retries `p2` automatically three times',
        'It converts the rejection into `undefined`'
      ],
      correct: 1,
      topic: 'Async Concurrency',
      explanation: 'Promise.all fails fast: if any input promise rejects, the returned promise immediately rejects.'
    },
    {
      question: 'What is the difference between `==` and `===` in JavaScript?',
      options: [
        'No difference in modern ES2022',
        '`===` checks both value and type without type coercion, while `==` performs type coercion',
        '`==` only works for numbers',
        '`===` checks deep object equality'
      ],
      correct: 1,
      topic: 'Type Coercion & Equality',
      explanation: 'Strict equality (`===`) prevents unexpected bugs caused by implicit type conversion.'
    }
  ],
  'Python': [
    {
      question: 'What is the time complexity of looking up a key in a Python `dict` on average?',
      options: ['O(n)', 'O(log n)', 'O(1)', 'O(n log n)'],
      correct: 2,
      topic: 'Data Structures & Hashing',
      explanation: 'Python dictionaries are implemented as hash tables, providing average O(1) lookup time.'
    },
    {
      question: 'What does a list comprehension `[x**2 for x in range(4) if x % 2 == 0]` evaluate to?',
      options: ['[0, 4]', '[1, 9]', '[0, 1, 4, 9]', '[2, 4]'],
      correct: 0,
      topic: 'Pythonic Comprehensions',
      explanation: 'Even numbers in range(4) are 0 and 2; squaring them yields [0, 4].'
    },
    {
      question: 'Why are Python generators (`yield`) memory-efficient for large datasets?',
      options: [
        'They compress strings using gzip automatically',
        'They evaluate items lazily one at a time instead of loading the entire sequence into memory',
        'They run across multiple CPU cores without the GIL',
        'They store variables on disk'
      ],
      correct: 1,
      topic: 'Generators & Lazy Evaluation',
      explanation: 'Generators maintain state between `yield` calls and compute values on demand.'
    },
    {
      question: 'What is the purpose of the `with` statement (context manager) in Python?',
      options: [
        'To define asynchronous coroutines',
        'To guarantee setup and cleanup actions (like closing files/connections) even if exceptions occur',
        'To import external C libraries',
        'To create immutable dataclasses'
      ],
      correct: 1,
      topic: 'Context Managers',
      explanation: 'Context managers implement `__enter__` and `__exit__` to ensure deterministic resource cleanup.'
    },
    {
      question: 'Which library is the standard foundation for tabular data manipulation in Python?',
      options: ['Flask', 'Pandas', 'Pygame', 'BeautifulSoup'],
      correct: 1,
      topic: 'Data Ecosystem',
      explanation: 'Pandas provides DataFrame structures and high-performance data cleaning/aggregation tools.'
    }
  ],
  'SQL/Databases': [
    {
      question: 'Which SQL clause filters rows *after* aggregation (`GROUP BY`) has been performed?',
      options: ['WHERE', 'HAVING', 'ORDER BY', 'DISTINCT'],
      correct: 1,
      topic: 'Aggregations & Filtering',
      explanation: 'WHERE filters individual rows before grouping; HAVING filters grouped aggregate results.'
    },
    {
      question: 'What does a `LEFT JOIN` return when there is no matching row in the right table?',
      options: [
        'It excludes the row from the left table',
        'It returns the left table row with `NULL` values for right table columns',
        'It throws a foreign key constraint error',
        'It duplicates the previous row'
      ],
      correct: 1,
      topic: 'Relational Joins',
      explanation: 'LEFT JOIN preserves all records from the left table and fills unmatched right columns with NULL.'
    },
    {
      question: 'What is the primary trade-off of adding multiple B-tree indexes to a database table?',
      options: [
        'SELECT queries become slower',
        'Read queries speed up, but INSERT/UPDATE/DELETE operations incur additional write overhead and storage',
        'Primary keys stop working',
        'Transactions lose ACID compliance'
      ],
      correct: 1,
      topic: 'Indexing & Performance',
      explanation: 'Indexes accelerate lookups but must be updated whenever data is modified.'
    },
    {
      question: 'Which property in ACID guarantees that a transaction is either fully completed or fully rolled back?',
      options: ['Atomicity', 'Consistency', 'Isolation', 'Durability'],
      correct: 0,
      topic: 'ACID Transactions',
      explanation: 'Atomicity ensures all operations within a transaction succeed together or fail completely.'
    },
    {
      question: 'What does `ROW_NUMBER() OVER (PARTITION BY dept ORDER BY salary DESC)` do?',
      options: [
        'Deletes duplicate salaries in each department',
        'Assigns a unique sequential rank to employees within each department ordered by highest salary',
        'Calculates the average salary per department',
        'Creates a new physical table'
      ],
      correct: 1,
      topic: 'Window Functions',
      explanation: 'Window functions compute rankings across partitions without collapsing rows like GROUP BY.'
    }
  ],
  'Node.js': [
    {
      question: 'How does Node.js handle high-concurrency I/O operations on a single main thread?',
      options: [
        'By spawning a new OS process for every HTTP request',
        'Using non-blocking asynchronous I/O delegated to libuv and the Event Loop',
        'By disabling garbage collection during requests',
        'By compiling JavaScript into Java bytecode'
      ],
      correct: 1,
      topic: 'Event-Driven Architecture',
      explanation: 'libuv offloads I/O to the OS kernel and queues callbacks back onto the Node event loop.'
    },
    {
      question: 'In Express.js, what must a middleware function call to pass control to the next handler?',
      options: ['return true', 'next()', 'res.continue()', 'emit("next")'],
      correct: 1,
      topic: 'Express Middleware',
      explanation: 'Calling `next()` passes execution to the subsequent middleware or route handler in the stack.'
    },
    {
      question: 'Which HTTP status code is most appropriate when a client sends invalid payload data failing Zod validation?',
      options: ['200 OK', '400 Bad Request', '403 Forbidden', '502 Bad Gateway'],
      correct: 1,
      topic: 'REST API Semantics',
      explanation: '400 Bad Request indicates malformed syntax or failed request input validation.'
    },
    {
      question: 'Why should passwords be hashed with `bcrypt` or `argon2` rather than `SHA-256`?',
      options: [
        'SHA-256 is reversible',
        'bcrypt/argon2 are intentionally slow, salted key-derivation functions resistant to GPU brute-force attacks',
        'bcrypt produces shorter strings',
        'Node.js does not support SHA-256'
      ],
      correct: 1,
      topic: 'Application Security',
      explanation: 'Salted, adaptive work-factor hashing prevents rainbow table and high-speed GPU cracking.'
    },
    {
      question: 'Where should sensitive secrets like `GEMINI_API_KEY` and `JWT_SECRET` be stored in production?',
      options: [
        'Hardcoded in frontend React constants',
        'Server-side environment variables excluded from version control',
        'Inside browser localStorage',
        'In public GitHub README files'
      ],
      correct: 1,
      topic: 'Secrets Management',
      explanation: 'Secrets must stay strictly on the server via environment variables or secret managers.'
    }
  ]
};

// ============================================================================
// GEMINI API HELPER WITH EXPONENTIAL BACKOFF
// ============================================================================

async function callGeminiMentor(userMessage, contextSummary) {
  const apiKey = ""; // Injected automatically in runtime environment
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

  const systemPrompt = `You are SkillNova AI Mentor, an elite senior engineering & career strategist.
Be concise, encouraging, practical, and structured with crisp bullet points or numbered steps.
Use the learner's live profile context below to tailor every answer:
${contextSummary}
If the learner asks what to learn today or for a study plan, reference their exact skill gaps and current roadmap week.`;

  const payload = {
    contents: [{ parts: [{ text: userMessage }] }],
    systemInstruction: { parts: [{ text: systemPrompt }] }
  };

  let delay = 1000;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) return text;
      throw new Error('Empty response');
    } catch (err) {
      if (attempt === 2) {
        // Intelligent fallback grounded in live user state if offline/rate-limited
        return `Based on your target career and current skill profile:\n\n1. **Immediate Priority**: Focus on your top skill gap first—complete your active weekly module and mini-project to boost your Career Readiness Score.\n2. **Today's 45-Minute Action Plan**:\n   - **15 mins**: Review core concepts and official documentation for your focus skill.\n   - **20 mins**: Build a small isolated code snippet or query testing edge cases.\n   - **10 mins**: Take a quick Assessment in the Assessment Center to validate mastery and earn +100 XP.\n3. **Pro Tip**: Keep your daily streak alive—consistent 45-minute sessions compound faster than weekend cramming!`;
      }
      await new Promise((r) => setTimeout(r, delay));
      delay *= 2;
    }
  }
}

// ============================================================================
// MAIN APPLICATION COMPONENT
// ============================================================================

export default function App() {
  // Navigation & UI State
  const [activeView, setActiveView] = useState('dashboard'); // 'landing' | 'dashboard' | 'skills' | 'careers' | 'roadmap' | 'assessment' | 'mentor' | 'portfolio'
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // User Profile & Gamification State (Persistent in localStorage)
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('skillnova_profile_v1');
    if (saved) return JSON.parse(saved);
    return {
      name: 'Alex Turner',
      handle: 'alex-turner-dev',
      roleTitle: 'Aspiring Software Engineer',
      education: 'B.S. Computer Science',
      targetCareerId: 'fullstack',
      weeklyHours: 12,
      xp: 340,
      streak: 5,
      learningHours: 28,
      skills: [
        { id: 's1', name: 'HTML/CSS', level: 'Advanced', category: 'Frontend' },
        { id: 's2', name: 'JavaScript', level: 'Intermediate', category: 'Language' },
        { id: 's3', name: 'React', level: 'Beginner', category: 'Frontend' },
        { id: 's4', name: 'SQL/Databases', level: 'Intermediate', category: 'Backend' },
        { id: 's5', name: 'Python', level: 'Intermediate', category: 'Language' },
        { id: 's6', name: 'Git & DevOps', level: 'Beginner', category: 'DevOps' }
      ],
      projects: [
        {
          id: 'p1',
          title: 'PulseMetrics Analytics Dashboard',
          description: 'Interactive telemetry dashboard built with React, TypeScript, and Recharts.',
          github: 'https://github.com/alexturner/pulse-metrics',
          live: 'https://pulsemetrics.demo.app',
          verified: true
        },
        {
          id: 'p2',
          title: 'QueryCraft SQL Optimizer',
          description: 'CLI tool that analyzes PostgreSQL EXPLAIN plans and suggests composite indexes.',
          github: 'https://github.com/alexturner/query-craft',
          live: 'https://querycraft.demo.app',
          verified: true
        }
      ],
      certifications: ['AWS Cloud Practitioner Foundational', 'Meta Frontend Developer Certificate'],
      assessmentHistory: [
        { id: 'a1', skill: 'JavaScript', score: 80, total: 5, date: '2 days ago', weakTopics: [] }
      ]
    };
  });

  // Roadmap State
  const [roadmapWeeks, setRoadmapWeeks] = useState(() => {
    const saved = localStorage.getItem('skillnova_roadmap_v1');
    if (saved) return JSON.parse(saved);
    const defaultCareer = CAREER_ROLES[0];
    return defaultCareer.roadmapTemplate.map((w, idx) => ({
      ...w,
      id: `w-${defaultCareer.id}-${w.week}`,
      status: idx === 0 ? 'Completed' : idx === 1 ? 'In Progress' : 'Not Started',
      completedResources: idx === 0 ? [0, 1, 2] : idx === 1 ? [0] : []
    }));
  });

  // Persist changes
  useEffect(() => {
    localStorage.setItem('skillnova_profile_v1', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('skillnova_roadmap_v1', JSON.stringify(roadmapWeeks));
  }, [roadmapWeeks]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ==========================================================================
  // REAL-TIME ANALYTICS & SKILL GAP ENGINE
  // ==========================================================================

  const targetCareer = useMemo(
    () => CAREER_ROLES.find((c) => c.id === userProfile.targetCareerId) || CAREER_ROLES[0],
    [userProfile.targetCareerId]
  );

  const analysis = useMemo(() => {
    let earnedWeight = 0;
    let totalWeight = 0;
    const gaps = [];
    const radarData = [];
    let masteredCount = 0;

    targetCareer.requiredSkills.forEach((req) => {
      totalWeight += req.weight;
      const userSkill = userProfile.skills.find(
        (s) => s.name.toLowerCase() === req.name.toLowerCase()
      );
      const currentNum = userSkill ? LEVEL_MAP[userSkill.level] || 0 : 0;
      const ratio = Math.min(currentNum / req.targetLevel, 1);
      earnedWeight += req.weight * ratio;

      if (currentNum >= req.targetLevel) {
        masteredCount++;
      } else {
        gaps.push({
          skill: req.name,
          currentLevel: REVERSE_LEVEL_MAP[currentNum],
          targetLevel: REVERSE_LEVEL_MAP[req.targetLevel],
          gapSeverity: req.targetLevel - currentNum,
          weight: req.weight
        });
      }

      radarData.push({
        skill: req.name.replace('/Databases', '').replace(' & DevOps', ''),
        Current: currentNum,
        Required: req.targetLevel,
        fullMark: 3
      });
    });

    // Factor in roadmap completion boost (up to +10%)
    const completedWeeks = roadmapWeeks.filter((w) => w.status === 'Completed').length;
    const roadmapBoost = roadmapWeeks.length > 0 ? Math.round((completedWeeks / roadmapWeeks.length) * 10) : 0;

    const baseScore = totalWeight > 0 ? Math.round((earnedWeight / totalWeight) * 90) : 0;
    const readinessScore = Math.min(100, baseScore + roadmapBoost);

    // Sort gaps by severity & weight
    gaps.sort((a, b) => b.gapSeverity * b.weight - a.gapSeverity * a.weight);

    const level = Math.floor(userProfile.xp / 100) + 1;

    return {
      readinessScore,
      masteredCount,
      totalRequired: targetCareer.requiredSkills.length,
      gaps,
      radarData,
      level
    };
  }, [targetCareer, userProfile.skills, userProfile.xp, roadmapWeeks]);

  // ==========================================================================
  // HANDLERS: SKILLS, CAREER CHANGE, ROADMAP
  // ==========================================================================

  const handleAddOrUpdateSkill = (name, level, category = 'Technical') => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setUserProfile((prev) => {
      const existingIdx = prev.skills.findIndex(
        (s) => s.name.toLowerCase() === trimmed.toLowerCase()
      );
      let updatedSkills;
      if (existingIdx >= 0) {
        updatedSkills = [...prev.skills];
        updatedSkills[existingIdx] = { ...updatedSkills[existingIdx], level, category };
      } else {
        updatedSkills = [
          ...prev.skills,
          { id: `s-${Date.now()}`, name: trimmed, level, category }
        ];
      }
      return { ...prev, skills: updatedSkills, xp: prev.xp + 25 };
    });
    showToast(`Skill "${trimmed}" (${level}) saved! +25 XP`);
  };

  const handleDeleteSkill = (id) => {
    setUserProfile((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s.id !== id)
    }));
    showToast('Skill removed from profile', 'info');
  };

  const handleSelectCareer = (careerId) => {
    const newCareer = CAREER_ROLES.find((c) => c.id === careerId);
    if (!newCareer) return;

    setUserProfile((prev) => ({ ...prev, targetCareerId: careerId }));

    // Adaptive Career Change Agent: preserve already mastered transferable skills
    const adaptedWeeks = newCareer.roadmapTemplate.map((w) => {
      const matchingUserSkill = userProfile.skills.find(
        (s) => s.name.toLowerCase() === w.focusSkill.toLowerCase()
      );
      const isAlreadyStrong =
        matchingUserSkill && LEVEL_MAP[matchingUserSkill.level] >= 3;

      return {
        ...w,
        id: `w-${careerId}-${w.week}`,
        status: isAlreadyStrong ? 'Completed' : w.week === 1 ? 'In Progress' : 'Not Started',
        completedResources: isAlreadyStrong ? [0, 1, 2] : []
      };
    });

    setRoadmapWeeks(adaptedWeeks);
    showToast(`Target Career updated to ${newCareer.title}. Transferable skills preserved!`);
    setActiveView('dashboard');
  };

  const handleToggleResource = (weekId, resIdx) => {
    setRoadmapWeeks((prev) =>
      prev.map((w) => {
        if (w.id !== weekId) return w;
        const exists = w.completedResources.includes(resIdx);
        const nextCompleted = exists
          ? w.completedResources.filter((i) => i !== resIdx)
          : [...w.completedResources, resIdx];

        const allDone = nextCompleted.length === w.resources.length;
        const nextStatus = allDone
          ? 'Completed'
          : nextCompleted.length > 0
          ? 'In Progress'
          : 'Not Started';

        if (!exists) {
          setUserProfile((u) => ({
            ...u,
            xp: u.xp + 20,
            learningHours: u.learningHours + 2
          }));
        }

        return {
          ...w,
          completedResources: nextCompleted,
          status: nextStatus
        };
      })
    );
  };

  const handleMarkWeekComplete = (weekId) => {
    setRoadmapWeeks((prev) =>
      prev.map((w) => {
        if (w.id !== weekId) return w;
        const isDone = w.status === 'Completed';
        if (!isDone) {
          setUserProfile((u) => ({
            ...u,
            xp: u.xp + 60,
            learningHours: u.learningHours + w.hours
          }));
          showToast(`Week ${w.week} (${w.focusSkill}) completed! +60 XP`);
        }
        return {
          ...w,
          status: isDone ? 'In Progress' : 'Completed',
          completedResources: isDone ? [] : w.resources.map((_, i) => i)
        };
      })
    );
  };

  // ==========================================================================
  // NAVIGATION ITEMS
  // ==========================================================================

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'skills', label: 'My Skills & Gaps', icon: Layers },
    { id: 'careers', label: 'Career Paths', icon: Compass },
    { id: 'roadmap', label: 'Learning Roadmap', icon: Map },
    { id: 'assessment', label: 'Assessment Center', icon: CheckCircle2 },
    { id: 'mentor', label: 'AI Career Mentor', icon: MessageSquare },
    { id: 'portfolio', label: 'Skill Portfolio', icon: Award },
  ];

  // ==========================================================================
  // RENDER LANDING PAGE VIEW
  // ==========================================================================

  if (activeView === 'landing') {
    return (
      <div className="min-h-screen bg-[#080B16] text-[#F8FAFC] font-sans selection:bg-[#6366F1]/30">
        {/* Top Navbar */}
        <header className="sticky top-0 z-40 border-b border-[#1F2937]/80 bg-[#080B16]/80 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#6366F1] via-[#8B5CF6] to-[#22D3EE] flex items-center justify-center shadow-lg shadow-[#6366F1]/25">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white to-[#94A3B8] bg-clip-text text-transparent">
                SkillNova AI
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveView('careers')}
                className="hidden sm:inline-flex px-4 py-2 text-sm font-medium text-[#94A3B8] hover:text-white transition"
              >
                Explore Careers
              </button>
              <button
                onClick={() => setActiveView('dashboard')}
                className="px-4 py-2 rounded-lg bg-[#6366F1] hover:bg-[#5558E6] text-white text-sm font-medium transition shadow-lg shadow-[#6366F1]/25 flex items-center gap-2"
              >
                Launch App <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative overflow-hidden pt-20 pb-24 px-4 sm:px-6 lg:px-8">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[680px] h-[340px] bg-gradient-to-r from-[#6366F1]/20 via-[#8B5CF6]/15 to-[#22D3EE]/20 blur-3xl rounded-full" />
          </div>

          <div className="relative max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111827] border border-[#1F2937] text-xs font-medium text-[#22D3EE] mb-6">
              <Sparkles className="w-3.5 h-3.5" /> Multi-Agent AI Career Operating System
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
              Find your skill gaps.{' '}
              <span className="bg-gradient-to-r from-[#6366F1] via-[#8B5CF6] to-[#22D3EE] bg-clip-text text-transparent">
                Reach your career goal.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-[#94A3B8] max-w-2xl mx-auto mb-10 leading-relaxed">
              SkillNova AI analyzes your skills, builds a personalized roadmap, and guides you until you become job-ready.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => setActiveView('dashboard')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:opacity-95 text-white font-semibold text-base shadow-xl shadow-[#6366F1]/25 transition flex items-center justify-center gap-2"
              >
                Get Started (Launch App) <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveView('careers')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#111827] hover:bg-[#161F32] border border-[#1F2937] text-[#F8FAFC] font-semibold text-base transition flex items-center justify-center gap-2"
              >
                <Compass className="w-4 h-4 text-[#22D3EE]" /> Explore Careers
              </button>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-[#1F2937]/60">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Engineered for Measurable Career Outcomes</h2>
            <p className="text-[#94A3B8] max-w-xl mx-auto">
              Six specialized AI agents continuously calibrate your learning path from first commit to offer letter.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Target,
                title: 'Skill DNA & Gap Radar',
                desc: 'Quantify your exact readiness score against real industry role benchmarks and visualize missing competencies.'
              },
              {
                icon: Map,
                title: 'Adaptive Week-by-Week Roadmap',
                desc: 'Dynamic curriculum that automatically restructures when you ace assessments, fall behind, or switch careers.'
              },
              {
                icon: Brain,
                title: 'Gemini AI Career Mentor',
                desc: 'Context-aware technical mentor that knows your weak topics, current week, and projects to give tailored guidance.'
              },
              {
                icon: CheckCircle2,
                title: 'Diagnostic Skill Assessments',
                desc: 'AI-evaluated technical quizzes that detect concept blind spots and trigger targeted revision modules.'
              },
              {
                icon: Flame,
                title: 'XP, Streaks & Leveling',
                desc: 'Stay accountable with daily learning streaks, XP rewards, and structured weekly hands-on mini projects.'
              },
              {
                icon: ShieldCheck,
                title: 'Proof-of-Skill Portfolio',
                desc: 'Shareable verified credential page with assessment scores, live project demos, and QR verification.'
              }
            ].map((feat, i) => {
              const Icon = feat.icon;
              return (
                <div
                  key={i}
                  className="p-6 rounded-2xl bg-[#111827]/80 border border-[#1F2937] hover:border-[#6366F1]/50 transition group"
                >
                  <div className="w-11 h-11 rounded-xl bg-[#161F32] border border-[#1F2937] flex items-center justify-center mb-4 group-hover:scale-105 transition">
                    <Icon className="w-5 h-5 text-[#22D3EE]" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-white">{feat.title}</h3>
                  <p className="text-sm text-[#94A3B8] leading-relaxed">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* How it Works */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-[#1F2937]/60">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">How SkillNova AI Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Map Your Skills', desc: 'Log your current stack and proficiency levels.' },
              { step: '02', title: 'Select Target Role', desc: 'Benchmark against Full Stack, AI/ML, Data, or Cloud roles.' },
              { step: '03', title: 'Execute Weekly Sprints', desc: 'Complete curated resources and hands-on mini projects.' },
              { step: '04', title: 'Verify & Share', desc: 'Pass AI assessments and publish your Proof-of-Skill portfolio.' }
            ].map((item) => (
              <div key={item.step} className="p-6 rounded-2xl bg-[#0D1220] border border-[#1F2937]">
                <span className="text-xs font-mono font-bold text-[#6366F1] tracking-widest">STEP {item.step}</span>
                <h3 className="text-lg font-semibold mt-2 mb-1">{item.title}</h3>
                <p className="text-sm text-[#94A3B8]">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-[#1F2937]/60">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote: 'SkillNova spotted my weak async JS and SQL indexing gaps immediately. In 6 weeks my readiness went from 52% to 91%.',
                author: 'Priya Nair',
                role: 'Full Stack Engineer @ FinStack'
              },
              {
                quote: 'Switching from Data Analyst to AI/ML Engineer felt overwhelming until the Career Change Agent preserved my Python & SQL credits.',
                author: 'Marcus Vance',
                role: 'Applied ML Engineer @ Synthetix'
              },
              {
                quote: 'Sharing my verified Proof-of-Skill portfolio link in recruiter outreach doubled my technical interview callbacks.',
                author: 'Elena Rostova',
                role: 'Cloud Platform Engineer'
              }
            ].map((t, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-[#111827] border border-[#1F2937]">
                <p className="text-sm text-[#F8FAFC] italic mb-4 leading-relaxed">"{t.quote}"</p>
                <div className="text-sm font-semibold text-white">{t.author}</div>
                <div className="text-xs text-[#22D3EE]">{t.role}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  // ==========================================================================
  // RENDER MAIN SAAS APPLICATION SHELL (SIDEBAR + HEADER + VIEWS)
  // ==========================================================================

  return (
    <div className="min-h-screen bg-[#080B16] text-[#F8FAFC] flex font-sans">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#161F32] border border-[#6366F1]/50 shadow-2xl text-sm font-medium text-white animate-fade-in">
          <Sparkles className="w-4 h-4 text-[#22D3EE]" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Mobile Sidebar Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Left Sidebar Navigation */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-[#0D1220] border-r border-[#1F2937] flex flex-col transition-transform duration-200 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-[#1F2937]">
          <button
            onClick={() => setActiveView('landing')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6366F1] via-[#8B5CF6] to-[#22D3EE] flex items-center justify-center shadow-md shadow-[#6366F1]/25">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-sm font-bold tracking-tight text-white group-hover:text-[#22D3EE] transition">
                SkillNova AI
              </div>
              <div className="text-[10px] font-mono text-[#94A3B8]">CAREER OS v2.4</div>
            </div>
          </button>

          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden p-1.5 text-[#94A3B8] hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveView(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                  active
                    ? 'bg-gradient-to-r from-[#6366F1]/20 to-[#8B5CF6]/10 text-white border border-[#6366F1]/40 shadow-sm'
                    : 'text-[#94A3B8] hover:text-white hover:bg-[#161F32]/60'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${active ? 'text-[#22D3EE]' : 'text-[#94A3B8]'}`} />
                  {item.label}
                </span>
                {item.id === 'skills' && analysis.gaps.length > 0 && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-[#6366F1]/20 text-[#22D3EE]">
                    {analysis.gaps.length}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom User Level Card */}
        <div className="p-4 border-t border-[#1F2937]">
          <div className="p-3.5 rounded-xl bg-[#111827] border border-[#1F2937]">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-white">Level {analysis.level} Scholar</span>
              <span className="font-mono text-[#22D3EE]">{userProfile.xp} XP</span>
            </div>
            <div className="w-full h-1.5 bg-[#161F32] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#6366F1] to-[#22D3EE] transition-all duration-500"
                style={{ width: `${userProfile.xp % 100}%` }}
              />
            </div>
            <button
              onClick={() => setActiveView('landing')}
              className="mt-3 w-full text-center text-xs text-[#94A3B8] hover:text-white transition"
            >
              ← View Landing Page
            </button>
          </div>
        </div>
      </aside>

      {/* Right Main Content Column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 px-4 sm:px-8 border-b border-[#1F2937] bg-[#080B16]/80 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg bg-[#111827] border border-[#1F2937] text-[#94A3B8]"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-xs text-[#94A3B8]">
              <span>Target Role:</span>
              <button
                onClick={() => setActiveView('careers')}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#111827] border border-[#1F2937] hover:border-[#6366F1] text-white font-medium transition"
              >
                <Target className="w-3.5 h-3.5 text-[#22D3EE]" />
                {targetCareer.title}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#111827] border border-[#1F2937] text-xs">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-semibold text-white">{userProfile.streak}d Streak</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#111827] border border-[#1F2937] text-xs">
              <Zap className="w-3.5 h-3.5 text-[#22D3EE]" />
              <span className="font-semibold text-white">{analysis.readinessScore}% Ready</span>
            </div>

            <button
              onClick={() => setActiveView('portfolio')}
              className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#6366F1] to-[#8B5CF6] flex items-center justify-center text-xs font-bold text-white shadow-md"
              title="View Public Portfolio"
            >
              {userProfile.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </button>
          </div>
        </header>

        {/* Dynamic Page Views */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeView === 'dashboard' && (
            <DashboardView
              userProfile={userProfile}
              targetCareer={targetCareer}
              analysis={analysis}
              roadmapWeeks={roadmapWeeks}
              setActiveView={setActiveView}
            />
          )}

          {activeView === 'skills' && (
            <SkillsGapView
              userProfile={userProfile}
              targetCareer={targetCareer}
              analysis={analysis}
              onSaveSkill={handleAddOrUpdateSkill}
              onDeleteSkill={handleDeleteSkill}
            />
          )}

          {activeView === 'careers' && (
            <CareerPathsView
              careers={CAREER_ROLES}
              userProfile={userProfile}
              onSelectCareer={handleSelectCareer}
            />
          )}

          {activeView === 'roadmap' && (
            <RoadmapView
              targetCareer={targetCareer}
              roadmapWeeks={roadmapWeeks}
              onToggleResource={handleToggleResource}
              onMarkWeekComplete={handleMarkWeekComplete}
              setActiveView={setActiveView}
            />
          )}

          {activeView === 'assessment' && (
            <AssessmentView
              userProfile={userProfile}
              setUserProfile={setUserProfile}
              roadmapWeeks={roadmapWeeks}
              setRoadmapWeeks={setRoadmapWeeks}
              showToast={showToast}
            />
          )}

          {activeView === 'mentor' && (
            <MentorChatView
              userProfile={userProfile}
              targetCareer={targetCareer}
              analysis={analysis}
              roadmapWeeks={roadmapWeeks}
            />
          )}

          {activeView === 'portfolio' && (
            <PortfolioView
              userProfile={userProfile}
              targetCareer={targetCareer}
              analysis={analysis}
              roadmapWeeks={roadmapWeeks}
              showToast={showToast}
            />
          )}
        </main>
      </div>
    </div>
  );
}

// ============================================================================
// VIEW 2: DASHBOARD VIEW
// ============================================================================

function DashboardView({ userProfile, targetCareer, analysis, roadmapWeeks, setActiveView }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (analysis.readinessScore / 100) * circumference;

  const activeWeek =
    roadmapWeeks.find((w) => w.status === 'Needs Revision') ||
    roadmapWeeks.find((w) => w.status === 'In Progress') ||
    roadmapWeeks[0];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#111827] via-[#111827] to-[#161F32] border border-[#1F2937] relative overflow-hidden">
        <div className="absolute right-0 top-0 w-72 h-72 bg-[#6366F1]/10 blur-3xl rounded-full pointer-events-none" />

        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#161F32] border border-[#1F2937] text-xs font-medium text-[#22D3EE] mb-3">
              <Sparkles className="w-3.5 h-3.5" /> Personalized AI Career Intelligence
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Welcome back, {userProfile.name}
            </h1>
            <p className="text-sm text-[#94A3B8] max-w-xl">
              Target Track: <span className="text-white font-semibold">{targetCareer.title}</span>.{' '}
              {analysis.gaps.length > 0
                ? `Closing ${analysis.gaps.length} remaining skill gaps will bring you to 100% job readiness.`
                : 'You have met all core technical benchmarks for this role!'}
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-5">
              <button
                onClick={() => setActiveView('roadmap')}
                className="px-4 py-2.5 rounded-xl bg-[#6366F1] hover:bg-[#5558E6] text-white text-sm font-medium transition shadow-lg shadow-[#6366F1]/25 flex items-center gap-2"
              >
                <Play className="w-4 h-4" /> Continue Learning
              </button>
              <button
                onClick={() => setActiveView('mentor')}
                className="px-4 py-2.5 rounded-xl bg-[#161F32] hover:bg-[#1E293B] border border-[#1F2937] text-white text-sm font-medium transition flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4 text-[#22D3EE]" /> Ask AI Mentor
              </button>
            </div>
          </div>

          {/* Animated Career Readiness Ring */}
          <div className="flex items-center gap-5 p-4 rounded-2xl bg-[#0D1220]/90 border border-[#1F2937] self-start lg:self-center">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-32 h-32 -rotate-90" viewBox="0 0 128 128">
                <circle
                  cx="64"
                  cy="64"
                  r={radius}
                  stroke="#1F2937"
                  strokeWidth="10"
                  fill="transparent"
                />
                <circle
                  cx="64"
                  cy="64"
                  r={radius}
                  stroke="url(#readinessGrad)"
                  strokeWidth="10"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-700 ease-out"
                />
                <defs>
                  <linearGradient id="readinessGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#6366F1" />
                    <stop offset="50%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#22D3EE" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-extrabold text-white">{analysis.readinessScore}%</span>
                <span className="text-[10px] uppercase tracking-wider text-[#94A3B8]">Readiness</span>
              </div>
            </div>
            <div>
              <div className="text-xs font-medium text-[#94A3B8]">Role Fit Status</div>
              <div className="text-base font-bold text-white mt-0.5">
                {analysis.readinessScore >= 80
                  ? 'Interview Ready'
                  : analysis.readinessScore >= 55
                  ? 'Strong Momentum'
                  : 'Foundation Stage'}
              </div>
              <div className="text-xs text-[#10B981] mt-1">
                {analysis.masteredCount}/{analysis.totalRequired} Core Skills Mastered
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 6 KPI Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Readiness Score', value: `${analysis.readinessScore}%`, icon: Target, color: 'text-[#22D3EE]' },
          { label: 'Skills Mastered', value: `${analysis.masteredCount}/${analysis.totalRequired}`, icon: CheckCircle2, color: 'text-[#10B981]' },
          { label: 'Learning Hours', value: `${userProfile.learningHours}h`, icon: Clock, color: 'text-[#6366F1]' },
          { label: 'Current Streak', value: `${userProfile.streak} Days`, icon: Flame, color: 'text-amber-400' },
          { label: 'XP Points', value: `${userProfile.xp} XP`, icon: Zap, color: 'text-[#8B5CF6]' },
          { label: 'Current Level', value: `Level ${analysis.level}`, icon: Trophy, color: 'text-emerald-400' },
        ].map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-[#111827] border border-[#1F2937] hover:border-[#6366F1]/40 transition"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[#94A3B8]">{kpi.label}</span>
                <Icon className={`w-4 h-4 ${kpi.color}`} />
              </div>
              <div className="text-xl font-bold text-white">{kpi.value}</div>
            </div>
          );
        })}
      </div>

      {/* Middle Analytics Grid: Skill DNA Radar + Priority Gaps & Focus */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Skill DNA Radar Chart */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-[#111827] border border-[#1F2937]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white">Skill DNA Radar</h2>
              <p className="text-xs text-[#94A3B8]">Your proficiency (1–3) vs {targetCareer.title} benchmarks</p>
            </div>
            <button
              onClick={() => setActiveView('skills')}
              className="text-xs font-medium text-[#22D3EE] hover:underline"
            >
              Edit Skills →
            </button>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="72%" data={analysis.radarData}>
                <PolarGrid stroke="#1F2937" />
                <PolarAngleAxis dataKey="skill" tick={{ fill: '#94A3B8', fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 3]} tick={false} axisLine={false} />
                <Radar
                  name="Target Required"
                  dataKey="Required"
                  stroke="#8B5CF6"
                  fill="#8B5CF6"
                  fillOpacity={0.18}
                />
                <Radar
                  name="Your Current Level"
                  dataKey="Current"
                  stroke="#22D3EE"
                  fill="#22D3EE"
                  fillOpacity={0.35}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0D1220',
                    borderColor: '#1F2937',
                    borderRadius: '12px',
                    color: '#F8FAFC',
                    fontSize: '12px'
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Skill Gaps & Today's Focus Plan */}
        <div className="lg:col-span-6 space-y-6">
          {/* Priority Skill Gaps */}
          <div className="p-6 rounded-2xl bg-[#111827] border border-[#1F2937]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-white">Priority Skill Gaps</h2>
              <span className="text-xs text-[#94A3B8]">{analysis.gaps.length} gaps detected</span>
            </div>

            {analysis.gaps.length === 0 ? (
              <div className="p-4 rounded-xl bg-[#10B981]/10 border border-[#10B981]/30 text-sm text-[#10B981]">
                All target competencies satisfied! Ready for mock interviews and portfolio showcase.
              </div>
            ) : (
              <div className="space-y-3">
                {analysis.gaps.slice(0, 3).map((gap) => (
                  <div
                    key={gap.skill}
                    className="p-3.5 rounded-xl bg-[#0D1220] border border-[#1F2937] flex items-center justify-between"
                  >
                    <div>
                      <div className="text-sm font-semibold text-white">{gap.skill}</div>
                      <div className="text-xs text-[#94A3B8]">
                        Current: <span className="text-amber-400">{gap.currentLevel}</span> → Target:{' '}
                        <span className="text-[#22D3EE]">{gap.targetLevel}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveView('assessment')}
                      className="px-3 py-1.5 rounded-lg bg-[#161F32] hover:bg-[#6366F1] text-xs font-medium text-white transition"
                    >
                      Verify Skill
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Today's Focus Plan */}
          {activeWeek && (
            <div className="p-6 rounded-2xl bg-[#111827] border border-[#1F2937]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono uppercase tracking-wider text-[#22D3EE]">
                  Today's Focus • Week {activeWeek.week}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                    activeWeek.status === 'Needs Revision'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : 'bg-[#6366F1]/20 text-[#22D3EE] border border-[#6366F1]/30'
                  }`}
                >
                  {activeWeek.status}
                </span>
              </div>
              <h3 className="text-base font-bold text-white mb-1">{activeWeek.title}</h3>
              <p className="text-xs text-[#94A3B8] mb-4">Mini Project: {activeWeek.project}</p>
              <button
                onClick={() => setActiveView('roadmap')}
                className="w-full py-2.5 rounded-xl bg-[#161F32] hover:bg-[#1E293B] border border-[#1F2937] text-xs font-semibold text-white transition flex items-center justify-center gap-1.5"
              >
                Open Week {activeWeek.week} Module <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// VIEW 3: MY SKILLS & GAP ANALYSIS VIEW
// ============================================================================

function SkillsGapView({ userProfile, targetCareer, analysis, onSaveSkill, onDeleteSkill }) {
  const [skillName, setSkillName] = useState('');
  const [skillLevel, setSkillLevel] = useState('Intermediate');
  const [skillCategory, setSkillCategory] = useState('Technical');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!skillName.trim()) return;
    onSaveSkill(skillName, skillLevel, skillCategory);
    setSkillName('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">My Skills & Real-Time Gap Analysis</h1>
          <p className="text-sm text-[#94A3B8]">
            Add or update your skill proficiency to dynamically recalculate your {targetCareer.title} readiness ({analysis.readinessScore}%).
          </p>
        </div>
      </div>

      {/* Add / Update Skill Form */}
      <form
        onSubmit={handleSubmit}
        className="p-6 rounded-2xl bg-[#111827] border border-[#1F2937] grid grid-cols-1 sm:grid-cols-12 gap-4 items-end"
      >
        <div className="sm:col-span-5">
          <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">
            Skill Name (e.g., React, Node.js, Python, Docker)
          </label>
          <input
            type="text"
            value={skillName}
            onChange={(e) => setSkillName(e.target.value)}
            placeholder="Enter skill name..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D1220] border border-[#1F2937] focus:border-[#6366F1] focus:outline-none text-sm text-white"
            required
          />
        </div>

        <div className="sm:col-span-3">
          <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">Proficiency Level</label>
          <select
            value={skillLevel}
            onChange={(e) => setSkillLevel(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D1220] border border-[#1F2937] focus:border-[#6366F1] focus:outline-none text-sm text-white"
          >
            <option value="Beginner">Beginner (Level 1)</option>
            <option value="Intermediate">Intermediate (Level 2)</option>
            <option value="Advanced">Advanced (Level 3)</option>
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">Category</label>
          <select
            value={skillCategory}
            onChange={(e) => setSkillCategory(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D1220] border border-[#1F2937] focus:border-[#6366F1] focus:outline-none text-sm text-white"
          >
            <option value="Frontend">Frontend</option>
            <option value="Backend">Backend</option>
            <option value="Language">Language</option>
            <option value="DevOps">DevOps</option>
            <option value="AI/Data">AI / Data</option>
          </select>
        </div>

        <div className="sm:col-span-2">
          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl bg-[#6366F1] hover:bg-[#5558E6] text-white text-sm font-semibold transition flex items-center justify-center gap-1.5 shadow-lg shadow-[#6366F1]/25"
          >
            <Plus className="w-4 h-4" /> Save Skill
          </button>
        </div>
      </form>

      {/* Quick Add Missing Target Skills */}
      {analysis.gaps.length > 0 && (
        <div className="p-5 rounded-2xl bg-[#0D1220] border border-[#1F2937]">
          <div className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-3">
            Quick-Calibrate Target Role Skills
          </div>
          <div className="flex flex-wrap gap-2">
            {analysis.gaps.map((gap) => (
              <button
                key={gap.skill}
                onClick={() => onSaveSkill(gap.skill, gap.targetLevel, 'Core')}
                className="px-3 py-1.5 rounded-lg bg-[#111827] hover:bg-[#161F32] border border-[#1F2937] hover:border-[#22D3EE] text-xs text-white flex items-center gap-1.5 transition"
              >
                <Plus className="w-3.5 h-3.5 text-[#22D3EE]" />
                Set {gap.skill} to {gap.targetLevel}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Current Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {userProfile.skills.map((skill) => {
          const num = LEVEL_MAP[skill.level] || 1;
          const pct = Math.round((num / 3) * 100);
          return (
            <div
              key={skill.id}
              className="p-5 rounded-2xl bg-[#111827] border border-[#1F2937] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="text-[11px] font-mono text-[#22D3EE]">{skill.category}</span>
                    <h3 className="text-base font-bold text-white">{skill.name}</h3>
                  </div>
                  <button
                    onClick={() => onDeleteSkill(skill.id)}
                    className="p-1.5 rounded-lg text-[#94A3B8] hover:text-rose-400 hover:bg-[#161F32] transition"
                    title="Remove skill"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Level Switcher Pills */}
                <div className="grid grid-cols-3 gap-1.5 mb-4">
                  {['Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => onSaveSkill(skill.name, lvl, skill.category)}
                      className={`py-1.5 rounded-lg text-xs font-medium transition ${
                        skill.level === lvl
                          ? 'bg-[#6366F1] text-white'
                          : 'bg-[#0D1220] text-[#94A3B8] hover:text-white'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-[#94A3B8] mb-1">
                  <span>Mastery</span>
                  <span>{pct}%</span>
                </div>
                <div className="w-full h-1.5 bg-[#0D1220] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#6366F1] to-[#10B981] transition-all duration-300"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// VIEW 4: CAREER PATHS VIEW
// ============================================================================

function CareerPathsView({ careers, userProfile, onSelectCareer }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Explore AI-Calibrated Career Paths</h1>
        <p className="text-sm text-[#94A3B8]">
          Select a target role. Our Career Change Agent automatically preserves your transferable skills and rebuilds your roadmap.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {careers.map((career) => {
          const Icon = career.icon;
          const isSelected = userProfile.targetCareerId === career.id;

          // Calculate live fit preview for this role
          let matchedWeight = 0;
          let totalWeight = 0;
          career.requiredSkills.forEach((req) => {
            totalWeight += req.weight;
            const found = userProfile.skills.find(
              (s) => s.name.toLowerCase() === req.name.toLowerCase()
            );
            if (found) {
              matchedWeight += req.weight * Math.min(LEVEL_MAP[found.level] / req.targetLevel, 1);
            }
          });
          const fitScore = Math.round((matchedWeight / totalWeight) * 100);

          return (
            <div
              key={career.id}
              className={`p-6 rounded-2xl border flex flex-col justify-between transition ${
                isSelected
                  ? 'bg-[#161F32] border-[#6366F1] shadow-xl shadow-[#6366F1]/10'
                  : 'bg-[#111827] border-[#1F2937] hover:border-[#6366F1]/50'
              }`}
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-[#0D1220] border border-[#1F2937] flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[#22D3EE]" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#10B981]/15 text-[#10B981]">
                    {fitScore}% Skill Match
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-1">{career.title}</h3>
                <p className="text-xs text-[#94A3B8] mb-4 leading-relaxed">{career.description}</p>

                <div className="flex items-center justify-between text-xs py-2.5 px-3 rounded-xl bg-[#0D1220] border border-[#1F2937] mb-4">
                  <div>
                    <span className="text-[#94A3B8] block">Avg. Compensation</span>
                    <span className="font-semibold text-white">{career.salary}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[#94A3B8] block">Market Demand</span>
                    <span className="font-semibold text-[#22D3EE]">{career.demand}</span>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="text-xs font-medium text-[#94A3B8] mb-2">Required Stack:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {career.requiredSkills.map((req) => {
                      const hasSkill = userProfile.skills.some(
                        (s) => s.name.toLowerCase() === req.name.toLowerCase()
                      );
                      return (
                        <span
                          key={req.name}
                          className={`px-2.5 py-1 rounded-md text-[11px] font-medium border ${
                            hasSkill
                              ? 'bg-[#10B981]/15 border-[#10B981]/30 text-[#10B981]'
                              : 'bg-[#0D1220] border-[#1F2937] text-[#94A3B8]'
                          }`}
                        >
                          {req.name}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              <button
                onClick={() => onSelectCareer(career.id)}
                className={`w-full py-2.5 rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2 ${
                  isSelected
                    ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40'
                    : 'bg-[#6366F1] hover:bg-[#5558E6] text-white shadow-lg shadow-[#6366F1]/25'
                }`}
              >
                {isSelected ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> Active Target Career
                  </>
                ) : (
                  <>Select Target Career</>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// VIEW 5: PERSONALIZED WEEK-WISE LEARNING ROADMAP VIEW
// ============================================================================

function RoadmapView({ targetCareer, roadmapWeeks, onToggleResource, onMarkWeekComplete, setActiveView }) {
  const completedCount = roadmapWeeks.filter((w) => w.status === 'Completed').length;
  const overallProgress =
    roadmapWeeks.length > 0 ? Math.round((completedCount / roadmapWeeks.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header & Overall Progress Bar */}
      <div className="p-6 rounded-2xl bg-[#111827] border border-[#1F2937]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <span className="text-xs font-mono text-[#22D3EE] uppercase tracking-wider">
              Adaptive Learning Path
            </span>
            <h1 className="text-2xl font-bold text-white">{targetCareer.title} Roadmap</h1>
          </div>
          <div className="text-right">
            <div className="text-2xl font-extrabold text-white">{overallProgress}%</div>
            <div className="text-xs text-[#94A3B8]">
              {completedCount} of {roadmapWeeks.length} Weekly Sprints Completed
            </div>
          </div>
        </div>

        <div className="w-full h-2.5 bg-[#0D1220] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#6366F1] via-[#8B5CF6] to-[#10B981] transition-all duration-500"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>

      {/* Weekly Sprint Cards */}
      <div className="space-y-4">
        {roadmapWeeks.map((week) => {
          const isCompleted = week.status === 'Completed';
          const needsRevision = week.status === 'Needs Revision';

          return (
            <div
              key={week.id}
              className={`p-6 rounded-2xl border transition ${
                needsRevision
                  ? 'bg-[#111827] border-rose-500/50'
                  : isCompleted
                  ? 'bg-[#111827]/70 border-[#10B981]/40'
                  : 'bg-[#111827] border-[#1F2937]'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#1F2937]">
                <div>
                  <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
                    <span className="px-2.5 py-0.5 rounded-md bg-[#161F32] text-xs font-mono font-bold text-[#22D3EE]">
                      WEEK {week.week}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md bg-[#6366F1]/20 text-xs font-medium text-[#8B5CF6]">
                      Focus: {week.focusSkill}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        needsRevision
                          ? 'bg-rose-500/20 text-rose-300'
                          : isCompleted
                          ? 'bg-[#10B981]/20 text-[#10B981]'
                          : week.status === 'In Progress'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-[#161F32] text-[#94A3B8]'
                      }`}
                    >
                      {week.status}
                    </span>
                    <span className="text-xs text-[#94A3B8] flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {week.hours}h est.
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white">{week.title}</h3>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => setActiveView('assessment')}
                    className="px-3.5 py-2 rounded-xl bg-[#161F32] hover:bg-[#1E293B] border border-[#1F2937] text-xs font-semibold text-white transition"
                  >
                    Take Skill Quiz
                  </button>
                  <button
                    onClick={() => onMarkWeekComplete(week.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                      isCompleted
                        ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40'
                        : 'bg-[#6366F1] hover:bg-[#5558E6] text-white'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {isCompleted ? 'Completed' : 'Complete Week'}
                  </button>
                </div>
              </div>

              {needsRevision && (
                <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2.5 text-xs text-rose-200">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>
                    Adaptive Rule Triggered: Recent quiz score was below 50%. Review the resources below and retake the {week.focusSkill} quiz to unlock progression.
                  </span>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4">
                {/* Objectives & Mini Project */}
                <div className="lg:col-span-6 space-y-3">
                  <div>
                    <div className="text-xs font-semibold text-[#94A3B8] uppercase mb-1.5">
                      Learning Objectives
                    </div>
                    <ul className="space-y-1">
                      {week.objectives.map((obj, i) => (
                        <li key={i} className="text-sm text-[#F8FAFC] flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#22D3EE]" />
                          {obj}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#0D1220] border border-[#1F2937]">
                    <div className="text-[11px] font-mono text-[#8B5CF6] uppercase">Hands-On Mini Project</div>
                    <div className="text-sm font-semibold text-white mt-0.5">{week.project}</div>
                  </div>
                </div>

                {/* Interactive Resource Checklist */}
                <div className="lg:col-span-6">
                  <div className="text-xs font-semibold text-[#94A3B8] uppercase mb-2">
                    Curated Resources (Check off as you complete)
                  </div>
                  <div className="space-y-2">
                    {week.resources.map((res, rIdx) => {
                      const checked = week.completedResources.includes(rIdx);
                      return (
                        <button
                          key={rIdx}
                          onClick={() => onToggleResource(week.id, rIdx)}
                          className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition ${
                            checked
                              ? 'bg-[#10B981]/10 border-[#10B981]/30 text-white'
                              : 'bg-[#0D1220] border-[#1F2937] hover:border-[#6366F1]/50 text-[#F8FAFC]'
                          }`}
                        >
                          <span className="flex items-center gap-2.5 text-sm">
                            {checked ? (
                              <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                            ) : (
                              <Circle className="w-4 h-4 text-[#94A3B8] shrink-0" />
                            )}
                            <span className={checked ? 'line-through text-[#94A3B8]' : ''}>{res}</span>
                          </span>
                          <span className="text-[11px] font-mono text-[#22D3EE]">+20 XP</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// VIEW 6: ASSESSMENT CENTER VIEW (AI DIAGNOSTIC QUIZZES + ADAPTIVE ENGINE)
// ============================================================================

function AssessmentView({ userProfile, setUserProfile, roadmapWeeks, setRoadmapWeeks, showToast }) {
  const availableSkills = Object.keys(QUESTION_BANK);
  const [selectedSkill, setSelectedSkill] = useState(availableSkills[0]);
  const [answers, setAnswers] = useState({});
  const [submittedResult, setSubmittedResult] = useState(null);

  const questions = QUESTION_BANK[selectedSkill] || QUESTION_BANK['React'];

  const handleSelectOption = (qIdx, optIdx) => {
    if (submittedResult) return;
    setAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleStartNewQuiz = (skill) => {
    setSelectedSkill(skill);
    setAnswers({});
    setSubmittedResult(null);
  };

  const handleSubmitQuiz = () => {
    if (Object.keys(answers).length < questions.length) {
      showToast('Please answer all 5 questions before submitting.', 'error');
      return;
    }

    let correctCount = 0;
    const weakTopics = [];

    questions.forEach((q, idx) => {
      if (answers[idx] === q.correct) {
        correctCount++;
      } else {
        weakTopics.push(q.topic);
      }
    });

    const percentage = Math.round((correctCount / questions.length) * 100);

    // ADAPTIVE BEHAVIOR RULES ENGINE
    let adaptiveMessage = '';
    if (percentage < 50) {
      adaptiveMessage = `Score below 50%. Adaptive Engine marked "${selectedSkill}" as Needs Revision in your roadmap.`;
      setRoadmapWeeks((prev) =>
        prev.map((w) =>
          w.focusSkill.toLowerCase().includes(selectedSkill.toLowerCase()) ||
          selectedSkill.toLowerCase().includes(w.focusSkill.toLowerCase())
            ? { ...w, status: 'Needs Revision' }
            : w
        )
      );
    } else if (percentage >= 70) {
      adaptiveMessage = `Mastery verified (≥70%)! "${selectedSkill}" upgraded to Advanced, +100 XP awarded, and roadmap updated!`;
      setRoadmapWeeks((prev) =>
        prev.map((w) =>
          w.focusSkill.toLowerCase().includes(selectedSkill.toLowerCase()) ||
          selectedSkill.toLowerCase().includes(w.focusSkill.toLowerCase())
            ? { ...w, status: 'Completed', completedResources: w.resources.map((_, i) => i) }
            : w
        )
      );
      setUserProfile((prev) => {
        const exists = prev.skills.some((s) => s.name.toLowerCase() === selectedSkill.toLowerCase());
        const updatedSkills = exists
          ? prev.skills.map((s) =>
              s.name.toLowerCase() === selectedSkill.toLowerCase() ? { ...s, level: 'Advanced' } : s
            )
          : [...prev.skills, { id: `s-${Date.now()}`, name: selectedSkill, level: 'Advanced', category: 'Verified' }];
        return {
          ...prev,
          xp: prev.xp + 100,
          skills: updatedSkills,
          assessmentHistory: [
            {
              id: `a-${Date.now()}`,
              skill: selectedSkill,
              score: percentage,
              total: questions.length,
              date: 'Just now',
              weakTopics
            },
            ...prev.assessmentHistory
          ]
        };
      });
    } else {
      adaptiveMessage = `Solid attempt (${percentage}%). Skill marked In Progress—review weak topics and retake to hit ≥70%.`;
      setUserProfile((prev) => ({
        ...prev,
        xp: prev.xp + 30,
        assessmentHistory: [
          {
            id: `a-${Date.now()}`,
            skill: selectedSkill,
            score: percentage,
            total: questions.length,
            date: 'Just now',
            weakTopics
          },
          ...prev.assessmentHistory
        ]
      }));
    }

    setSubmittedResult({
      score: percentage,
      correctCount,
      total: questions.length,
      weakTopics,
      adaptiveMessage
    });

    showToast(adaptiveMessage);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">AI Diagnostic Assessment Center</h1>
          <p className="text-sm text-[#94A3B8]">
            Validate technical mastery. Scores ≥70% unlock roadmap modules & award +100 XP; scores &lt;50% trigger targeted revision.
          </p>
        </div>

        {/* Skill Selector Tabs */}
        <div className="flex flex-wrap gap-2">
          {availableSkills.map((skill) => (
            <button
              key={skill}
              onClick={() => handleStartNewQuiz(skill)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                selectedSkill === skill
                  ? 'bg-[#6366F1] text-white shadow-lg shadow-[#6366F1]/25'
                  : 'bg-[#111827] border border-[#1F2937] text-[#94A3B8] hover:text-white'
              }`}
            >
              {skill}
            </button>
          ))}
        </div>
      </div>

      {/* Results Banner if Submitted */}
      {submittedResult && (
        <div
          className={`p-6 rounded-2xl border ${
            submittedResult.score >= 70
              ? 'bg-[#10B981]/10 border-[#10B981]/40'
              : submittedResult.score < 50
              ? 'bg-rose-500/10 border-rose-500/40'
              : 'bg-amber-500/10 border-amber-500/40'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-[#22D3EE]">
                Diagnostic Evaluation Complete
              </div>
              <h2 className="text-2xl font-extrabold text-white mt-1">
                Score: {submittedResult.score}% ({submittedResult.correctCount}/{submittedResult.total} Correct)
              </h2>
              <p className="text-sm text-[#F8FAFC] mt-1">{submittedResult.adaptiveMessage}</p>
              {submittedResult.weakTopics.length > 0 && (
                <div className="mt-2 text-xs text-rose-300">
                  Focus areas to review: {submittedResult.weakTopics.join(', ')}
                </div>
              )}
            </div>
            <button
              onClick={() => handleStartNewQuiz(selectedSkill)}
              className="px-4 py-2.5 rounded-xl bg-[#161F32] hover:bg-[#1E293B] border border-[#1F2937] text-xs font-semibold text-white flex items-center gap-2 self-start"
            >
              <RotateCcw className="w-4 h-4" /> Retake Assessment
            </button>
          </div>
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-4">
        {questions.map((q, qIdx) => (
          <div key={qIdx} className="p-6 rounded-2xl bg-[#111827] border border-[#1F2937]">
            <div className="flex items-center justify-between text-xs text-[#94A3B8] mb-2">
              <span className="font-mono text-[#22D3EE]">QUESTION {qIdx + 1} OF {questions.length}</span>
              <span>Topic: {q.topic}</span>
            </div>
            <h3 className="text-base font-semibold text-white mb-4">{q.question}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {q.options.map((opt, optIdx) => {
                const isSelected = answers[qIdx] === optIdx;
                const isCorrect = q.correct === optIdx;

                let btnStyle = 'bg-[#0D1220] border-[#1F2937] text-[#F8FAFC] hover:border-[#6366F1]/60';
                if (submittedResult) {
                  if (isCorrect) {
                    btnStyle = 'bg-[#10B981]/20 border-[#10B981] text-white';
                  } else if (isSelected && !isCorrect) {
                    btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-200';
                  }
                } else if (isSelected) {
                  btnStyle = 'bg-[#6366F1]/20 border-[#6366F1] text-white';
                }

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(qIdx, optIdx)}
                    className={`p-3.5 rounded-xl border text-left text-sm transition flex items-center gap-3 ${btnStyle}`}
                  >
                    <span className="w-6 h-6 rounded-md bg-[#161F32] flex items-center justify-center text-xs font-mono shrink-0">
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>

            {submittedResult && (
              <div className="mt-4 p-3 rounded-xl bg-[#0D1220] border border-[#1F2937] text-xs text-[#94A3B8]">
                <strong className="text-[#22D3EE]">Explanation:</strong> {q.explanation}
              </div>
            )}
          </div>
        ))}
      </div>

      {!submittedResult && (
        <div className="flex justify-end">
          <button
            onClick={handleSubmitQuiz}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white font-semibold text-sm shadow-xl shadow-[#6366F1]/25 hover:opacity-95 transition"
          >
            Submit Assessment for AI Grading
          </button>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// VIEW 7: GEMINI AI CAREER MENTOR CHAT VIEW
// ============================================================================

function MentorChatView({ userProfile, targetCareer, analysis, roadmapWeeks }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hi ${userProfile.name}! I'm your SkillNova AI Mentor. I have full visibility into your **${targetCareer.title}** goal (${analysis.readinessScore}% readiness) and your ${analysis.gaps.length} remaining skill gaps. How can I accelerate your learning today?`
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const quickPrompts = [
    'What should I learn today?',
    'Analyze my skill gaps & readiness',
    'Explain React hooks simply',
    'Create a 7-day JavaScript mastery plan'
  ];

  const handleSend = async (promptText) => {
    const query = (promptText || input).trim();
    if (!query || loading) return;

    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: query }]);
    setLoading(true);

    const contextSummary = `
Learner: ${userProfile.name}
Target Career: ${targetCareer.title}
Career Readiness Score: ${analysis.readinessScore}%
Current Skills: ${userProfile.skills.map((s) => `${s.name} (${s.level})`).join(', ')}
Priority Skill Gaps: ${analysis.gaps.map((g) => `${g.skill} (Current: ${g.currentLevel}, Target: ${g.targetLevel})`).join('; ') || 'None'}
Active Roadmap Week: ${roadmapWeeks.find((w) => w.status !== 'Completed')?.title || 'All weeks completed'}
`;

    const reply = await callGeminiMentor(query, contextSummary);
    setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    setLoading(false);
  };

  return (
    <div className="h-[calc(100vh-8.5rem)] flex flex-col rounded-2xl bg-[#111827] border border-[#1F2937] overflow-hidden">
      {/* Chat Header */}
      <div className="px-6 py-4 bg-[#0D1220] border-b border-[#1F2937] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#6366F1] to-[#22D3EE] flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white">SkillNova AI Career Mentor</h1>
            <div className="text-xs text-[#10B981] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              Context-Synced with {targetCareer.title} Profile
            </div>
          </div>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-2xl px-4 py-3.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                msg.role === 'user'
                  ? 'bg-[#6366F1] text-white rounded-br-sm'
                  : 'bg-[#0D1220] border border-[#1F2937] text-[#F8FAFC] rounded-bl-sm'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="px-4 py-3 rounded-2xl bg-[#0D1220] border border-[#1F2937] text-xs text-[#22D3EE] flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              Analyzing your Skill DNA & formulating response...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick Prompts & Input Bar */}
      <div className="p-4 bg-[#0D1220] border-t border-[#1F2937] space-y-3">
        <div className="flex flex-wrap gap-2">
          {quickPrompts.map((qp) => (
            <button
              key={qp}
              onClick={() => handleSend(qp)}
              className="px-3 py-1.5 rounded-lg bg-[#111827] hover:bg-[#161F32] border border-[#1F2937] text-xs text-[#94A3B8] hover:text-white transition"
            >
              {qp}
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2.5"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your AI Career Mentor anything about your roadmap, code, or career switch..."
            className="flex-1 px-4 py-3 rounded-xl bg-[#111827] border border-[#1F2937] focus:border-[#6366F1] focus:outline-none text-sm text-white"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-4 py-3 rounded-xl bg-[#6366F1] hover:bg-[#5558E6] disabled:opacity-50 text-white transition"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

// ============================================================================
// VIEW 8: PROOF-OF-SKILL PORTFOLIO VIEW
// ============================================================================

function PortfolioView({ userProfile, targetCareer, analysis, roadmapWeeks, showToast }) {
  const [copied, setCopied] = useState(false);
  const shareUrl = `https://skillnova.ai/u/${userProfile.handle}`;

  const handleCopyUrl = () => {
    navigator.clipboard?.writeText(shareUrl);
    setCopied(true);
    showToast('Public portfolio link copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Shareable URL & QR Header Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#111827] to-[#161F32] border border-[#1F2937] flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#6366F1] via-[#8B5CF6] to-[#22D3EE] flex items-center justify-center text-xl font-extrabold text-white shadow-lg">
            {userProfile.name
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#10B981] mb-1">
              <ShieldCheck className="w-4 h-4" /> Verified Proof-of-Skill Credential
            </div>
            <h1 className="text-2xl font-bold text-white">{userProfile.name}</h1>
            <p className="text-sm text-[#94A3B8]">
              {targetCareer.title} Candidate • {analysis.readinessScore}% Role Readiness • Level {analysis.level}
            </p>
          </div>
        </div>

        {/* Share Link + Simulated QR */}
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-[#0D1220] border border-[#1F2937] flex items-center gap-2.5">
            <span className="text-xs font-mono text-[#22D3EE] truncate max-w-[190px] sm:max-w-xs">
              {shareUrl}
            </span>
            <button
              onClick={handleCopyUrl}
              className="px-3 py-1.5 rounded-lg bg-[#6366F1] hover:bg-[#5558E6] text-xs font-semibold text-white flex items-center gap-1.5 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy Link'}
            </button>
          </div>

          <div
            className="w-14 h-14 rounded-xl bg-white p-1.5 flex items-center justify-center shrink-0"
            title="Scan to verify SkillNova credential"
          >
            <QrCode className="w-full h-full text-[#080B16]" />
          </div>
        </div>
      </div>

      {/* Verified Skills & Badges */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 p-6 rounded-2xl bg-[#111827] border border-[#1F2937]">
          <h2 className="text-base font-bold text-white mb-4">Verified Technical Competencies</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {userProfile.skills.map((skill) => (
              <div
                key={skill.id}
                className="p-3.5 rounded-xl bg-[#0D1220] border border-[#1F2937] flex items-center justify-between"
              >
                <div>
                  <div className="text-sm font-semibold text-white">{skill.name}</div>
                  <div className="text-xs text-[#94A3B8]">{skill.level}</div>
                </div>
                <ShieldCheck className="w-4 h-4 text-[#10B981]" />
              </div>
            ))}
          </div>
        </div>

        {/* Assessment Badges & Certifications */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-[#111827] border border-[#1F2937] space-y-4">
          <h2 className="text-base font-bold text-white">Diagnostic Assessment Scores & Certifications</h2>
          <div className="space-y-2.5">
            {userProfile.assessmentHistory.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-[#0D1220] border border-[#1F2937] flex items-center justify-between"
              >
                <div>
                  <div className="text-sm font-semibold text-white">{item.skill} Diagnostic</div>
                  <div className="text-xs text-[#94A3B8]">Completed {item.date}</div>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-[#10B981]/15 text-xs font-bold text-[#10B981]">
                  {item.score}% Score
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-[#1F2937]">
            <div className="text-xs font-semibold text-[#94A3B8] uppercase mb-2">Certifications</div>
            <div className="flex flex-wrap gap-2">
              {userProfile.certifications.map((cert, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-lg bg-[#161F32] border border-[#1F2937] text-xs text-white"
                >
                  {cert}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Completed & Verified Projects */}
      <div className="p-6 rounded-2xl bg-[#111827] border border-[#1F2937]">
        <h2 className="text-base font-bold text-white mb-4">Verified Engineering Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {userProfile.projects.map((proj) => (
            <div key={proj.id} className="p-5 rounded-xl bg-[#0D1220] border border-[#1F2937]">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-bold text-white">{proj.title}</h3>
                <span className="px-2 py-0.5 rounded-md bg-[#22D3EE]/15 text-[11px] font-medium text-[#22D3EE]">
                  Verified Build
                </span>
              </div>
              <p className="text-xs text-[#94A3B8] mb-4 leading-relaxed">{proj.description}</p>
              <div className="flex items-center gap-4 text-xs font-medium">
                <a
                  href={proj.github}
                  target="_blank"
                  rel="noreferrer"
                  className="text-white hover:text-[#22D3EE] flex items-center gap-1 transition"
                >
                  GitHub Source <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <a
                  href={proj.live}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#6366F1] hover:text-[#22D3EE] flex items-center gap-1 transition"
                >
                  Live Demo <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}