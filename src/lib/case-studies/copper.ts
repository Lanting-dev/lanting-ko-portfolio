export type CopperMedia = {
  src: string;
  type: "image" | "video";
  alt: string;
  poster?: string;
  /** Video carries meaningful audio: show controls and a "has sound" hint. */
  sound?: boolean;
};

export type CopperMappingItem = {
  from: string;
  to: string;
  body: string;
  sub?: readonly string[];
};

export type CopperMapping = {
  heading: string;
  intro: string;
  items: readonly CopperMappingItem[];
};

export type CopperDesignDecision = {
  id: string;
  label: string;
  headline: string;
  body: string;
  media: CopperMedia;
  mapping?: CopperMapping;
};

export type CopperOutcome = {
  title: string;
  body: string;
};

export type CopperFutureStep = {
  index: string;
  title: string;
  body: string;
};

export const COPPER_CASE_STUDY = {
  slug: "copper",
  kicker: "Cooper Hewitt",
  title: "Redesigning an Accessible Font Exploration Interface",
  meta: [
    { label: "Duration", value: "4 weeks" },
    { label: "Team", value: "Lan-Ting K, Smridhi G, Simran K, Gloria Y, Nandita M" },
    { label: "Client", value: "Cooper Hewitt" },
    { label: "Service", value: "Accessibility" },
    { label: "Tools", value: "Figma, Voice Over, Hume AI" },
  ],
  toc: [
    { id: "problem", label: "Problem" },
    { id: "design", label: "Design" },
    { id: "outcome", label: "Outcome" },
    { id: "conclusion", label: "Conclusion" },
  ],
  summary: [
    "Bungee is a chromatic display font in Cooper Hewitt’s digital collection, but its web-based tester was built entirely around visual interaction, leaving users with visual impairments unable to engage with it.",
    "In this project, I redesigned the interface to meet WCAG standards, replacing inaccessible controls with keyboard-navigable alternatives and adding audio feedback to turn a visual-only experience into a multisensory one.",
  ],
  hero: {
    src: "/work/copper/hero.png",
    alt: "Bungee accessible font tester showing the word BUNGEE and the control panel",
  },
  problem: {
    headline: "A font tester that only works if you can see it",
    body:
      "Bungee is a modular, chromatic display font in Cooper Hewitt’s digital collection. Its web-based tester lets users layer colors, change orientations, and create typographic compositions, but every interaction relies on visual input. Users with visual impairments have no way to engage with it. With nearly 20 million Americans affected by visual impairments, this is a significant gap in museum digital accessibility.",
  },
  designDecisions: [
    {
      id: "unfold-panel",
      label: "Design Decision 01",
      headline: "Unfold the control panel for keyboard access",
      body:
        "The collapsed panel required extra clicks and couldn’t be navigated by keyboard. I unfolded it, mapped a logical tab order, and wrapped the interface in a semantic <form> so users can trigger actions without tabbing through every element.",
      media: {
        src: "/work/copper/tab-order.png",
        type: "image",
        alt: "Annotated tab order across the unfolded Bungee control panel",
      },
    },
    {
      id: "color-swatches",
      label: "Design Decision 02",
      headline: "Replace the color picker with labeled swatches",
      body:
        "The original picker relied on dragging within a visual spectrum, making it impossible to navigate without sight. I replaced it with a labeled swatch grid and added HEX/RGB input for custom colors.",
      media: {
        src: "/work/copper/color-swatches.png",
        type: "image",
        alt: "Labeled swatch grid with HEX and RGB input replacing the spectrum color picker",
      },
    },
    {
      id: "audio-feedback",
      label: "Design Decision 03",
      headline: "Add audio to bridge the visual gap",
      body:
        "Descriptions alone can’t capture the feel of a visual design. Audio feedback lets users hear how the font changes as they adjust parameters.",
      media: {
        src: "/work/copper/audio-feedback.mp4",
        type: "video",
        alt: "Audio feedback responding as font parameters are adjusted",
      },
      mapping: {
        heading: "Sonic Typography Mapping System",
        intro:
          "Building on the improved technical foundation, the second phase introduced an audio experience that translates visual characteristics into corresponding sound elements:",
        items: [
          {
            from: "Internal Contrast",
            to: "Voice Depth",
            body: "Greater contrast produces deeper, more resonant voices, while lighter contrasts use higher, airier tones.",
          },
          {
            from: "Overall Contrast",
            to: "Timbre",
            body: "Different color schemes map to voice qualities that evoke similar emotional responses — bright colors feel energetic, muted tones feel softer.",
          },
          {
            from: "Layering",
            to: "Audio Effects",
            body: "Bungee’s distinctive layers transform into specific audio effects:",
            sub: [
              "Inline — a slight echo effect",
              "Outline — reverb depth",
              "Shade — a chorus effect that adds richness",
            ],
          },
          {
            from: "Orientation",
            to: "Pacing",
            body: "Vertical text orientation becomes a distinct rhythmic pattern with deliberate pauses between letters, clearly distinguishing it from horizontal text flow.",
          },
          {
            from: "Background Shapes",
            to: "Ambient Sound",
            body: "Different decorative elements create distinctive audio environments:",
            sub: [
              "Banner shapes produce continuous ambient tones",
              "Block shapes create punctuated sound textures",
              "Ornamental elements add subtle audio accents",
            ],
          },
        ],
      },
    },
    {
      id: "onboarding",
      label: "Design Decision 04",
      headline: "Guide every visitor through onboarding",
      body:
        "Interactive digital works aren’t always intuitive for museum visitors. I designed a contextual tutorial triggered on both hover and keyboard focus, with an optional panel for returning users.",
      media: {
        src: "/work/copper/onboarding.mp4",
        type: "video",
        alt: "Contextual tutorial tooltip guiding a visitor through the Bungee tester",
        sound: true,
      },
    },
  ] satisfies CopperDesignDecision[],
  outcomes: [
    {
      title: "Unfolded Control Panel",
      body: "Simplified the interface by removing unnecessary collapsible sections to improve visibility and reduce interaction steps.",
    },
    {
      title: "Accessible Color Picker",
      body: "Replaced the default color picker with a swatch-style interface that supports keyboard navigation and screen reader access.",
    },
    {
      title: "Guided Tutorial",
      body: "Designed contextual onboarding for both first-time and returning users, with support for hover, focus, and an optional tutorial panel.",
    },
    {
      title: "From Visual to Multisensory",
      body: "Introduced audio feedback to let users perceive typographic changes not only visually, but also through sound.",
    },
  ] satisfies CopperOutcome[],
  outcomeDemo: {
    src: "/work/copper/audio-feedback.mp4",
    type: "video",
    alt: "Full walkthrough of the redesigned accessible Bungee font tester",
  } satisfies CopperMedia,
  conclusion: {
    headline: "Beyond the screen, beyond the visual",
    paragraphs: [
      "This project was a unique opportunity for me to design within a museum context. While I truly enjoyed creating a multisensory experience, the process also revealed areas for improvement that I look forward to exploring in future projects.",
      "Here are some future steps:",
    ],
    futureSteps: [
      {
        index: "01",
        title: "Describe color more expressively.",
        body: "Instead of “orange,” something like “orange sunset on the beach” helps users feel the color, not just identify it.",
      },
      {
        index: "02",
        title: "Design gender-neutral sound.",
        body: "Voice and audio cues should feel expressive without reinforcing stereotypes.",
      },
      {
        index: "03",
        title: "Expand beyond keyboard.",
        body: "Bungee will be displayed at Cooper Hewitt in person. Other forms of interaction may change how visitors engage with it in a physical space.",
      },
    ] satisfies CopperFutureStep[],
  },
} as const;
