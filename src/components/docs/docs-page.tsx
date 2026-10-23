import type { DocsPage as DocsPageType } from "@/lib/docs";
import { DocsNav } from "./docs-nav";
import { DocsToc } from "./docs-toc";
import "./docs-shell.css";

export function DocsPageView({ page }: { page: DocsPageType }) {
  const toc = page.headings.map((heading) => ({
    id: heading.id,
    title: heading.title,
  }));

  return (
    <div className="docs">
      <div className="docs__frame">
        <DocsNav />
        <div className="docs__main">
          <article className="docs__article">
            <p className="docs__kicker">Documentation</p>
            <h1 className="docs__title">{page.title}</h1>
            <p className="docs__lead">{page.description}</p>

            {page.headings.map((heading) => (
              <section key={heading.id} id={heading.id} className="docs__section">
                <h2>{heading.title}</h2>
                {heading.blocks.map((block, index) => {
                  if (block.type === "p") {
                    return <p key={`${heading.id}-p-${index}`}>{block.text}</p>;
                  }
                  if (block.type === "ul") {
                    return (
                      <ul key={`${heading.id}-ul-${index}`}>
                        {block.items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    );
                  }
                  if (block.type === "note") {
                    return (
                      <p key={`${heading.id}-note-${index}`} className="docs__note">
                        {block.text}
                      </p>
                    );
                  }
                  if (block.type === "link") {
                    return (
                      <p key={`${heading.id}-link-${index}`} className="docs__link-row">
                        <a href={block.href} target="_blank" rel="noopener noreferrer">
                          {block.label}
                        </a>
                      </p>
                    );
                  }
                  return (
                    <div key={`${heading.id}-code-${index}`} className="docs__code">
                      {block.label ? <p className="docs__code-label">{block.label}</p> : null}
                      <pre>
                        <code>{block.content}</code>
                      </pre>
                    </div>
                  );
                })}
              </section>
            ))}
          </article>
          <DocsToc items={toc} />
        </div>
      </div>
    </div>
  );
}
