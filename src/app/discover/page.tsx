"use client";

import { PromptGallery } from "@/components/ui/cards/PromptGallery";
import { usePromptStore } from "@/src/store/PromptStore";

export default function DiscoverPage() {
    const prompts = usePromptStore((state) => state.prompts);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">
                    Découvrir les Prompts
                </h1>
                <p className="text-muted-foreground">
                    Explorez et découvrez tous les prompts disponibles
                </p>
            </div>
            <PromptGallery prompts={prompts || []} />
        </div>
    );
}
