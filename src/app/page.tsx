"use client";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import HomeCard from "../components/ui/cards/HomeCard";
import PromptShowcaseCard from "../components/ui/showcase/PromptShowcase";
import { usePromptStore } from "../store/PromptStore";

export default function Home() {
    const initPromptStore = usePromptStore((state) => state.init);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            initPromptStore().then((r) => {
                setLoading(!r);
            });
        }, 100);
    }, [initPromptStore]);

    return (
        <>
            <div className="flex-1 space-y-8 p-8">
                <section className="space-y-4">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-bold tracking-tight">
                            Bienvenue dans Prompt Manager
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            Gérez, créez et partagez vos prompts IA de manière
                            professionnelle.
                        </p>
                    </div>

                    <div className="relative max-w-2xl">
                        <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
                        <Input
                            placeholder="Rechercher un prompt par titre, tag ou contenu..."
                            className="pl-10"
                        />
                    </div>
                </section>

                <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <HomeCard loading={loading} />
                </section>

                <div className="space-y-2">
                    <p className="text-muted-foreground text-lg">
                        Voici un aperçu de vos prompts récemment ajoutés ou
                        modifiés.
                    </p>
                </div>

                <PromptShowcaseCard loading={loading} />
            </div>
        </>
    );
}
