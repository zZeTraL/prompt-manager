"use client";

import { Button } from "@/ui/button";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarSeparator,
} from "@/ui/sidebar";
import {
    FileText,
    FolderOpen,
    History,
    Home,
    PlusCircle,
    Search,
    Settings,
    Star,
    Tags,
    TrendingUp,
} from "lucide-react";
import Link from "next/link";

export default function SidebarApp() {
    return (
        <Sidebar>
            <SidebarHeader className="p-4">
                <div className="flex items-center gap-2">
                    <FileText className="h-6 w-6 text-primary" />
                    <span className="text-lg font-bold">Prompt Manager</span>
                </div>
                <Button className="mt-3 w-full" size="sm">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Nouveau Prompt
                </Button>
            </SidebarHeader>

            <SidebarContent className="p-2">
                <SidebarSeparator />
                <SidebarGroup>
                    <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Link href="/">
                                        <Home className="h-4 w-4" />
                                        <span>Accueil</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Link href="/search">
                                        <Search className="h-4 w-4" />
                                        <span>Rechercher</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Link href="/favorites">
                                        <Star className="h-4 w-4" />
                                        <span>Favoris</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Link href="/history">
                                        <History className="h-4 w-4" />
                                        <span>Historique</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarSeparator />

                <SidebarGroup>
                    <SidebarGroupLabel>Organisation</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Link href="/projects">
                                        <FolderOpen className="h-4 w-4" />
                                        <span>Projets</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Link href="/tags">
                                        <Tags className="h-4 w-4" />
                                        <span>Tags</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarSeparator />

                <SidebarGroup>
                    <SidebarGroupLabel>Insights</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Link href="/analytics">
                                        <TrendingUp className="h-4 w-4" />
                                        <span>Analytics</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="p-4">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <Link href="/settings">
                                <Settings className="h-4 w-4" />
                                <span>Paramètres</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
