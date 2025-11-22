# backend-enums

Backend enumerations for the Personal monorepo.

## Purpose

This library provides type-safe enumerations used across backend libraries and applications, ensuring consistency and preventing typos.

## Enums

### `EnvVar`

Environment variable names used throughout the backend.

**Usage:**

```typescript
import { EnvVar } from '@po/backend/enums';

const port = process.env[EnvVar.Port];
const dbHost = process.env[EnvVar.PgHost];
```

**Available values:**
- `NodeEnv` - `'NODE_ENV'`
- `Port` - `'PORT'`
- `DatabaseUrl` - `'DATABASE_URL'`
- `PgHost` - `'PG_HOST'`
- `PgPort` - `'PG_PORT'`
- `PgUser` - `'PG_USER'`
- `PgPassword` - `'PG_PASSWORD'`
- `PgDatabase` - `'PG_DATABASE'`
- `PgSsl` - `'PG_SSL'`

**Benefits:**
- Type safety when accessing environment variables
- Autocomplete support in IDEs
- Prevents typos in environment variable names
- Centralized source of truth for all backend env vars
