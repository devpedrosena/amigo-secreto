"use client";

import { Github, Linkedin, Gift } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

export default function Footer() {
  return (
    <footer className="border-t">
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <Link
              href="https://www.linkedin.com/in/pedrohsenna"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="ghost" size="icon">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Button>
            </Link>
            <Link
              href="https://github.com/devpedrosena"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="ghost" size="icon">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Button>
            </Link>
          </div>
          <div className="text-center md:text-right">
            <Link
              className="text-lg font-bold flex items-center justify-center md:justify-end gap-2"
              href="/app/grupos"
            >
              <Gift className="text-green-400 h-5 w-5" />
              <span>Amigo</span>
              <span className="font-thin">Secreto</span>
            </Link>
            <p className="text-sm text-muted-foreground mt-2">
              © {new Date().getFullYear()} Pedro Sena. Todos os direitos
              reservados.
            </p>
          </div>
        </div>
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            Desenvolvido com paixão usando Next.js, Tailwind CSS, e Supabase.
          </p>
          <p className="mt-2">
            Precisa de um desenvolvedor?{" "}
            <Link
              href="mailto:pedrosenna540@gmail.com"
              className="text-primary hover:underline"
            >
              Entre em contato
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
