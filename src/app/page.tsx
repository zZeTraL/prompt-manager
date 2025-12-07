import DEFAULT_PROMPT from "@/data/DEFAULT_PROMPT.json";
import { createPrompt } from "@/database/prompt_manager";
import { CreatePromptSchema } from "@/types/prompt";
import { revalidatePath } from "next/cache";

export default function Home() {
    async function createPromptAction(formData: FormData) {
        "use server";

        try {
            // Parse form data or use default
            const data = CreatePromptSchema.parse({
                ...DEFAULT_PROMPT,
                userId: formData.get("userId") || DEFAULT_PROMPT.userId,
                promptId: formData.get("promptId") || DEFAULT_PROMPT.promptId,
                title: formData.get("title") || DEFAULT_PROMPT.title,
                content: formData.get("content") || DEFAULT_PROMPT.content,
                createdBy: formData.get("userId") || DEFAULT_PROMPT.createdBy,
                updatedBy: formData.get("userId") || DEFAULT_PROMPT.updatedBy,
            });

            const prompt = await createPrompt(data);

            console.log("✅ Prompt created:", prompt.id);

            // Revalidate to show new data
            revalidatePath("/");
        } catch (error) {
            console.error("❌ Failed to create prompt:", error);
        }
    }

    return (
        <main className="p-8">
            <h1 className="text-2xl font-bold mb-4">Prompt Manager</h1>

            <form action={createPromptAction} className="space-y-4">
                <div>
                    <label htmlFor="userId" className="block mb-2">
                        User ID
                    </label>
                    <input
                        type="text"
                        id="userId"
                        name="userId"
                        defaultValue="user123"
                        className="border p-2 w-full"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="promptId" className="block mb-2">
                        Prompt ID
                    </label>
                    <input
                        type="text"
                        id="promptId"
                        name="promptId"
                        defaultValue="prompt-ai-assistant"
                        className="border p-2 w-full"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="title" className="block mb-2">
                        Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        defaultValue="AI Code Assistant Prompt"
                        className="border p-2 w-full"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="content" className="block mb-2">
                        Content
                    </label>
                    <textarea
                        id="content"
                        name="content"
                        rows={6}
                        defaultValue="You are a helpful AI programming assistant..."
                        className="border p-2 w-full"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Create Prompt
                </button>
            </form>
        </main>
    );
}
