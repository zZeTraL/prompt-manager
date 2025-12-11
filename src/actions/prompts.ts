"use server";

import {
    createPrompt,
    deletePrompt as deletePromptFromDB,
    fetchAllPrompts,
    fetchPromptById,
} from "@/database/function";
import { Prompt } from "@/types/prompt";

export async function getPrompts() {
    try {
        const prompts = await fetchAllPrompts();
        return { success: true, data: prompts };
    } catch (error) {
        console.error("Error fetching prompts:", error);
        return { success: false, error: "Failed to fetch prompts" };
    }
}

export async function getPromptById(id: string) {
    try {
        const prompt = await fetchPromptById(id);
        if (!prompt) {
            return { success: false, error: "Prompt not found" };
        }
        return { success: true, data: prompt };
    } catch (error) {
        console.error("Error fetching prompt by ID:", error);
        return { success: false, error: "Failed to fetch prompt by ID" };
    }
}

export async function createNewPrompt(promptData: Prompt) {
    try {
        const newPrompt = await createPrompt(promptData);
        return { success: true, data: newPrompt };
    } catch (error) {
        console.error("Error creating prompt:", error);
        return { success: false, error: "Failed to create prompt" };
    }
}

export async function deletePrompt(id: string) {
    try {
        await deletePromptFromDB(id);
        return { success: true };
    } catch (error) {
        console.error("Error deleting prompt:", error);
        return { success: false, error: "Failed to delete prompt" };
    }
}
