import { getPrompts } from "@/actions/prompts";
import { PromptGallery } from "@/components/ui/cards/PromptGallery";

export default async function DiscoverPage() {
    const result = await getPrompts();

    if (!result.success) {
        return (
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">
                    Découvrir les Prompts
                </h1>
                <div className="text-center text-red-500">
                    Erreur lors du chargement des prompts
                </div>
            </div>
        );
    }

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
            <PromptGallery prompts={result.data || []} />
        </div>
    );
}
