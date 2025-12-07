import type { Metadata } from "next";

// Global CSS import
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
            <body>{children}</body>
        </html>
    );
}
