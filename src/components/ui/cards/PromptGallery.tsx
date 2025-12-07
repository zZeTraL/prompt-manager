"use client";

import { Prompt } from "@/src/types/prompt";
import Link from "next/link";
import { PromptCard } from "./PromptCard";

interface PromptGalleryProps {
    prompts: Prompt[];
    loading?: boolean;
}

export function PromptGallery({
    prompts,
    loading = false,
}: PromptGalleryProps) {
    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                    <PromptCard key={index} loading={true} />
                ))}
            </div>
        );
    }

    if (prompts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-lg text-muted-foreground">
                    Aucun prompt disponible pour le moment
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prompts.map((prompt) => (
                <Link
                    key={prompt.id}
                    href={`/prompts/${prompt.id}`}
                    className="transition-transform hover:scale-[1.02] duration-200"
                >
                    <PromptCard prompt={prompt} />
                </Link>
            ))}
        </div>
    );
}
