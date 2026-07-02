import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypePrettyCode, {
    theme: "tokyo-night",
    keepBackground: false,
  })
  .use(rehypeStringify);

/** Render trusted markdown (owner-authored posts) to HTML with syntax highlighting. */
export async function renderMarkdown(md: string): Promise<string> {
  const file = await processor.process(md);
  return String(file);
}
