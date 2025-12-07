import { z } from "zod";

// Version history item schema
const VersionHistoryItemSchema = z.object({
    version: z
        .string()
        .regex(
            /^v\d+\.\d+\.\d+$/,
            "Version must follow semver format (e.g., v1.0.0)",
        ),
    content: z.string().min(1, "Content cannot be empty"),
    changelog: z.string().optional(),
    createdAt: z.string().datetime(),
    createdBy: z.string().min(1),
});

// Main prompt schema
const PromptSchema = z.object({
    // Cosmos DB required fields
    id: z.string().uuid(),

    // Hierarchical Partition Keys
    userId: z.string().min(1, "userId is required"),
    promptId: z.string().min(1, "promptId is required"),

    // Type discriminator
    type: z.literal("prompt"),

    // Prompt metadata
    title: z.string().min(1).max(100),
    description: z.string().max(500).optional(),
    tags: z.array(z.string()).default([]),

    // Versioning
    version: z
        .string()
        .regex(
            /^v\d+\.\d+\.\d+$/,
            "Version must follow semver format (e.g., v1.0.0)",
        ),
    content: z.string().min(1, "Content cannot be empty"),
    versionHistory: z.array(VersionHistoryItemSchema).default([]),

    // Status
    status: z.enum(["draft", "published", "archived"]).default("draft"),
    isLatest: z.boolean().default(true),

    // Timestamps
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    publishedAt: z.string().datetime().optional(),

    // User tracking
    createdBy: z.string().min(1),
    updatedBy: z.string().min(1),
});

// Export types
type Prompt = z.infer<typeof PromptSchema>;
type VersionHistoryItem = z.infer<typeof VersionHistoryItemSchema>;

// Create prompt schema (without id, timestamps)
const CreatePromptSchema = PromptSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    publishedAt: true,
}).partial({
    versionHistory: true,
    isLatest: true,
    status: true,
    tags: true,
});

// Update prompt schema
const UpdatePromptSchema = PromptSchema.partial().required({
    id: true,
    userId: true,
    promptId: true,
});

export {
    CreatePromptSchema,
    PromptSchema,
    UpdatePromptSchema,
    VersionHistoryItemSchema,
    type Prompt,
    type VersionHistoryItem,
};
