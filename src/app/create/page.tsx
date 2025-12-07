"use client";

import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Separator } from "@/src/components/ui/separator";
import { usePromptStore } from "@/src/store/PromptStore";
import { Prompt } from "@/src/types/prompt";
import {
    AlignLeft,
    FileText,
    GitBranch,
    Plus,
    Save,
    Sparkles,
    Tag,
    User,
    X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type PromptFormData = {
    userId: string;
    promptId: string;
    title: string;
    description: string;
    tags: string[];
    version: string;
    content: string;
    status: "draft" | "published" | "archived";
    createdBy: string;
};

export default function CreatePromptPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [tagInput, setTagInput] = useState("");
    const [error, setError] = useState<string | null>(null);

    const createNewPrompt = usePromptStore((state) => state.createNewPrompt);

    const [formData, setFormData] = useState<PromptFormData>({
        userId: "",
        promptId: "",
        title: "",
        description: "",
        tags: [],
        version: "v1.0.0",
        content: "",
        status: "draft",
        createdBy: "",
    });

    const handleInputChange = (field: keyof PromptFormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleAddTag = () => {
        if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
            setFormData((prev) => ({
                ...prev,
                tags: [...prev.tags, tagInput.trim()],
            }));
            setTagInput("");
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setFormData((prev) => ({
            ...prev,
            tags: prev.tags.filter((tag) => tag !== tagToRemove),
        }));
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAddTag();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            // Generate UUID for the new prompt
            const newPromptId = crypto.randomUUID();
            const now = new Date().toISOString();

            // Create prompt object matching the Prompt type
            const promptData: Prompt = {
                id: newPromptId,
                userId: formData.userId,
                promptId: formData.promptId,
                type: "prompt" as const,
                title: formData.title,
                description: formData.description || undefined,
                tags: formData.tags,
                version: formData.version,
                content: formData.content,
                versionHistory: [
                    {
                        version: formData.version,
                        content: formData.content,
                        changelog: "Initial version",
                        createdAt: now,
                        createdBy: formData.createdBy,
                    },
                ],
                status: formData.status,
                isLatest: true,
                createdAt: now,
                updatedAt: now,
                publishedAt: formData.status === "published" ? now : undefined,
                createdBy: formData.createdBy,
                updatedBy: formData.createdBy,
            };

            console.log("Creating prompt:", promptData);

            // Call the store function to create the prompt
            const createdPrompt = await createNewPrompt(promptData);

            if (createdPrompt) {
                // Redirect to the newly created prompt page
                router.push(`/prompts/${createdPrompt.id}`);
            } else {
                setError("Échec de la création du prompt. Veuillez réessayer.");
            }
        } catch (error) {
            console.error("Error creating prompt:", error);
            setError("Une erreur est survenue lors de la création du prompt.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const isFormValid = () => {
        return (
            formData.userId.trim() !== "" &&
            formData.promptId.trim() !== "" &&
            formData.title.trim() !== "" &&
            formData.content.trim() !== "" &&
            formData.version.trim() !== "" &&
            formData.createdBy.trim() !== "" &&
            /^v\d+\.\d+\.\d+$/.test(formData.version)
        );
    };

    return (
        <div className="container mx-auto p-8 max-w-5xl space-y-6">
            {/* Header */}
            <div className="space-y-2">
                <div className="flex items-center gap-3">
                    <Sparkles className="w-8 h-8 text-primary" />
                    <h1 className="text-4xl font-bold tracking-tight">
                        Créer un nouveau prompt
                    </h1>
                </div>
                <p className="text-lg text-muted-foreground">
                    Remplissez tous les champs pour créer votre prompt
                    personnalisé
                </p>
            </div>

            <Separator />

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* User & Prompt IDs */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="w-5 h-5" />
                            Identifiants
                        </CardTitle>
                        <CardDescription>
                            Informations d&apos;identification pour le système
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label
                                    htmlFor="userId"
                                    className="text-sm font-medium"
                                >
                                    User ID{" "}
                                    <span className="text-destructive">*</span>
                                </label>
                                <Input
                                    id="userId"
                                    placeholder="user123"
                                    value={formData.userId}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "userId",
                                            e.target.value,
                                        )
                                    }
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label
                                    htmlFor="promptId"
                                    className="text-sm font-medium"
                                >
                                    Prompt ID{" "}
                                    <span className="text-destructive">*</span>
                                </label>
                                <Input
                                    id="promptId"
                                    placeholder="prompt-ai-assistant"
                                    value={formData.promptId}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "promptId",
                                            e.target.value,
                                        )
                                    }
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label
                                htmlFor="createdBy"
                                className="text-sm font-medium"
                            >
                                Créé par{" "}
                                <span className="text-destructive">*</span>
                            </label>
                            <Input
                                id="createdBy"
                                placeholder="user123"
                                value={formData.createdBy}
                                onChange={(e) =>
                                    handleInputChange(
                                        "createdBy",
                                        e.target.value,
                                    )
                                }
                                required
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Basic Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="w-5 h-5" />
                            Informations de base
                        </CardTitle>
                        <CardDescription>
                            Titre, description et métadonnées du prompt
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label
                                htmlFor="title"
                                className="text-sm font-medium"
                            >
                                Titre{" "}
                                <span className="text-destructive">*</span>
                            </label>
                            <Input
                                id="title"
                                placeholder="AI Code Assistant Prompt"
                                value={formData.title}
                                onChange={(e) =>
                                    handleInputChange("title", e.target.value)
                                }
                                maxLength={100}
                                required
                            />
                            <p className="text-xs text-muted-foreground">
                                {formData.title.length}/100 caractères
                            </p>
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="description"
                                className="text-sm font-medium"
                            >
                                Description
                            </label>
                            <Input
                                id="description"
                                placeholder="Prompt for helping developers write better code"
                                value={formData.description}
                                onChange={(e) =>
                                    handleInputChange(
                                        "description",
                                        e.target.value,
                                    )
                                }
                                maxLength={500}
                            />
                            <p className="text-xs text-muted-foreground">
                                {formData.description.length}/500 caractères
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label
                                    htmlFor="version"
                                    className="text-sm font-medium flex items-center gap-2"
                                >
                                    <GitBranch className="w-4 h-4" />
                                    Version{" "}
                                    <span className="text-destructive">*</span>
                                </label>
                                <Input
                                    id="version"
                                    placeholder="v1.0.0"
                                    value={formData.version}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "version",
                                            e.target.value,
                                        )
                                    }
                                    pattern="^v\d+\.\d+\.\d+$"
                                    required
                                />
                                <p className="text-xs text-muted-foreground">
                                    Format: v1.0.0 (semver)
                                </p>
                            </div>

                            <div className="space-y-2">
                                <label
                                    htmlFor="status"
                                    className="text-sm font-medium flex items-center gap-2"
                                >
                                    <AlignLeft className="w-4 h-4" />
                                    Statut{" "}
                                    <span className="text-destructive">*</span>
                                </label>
                                <select
                                    id="status"
                                    value={formData.status}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "status",
                                            e.target.value as
                                                | "draft"
                                                | "published"
                                                | "archived",
                                        )
                                    }
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    required
                                >
                                    <option value="draft">Brouillon</option>
                                    <option value="published">Publié</option>
                                    <option value="archived">Archivé</option>
                                </select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Tags */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Tag className="w-5 h-5" />
                            Tags
                        </CardTitle>
                        <CardDescription>
                            Ajoutez des tags pour catégoriser votre prompt
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-2">
                            <Input
                                placeholder="Ajouter un tag (ex: coding, ai, assistant)"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={handleAddTag}
                                disabled={!tagInput.trim()}
                            >
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>

                        {formData.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {formData.tags.map((tag, index) => (
                                    <Badge
                                        key={index}
                                        variant="secondary"
                                        className="gap-1 pr-1"
                                    >
                                        {tag}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveTag(tag)}
                                            className="ml-1 hover:bg-muted rounded-full p-0.5"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Content */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="w-5 h-5" />
                            Contenu du prompt
                        </CardTitle>
                        <CardDescription>
                            Le contenu principal de votre prompt
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <label
                                htmlFor="content"
                                className="text-sm font-medium"
                            >
                                Contenu{" "}
                                <span className="text-destructive">*</span>
                            </label>
                            <textarea
                                id="content"
                                placeholder="You are a helpful AI programming assistant..."
                                value={formData.content}
                                onChange={(e) =>
                                    handleInputChange("content", e.target.value)
                                }
                                className="flex min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono"
                                required
                            />
                            <p className="text-xs text-muted-foreground">
                                {formData.content.length} caractères
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Submit Button */}
                <Card className="border-primary/20">
                    <CardContent className="pt-6">
                        {error && (
                            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                                <p className="text-sm text-destructive">
                                    {error}
                                </p>
                            </div>
                        )}
                        <div className="flex gap-4 justify-end">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.push("/discover")}
                                disabled={isSubmitting}
                            >
                                Annuler
                            </Button>
                            <Button
                                type="submit"
                                disabled={!isFormValid() || isSubmitting}
                                className="gap-2"
                            >
                                {isSubmitting ? (
                                    <>Création en cours...</>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        Créer le prompt
                                    </>
                                )}
                            </Button>
                        </div>
                        {!isFormValid() && (
                            <p className="text-sm text-muted-foreground text-right mt-2">
                                Veuillez remplir tous les champs obligatoires
                                (*)
                            </p>
                        )}
                    </CardContent>
                </Card>
            </form>
        </div>
    );
}
