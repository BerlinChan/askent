# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Askent is a web-based interactive presentation and Q&A tool (similar to Sli.do) built as a monorepo with three main packages:
- `askent-client`: React frontend application
- `askent-server`: Node.js backend API server with GraphQL
- `askent-common`: Shared constants and utilities

## Development Commands

### Monorepo Commands
```bash
# Install all dependencies
npm install

# Deploy to Docker stack
npm run stack:deploy

# Remove Docker stack
npm run stack:rm

# Build Docker image
npm run docker:build
```

### Client Development
```bash
# Generate GraphQL types and hooks
npm run codegen -w askent-client

# Start development server (port 3000)
npm run start -w askent-client

# Run tests
npm test -w askent-client

# Build for production
npm run build -w askent-client
```

### Server Development
```bash
# Start development server with hot reload (port 4000)
npm run dev -w askent-server

# Create .env file from template
cp packages/askent-server/.env.template packages/askent-server/.env

# Create database config from template
cp packages/askent-server/ormconfig.template.js packages/askent-server/ormconfig.js
```

## Local Development Setup

1. **Start Database and Services**
```bash
docker-compose up -d
```

2. **Configure Environment**
```bash
# Server environment
cp packages/askent-server/.env.template packages/askent-server/.env
cp packages/askent-server/ormconfig.template.js packages/askent-server/ormconfig.js

# Update JWT_SECRET and HASURA_GRAPHQL_ADMIN_SECRET in .env
```

3. **Generate GraphQL Types**
```bash
npm run codegen -w askent-client
```

4. **Start Services**
```bash
# Terminal 1: Server
npm run dev -w askent-server

# Terminal 2: Client
npm run start -w askent-client
```

## Architecture Key Points

- **GraphQL API**: Apollo Server with TypeGraphQL for schema generation
- **Real-time**: Hasura GraphQL Engine for subscriptions
- **Database**: PostgreSQL with TypeORM
- **Frontend**: React 17 with TypeScript, Material-UI, Apollo Client
- **Testing**: Jest + React Testing Library (client), Cypress E2E
- **Deployment**: GitHub Pages for client, Docker for server

## Code Structure

### Client (`packages/askent-client/`)
- `src/routes/`: Route definitions and page components
- `src/components/`: Reusable UI components
- `src/generated/`: Auto-generated GraphQL types and hooks
- `src/utils/`: Utility functions
- `src/constant.ts`: Application constants

### Server (`packages/askent-server/`)
- `src/graphql/`: GraphQL resolvers and schema definitions
- `src/entity/`: TypeORM database entities
- `src/db/`: Database connection and migrations
- `hasura/`: Hasura GraphQL Engine configuration

### Common (`packages/askent-common/`)
- Shared constants and utilities

## Testing

- **Client**: Run `npm test -w askent-client` for unit tests
- **E2E**: Cypress tests in client package
- **Server**: No explicit test setup (consider adding Jest)

## Deployment

- **Client**: Deployed to GitHub Pages via GitHub Actions on push to `release` branch
- **Server**: Docker container deployment
- **Database**: PostgreSQL in Docker Compose

## Environment Variables

### Server (.env)
```
NODE_ENV=development|production|test
PORT=4000
JWT_SECRET=your_jwt_secret
HASURA_GRAPHQL_ADMIN_SECRET=your_hasura_secret
```

### Database (ormconfig.js)
```javascript
{
  "type": "postgres",
  "host": "localhost",
  "port": 5432,
  "username": "postgres",
  "password": "postgres",
  "database": "askent"
}
```

## GraphQL Development

1. Update schema in `packages/askent-server/src/graphql/`
2. Run `npm run codegen -w askent-client` to regenerate types
3. Import generated hooks from `src/generated/graphql.ts`

## Common Development Tasks

- **Add new GraphQL resolver**: Update schema and regenerate types
- **Create new component**: Follow existing patterns in `src/components/`
- **Database migration**: Use TypeORM CLI in server package
- **Internationalization**: Use React Intl with existing setup
- **Authentication**: JWT-based with role-based permissions

## CI/CD

- **Workflow**: GitHub Actions on push to `release` branch
- **Triggers**: Client package changes only
- **Deployment**: Automatic GitHub Pages deployment
- **Testing**: Build process includes client build verification