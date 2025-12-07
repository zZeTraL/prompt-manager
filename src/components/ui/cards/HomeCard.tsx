import { usePromptStore } from "@/src/store/PromptStore";
import { Clock, FileText, Star, UserPlus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../card";
import { Skeleton } from "../skeleton";

interface HomeCardProps {
    loading?: boolean;
}

export default function HomeCard({ loading = false }: HomeCardProps) {
    const prompts = usePromptStore((state) => state.prompts);
    const currentUserId = "user123"; // TODO: Récupérer depuis auth

    // KPI 1: Total de prompts
    const totalPrompts = prompts.length;

    // KPI 2: Mes Favoris
    const myFavorites = prompts.filter((p) =>
        p.favoritedBy?.includes(currentUserId),
    ).length;

    // KPI 3: Prompts récents (7 derniers jours)
    const recentPrompts = prompts.filter((p) => {
        const daysSinceCreation =
            (Date.now() - new Date(p.createdAt).getTime()) /
            (1000 * 60 * 60 * 24);
        return daysSinceCreation <= 7;
    }).length;

    // KPI 4: Dernier contributeur (basé sur createdBy et updatedAt)
    const sortedByDate = [...prompts].sort(
        (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
    const latestPrompt = sortedByDate[0];
    const lastContributor =
        latestPrompt?.createdBy || latestPrompt?.updatedBy || "N/A";

    if (loading) {
        return (
            <>
                {[...Array(4)].map((_, i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-16 mb-2" />
                            <Skeleton className="h-3 w-32" />
                        </CardContent>
                    </Card>
                ))}
            </>
        );
    }

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Bibliothèque
                    </CardTitle>
                    <FileText className="text-muted-foreground h-4 w-4" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalPrompts}</div>
                    <p className="text-muted-foreground text-xs">
                        {totalPrompts === 0
                            ? "Aucun prompt disponible"
                            : `${totalPrompts} prompt${totalPrompts > 1 ? "s" : ""}`}
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Mes Favoris
                    </CardTitle>
                    <Star className="text-muted-foreground h-4 w-4" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{myFavorites}</div>
                    <p className="text-muted-foreground text-xs">
                        {myFavorites === 0
                            ? "Aucun favori"
                            : "Prompts sauvegardés"}
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Nouveautés
                    </CardTitle>
                    <Clock className="text-muted-foreground h-4 w-4" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{recentPrompts}</div>
                    <p className="text-muted-foreground text-xs">
                        {recentPrompts === 0
                            ? "Aucun nouveau prompt"
                            : "Derniers 7 jours"}
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Dernier Contributeur
                    </CardTitle>
                    <UserPlus className="text-muted-foreground h-4 w-4" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold truncate">
                        {lastContributor}
                    </div>
                    <p className="text-muted-foreground text-xs">
                        {latestPrompt
                            ? "Dernière modification"
                            : "Aucun prompt"}
                    </p>
                </CardContent>
            </Card>
        </>
    );
}
