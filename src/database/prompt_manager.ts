import { container } from "@/database/cosmos";
import { CreatePromptSchema, PromptSchema, type Prompt } from "@/types/prompt";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

/**
 * Create a new prompt
 */
export async function createPrompt(
    data: z.infer<typeof CreatePromptSchema>,
): Promise<Prompt> {
    const now = new Date().toISOString();

    const prompt: Prompt = {
        ...data,
        id: uuidv4(),
        type: "prompt",
        versionHistory: data.versionHistory || [],
        isLatest: true,
        status: data.status || "draft",
        tags: data.tags || [],
        createdAt: now,
        updatedAt: now,
    };

    // Validate with Zod
    const validated = PromptSchema.parse(prompt);

    try {
        const { resource, diagnostics } =
            await container.items.create(validated);

        // Log diagnostics if latency is high
        if (
            diagnostics?.clientSideRequestStatistics?.requestDurationInMs &&
            diagnostics.clientSideRequestStatistics.requestDurationInMs > 100
        ) {
            console.warn("High latency detected:", diagnostics);
        }

        return resource as Prompt;
    } catch (error: unknown) {
        if (error instanceof Error) {
            const cosmosError = error as Error & {
                code?: number;
                retryAfterInMs?: number;
                diagnostics?: unknown;
            };
            if (cosmosError.code === 429) {
                console.log(
                    `Rate limited. Retry after: ${cosmosError.retryAfterInMs}ms`,
                );
            }
            console.error(
                "Cosmos DB error diagnostics:",
                cosmosError.diagnostics,
            );
        }
        throw error;
    }
}

/**
 * Get the latest version of a prompt
 */
export async function getLatestPrompt(
    userId: string,
    promptId: string,
): Promise<Prompt | null> {
    const querySpec = {
        query: `
            SELECT * FROM c 
            WHERE c.userId = @userId 
            AND c.promptId = @promptId 
            AND c.isLatest = true
            AND c.type = 'prompt'
        `,
        parameters: [
            { name: "@userId", value: userId },
            { name: "@promptId", value: promptId },
        ],
    };

    const { resources, diagnostics } = await container.items
        .query<Prompt>(querySpec, { partitionKey: [userId, promptId] })
        .fetchAll();

    // Log diagnostics for slow queries
    if (
        diagnostics?.clientSideRequestStatistics?.requestDurationInMs &&
        diagnostics.clientSideRequestStatistics.requestDurationInMs > 100
    ) {
        console.warn("Slow query detected:", diagnostics);
    }

    return resources[0] || null;
}

/**
 * Get a specific version of a prompt
 */
export async function getPromptVersion(
    userId: string,
    promptId: string,
    version: string,
): Promise<Prompt | null> {
    const querySpec = {
        query: `
            SELECT * FROM c 
            WHERE c.userId = @userId 
            AND c.promptId = @promptId 
            AND c.version = @version
            AND c.type = 'prompt'
        `,
        parameters: [
            { name: "@userId", value: userId },
            { name: "@promptId", value: promptId },
            { name: "@version", value: version },
        ],
    };

    const { resources } = await container.items
        .query<Prompt>(querySpec, { partitionKey: [userId, promptId] })
        .fetchAll();

    return resources[0] || null;
}

/**
 * Get all versions of a prompt
 */
export async function getAllPromptVersions(
    userId: string,
    promptId: string,
): Promise<Prompt[]> {
    const querySpec = {
        query: `
            SELECT * FROM c 
            WHERE c.userId = @userId 
            AND c.promptId = @promptId 
            AND c.type = 'prompt'
            ORDER BY c.version DESC
        `,
        parameters: [
            { name: "@userId", value: userId },
            { name: "@promptId", value: promptId },
        ],
    };

    const { resources } = await container.items
        .query<Prompt>(querySpec, { partitionKey: [userId, promptId] })
        .fetchAll();

    return resources;
}

/**
 * Get all prompts for a user
 */
export async function getUserPrompts(userId: string): Promise<Prompt[]> {
    const querySpec = {
        query: `
            SELECT * FROM c 
            WHERE c.userId = @userId 
            AND c.isLatest = true
            AND c.type = 'prompt'
        `,
        parameters: [{ name: "@userId", value: userId }],
    };

    const { resources } = await container.items
        .query<Prompt>(querySpec)
        .fetchAll();

    return resources;
}

/**
 * Create a new version of an existing prompt
 */
export async function createNewVersion(
    userId: string,
    promptId: string,
    newContent: string,
    updatedBy: string,
    changelog?: string,
): Promise<Prompt> {
    const current = await getLatestPrompt(userId, promptId);
    if (!current) throw new Error("Prompt not found");

    // Parse version and increment patch
    const [major, minor, patch] = current.version
        .replace("v", "")
        .split(".")
        .map(Number);
    const newVersion = `v${major}.${minor}.${patch + 1}`;

    const now = new Date().toISOString();

    // Mark current as not latest using patch operation
    await container
        .item(current.id, [userId, promptId])
        .patch([{ op: "replace", path: "/isLatest", value: false }]);

    // Create new version
    const newPrompt: Prompt = {
        ...current,
        id: uuidv4(),
        version: newVersion,
        content: newContent,
        versionHistory: [
            ...current.versionHistory,
            {
                version: current.version,
                content: current.content,
                changelog: changelog || "Version update",
                createdAt: now,
                createdBy: current.updatedBy,
            },
        ],
        isLatest: true,
        updatedAt: now,
        updatedBy,
    };

    const validated = PromptSchema.parse(newPrompt);
    const { resource } = await container.items.create(validated);

    return resource as Prompt;
}

/**
 * Update prompt metadata (title, description, tags, status)
 */
export async function updatePromptMetadata(
    id: string,
    userId: string,
    promptId: string,
    updates: {
        title?: string;
        description?: string;
        tags?: string[];
        status?: "draft" | "published" | "archived";
    },
    updatedBy: string,
): Promise<Prompt> {
    const now = new Date().toISOString();

    const operations = Object.entries(updates).map(([key, value]) => ({
        op: "replace" as const,
        path: `/${key}`,
        value,
    }));

    operations.push({
        op: "replace",
        path: "/updatedAt",
        value: now,
    });

    operations.push({
        op: "replace",
        path: "/updatedBy",
        value: updatedBy,
    });

    const { resource } = await container
        .item(id, [userId, promptId])
        .patch(operations);

    return resource as Prompt;
}

/**
 * Delete a prompt (marks as archived)
 */
export async function archivePrompt(
    id: string,
    userId: string,
    promptId: string,
    updatedBy: string,
): Promise<Prompt> {
    const now = new Date().toISOString();

    const { resource } = await container.item(id, [userId, promptId]).patch([
        { op: "replace", path: "/status", value: "archived" },
        { op: "replace", path: "/updatedAt", value: now },
        { op: "replace", path: "/updatedBy", value: updatedBy },
    ]);

    return resource as Prompt;
}

/**
 * Physically delete a prompt
 */
export async function deletePrompt(
    id: string,
    userId: string,
    promptId: string,
): Promise<void> {
    await container.item(id, [userId, promptId]).delete();
}
