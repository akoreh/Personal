export const swaggerSchemas = {
  LoginCredentials: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: {
        type: 'string',
        format: 'email',
        example: 'user@example.com',
      },
      password: {
        type: 'string',
        format: 'password',
        example: 'password123',
      },
    },
  },
  LoginResponse: {
    type: 'object',
    properties: {
      accessToken: {
        type: 'string',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  },
  RefreshTokenRequest: {
    type: 'object',
    required: ['refreshToken'],
    properties: {
      refreshToken: {
        type: 'string',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  },
  Error: {
    type: 'object',
    properties: {
      message: {
        type: 'string',
        example: 'An error occurred',
      },
    },
  },
};

export const swaggerSecuritySchemes = {
  bearerAuth: {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
  },
};
