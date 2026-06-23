export type CaseStudyMetaItem = {
  label: string;
  value: string;
};

export type CaseStudyInsight = {
  title: string;
  body: string;
};

export type CaseStudyFinding = {
  text: string;
  methods: string[];
};

export type CaseStudyJourneyStep = {
  title: string;
  description: string;
  emoji: string;
};

export type CaseStudyImpactPoint = {
  index: string;
  text: string;
};

export type CaseStudyImageRef = {
  src: string;
  alt: string;
};

type CaseStudyDesignSectionBase = {
  id: string;
  label: string;
  headline: string;
  body?: string;
  bodies?: readonly string[];
  image?: CaseStudyImageRef;
  images?: readonly CaseStudyImageRef[];
};

export type CaseStudyStrategySection = CaseStudyDesignSectionBase & {
  id: "strategic-direction";
  journey: readonly CaseStudyJourneyStep[];
};

export type CaseStudyImpactSection = CaseStudyDesignSectionBase & {
  id: "impact";
  points: readonly CaseStudyImpactPoint[];
};

export type CaseStudyDesignSection =
  | CaseStudyStrategySection
  | CaseStudyImpactSection
  | (CaseStudyDesignSectionBase & {
      id: Exclude<string, "strategic-direction" | "impact">;
    });

export const NGA_CASE_STUDY = {
  slug: "nga",
  accent: "#F85525",
  title: "Designing a Multiplayer Experience for Gen Z Museum Engagement",
  meta: [
    { label: "Duration", value: "12 weeks" },
    { label: "Team", value: "Lanting K, Claire P, Isadora O, Eric L" },
    { label: "Client", value: "National Gallery of Art" },
    {
      label: "Service",
      value: "UX Strategy, UX Research, Product Design",
    },
    { label: "Tools", value: "Figma, Panelfox, Zoom, Google Sheets" },
  ] satisfies CaseStudyMetaItem[],
  summary: {
    title: "Long Story Short",
    paragraphs: [
      "13% of NGA's website users are Fun Seekers, the youngest audience group and mostly Gen Z. However, they have the lowest satisfaction among all groups. While Artle drives 10,000 daily players, it focuses on guessing rather than active participation.",
      "In this project, I address this gap by shifting art engagement from passive recognition to social creation. The result is a multiplayer drawing experience where users create, compete, and share.",
    ],
  },
  heroImages: [
    {
      src: "/work/nga/home.png",
      alt: "Art or Fart — home screen",
    },
    {
      src: "/work/nga/public-room-selection.png",
      alt: "Art or Fart — public room selection",
    },
    {
      src: "/work/nga/ai-tool.png",
      alt: "Art or Fart — AI drawing tool",
    },
  ] satisfies CaseStudyImageRef[],
  toc: [
    { id: "problem", label: "Problem" },
    { id: "research", label: "Research" },
    { id: "design", label: "Design" },
    { id: "conclusion", label: "Conclusion" },
  ] as const,
  problem: {
    label: "Problem",
    headline: "High Traffic, Low Satisfaction Among Gen Z",
    intro:
      "As a world-class art museum, NGA attracts significant online traffic, but Fun Seekers, largely Gen Z, have the lowest satisfaction among the six audience groups. NGA had already experimented with several approaches to attract them. One example is Artle, a daily art-guessing game. Artle attracts around 10,000 players each day, and Fun Seekers are one of its main user groups, proving that games work. However, like many lightweight guessing games, Artle supports only a narrow type of interaction. This creates an opportunity to design a mobile experience that better aligns with how Fun Seekers want to engage.",
    insightsTitle: "What the National Gallery of Art Already Knows",
    insights: [
      {
        title:
          "Fun Seekers make up 13% of online traffic but report the lowest satisfaction",
        body: "Fun Seekers make up 13% of online traffic. However, they have the lowest satisfaction.",
      },
      {
        title: "Engagement is narrow",
        body: "Artle drives strong return behavior, with 54% of Fun Seekers returning. However, a lack of interactive content remains their main pain point.",
      },
      {
        title: "57% of Traffic Comes From Mobile",
        body: "Fun Seekers primarily use mobile devices to access the NGA website.",
      },
    ] satisfies CaseStudyInsight[],
  },
  research: {
    label: "Research",
    headline:
      "Engaging, Informative Experiences Are Social and Authentic",
    intro:
      "Based on these insights, we focused on understanding what Gen Z Fun Seekers consider engaging and how they use museum websites.",
    findings: [
      {
        text: "Museum websites are informative but not engaging",
        methods: ["Survey", "Interview"],
      },
      {
        text: "Fun Comes From Social Interaction, Sharing, and Co-Creation",
        methods: ["Survey", "Literature Review", "Interview"],
      },
      {
        text: "Gen Z Values Authenticity",
        methods: ["Interview", "Literature Review"],
      },
    ] satisfies CaseStudyFinding[],
    image: {
      src: "/work/nga/case-research.png",
      alt: "Research synthesis boards and competitive analysis",
    },
  },
  designSections: [
    {
      id: "strategic-direction",
      label: "Strategic Direction",
      headline: "Meet Gen Z where they already are",
      bodies: [
        "Our strategy focused on shifting from one-way interactions to participatory, shareable experiences, while rethinking information discovery as an engaging process. Instead of relying on standalone game mechanics, we integrated social and co-creative behaviors into the core art experience.",
        "We designed a participatory art experience that turns exploration into a social, game-driven interaction.",
      ],
      journey: [
        {
          title: "Discover",
          description: "Discover the game on the NGA website",
          emoji: "🤔",
        },
        {
          title: "Join",
          description: "Read the rules and enter the lobby",
          emoji: "😌",
        },
        {
          title: "Play",
          description: "Reveal the theme and play",
          emoji: "🤯",
        },
        { title: "Social", description: "Vote and react", emoji: "😄" },
        {
          title: "Results",
          description: "View the leaderboard and share",
          emoji: "😊",
        },
      ],
    },
    {
      id: "ideation",
      label: "Ideation",
      headline: "Creating art as competition",
      body: "Our breakthrough was Art or Fart, a concept inspired by Gen Z's fast-paced digital culture that transforms art appreciation into a competitive, social game. Earlier ideas fell short because they lacked immediacy or meaningful social interaction.",
      image: {
        src: "/work/nga/case-ideation.png",
        alt: "Early Art or Fart concept explorations",
      },
    },
    {
      id: "discoverability",
      label: "Design Decision 01",
      headline: "Increase discoverability through existing behavior",
      body: "Gen Z users typically visit museum websites for practical information, such as opening hours and current exhibitions. We placed an entry point near exhibition information to increase the game's discoverability and encourage users to learn about the featured artistic style before visiting. We added another entry point to Artle's results page, allowing existing players to try the new game.",
      images: [
        {
          src: "/work/nga/case-entry-point-1.png",
          alt: "Art or Fart entry point on Mary Cassatt exhibition page",
        },
        {
          src: "/work/nga/case-entry-point-2.png",
          alt: "Art or Fart entry point on Artle results page",
        },
      ],
    },
    {
      id: "drawing-assist",
      label: "Design Decision 02",
      headline: "Lower the barrier to drawing with a finger",
      body: "Drawing on a small screen with just a finger creates a high barrier to entry. We integrated multiple drawing assistance tools that interpret sketches and suggest options, making creation feel accessible rather than frustrating.",
      image: {
        src: "/work/nga/case-drawing-tools.png",
        alt: "AI drawing assist tools on mobile",
      },
    },
    {
      id: "reactions",
      label: "Design Decision 03",
      headline: "Enable Social Expression Without Losing Control",
      body: "Open chat risked undermining NGA's institutional voice. We replaced it with a reactions feature, preserving social expression while keeping communication controlled.",
      image: {
        src: "/work/nga/case-reactions.png",
        alt: "Reactions feature replacing open chat",
      },
    },
    {
      id: "theme-shuffle",
      label: "Design Decision 04",
      headline: "Learn Through Play",
      body: "Letting users vote on themes created more problems than it solved. A carousel selector that combines an art style with an object gave players more variety, clearer context, and a built-in learning moment.",
      image: {
        src: "/work/nga/case-theme-shuffle.png",
        alt: "Theme shuffle mechanism replacing theme voting",
      },
    },
    {
      id: "impact",
      label: "Impact",
      headline: "Transform Learning Into a Game",
      body: "Art or Fart is a competitive, multiplayer drawing game where players paint to a themed prompt, vote on each other's work, and climb a weekly leaderboard.",
      image: {
        src: "/work/nga/case-impact-review.png",
        alt: "NGA team review session over Zoom",
      },
      points: [
        {
          index: "01",
          text: "Shifts a one-way information channel into a participatory platform",
        },
        {
          index: "02",
          text: "A competitive game loop sustains social engagement",
        },
        {
          index: "03",
          text: "Themed prompts naturally surface NGA's collection",
        },
      ],
    },
  ] as const satisfies readonly CaseStudyDesignSection[],
  conclusion: {
    quote:
      "A lot of this is familiar to our developers... I can see this easily fitting into our portfolio of products.",
    quoteAttribution: "NGA Team",
    label: "Conclusion",
    headline: "Scaling the Experience",
    body: "Future work will focus on expanding the catalog of themes and integrating a shared engagement system that connects this experience with other NGA games, encouraging long-term participation and extending engagement across the broader NGA ecosystem.",
  },
} as const;

export type CaseStudyTocId = (typeof NGA_CASE_STUDY.toc)[number]["id"];

function hasJourney(
  section: CaseStudyDesignSection,
): section is CaseStudyStrategySection {
  return section.id === "strategic-direction";
}

function hasImpactPoints(
  section: CaseStudyDesignSection,
): section is CaseStudyImpactSection {
  return section.id === "impact";
}

export { hasJourney, hasImpactPoints };

function getSectionBody(
  section: CaseStudyDesignSection,
): string | readonly string[] | undefined {
  if ("bodies" in section && section.bodies) {
    return section.bodies;
  }
  if ("body" in section && section.body) {
    return section.body;
  }
  return undefined;
}

function getSectionImage(
  section: CaseStudyDesignSection,
): CaseStudyImageRef | undefined {
  return "image" in section ? section.image : undefined;
}

function getSectionImages(
  section: CaseStudyDesignSection,
): readonly CaseStudyImageRef[] | undefined {
  return "images" in section ? section.images : undefined;
}

export { getSectionBody, getSectionImage, getSectionImages };
