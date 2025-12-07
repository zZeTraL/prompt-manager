import type { Metadata } from "next";

// Global CSS import
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@radix-ui/react-separator";
import SidebarApp from "../components/ui/sidebar/SidebarApp";
import "./globals.css";

export const metadata: Metadata = {
    title: "Prompt Manager",
    description: "Create, Manage and Version your Prompts!",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="fr">
            <body>
                <SidebarProvider>
                    <div className="flex h-screen w-full">
                        <SidebarApp />
                        <main className="flex min-h-screen w-screen flex-col">
                            <div className="bg-background sticky top-0 z-10 w-full border-b">
                                <div className="flex h-14 items-center gap-4 px-4">
                                    <SidebarTrigger />
                                    <Separator
                                        orientation="vertical"
                                        className="h-6"
                                    />
                                    <div className="flex flex-1 items-center justify-between">
                                        <span className="text-sm font-medium">
                                            Prompt Manager
                                        </span>
                                    </div>
                                </div>
                            </div>
                            {children}
                        </main>
                    </div>
                </SidebarProvider>
            </body>
        </html>
    );
}
