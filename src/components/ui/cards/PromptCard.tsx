import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Prompt } from "@/types/prompt";
import { Calendar, Tag, User } from "lucide-react";

interface PromptCardProps {
    prompt?: Prompt;
    loading?: boolean;
}

export function PromptCard({ prompt, loading = false }: PromptCardProps) {
    const formatDate = (date: Date | string) => {
        return new Date(date).toLocaleDateString("fr-FR", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    if (loading || !prompt) {
        return (
            <Card className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-2/3" />
                        </div>
                    </div>
                </CardHeader>

                <CardContent>
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-4" />
                            <Skeleton className="h-5 w-16" />
                            <Skeleton className="h-5 w-20" />
                            <Skeleton className="h-5 w-16" />
                        </div>

                        <div className="flex items-center gap-4">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-28" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <CardTitle className="text-xl mb-2">
                            {prompt.title}
                        </CardTitle>
                        <CardDescription className="line-clamp-2">
                            {prompt.description}
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                <div className="space-y-3">
                    {prompt.tags && prompt.tags.length > 0 && (
                        <div className="flex items-center gap-2 flex-wrap">
                            <Tag className="h-4 w-4 text-muted-foreground" />
                            {prompt.tags.map((tag, index) => (
                                <Badge
                                    key={index}
                                    variant="outline"
                                    className="text-xs"
                                >
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    )}

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {prompt.createdBy && (
                            <div className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                <span>{prompt.createdBy}</span>
                            </div>
                        )}

                        <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(prompt.createdAt)}</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
