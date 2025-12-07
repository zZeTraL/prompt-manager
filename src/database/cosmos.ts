import { CosmosClient } from "@azure/cosmos";

const endpoint = process.env.COSMOS_ENDPOINT;
const key = process.env.COSMOS_KEY;
const databaseName = process.env.COSMOS_DATABASE_NAME;
const containerName = process.env.COSMOS_CONTAINER_NAME;

// Only validate and initialize if we're not in build mode
const isBuildTime = process.env.NEXT_PHASE === "phase-production-build";

if (!isBuildTime && (!endpoint || !key || !databaseName || !containerName)) {
    throw new Error(
        "Missing required Cosmos DB environment variables. Please check .env.local for COSMOS_ENDPOINT, COSMOS_KEY, COSMOS_DATABASE_NAME, and COSMOS_CONTAINER_NAME",
    );
}

// Initialize client only if we have the required variables
let client: CosmosClient | null = null;
let database: ReturnType<CosmosClient["database"]> | null = null;
let container: ReturnType<
    ReturnType<CosmosClient["database"]>["container"]
> | null = null;

if (endpoint && key && databaseName && containerName) {
    client = new CosmosClient({
        endpoint,
        key,
        connectionPolicy: {
            enableEndpointDiscovery: true,
        },
    });

    database = client.database(databaseName);
    container = database.container(containerName);
}

export { client, container, database };
