import { parseBodyBlocks } from "@/lib/editorial/charts";
import { ResearchFigure } from "@/components/research-figure";

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
        return <p key={`p-${index}`}>{block.text}</p>;
      })}
    </>
  );
}
