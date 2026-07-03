import { redirect } from "next/navigation";

/** About lives on the landing page now — the Crew Dossier section. */
export function GET() {
  redirect("/#dossier");
}
