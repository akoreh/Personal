export const authPaths = {
  '/auth/login': {
    post: {
      tags: ['Authentication'],
      summary: 'User login',
      description: 'Authenticate user and return JWT access token',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/LoginCredentials',
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Login successful',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/LoginResponse',
              },
            },
          },
        },
        '401': {
          description: 'Invalid credentials',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
        '422': {
          description: 'Validation error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
      },
    },
  },
  '/auth/refresh': {
    post: {
      tags: ['Authentication'],
      summary: 'Refresh access token',
      description: 'Get a new access token using a refresh token',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/RefreshTokenRequest',
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Token refresh successful',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/LoginResponse',
              },
            },
          },
        },
        '401': {
          description: 'Invalid or expired refresh token',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
      },
    },
  },
};
