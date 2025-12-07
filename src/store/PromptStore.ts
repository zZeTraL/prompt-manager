import { getPrompts } from "@/actions/prompts";
import { Prompt } from "@/types/prompt";
import { create } from "zustand";

type PromptStore = {
    prompts: Prompt[];
    init: () => Promise<boolean>;
    fetchAllPrompts: () => Promise<void>;
};

export const usePromptStore = create<PromptStore>((set) => ({
    prompts: [],
    init: async () => {
        if (typeof window === "undefined") return false;
        // Use Server Action instead of API route
        const result = await getPrompts();
        if (result.success) {
            console.log("Initialized prompts:", result.data);
            set({ prompts: result.data || [] });
            return true;
        }
        return false;
    },

    fetchAllPrompts: async () => {
        const result = await getPrompts();
        if (result.success) {
            console.info("Fetched prompts:", result.data);
            set({ prompts: result.data || [] });
        }
    },
}));
