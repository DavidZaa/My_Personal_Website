import { describe, expect, it } from "vitest";
import { renderMarkdown } from "@/lib/markdown";

describe("renderMarkdown", () => {
  it("renders headings, emphasis, and links", async () => {
    const html = await renderMarkdown(
      "## Signals\n\nSome *emphasis* and a [link](https://example.com).",
    );
    expect(html).toContain("<h2>Signals</h2>");
    expect(html).toContain("<em>emphasis</em>");
    expect(html).toContain('href="https://example.com"');
  });

  it("syntax-highlights fenced code blocks", async () => {
    const html = await renderMarkdown('```ts\nconst x: number = 1;\n```');
    expect(html).toContain("<pre");
    expect(html).toContain("<code");
    // shiki emits per-token spans — presence means highlighting ran
    expect(html).toContain("<span");
  });

  it("supports GFM tables", async () => {
    const html = await renderMarkdown("| a | b |\n| - | - |\n| 1 | 2 |");
    expect(html).toContain("<table>");
    expect(html).toContain("<td>1</td>");
  });

  it("handles empty input without throwing", async () => {
    expect(await renderMarkdown("")).toBe("");
  });
});
