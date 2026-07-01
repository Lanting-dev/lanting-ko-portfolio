import { VISIBLE_PROJECTS } from "@/lib/projects";

/** Intro scroll room before the first card peels in. */
export const PROJECT_STACK_INTRO_VH = 50;

/** Scroll gap between each card peel (margin-top on cards 2…n). */
export const PROJECT_STACK_CARD_VH = 80;

/** Tail scroll room before About handoff. */
export const PROJECT_STACK_EXIT_VH = 50;

/** Desktop card body — synced to `--project-stack-card-body-vh`. */
export const PROJECT_STACK_CARD_BODY_VH = 62;

/** Mobile stacks copy + media vertically — needs more body vh. */
export const PROJECT_STACK_CARD_BODY_VH_MOBILE = 72;

/** Extra scroll after the last card settles. */
export const PROJECT_STACK_PEEL_BUFFER_RATIO = 0.4;

export const PROJECT_STACK_CARD_COUNT = VISIBLE_PROJECTS.length;

export function projectStackBodyVh(mobile: boolean): number {
  return mobile ? PROJECT_STACK_CARD_BODY_VH_MOBILE : PROJECT_STACK_CARD_BODY_VH;
}

/** Document flow height inside the stack scroll room. */
export function projectStackScrollRoomVh(
  cardCount = PROJECT_STACK_CARD_COUNT,
  bodyVh = PROJECT_STACK_CARD_BODY_VH,
  stepVh = PROJECT_STACK_CARD_VH,
): number {
  if (cardCount <= 0) return 0;
  const peelBuffer = stepVh * PROJECT_STACK_PEEL_BUFFER_RATIO;
  return (
    cardCount * bodyVh +
    Math.max(0, cardCount - 1) * stepVh +
    peelBuffer
  );
}

export type ProjectStackLayout = {
  section: number;
  intro: number;
  cardStep: number;
  cardBody: number;
  scrollRoom: number;
  exit: number;
};

export function projectStackLayout(
  mobile: boolean,
  cardCount = PROJECT_STACK_CARD_COUNT,
): ProjectStackLayout {
  const cardBody = projectStackBodyVh(mobile);
  const cardStep = PROJECT_STACK_CARD_VH;
  const scrollRoom = projectStackScrollRoomVh(cardCount, cardBody, cardStep);

  return {
    section: PROJECT_STACK_INTRO_VH + scrollRoom + PROJECT_STACK_EXIT_VH,
    intro: PROJECT_STACK_INTRO_VH,
    cardStep,
    cardBody,
    scrollRoom,
    exit: PROJECT_STACK_EXIT_VH,
  };
}

/** Reference desktop total — feeds rhythm spec / PROJECT_SCROLL_VH. */
export const PROJECT_STACK_SCROLL_VH = projectStackLayout(false).section;

/** @deprecated use projectStackLayout() */
export function projectStackLayoutVh(trackVh: number): ProjectStackLayout {
  void trackVh;
  return projectStackLayout(false);
}
