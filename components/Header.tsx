"use client";

import { Gift, UsersRound, LogOut, Menu, X } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/client";
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  async function handleLogout() {
    const supabase = await createClient();
    await supabase.auth.signOut(); // Realiza o logout
    redirect("/login"); // Redireciona para a página de login
  }

  const handleMenuItemClick = (path: string) => {
    setIsMenuOpen(false);
    router.push(path);
  };

  return (
    <header className="border-b">
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center">
          <Link
            className="text-2xl font-bold flex items-center gap-2"
            href="/app/grupos"
          >
            <Gift className="text-green-400 h-6 w-6" />
            <span>Amigo</span>
            <span className="font-thin">Secreto</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-4">
            <Link
              className="text-foreground text-sm flex gap-2 items-center"
              href="/app/grupos"
            >
              <UsersRound className="w-4 h-4" />
              Meus grupos
            </Link>
            <Button asChild variant="outline">
              <Link href="/app/grupos/novo">Novo grupo</Link>
            </Button>
            <Button
              variant="destructive"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </Button>
          </nav>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="fixed inset-0 bg-background z-50 md:hidden">
          <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-8">
              <Link
                className="text-2xl font-bold flex items-center gap-2"
                href="/app/grupos"
                onClick={() => setIsMenuOpen(false)}
              >
                <Gift className="text-green-400 h-6 w-6" />
                <span>Amigo</span>
                <span className="font-thin">Secreto</span>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(false)}
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
            <nav className="flex flex-col space-y-4">
              <Button
                variant="ghost"
                className="flex items-center justify-start gap-2"
                onClick={() => handleMenuItemClick("/app/grupos")}
              >
                <UsersRound className="w-4 h-4" />
                Meus grupos
              </Button>
              <Button
                variant="outline"
                className="flex items-center justify-start gap-2"
                onClick={() => handleMenuItemClick("/app/grupos/novo")}
              >
                Novo grupo
              </Button>
              <Button
                variant="destructive"
                onClick={handleLogout}
                className="flex items-center justify-start gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </Button>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
