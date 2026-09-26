import type { Metadata } from "next";
import { ClerkProvider, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Wallet } from "lucide-react";
import "./globals.css";

export const metadata: Metadata = {
  title: "ExpenseFlow — Track your spending",
  description: "A simple, fast expense tracker built with Next.js, Drizzle, and Clerk.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="antialiased">
          <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
              <Link href="/" className="flex items-center gap-2 font-semibold text-foreground">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Wallet size={18} />
                </span>
                <span>ExpenseFlow</span>
              </Link>
              <SignedIn>
                <UserButton afterSignOutUrl="/sign-in" />
              </SignedIn>
              <SignedOut>
                <Link
                  href="/sign-in"
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
                >
                  Sign in
                </Link>
              </SignedOut>
            </div>
          </header>
          <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
