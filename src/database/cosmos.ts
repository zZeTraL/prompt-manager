import { CosmosClient } from "@azure/cosmos";

const endpoint = process.env.COSMOS_ENDPOINT;
const key = process.env.COSMOS_KEY;
const databaseName = process.env.COSMOS_DATABASE_NAME;
const containerName = process.env.COSMOS_CONTAINER_NAME;

// On valide que les variables d'environnement sont bien définies
if (!endpoint || !key || !databaseName || !containerName) {
    throw new Error(
        "Missing required Cosmos DB environment variables. Please check .env.local for COSMOS_ENDPOINT, COSMOS_KEY, COSMOS_DATABASE_NAME, and COSMOS_CONTAINER_NAME",
    );
}

// On initialise le client Cosmos
const client = new CosmosClient({
    endpoint,
    key,
    connectionPolicy: {
        enableEndpointDiscovery: true,
    },
});

const database = client.database(databaseName);
const container = database.container(containerName);

// On exporte le client, la base de données et le conteneur
export { client, container, database };
