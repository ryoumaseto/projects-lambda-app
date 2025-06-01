"use client";

import { Navigation } from "@/components/Navigation";
import { Header } from "@/components/Header";
import { useSidebarStore } from "@/store/sidebar";
import { cn } from "@/lib/utils";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isOpen } = useSidebarStore();

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-blue-50/50 to-white">
      <Navigation />
      <div className={cn(
        "flex-1 flex flex-col min-w-0"
      )}>
        <Header />
        <main className="flex-1 p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
} 