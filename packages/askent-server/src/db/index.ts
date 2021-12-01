import { createConnection, ConnectionOptions } from "typeorm";
import ormconfig from "../../ormconfig";

// TODO https://github.com/Mando75/typeorm-graphql-loader

export async function connectPostgres() {
  try {
    await createConnection(ormconfig as ConnectionOptions);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
