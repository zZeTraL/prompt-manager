import { Container, CosmosClient, Database } from "@azure/cosmos";

const endpoint = process.env.COSMOS_ENDPOINT;
const key = process.env.COSMOS_KEY;
const databaseName = process.env.COSMOS_DATABASE_NAME;
const containerName = process.env.COSMOS_CONTAINER_NAME;

// Le client / base de données / conteneur Cosmos DB peuvent être nuls avant l'initialisation
let client: CosmosClient | null = null;
let database: Database | null = null;
let container: Container | null = null;

// Init Cosmos DB Client (Singleton)
function initializeCosmosClient(): {
    client: CosmosClient;
    database: Database;
    container: Container;
} {
    if (!endpoint || !key || !databaseName || !containerName) {
        throw new Error(
            "Missing required Cosmos DB environment variables. Required: COSMOS_ENDPOINT, COSMOS_KEY, COSMOS_DATABASE_NAME, and COSMOS_CONTAINER_NAME",
        );
    }

    // Reuse existing client (singleton pattern)
    if (!client) {
        client = new CosmosClient({
            endpoint,
            key,
            connectionPolicy: {
                enableEndpointDiscovery: true,
                requestTimeout: 10000,
                retryOptions: {
                    maxRetryAttemptCount: 3,
                    maxWaitTimeInSeconds: 30,
                },
            },
        });

        database = client.database(databaseName);
        container = database.container(containerName);
    }

    return {
        client: client!,
        database: database!,
        container: container!,
    };
}

// Les variables d'environnement seront injectées au moment de l'exécution
export function getCosmosContainer(): Container {
    const { container } = initializeCosmosClient();
    return container;
}

export function getCosmosDatabase(): Database {
    const { database } = initializeCosmosClient();
    return database;
}

export function getCosmosClient(): CosmosClient {
    const { client } = initializeCosmosClient();
    return client;
}
