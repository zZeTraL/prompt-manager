import { getCosmosContainer } from "@/database/cosmos";
import { type Prompt } from "@/types/prompt";

// Retrieve all prompts
async function fetchAllPrompts(): Promise<Prompt[]> {
    const container = getCosmosContainer();
    const querySpec = {
        query: "SELECT * FROM c WHERE c.type = @type",
        parameters: [
            {
                name: "@type",
                value: "prompt",
            },
        ],
    };
    const { resources } = await container.items
        .query<Prompt>(querySpec)
        .fetchAll();
    return resources;
}

async function fetchPromptById(id: string): Promise<Prompt | null> {
    const container = getCosmosContainer();
    const querySpec = {
        query: "SELECT * FROM c WHERE c.type = @type AND c.id = @id",
        parameters: [
            {
                name: "@type",
                value: "prompt",
            },
            {
                name: "@id",
                value: id,
            },
        ],
    };
    const { resources } = await container.items
        .query<Prompt>(querySpec)
        .fetchAll();
    return resources.length > 0 ? resources[0] : null;
}

async function createPrompt(prompt: Prompt): Promise<Prompt> {
    const container = getCosmosContainer();
    const { resource } = await container.items.create<Prompt>({
        ...prompt,
        type: "prompt",
    });
    if (!resource) {
        throw new Error("Failed to create prompt");
    }
    return resource;
}

async function deletePrompt(id: string): Promise<void> {
    const container = getCosmosContainer();
    await container.item(id, id).delete();
}

export { createPrompt, deletePrompt, fetchAllPrompts, fetchPromptById };
