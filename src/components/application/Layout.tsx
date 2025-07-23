type LayoutProps = {
  header: React.ReactNode;
  footer: React.ReactNode;
  children: React.ReactNode;
};

export default function Layout({ header, footer, children }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-background text-white">
      <header className="w-full">{header}</header>

      <main className="flex-1 w-full px-4 py-8 flex justify-center">
        <div className="w-full max-w-3xl">{children}</div>
      </main>

      <footer className="w-full">{footer}</footer>
    </div>
  );
}
