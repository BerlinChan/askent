export default {
  "type": "postgres",
  "host": "localhost",
  "port": 5432,
  "username": "postgres",
  "password": "postgres",
  "database": "askent",
  "synchronize": true,
  "logging": true,
  "entities": ["src/entity/**/*.ts"],
  "migrations": ["src/db/migration/**/*.ts"],
  "subscribers": ["src/db/subscriber/**/*.ts"],
  "cli": {
    "entitiesDir": "src/entity",
    "migrationsDir": "src/db/migration",
    "subscribersDir": "src/db/subscriber"
  }
}
