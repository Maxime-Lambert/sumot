import { useEffect, useState } from "react";

type DefinitionPanelProps = {
  word: string;
};

export default function DefinitionPanel(props: DefinitionPanelProps) {
  const [definitionHtml, setDefinitionHtml] = useState<string | null>(null);

  useEffect(() => {
    const fetchDefinition = async () => {
      try {
        const res = await fetch(
          `https://fr.wiktionary.org/w/api.php?action=parse&page=${props.word.toLowerCase()}&format=json&origin=*&prop=text`
        );
        const data = await res.json();

        if (data.error?.code === "missingtitle") {
          setDefinitionHtml(null);
          return;
        }

        const rawHtml = data.parse?.text["*"];
        if (!rawHtml) {
          setDefinitionHtml(null);
          return;
        }

        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = rawHtml;

        tempDiv.querySelectorAll("a[href^='/wiki/']").forEach((a) => {
          a.setAttribute(
            "href",
            `https://fr.wiktionary.org${a.getAttribute("href")}`
          );
          a.setAttribute("target", "_blank");
          a.setAttribute("rel", "noopener noreferrer");
        });

        const contentNodes = tempDiv.querySelectorAll(".mw-parser-output > *");
        const definitionParts: string[] = [];

        for (const node of contentNodes) {
          if (["P", "UL", "OL", "DL"].includes(node.tagName)) {
            node
              .querySelectorAll("sup, .mw-editsection")
              .forEach((el) => el.remove());
            definitionParts.push(node.outerHTML);
          } else if (definitionParts.length > 0) {
            break;
          }
        }

        if (definitionParts.length > 0) {
          setDefinitionHtml(definitionParts.join(""));
        } else {
          setDefinitionHtml(null);
        }
      } catch (err) {
        console.error("Erreur fetch définition :", err);
        setDefinitionHtml(null);
      }
    };

    fetchDefinition();
  }, [props.word]);

  if (!definitionHtml) return null;

  return (
    <div className="mt-4 p-4 bg-surface border border-accent rounded text-white max-w-2xl mx-auto text-sm">
      <h2 className="font-bold mb-2 text-lg">
        <a
          target="_blank"
          href={`https://fr.wiktionary.org/wiki/${props.word.toLowerCase()}`}
          rel="noopener noreferrer"
          className="underline"
        >
          Définition
        </a>
      </h2>
      <div
        className="prose prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: definitionHtml }}
      />
    </div>
  );
}
