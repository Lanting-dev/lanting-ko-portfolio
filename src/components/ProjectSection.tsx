import type { RefObject } from "react";
import { ProjectScrollSection } from "./projects/ProjectScrollSection";

type ProjectSectionProps = {
  trackRef?: RefObject<HTMLElement | null>;
};

export function ProjectSection({ trackRef }: ProjectSectionProps) {
  return <ProjectScrollSection trackRef={trackRef} />;
}
