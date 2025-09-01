import { useEffect, useRef } from "react";
import { Link as LinkIcon } from "lucide-react";
import type { Sumot } from "@/types/Sumot";

interface DefinitionPanelProps {
  solution?: Sumot;
  onReady?: () => void;
}

export default function DefinitionPanel({
  solution,
  onReady,
}: DefinitionPanelProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!solution || !contentRef.current) return;
    const links = contentRef.current.querySelectorAll("a");
    links.forEach((link) => {
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
    });
    onReady?.();
  }, [solution, onReady]);

  if (!solution) return null;

  return (
    <div className="w-full p-4 border border-secondary-container-border rounded-xl bg-secondary-container text-sm text-white">
      <h2 className="font-semibold mb-2 text-center text-base">
        <a
          href={`https://fr.wiktionary.org/wiki/${solution.definitionWord}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline inline-flex items-center gap-1 hover:text-accent transition"
        >
          <span>{solution.definitionWord}</span>
          <LinkIcon className="w-4 h-4" />
        </a>
      </h2>

      <div
        ref={contentRef}
        className="prose prose-invert max-w-none text-sm text-left leading-relaxed"
        dangerouslySetInnerHTML={{ __html: solution.definition }}
      />
    </div>
  );
}
