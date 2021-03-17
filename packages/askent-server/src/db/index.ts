import { createConnection, ConnectionOptions } from "typeorm";
import dotenv from "dotenv";
import path from "path";
import ormconfig from "../../ormconfig";

// TODO https://github.com/Mando75/typeorm-graphql-loader

const dotenvResult = dotenv.config({
  path: path.join(__dirname, "../../.env"),
});
if (dotenvResult.error) {
  throw dotenvResult.error;
}
export async function connectPostgres() {
  try {
    await createConnection(ormconfig as ConnectionOptions);
  } catch (error) {
    console.error(error);
  }
}
