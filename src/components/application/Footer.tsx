export default function Footer() {
  return (
    <footer className="w-full h-12 sm:h-16 border-t border-secondary-border bg-secondary text-secondary-foreground backdrop-blur">
      <div className="max-w-[1280px] mx-auto text-[0.65rem] sm:text-sm text-muted-foreground text-center flex items-center justify-center h-full px-2 flex-wrap gap-x-1">
        <span>© 2025 Sumot. Créé par © ALED Studios.</span>
        <span>
          Retrouvez également <strong>Sumot</strong> sur votre Play Store.
        </span>
        <span>Tous droits réservés.</span>
        <span>Vous pouvez nous joindre via</span>
        <span className="underline">
          <a href="mailto:contact@sumot.app">contact@sumot.app</a>
        </span>
      </div>
    </footer>
  );
}
