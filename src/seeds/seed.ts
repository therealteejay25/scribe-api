import { connectDatabase } from '../config/database';
import { User } from '../models/User.model';
import { Article } from '../models/Article.model';
import { Comment } from '../models/Comment.model';
import { logger } from '../utils/logger';
import { generateSlug } from '../utils/slugify';

const seedData = async () => {
  try {
    await connectDatabase();
    logger.info('Starting database seed...');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Article.deleteMany({}),
      Comment.deleteMany({}),
    ]);
    logger.info('Cleared existing data');

    // Create users
    const users = await User.create([
      {
        username: 'johndoe',
        email: 'john@example.com',
        password: 'password123',
        bio: 'Full-stack developer passionate about Node.js and TypeScript',
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
      },
      {
        username: 'janedoe',
        email: 'jane@example.com',
        password: 'password123',
        bio: 'Frontend developer and UI/UX enthusiast',
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane',
      },
      {
        username: 'bobsmith',
        email: 'bob@example.com',
        password: 'password123',
        bio: 'Backend engineer specializing in scalable systems',
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob',
      },
    ]);

    logger.info(`Created ${users.length} users`);

    // Setup following relationships
    users[0].following.push(users[1]._id);
    users[0].following.push(users[2]._id);
    users[1].following.push(users[0]._id);
    await Promise.all(users.map(u => u.save()));

    // Create articles
    const articles = await Article.create([
      {
        slug: generateSlug('Getting Started with TypeScript'),
        title: 'Getting Started with TypeScript',
        description: 'A comprehensive guide to TypeScript for beginners',
        body: `# Introduction to TypeScript

TypeScript is a strongly typed programming language that builds on JavaScript. It adds optional static typing to the language, which can help catch errors early and improve code quality.

## Why TypeScript?

- Type safety
- Better IDE support
- Enhanced code maintainability
- Improved refactoring capabilities

## Getting Started

Install TypeScript globally:
\`\`\`bash
npm install -g typescript
\`\`\`

Create your first TypeScript file and compile it:
\`\`\`bash
tsc hello.ts
\`\`\`

TypeScript is an excellent choice for large-scale applications!`,
        image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800',
        tagList: ['typescript', 'javascript', 'programming'],
        author: users[0]._id,
      },
      {
        slug: generateSlug('Building REST APIs with Node.js'),
        title: 'Building REST APIs with Node.js',
        description: 'Learn how to build scalable REST APIs using Node.js and Express',
        body: `# Building REST APIs with Node.js

Node.js is perfect for building fast and scalable REST APIs. Combined with Express, you can create production-ready APIs quickly.

## Key Concepts

1. RESTful routing
2. Middleware
3. Error handling
4. Authentication
5. Database integration

## Best Practices

- Use proper HTTP status codes
- Implement input validation
- Add rate limiting
- Use JWT for authentication
- Document your API

Start building amazing APIs today!`,
        image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
        tagList: ['nodejs', 'api', 'express', 'backend'],
        author: users[1]._id,
      },
      {
        slug: generateSlug('MongoDB Best Practices'),
        title: 'MongoDB Best Practices',
        description: 'Essential MongoDB patterns and practices for production',
        body: `# MongoDB Best Practices

MongoDB is a powerful NoSQL database. Here are some best practices to follow:

## Schema Design

- Embed related data when possible
- Use references for large or frequently changing data
- Denormalize when read performance is critical

## Indexing

- Create indexes on frequently queried fields
- Use compound indexes for multi-field queries
- Monitor index usage with explain()

## Performance

- Use projection to limit returned fields
- Implement pagination with limit() and skip()
- Use aggregation pipelines for complex queries

Follow these practices for optimal performance!`,
        image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800',
        tagList: ['mongodb', 'database', 'nosql', 'backend'],
        author: users[2]._id,
      },
      {
        slug: generateSlug('React Hooks Deep Dive'),
        title: 'React Hooks Deep Dive',
        description: 'Understanding React Hooks and when to use them',
        body: `# React Hooks Deep Dive

React Hooks revolutionized how we write React components. Let's explore the most important hooks.

## useState

Manage component state:
\`\`\`javascript
const [count, setCount] = useState(0);
\`\`\`

## useEffect

Handle side effects:
\`\`\`javascript
useEffect(() => {
  // Side effect code
  return () => {
    // Cleanup
  };
}, [dependencies]);
\`\`\`

## Custom Hooks

Create reusable logic by building custom hooks!`,
        image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
        tagList: ['react', 'javascript', 'frontend', 'hooks'],
        author: users[1]._id,
      },
      {
        slug: generateSlug('Docker for Developers'),
        title: 'Docker for Developers',
        description: 'Containerize your applications with Docker',
        body: `# Docker for Developers

Docker makes it easy to package and deploy applications consistently across environments.

## Key Benefits

- Consistent environments
- Easy deployment
- Isolation
- Scalability

## Getting Started

Create a Dockerfile:
\`\`\`dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "start"]
\`\`\`

Build and run:
\`\`\`bash
docker build -t myapp .
docker run -p 3000:3000 myapp
\`\`\`

Start containerizing your apps today!`,
        image: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=800',
        tagList: ['docker', 'devops', 'containers'],
        author: users[0]._id,
      },
    ]);

    logger.info(`Created ${articles.length} articles`);

    // Add favorites and likes
    articles[0].favoritedBy.push(users[1]._id, users[2]._id);
    articles[0].favoritesCount = 2;
    articles[0].likedBy.push(users[1]._id);
    articles[0].likesCount = 1;

    articles[1].favoritedBy.push(users[0]._id);
    articles[1].favoritesCount = 1;
    articles[1].likedBy.push(users[0]._id, users[2]._id);
    articles[1].likesCount = 2;

    articles[2].bookmarkedBy.push(users[0]._id, users[1]._id);
    articles[2].bookmarksCount = 2;

    await Promise.all(articles.map(a => a.save()));

    // Create comments
    const comments = await Comment.create([
      {
        body: 'Great article! Very helpful for beginners.',
        author: users[1]._id,
        article: articles[0]._id,
      },
      {
        body: 'Thanks for sharing this. The examples are clear and concise.',
        author: users[2]._id,
        article: articles[0]._id,
      },
      {
        body: 'This is exactly what I needed. Bookmarking for future reference!',
        author: users[0]._id,
        article: articles[1]._id,
      },
      {
        body: 'Excellent explanation of MongoDB patterns.',
        author: users[1]._id,
        article: articles[2]._id,
      },
    ]);

    // Update comment counts
    articles[0].commentsCount = 2;
    articles[1].commentsCount = 1;
    articles[2].commentsCount = 1;
    await Promise.all(articles.map(a => a.save()));

    logger.info(`Created ${comments.length} comments`);

    logger.info('✅ Database seeded successfully!');
    logger.info('\nTest Credentials:');
    logger.info('Email: john@example.com | Password: password123');
    logger.info('Email: jane@example.com | Password: password123');
    logger.info('Email: bob@example.com | Password: password123');

    process.exit(0);
  } catch (error) {
    logger.error('Seed failed:', error);
    process.exit(1);
  }
};

seedData();
