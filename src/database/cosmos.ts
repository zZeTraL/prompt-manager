import { Container, CosmosClient, Database } from "@azure/cosmos";

const endpoint = process.env.COSMOS_ENDPOINT;
const key = process.env.COSMOS_KEY;
const databaseName = process.env.COSMOS_DATABASE_NAME;
const containerName = process.env.COSMOS_CONTAINER_NAME;

let client: CosmosClient | null = null;
let database: Database | null = null;
let container: Container | null = null;

/**
 * Initialize Cosmos DB client with best practices
 * - Reuses singleton client instance
 * - Configured for Azure App Service deployment
 * - Logs diagnostics for performance monitoring
 */
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

/**
 * Get Cosmos DB container instance
 * Use this in your API routes and server-side code
 * Environment variables will be injected at runtime in Azure App Service
 */
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
