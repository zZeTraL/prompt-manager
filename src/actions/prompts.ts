"use server";

import { fetchAllPrompts } from "@/database/function";

export async function getPrompts() {
    try {
        const prompts = await fetchAllPrompts();
        return { success: true, data: prompts };
    } catch (error) {
        console.error("Error fetching prompts:", error);
        return { success: false, error: "Failed to fetch prompts" };
    }
}
