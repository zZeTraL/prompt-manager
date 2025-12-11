"use client";

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/ui/sidebar";
import { FileText, Home, Plus, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styled from "styled-components";

const StyledSidebarMenuButton = styled(SidebarMenuButton)<{
    $current?: boolean;
}>`
    background-color: ${(props) => (props.$current ? "var(--accent)" : null)};
`;

export default function SidebarApp() {
    // Retrieve current page
    const currentPath = usePathname();

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
                                <StyledSidebarMenuButton
                                    $current={currentPath == "/"}
                                    asChild
                                >
                                    <Link href="/">
                                        <Home className="h-4 w-4" />
                                        <span>Accueil</span>
                                    </Link>
                                </StyledSidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <StyledSidebarMenuButton
                                    $current={currentPath === "/discover"}
                                    asChild
                                >
                                    <Link href="/discover">
                                        <Search className="h-4 w-4" />
                                        <span>Découvrir</span>
                                    </Link>
                                </StyledSidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <StyledSidebarMenuButton
                                    $current={currentPath === "/create"}
                                    asChild
                                >
                                    <Link href="/create">
                                        <Plus className="h-4 w-4" />
                                        <span>Créer un prompt</span>
                                    </Link>
                                </StyledSidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
