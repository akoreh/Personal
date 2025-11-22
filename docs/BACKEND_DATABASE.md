# Backend with MySQL and Docker

This backend uses TypeORM with MySQL running in Docker.

## Quick Start

### 1. Start MySQL with Docker

```bash
# Start MySQL container in the background
docker compose up -d

# Check if it's running
docker compose ps

# View logs
docker compose logs -f mysql
```

### 2. Start the Backend

```bash
npm run start-backend
```

The backend will automatically:

- Connect to MySQL on `localhost:3306`
- Create tables based on your entities (in development mode)

## Docker Commands

```bash
# Start database
docker compose up -d

# Stop database
docker compose down

# Stop and remove all data
docker compose down -v

# View logs
docker compose logs -f mysql

# Access MySQL shell
docker compose exec mysql mysql -u personal_user -p
# Password: personal_pass
```

## Database Configuration

Configuration is in `apps/backend/.env`:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=personal_db
DB_USER=personal_user
DB_PASSWORD=personal_pass
```

## TypeORM Usage

### Creating Entities

Entities go in `libs/backend/entities/src/lib/`:

```typescript
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column('text')
  content!: string;
}
```

**Don't forget to:**

1. Add the entity to the entities array in `libs/backend/core/src/lib/database.config.ts`
2. Export it from `libs/backend/entities/src/index.ts`

### Using the Database

```typescript
import { AppDataSource } from '@po/backend/core';
import { User } from '@po/backend/entities';

// Get repository
const userRepository = AppDataSource.getRepository(User);

// Create
const user = userRepository.create({
  email: 'test@example.com',
  password: 'hashed_password',
});
await userRepository.save(user);

// Find
const users = await userRepository.find();
const user = await userRepository.findOne({ where: { email: 'test@example.com' } });

// Update
user.firstName = 'John';
await userRepository.save(user);

// Delete
await userRepository.remove(user);
```

## Migrations (Production)

In production, disable `synchronize` and use migrations:

```bash
# Generate migration from entity changes
npx typeorm migration:generate -d dist/libs/backend/core/src/lib/database.config.js src/migrations/InitialMigration

# Run migrations
npx typeorm migration:run -d dist/libs/backend/core/src/lib/database.config.js
```

## Troubleshooting

### Connection refused

Make sure Docker is running and MySQL is healthy:

```bash
docker compose ps
```

### Port already in use

Change `DB_PORT` in `.env` to a different port (e.g., 3307).

### Clear all data

```bash
docker compose down -v
docker compose up -d
```
