export type ProjectItem = {
  id: string;
  src: string;
  /** Full-colour art used on the 3D cube front face. */
  colorSrc?: string;
  alt: string;
  accent: string;
  href?: string;
  /** Card caption — readable without opening the case study. */
  title?: string;
  meta?: string;
  description?: string;
  /** Omit from homepage carousel until the case study is ready. */
  hidden?: boolean;
};

const PROJECT_CARD_COLOR_VERSION = "2026-06-23";
const projectColorAsset = (path: string) =>
  `${path}?v=${PROJECT_CARD_COLOR_VERSION}`;

export const PROJECTS: ProjectItem[] = [
  {
    id: "nga",
    src: "/projects/NGA.png",
    colorSrc: projectColorAsset("/projects/NGA-Color.png"),
    alt: "National Gallery of Art · UX research and product design",
    accent: "#F85525",
    href: "/work/nga",
    title: "Designing a Multiplayer Experience for Gen Z Museum Engagement",
    meta: "National Gallery of Art · UX Research · Product Design",
    description:
      "A multiplayer drawing game that turns art appreciation into social, competitive play for Gen Z.",
  },
  {
    id: "gt",
    src: "/projects/GT.png",
    colorSrc: projectColorAsset("/projects/GT-Color.png"),
    alt: "Gutenberg Technology · AI Course Builder research and product design",
    accent: "#FAA968",
    href: "/work/gt",
    title: "Making System State Visible in AI Course Creation",
    meta: "Gutenberg Technology · UX Research · Product Design",
    description:
      "Surfacing system state in an AI course builder so users act with confidence, not trial and error.",
  },
  {
    id: "foru",
    src: "/projects/Amazon Music.png",
    colorSrc: projectColorAsset("/projects/Amazon Music-Color.png"),
    alt: "Amazon Music, For Ü personalized recommendation strategy",
    accent: "#25C4AD",
    href: "/work/foru",
    title: "A Personalized Recommendation Strategy for Amazon Music",
    meta: "Amazon Music · User Research · Product Design",
    description:
      "Cross-ecosystem recommendations, routine-based For You rows, and Maestro AI, with user control over data sources.",
  },
  {
    id: "copper",
    src: "/projects/COPPER.png",
    colorSrc: projectColorAsset("/projects/COPPER-Color.png"),
    alt: "Cooper Hewitt · accessible Bungee font tester redesign",
    accent: "#F6DCAC",
    href: "/work/copper",
    title: "Redesigning an Accessible Font Exploration Interface",
    meta: "Cooper Hewitt · Accessibility · Product Design",
    description:
      "Rebuilding the Bungee font tester for keyboard and screen-reader access, plus audio that turns a visual tool multisensory.",
  },
  {
    id: "iong",
    src: "/projects/IONG.png",
    colorSrc: projectColorAsset("/projects/IONG-Color.png"),
    alt: "IONG · speculative design and interaction design",
    accent: "#01204E",
    href: "/work/iong",
    title: "When Biometric Systems Decide What We Eat",
    meta: "Individual Project · Speculative Design · Interaction Design",
    description:
      "A 2070 employee onboarding demo where reading time and biometric tracking quietly assign you a role inside a system that manages citizen nutrition.",
  },
  {
    id: "alo",
    src: "/projects/ALO.png",
    colorSrc: projectColorAsset("/projects/ALO-Color.png"),
    alt: "ALO · product design",
    accent: "#028391",
    title: "ALO",
    meta: "Product Design",
    hidden: true,
  },
];

/** Projects shown in the Work carousel and related lists. */
export const VISIBLE_PROJECTS = PROJECTS.filter((project) => !project.hidden);
