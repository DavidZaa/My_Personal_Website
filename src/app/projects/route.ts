import { redirect } from "next/navigation";

/**
 * Projects live in the landing page's hangar bay. This route stays
 * reserved for future per-project detail pages (/projects/[slug]).
 */
export function GET() {
  redirect("/#payload");
}
