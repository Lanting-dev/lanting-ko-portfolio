import type { GtStep } from "./gt";

export type ForuPersona = {
  name: string;
  role: string;
  age: number;
  location: string;
  quote: string;
  type: string;
  insight: string;
  image: { src: string; alt: string };
};

export type ForuFinding = {
  title: string;
  body: string;
};

export type ForuDesignPillar = {
  id: string;
  label: string;
  headline: string;
  paragraphs: readonly string[];
  figure?: { src: string; alt: string };
  steps: readonly GtStep[];
};

export type ForuImpactQuote = {
  quote: string;
  attribution: string;
};

const FORU_ASSET_VERSION = "2026-06-24g";
const foruAsset = (path: string) => `${path}?v=${FORU_ASSET_VERSION}`;

export const FORU_CASE_STUDY = {
  slug: "foru",
  kicker: "For Ü",
  title: "Making Amazon Music Part of Everyday Life Through Personalization",
  meta: [
    { label: "Duration", value: "4 weeks" },
    { label: "Team", value: "Allison Chen, Lanting Ko" },
    { label: "Client", value: "Amazon Music" },
    { label: "Service", value: "User Research, Customer Lifecycle Analysis, Product Thinking, Prototyping" },
    { label: "Tools", value: "Figma, Google Survey" },
  ],
  toc: [
    { id: "overview", label: "Overview" },
    { id: "problem", label: "Problem" },
    { id: "research", label: "Research" },
    { id: "strategy", label: "Strategy" },
    { id: "design", label: "Design" },
    { id: "impact", label: "Impact" },
    { id: "conclusion", label: "Conclusion" },
  ],
  summary: [
    "For Ü is a personalized recommendation strategy designed to retain casual listeners across Amazon Music's tiered offerings. Casual listeners are the platform's largest segment, but they disengage when recommendations feel generic.",
    "We mapped two listener types, identified gaps versus competitors, and prototyped cross-ecosystem recommendations, routine-based playlists, and Maestro AI creation, with user control over data sources.",
  ],
  hero: {
    src: "/work/foru/foru.mp4",
    poster: foruAsset("/work/foru/hero.png"),
    alt: "For Ü, Amazon Music personalized recommendation strategy walkthrough",
  },
  prototypeUrl:
    "https://www.figma.com/proto/ApWUNGLo6E0KHnY7LSoLB4/High-Fidelity-Prototype?node-id=318-14232&p=f&viewport=97%2C217%2C0.05&t=qKY9EHQy3pq1GIuo-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=318%3A14232&show-proto-sidebar=1&page-id=0%3A1",
  problem: {
    headline: "How might we make users feel that Amazon Music really understands them?",
    body:
      "Retention depends on whether casual listeners feel the service fits into their lives. When For You recommendations miss the mark, Amazon Music becomes interchangeable with any other streaming app.",
    challenge:
      "Design a customer experience strategy that improves retention across tiered offerings and makes personalization feel human, not algorithmic.",
    signals: [
      {
        title: "29% disengaged",
        body: "Among lapsed casual users, 29% cited poor recommendations as a reason for leaving.",
      },
      {
        title: "75% felt competitors won",
        body: "Among lapsed users, 75% felt Spotify, Apple Music, or YouTube Music offered stronger personalization.",
      },
      {
        title: "Casual listeners matter most",
        body: "Active and passive casual listeners form the largest segment, making them the greatest opportunity for improving retention.",
      },
    ] satisfies ForuFinding[],
  },
  research: {
    headline: "Two kinds of casual listeners",
    intro:
      "We surveyed users and mapped behaviors to two personas. Both stream casually, but they relate to music differently.",
    personas: [
      {
        name: "Brooke Harper",
        role: "Graphic Designer",
        age: 29,
        location: "Brooklyn, NY",
        quote: "Music bridges me, myself, and others.",
        type: "Active Listener",
        insight: "Wants recommendations that reflect taste, mood, and identity, not just play history.",
        image: {
          src: "/work/foru/persona-active-brooke.jpg",
          alt: "Brooke Harper persona, Active Listener, 29, Graphic Designer in Brooklyn",
        },
      },
      {
        name: "Jamie Walker",
        role: "Journalist",
        age: 35,
        location: "Newark, NJ",
        quote: "Music is just there in the background of my life.",
        type: "Passive Listener",
        insight: "Needs context-matched playlists without searching or building libraries.",
        image: {
          src: "/work/foru/persona-passive-jamie.jpg",
          alt: "Jamie Walker persona, Passive Listener, 35, Journalist in Newark",
        },
      },
    ] satisfies ForuPersona[],
    findings: [
      {
        title: "Recommendations feel generic",
        body: "For You rows that repeat artists or ignore recent activity feel like guessing.",
      },
      {
        title: "Ecosystem data is underused",
        body: "Shopping, reading, and viewing signals rarely surface in Music in ways users trust.",
      },
      {
        title: "Competitors lead on control",
        body: "Spotify and Apple Music offer clearer taste levers; Amazon has the data but not the experience.",
      },
    ] satisfies ForuFinding[],
  },
  strategy: {
    headline: "For Ü: personalization that knows you",
    body:
      "For Ü connects Amazon's ecosystem to everyday listening: cross-service recommendations users can trace to their data, routine-based playlists, and Maestro AI for frictionless creation.",
    principles: [
      {
        title: "Transparent by default",
        body: "Users choose which Amazon services feed recommendations and can adjust anytime.",
      },
      {
        title: "Context over catalog",
        body: "Playlists respond to mood, weather, and daily routines, not just listening history.",
      },
      {
        title: "Creation without friction",
        body: "Maestro Beta generates tracklists from text or image prompts; users control saving and refining.",
      },
    ] satisfies ForuFinding[],
    comparison: {
      src: foruAsset("/work/foru/competitive-comparison.png"),
      alt: "Competitive comparison of For Ü vs Spotify, Apple Music, and YouTube Music across recommendation factors, daily routine control, and AI playlist creation",
    },
  },
  design: [
    {
      id: "ecosystem",
      label: "Design Pillar 01",
      headline: "Cross-ecosystem recommendations",
      paragraphs: [
        "Amazon already has signals about what users read, watch, and shop for. With explicit consent, For Ü makes selected signals visible inside Music and explains how they shape recommendations.",
      ],
      figure: {
        src: foruAsset("/work/foru/ecosystem-flow.png"),
        alt: "Cross-ecosystem For You modules based on Prime Video, IMDb, Twitch, and Goodreads, plus recommendation settings with user-controlled data sources",
      },
      steps: [],
    },
    {
      id: "routine",
      label: "Design Pillar 02",
      headline: "Routine-based For You",
      paragraphs: [
        "Passive listeners open Music because the moment needs a soundtrack. For Ü organizes the For You tab around daily context: weather, commute, work rhythm, and emotional cues.",
      ],
      steps: [
        {
          index: "01",
          title: "Routines that fit the day",
          finding: "Rainy Manhattan, office focus",
          description:
            "Contextual rows adapt to location and schedule: commute playlists for rainy mornings, focus tracks for the workday.",
          media: [
            {
              src: foruAsset("/work/foru/routines-flow.png"),
              type: "image",
              alt: "For You routines flow showing For You tab, recommendation settings, and edit routine screens",
            },
          ],
        },
        {
          index: "02",
          title: "Quote-based recommendations",
          finding: "Emotional entry points",
          description:
            "Users enter a quote or lyric; For Ü returns a playlist anchored to that sentiment.",
          media: [
            {
              src: foruAsset("/work/foru/for-you-quote.png"),
              type: "image",
              alt: "For You tab with quote-based emotional music recommendation feature",
            },
          ],
        },
      ],
    },
    {
      id: "maestro",
      label: "Design Pillar 03",
      headline: "Maestro Beta: AI playlist creation",
      paragraphs: [
        "Active listeners want to shape their sound without building playlists track by track. Maestro Beta accepts text or image prompts and keeps final control with the listener.",
      ],
      steps: [
        {
          index: "01",
          title: "Create with prompt or image",
          finding: "Text + visual input",
          description:
            "Users pick an inspiration card or type a prompt (city walk, mood, genre) to start generation.",
          media: [
            {
              src: foruAsset("/work/foru/maestro-create.png"),
              type: "image",
              alt: "Maestro Beta create screen with inspiration cards and prompt suggestions",
            },
          ],
        },
        {
          index: "02",
          title: "Combine image and prompt",
          finding: "Multimodal input",
          description:
            "A city photo plus a text prompt shows how Maestro interprets visual and verbal cues together.",
          media: [
            {
              src: foruAsset("/work/foru/maestro-create-prompt.png"),
              type: "image",
              alt: "Maestro Beta with city image and typed prompt for a city walk pop playlist",
            },
          ],
        },
        {
          index: "03",
          title: "AI reads the mood",
          finding: "Transparent analysis",
          description:
            "Maestro narrates what it sees in the image before generating, so users know why a playlist fits.",
          media: [
            {
              src: foruAsset("/work/foru/maestro-analysis.png"),
              type: "image",
              alt: "Maestro Beta analyzing a New York City street photo and describing the mood",
            },
          ],
        },
        {
          index: "04",
          title: "Preview before saving",
          finding: "Safe iteration",
          description:
            "Users review the tracklist and preview it in the player before saving the playlist to their library.",
          media: [
            {
              src: foruAsset("/work/foru/maestro-preview.png"),
              type: "image",
              alt: "Maestro Beta preview screen for Skyscraper Melodies NYC Pop Panorama playlist",
            },
          ],
        },
        {
          index: "05",
          title: "Saved to your library",
          finding: "From prompt to playlist",
          description:
            "The finished playlist lands in the library, ready to shuffle, edit, or share.",
          media: [
            {
              src: foruAsset("/work/foru/maestro-result.png"),
              type: "image",
              alt: "Maestro Beta completed playlist with shuffle and track list",
            },
          ],
        },
        {
          index: "06",
          title: "Share your daily pick",
          finding: "Social spread",
          description:
            "A share card turns the playlist into something users can post to Stories or messages.",
          media: [
            {
              src: foruAsset("/work/foru/maestro-share.png"),
              type: "image",
              alt: "Maestro Beta share card for Skyscraper Melodies playlist",
            },
          ],
        },
      ],
    },
  ] satisfies ForuDesignPillar[],
  impact: {
    headline:
      "Five participants rated their likelihood of returning at 7.8/10 the next day and 7.0/10 within the next month.",
    lead: "We interviewed five participants to evaluate the design's retention potential.",
    quotes: [
      {
        quote:
          "I would return to the app to find soundtracks from shows I've recently watched.",
        attribution: "Usability testing participant",
      },
      {
        quote:
          "It's cool to create playlists with AI. I would like to try different photos.",
        attribution: "Usability testing participant",
      },
      {
        quote:
          "I like being able to view and edit my routine because I usually choose music based on the situation.",
        attribution: "Usability testing participant",
      },
      {
        quote: "Sometimes, images say what I can't put into words.",
        attribution: "Usability testing participant",
      },
    ] satisfies ForuImpactQuote[],
  },
  conclusion: {
    headline: "Making Amazon Music feel indispensable",
    paragraphs: [
      "For Ü treats personalization as trust: show where recommendations come from, match music to daily rhythms, and offer AI creation without removing agency.",
      "This was a four-week concept project. Next steps would include testing whether recommendation settings feel transparent, validating routine-based triggers with listening data, and aligning the Maestro concept with production saving flows.",
    ],
  },
} as const;
