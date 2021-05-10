export default {
  "type": "postgres",
  "host": "localhost",
  "port": 5432,
  "username": "postgres",
  "password": "postgres",
  "database": "askent",
  "synchronize": true,
  "logging": true,
  "entities": ["src/entity/**"],
  "migrations": ["src/db/migration/**"],
  "subscribers": ["src/db/subscriber/**"],
  "cli": {
    "entitiesDir": "src/entity",
    "migrationsDir": "src/db/migration",
    "subscribersDir": "src/db/subscriber"
  }
}
