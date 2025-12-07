import { usePromptStore } from "@/src/store/PromptStore";
import { FileText, PlusCircle } from "lucide-react";
import { Button } from "../button";
import { Card, CardContent } from "../card";
import { PromptCard } from "../cards/PromptCard";

interface PromptShowcaseCardProps {
    loading?: boolean;
}

export default function PromptShowcaseCard({
    loading,
}: PromptShowcaseCardProps) {
    const prompts = usePromptStore((state) => state.prompts);

    if (loading) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                    <PromptCard key={i} loading={true} />
                ))}
            </div>
        );
    }

    return (
        <>
            {prompts.length === 0 ? (
                <Card className="w-full">
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <FileText className="text-muted-foreground mb-4 h-12 w-12" />
                        <h3 className="mb-2 text-lg font-semibold">
                            Aucun prompt pour le moment
                        </h3>
                        <p className="text-muted-foreground mb-4 text-center text-sm">
                            Créez votre premier prompt pour commencer à gérer
                            votre bibliothèque AI
                        </p>
                        <Button>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Créer mon premier prompt
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {prompts.slice(0, 6).map((prompt) => (
                        <PromptCard
                            key={prompt.id}
                            prompt={prompt}
                            loading={false}
                        />
                    ))}
                </div>
            )}
        </>
    );
}
