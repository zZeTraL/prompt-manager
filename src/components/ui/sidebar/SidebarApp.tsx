"use client";

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
} from "@/ui/sidebar";
import { FileText, Home, Search, Settings } from "lucide-react";
import Link from "next/link";

export default function SidebarApp() {
    return (
        <Sidebar>
            <SidebarHeader className="p-4">
                <div className="flex items-center gap-2">
                    <FileText className="h-6 w-6 text-primary" />
                    <span className="text-lg font-bold">Prompt Manager</span>
                </div>
            </SidebarHeader>

            <SidebarContent className="p-2">
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
                                        <span>Découvrir</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Link href="/create">
                                        <Search className="h-4 w-4" />
                                        <span>Créer un prompt</span>
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
