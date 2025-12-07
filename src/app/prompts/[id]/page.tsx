"use client";

import { Badge } from "@/src/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/src/components/ui/card";
import { Separator } from "@/src/components/ui/separator";
import { Skeleton } from "@/src/components/ui/skeleton";
import { usePromptStore } from "@/src/store/PromptStore";
import { Prompt } from "@/src/types/prompt";
import {
    Calendar,
    CheckCircle2,
    Clock,
    FileText,
    GitBranch,
    History,
    User,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PromptPage() {
    // Retrieve the prompt ID from the URL parameters
    const params = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [prompt, setPrompt] = useState<Prompt | null>(null);

    const fetchPromptById = usePromptStore((state) => state.fetchPromptById);

    useEffect(() => {
        const id = params.id?.toString();
        if (id) {
            fetchPromptById(id).then((fetchedPrompt) => {
                setIsLoading(false);
                setPrompt(fetchedPrompt);
            });
        }
    }, [params.id, fetchPromptById]);

    if (isLoading) {
        return (
            <div className="container mx-auto p-8 max-w-6xl space-y-6">
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-96 w-full" />
            </div>
        );
    }

    if (!prompt) {
        return (
            <div className="container mx-auto p-8 max-w-6xl">
                <Card className="border-destructive">
                    <CardHeader>
                        <CardTitle className="text-destructive">
                            Prompt introuvable
                        </CardTitle>
                        <CardDescription>
                            Le prompt demandé n&apos;existe pas ou a été
                            supprimé.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("fr-FR", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "published":
                return "bg-green-500/10 text-green-500 border-green-500/20";
            case "draft":
                return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
            case "archived":
                return "bg-gray-500/10 text-gray-500 border-gray-500/20";
            default:
                return "bg-blue-500/10 text-blue-500 border-blue-500/20";
        }
    };

    return (
        <div className="container mx-auto p-8 max-w-6xl space-y-6">
            {/* Header Section */}
            <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-3">
                            <h1 className="text-4xl font-bold tracking-tight">
                                {prompt.title}
                            </h1>
                            {prompt.isLatest && (
                                <Badge
                                    variant="outline"
                                    className="bg-blue-500/10 text-blue-500 border-blue-500/20"
                                >
                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                    Latest
                                </Badge>
                            )}
                        </div>
                        {prompt.description && (
                            <p className="text-lg text-muted-foreground">
                                {prompt.description}
                            </p>
                        )}
                    </div>
                    <Badge className={getStatusColor(prompt.status)}>
                        {prompt.status.toUpperCase()}
                    </Badge>
                </div>

                {/* Tags */}
                {prompt.tags && prompt.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {prompt.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                )}
            </div>

            <Separator />

            {/* Metadata Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <GitBranch className="w-4 h-4" />
                            Version
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{prompt.version}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <User className="w-4 h-4" />
                            Créé par
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-lg font-semibold">
                            {prompt.createdBy}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Mis à jour par: {prompt.updatedBy}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Type
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-lg font-semibold capitalize">
                            {prompt.type}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Timestamps */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        Dates importantes
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                            Créé le:
                        </span>
                        <span className="font-medium">
                            {formatDate(prompt.createdAt)}
                        </span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                            Mis à jour le:
                        </span>
                        <span className="font-medium">
                            {formatDate(prompt.updatedAt)}
                        </span>
                    </div>
                    {prompt.publishedAt && (
                        <>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">
                                    Publié le:
                                </span>
                                <span className="font-medium">
                                    {formatDate(prompt.publishedAt)}
                                </span>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Content Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Contenu du Prompt
                    </CardTitle>
                    <CardDescription>
                        Version actuelle: {prompt.version}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="bg-muted/50 rounded-lg p-6 font-mono text-sm whitespace-pre-wrap wrap-break-word">
                        {prompt.content}
                    </div>
                </CardContent>
            </Card>

            {/* Version History */}
            {prompt.versionHistory && prompt.versionHistory.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <History className="w-5 h-5" />
                            Historique des versions
                        </CardTitle>
                        <CardDescription>
                            {prompt.versionHistory.length} version(s)
                            disponible(s)
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {prompt.versionHistory.map((version, index) => (
                            <div key={index}>
                                <div className="space-y-3">
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline">
                                                    {version.version}
                                                </Badge>
                                                <span className="text-sm text-muted-foreground">
                                                    par {version.createdBy}
                                                </span>
                                            </div>
                                            <p className="text-sm font-medium">
                                                {version.changelog}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <Clock className="w-3 h-3" />
                                            {formatDate(version.createdAt)}
                                        </div>
                                    </div>
                                    <div className="bg-muted/30 rounded-md p-4 font-mono text-xs">
                                        {version.content}
                                    </div>
                                </div>
                                {index < prompt.versionHistory.length - 1 && (
                                    <Separator className="mt-4" />
                                )}
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {/* IDs Section (for dev purposes) */}
            <Card className="border-dashed">
                <CardHeader>
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        Informations techniques
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-xs font-mono">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">ID:</span>
                        <span>{prompt.id}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">User ID:</span>
                        <span>{prompt.userId}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">
                            Prompt ID:
                        </span>
                        <span>{prompt.promptId}</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
