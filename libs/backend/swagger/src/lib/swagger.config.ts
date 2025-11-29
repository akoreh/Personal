import { Application } from 'express';
import { serve, setup } from 'swagger-ui-express';

import { swaggerInfo, swaggerServers, swaggerTags } from './info.config';
import { authPaths } from './paths/auth.paths';
import { healthPaths } from './paths/health.paths';
import { swaggerSchemas, swaggerSecuritySchemes } from './schemas.config';

const swaggerDocument = {
  openapi: '3.0.0',
  info: swaggerInfo,
  servers: swaggerServers,
  components: {
    securitySchemes: swaggerSecuritySchemes,
    schemas: swaggerSchemas,
  },
  paths: [healthPaths, authPaths],
  tags: swaggerTags,
};

export function setupSwagger(app: Application): void {
  app.use('/swagger', serve, setup(swaggerDocument));
}
