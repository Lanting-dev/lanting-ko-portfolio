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
};

const PROJECT_CARD_COLOR_VERSION = "2026-06-23";
const projectColorAsset = (path: string) =>
  `${path}?v=${PROJECT_CARD_COLOR_VERSION}`;

export const PROJECTS: ProjectItem[] = [
  {
    id: "nga",
    src: "/projects/NGA.png",
    colorSrc: projectColorAsset("/projects/NGA-Color.png"),
    alt: "National Gallery of Art — UX research and product design",
    accent: "#F85525",
    href: "/work/nga",
    title: "National Gallery of Art",
    meta: "UX Research · Product Design",
    description:
      "A multiplayer drawing game that turns art appreciation into social, competitive play for Gen Z.",
  },
  {
    id: "gt",
    src: "/projects/GT.png",
    colorSrc: projectColorAsset("/projects/GT-Color.png"),
    alt: "Gutenberg Technology — AI Course Builder research and product design",
    accent: "#FAA968",
    href: "/work/gt",
    title: "Gutenberg Technology",
    meta: "UX Research · Product Design",
    description:
      "Making an AI course builder legible by surfacing system state so users act with confidence instead of trial and error.",
  },
  {
    id: "copper",
    src: "/projects/COPPER.png",
    colorSrc: projectColorAsset("/projects/COPPER-Color.png"),
    alt: "Cooper Hewitt — accessible Bungee font tester redesign",
    accent: "#F6DCAC",
    href: "/work/copper",
    title: "Cooper Hewitt",
    meta: "Accessibility · Product Design",
    description:
      "Rebuilding the Bungee font tester for keyboard and screen-reader access, plus audio that turns a visual tool multisensory.",
  },
  {
    id: "iong",
    src: "/projects/IONG.png",
    colorSrc: projectColorAsset("/projects/IONG-Color.png"),
    alt: "IONG — product design",
    accent: "#01204E",
    title: "IONG",
    meta: "Product Design",
  },
  {
    id: "alo",
    src: "/projects/ALO.png",
    colorSrc: projectColorAsset("/projects/ALO-Color.png"),
    alt: "ALO — product design",
    accent: "#028391",
    title: "ALO",
    meta: "Product Design",
  },
];
