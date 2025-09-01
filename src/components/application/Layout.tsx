import type { ReactNode } from "react";

interface LayoutProps {
  header: ReactNode;
  footer: ReactNode;
  children: ReactNode;
}

export default function Layout({ header, footer, children }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {header}

      <main className="flex-1 flex justify-center">
        <div className="w-full max-w-[1280px] px-4 py-4 flex flex-col items-center justify-start min-h-[calc(100vh-10rem)]">
          {children}
        </div>
      </main>

      {footer}
    </div>
  );
}
