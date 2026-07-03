import type { Metadata } from "next";
import { recordPageView } from "@/lib/data";
import { ProjectGallery } from "./ProjectGallery";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "The payload bay — research, apps, civic deployments, club projects, and patents from David Zhang, one hangar door at a time.",
};

export default function ProjectsPage() {
  void recordPageView("/projects");
  return <ProjectGallery />;
}
