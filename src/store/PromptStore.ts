import {
    createNewPrompt,
    deletePrompt as deletePromptAction,
    getPromptById,
    getPrompts,
} from "@/actions/prompts";
import { Prompt } from "@/types/prompt";
import { create } from "zustand";

type PromptStore = {
    prompts: Prompt[];
    init: () => Promise<boolean>;
    fetchAllPrompts: () => Promise<void>;
    fetchPromptById: (id: string) => Promise<Prompt | null>;
    createNewPrompt: (promptData: Prompt) => Promise<Prompt | null>;
    deletePrompt: (id: string) => Promise<boolean>;
};

export const usePromptStore = create<PromptStore>((set) => ({
    prompts: [],
    init: async () => {
        if (typeof window === "undefined") return false;
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

    fetchPromptById: async (id: string) => {
        const result = await getPromptById(id);
        if (result.success) {
            return result.data || null;
        }
        return null;
    },

    createNewPrompt: async (promptData: Prompt) => {
        const result = await createNewPrompt(promptData);
        if (result.success) {
            set((state) => ({
                prompts: [...state.prompts, result.data!],
            }));
            return result.data || null;
        }
        return null;
    },

    deletePrompt: async (id: string) => {
        const result = await deletePromptAction(id);
        if (result.success) {
            set((state) => ({
                prompts: state.prompts.filter((prompt) => prompt.id !== id),
            }));
            return true;
        }
        return false;
    },
}));
