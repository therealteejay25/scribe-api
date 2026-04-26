export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'RealWorld API',
    version: '1.0.0',
    description: 'A fully spec-compliant RealWorld API implementation with Node.js, TypeScript, Express, and MongoDB',
    contact: {
      name: 'API Support',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000/api',
      description: 'Development server',
    },
  ],
  tags: [
    { name: 'Authentication', description: 'User registration and login' },
    { name: 'User', description: 'User profile management' },
    { name: 'Profiles', description: 'User profiles and following' },
    { name: 'Articles', description: 'Article CRUD operations' },
    { name: 'Comments', description: 'Article comments' },
    { name: 'Favorites', description: 'Favorite articles' },
    { name: 'Tags', description: 'Article tags' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter JWT token with "Token" prefix',
      },
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          username: { type: 'string', example: 'johndoe' },
          email: { type: 'string', format: 'email', example: 'john@example.com' },
          bio: { type: 'string', example: 'Full-stack developer' },
          image: { type: 'string', format: 'uri', example: 'https://example.com/avatar.jpg' },
          token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
        },
      },
      Profile: {
        type: 'object',
        properties: {
          username: { type: 'string', example: 'johndoe' },
          bio: { type: 'string', example: 'Full-stack developer' },
          image: { type: 'string', format: 'uri' },
          following: { type: 'boolean', example: false },
        },
      },
      Article: {
        type: 'object',
        properties: {
          slug: { type: 'string', example: 'how-to-build-apis-abc123' },
          title: { type: 'string', example: 'How to Build APIs' },
          description: { type: 'string', example: 'A comprehensive guide' },
          body: { type: 'string', example: 'Full article content...' },
          image: { type: 'string', format: 'uri' },
          tagList: { type: 'array', items: { type: 'string' }, example: ['nodejs', 'api'] },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
          favorited: { type: 'boolean', example: false },
          favoritesCount: { type: 'integer', example: 5 },
          liked: { type: 'boolean', example: false },
          likesCount: { type: 'integer', example: 10 },
          bookmarked: { type: 'boolean', example: false },
          bookmarksCount: { type: 'integer', example: 3 },
          sharesCount: { type: 'integer', example: 2 },
          commentsCount: { type: 'integer', example: 8 },
          readTime: { type: 'integer', example: 5 },
          author: { $ref: '#/components/schemas/Profile' },
        },
      },
      Comment: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '507f1f77bcf86cd799439011' },
          body: { type: 'string', example: 'Great article!' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
          author: { $ref: '#/components/schemas/Profile' },
        },
      },
      Error: {
        type: 'object',
        properties: {
          errors: {
            type: 'object',
            properties: {
              body: {
                type: 'array',
                items: { type: 'string' },
                example: ['Error message'],
              },
            },
          },
        },
      },
    },
  },
  paths: {
    '/users': {
      post: {
        tags: ['Authentication'],
        summary: 'Register a new user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  user: {
                    type: 'object',
                    required: ['username', 'email', 'password'],
                    properties: {
                      username: { type: 'string', example: 'johndoe' },
                      email: { type: 'string', format: 'email', example: 'john@example.com' },
                      password: { type: 'string', format: 'password', example: 'password123' },
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'User created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    user: { $ref: '#/components/schemas/User' },
                  },
                },
              },
            },
          },
          422: {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
    },
    '/users/login': {
      post: {
        tags: ['Authentication'],
        summary: 'Login existing user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  user: {
                    type: 'object',
                    required: ['email', 'password'],
                    properties: {
                      email: { type: 'string', format: 'email' },
                      password: { type: 'string', format: 'password' },
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Login successful',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    user: { $ref: '#/components/schemas/User' },
                  },
                },
              },
            },
          },
          401: {
            description: 'Invalid credentials',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
    },
    '/user': {
      get: {
        tags: ['User'],
        summary: 'Get current user',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'User retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    user: { $ref: '#/components/schemas/User' },
                  },
                },
              },
            },
          },
          401: {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
      put: {
        tags: ['User'],
        summary: 'Update current user',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  user: {
                    type: 'object',
                    properties: {
                      username: { type: 'string' },
                      email: { type: 'string', format: 'email' },
                      password: { type: 'string', format: 'password' },
                      bio: { type: 'string' },
                      image: { type: 'string', format: 'uri' },
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'User updated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    user: { $ref: '#/components/schemas/User' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/articles': {
      get: {
        tags: ['Articles'],
        summary: 'List articles',
        parameters: [
          { name: 'tag', in: 'query', schema: { type: 'string' }, description: 'Filter by tag' },
          { name: 'author', in: 'query', schema: { type: 'string' }, description: 'Filter by author username' },
          { name: 'favorited', in: 'query', schema: { type: 'string' }, description: 'Filter by favorited username' },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 }, description: 'Limit number of articles' },
          { name: 'offset', in: 'query', schema: { type: 'integer', default: 0 }, description: 'Offset for pagination' },
        ],
        responses: {
          200: {
            description: 'Articles retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    articles: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Article' },
                    },
                    articlesCount: { type: 'integer', example: 42 },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Articles'],
        summary: 'Create article',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  article: {
                    type: 'object',
                    required: ['title', 'description', 'body'],
                    properties: {
                      title: { type: 'string' },
                      description: { type: 'string' },
                      body: { type: 'string' },
                      image: { type: 'string', format: 'uri' },
                      tagList: { type: 'array', items: { type: 'string' } },
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Article created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    article: { $ref: '#/components/schemas/Article' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/tags': {
      get: {
        tags: ['Tags'],
        summary: 'Get all tags',
        responses: {
          200: {
            description: 'Tags retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    tags: {
                      type: 'array',
                      items: { type: 'string' },
                      example: ['nodejs', 'typescript', 'api'],
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};
