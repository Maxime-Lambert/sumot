import type { Sumot } from "@/types/Sumot";
import { Link } from "lucide-react";

type DefinitionPanelProps = {
  solution?: Sumot;
};

export default function DefinitionPanel(props: DefinitionPanelProps) {
  return (
    <div className="mt-2 p-3 bg-surface border border-accent rounded text-white max-w-2xl mx-auto text-xs">
      <h2 className="font-semibold mb-1 text-base flex justify-center items-center gap-1">
        <a
          target="_blank"
          href={`https://fr.wiktionary.org/wiki/${props.solution?.definitionWord}`}
          rel="noopener noreferrer"
          className="underline inline-flex items-center gap-1 hover:text-accent transition"
        >
          <span>{props.solution?.definitionWord}</span>
          <Link className="w-3.5 h-3.5" />
        </a>
      </h2>

      <div
        className="prose prose-invert max-w-none"
        dangerouslySetInnerHTML={{
          __html: props.solution ? props.solution.definition : "",
        }}
      />
    </div>
  );
}
