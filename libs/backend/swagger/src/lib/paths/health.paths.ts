export const healthPaths = {
  '/health': {
    get: {
      tags: ['Health'],
      summary: 'Health check',
      description: 'Check if the API is running and database is connected',
      responses: {
        '200': {
          description: 'API is healthy',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: {
                    type: 'string',
                    example: 'ok',
                  },
                  timestamp: {
                    type: 'string',
                    format: 'date-time',
                  },
                  database: {
                    type: 'string',
                    example: 'connected',
                  },
                },
              },
            },
          },
        },
        '503': {
          description: 'Service unavailable',
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
