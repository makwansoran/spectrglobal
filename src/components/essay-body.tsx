import type { CSSProperties } from "react";
import { parseBodyBlocks } from "@/lib/editorial/charts";
import { essayStyleVars } from "@/lib/editorial/typography";
import { ResearchFigure } from "@/components/research-figure";
import "./essay-body.css";

export function EssayBody({ paragraphs }: { paragraphs: string[] }) {
  const blocks = parseBodyBlocks(paragraphs);
  let figure = 0;

  return (
    <>
      {blocks.map((block, index) => {
        if (block.type === "chart") {
          figure += 1;
          return <ResearchFigure key={`${block.chart.id}-${index}`} chart={block.chart} number={figure} />;
        }
        return (
          <p key={`p-${index}`} className="essay-copy" style={essayStyleVars(block.style) as CSSProperties}>
            {block.text}
          </p>
        );
      })}
    </>
  );
}
