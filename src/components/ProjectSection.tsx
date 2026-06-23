import type { RefObject } from "react";
import { ProjectScrollSection } from "./projects/ProjectScrollSection";
import type { BallHandoffPose } from "@/lib/layout/ballHandoff";

type ProjectSectionProps = {
  trackRef?: RefObject<HTMLElement | null>;
  horizontalProgress?: number;
  orbTargetRef?: RefObject<HTMLDivElement | null>;
  cardImpactRef?: RefObject<HTMLDivElement | null>;
  lastBallSlotRef?: RefObject<HTMLDivElement | null>;
  handoffPoseRef?: RefObject<BallHandoffPose | null>;
  profileBallSlotRef?: RefObject<HTMLDivElement | null>;
  projectExitT?: number;
  aboutProgress?: number;
  fallPhase?: number;
  showLandedOrb?: boolean;
  hideProjectBall?: boolean;
};

export function ProjectSection({
  trackRef,
  horizontalProgress = 0,
  orbTargetRef,
  cardImpactRef,
  lastBallSlotRef,
  handoffPoseRef,
  profileBallSlotRef,
  projectExitT = 0,
  aboutProgress = 0,
  fallPhase = 0,
  showLandedOrb = false,
  hideProjectBall = false,
}: ProjectSectionProps) {
  return (
    <ProjectScrollSection
      trackRef={trackRef}
      horizontalProgress={horizontalProgress}
      orbTargetRef={orbTargetRef}
      cardImpactRef={cardImpactRef}
      lastBallSlotRef={lastBallSlotRef}
      handoffPoseRef={handoffPoseRef}
      profileBallSlotRef={profileBallSlotRef}
      projectExitT={projectExitT}
      aboutProgress={aboutProgress}
      fallPhase={fallPhase}
      showLandedOrb={showLandedOrb}
      hideProjectBall={hideProjectBall}
    />
  );
}
