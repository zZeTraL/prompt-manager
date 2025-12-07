import { CosmosClient } from "@azure/cosmos";

const endpoint = process.env.COSMOS_ENDPOINT || "";
const key = process.env.COSMOS_KEY || "";
const databaseName = process.env.COSMOS_DATABASE_NAME || "";
const containerName = process.env.COSMOS_CONTAINER_NAME || "";

const client = new CosmosClient({ endpoint, key });
const database = client.database(databaseName);
const container = database.container(containerName);

export { client, container, database };
