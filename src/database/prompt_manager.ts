import { getCosmosContainer } from "@/database/cosmos";
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
        const container = getCosmosContainer();
        const { resource } = await container.items.create(validated);

        return resource as Prompt;
    } catch (error: unknown) {
        if (error instanceof Error) {
            const cosmosError = error as Error & {
                code?: number;
                retryAfterInMs?: number;
                diagnostics?: unknown;
            };

            // Handle 429 rate limiting
            if (cosmosError.code === 429) {
                console.log(
                    `Rate limited. Retry after: ${cosmosError.retryAfterInMs}ms`,
                );
            }

            // Log diagnostics for troubleshooting
            console.error(
                "Cosmos DB error diagnostics:",
                cosmosError.diagnostics,
            );
        }
        throw error;
    }
}
