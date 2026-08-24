import type { GtStep } from "./gt";

export type IongInsight = {
  title: string;
  body: string;
  image?: { src: string; alt: string };
};

export type IongDepartment = {
  name: string;
  tagline: string;
  body: string;
  accessible: boolean;
};

export type IongSubstrate = {
  name: string;
  macro: string;
  body: string;
  image: { src: string; alt: string };
};

export type IongInterface = {
  label: string;
  headline: string;
  body: string;
  image: { src: string; alt: string };
};

export const IONG_CASE_STUDY = {
  slug: "iong",
  kicker: "IONG 養",
  title: "When Biometric Systems Decide What We Eat",
  meta: [
    { label: "Duration", value: "4 weeks" },
    { label: "Team", value: "Lan-Ting Ko" },
    { label: "Client", value: "Individual Project" },
    { label: "Service", value: "Speculative Design, Interaction Design" },
    { label: "Tools", value: "Figma, Codex, Claude Code" },
  ],
  toc: [
    { id: "concept", label: "Concept" },
    { id: "world", label: "World" },
    { id: "experience", label: "Experience" },
    { id: "reflection", label: "Reflection" },
  ],
  summary: [
    "IONG is a speculative onboarding system set in 2070, where food is no longer chosen but assigned through biometric tracking and automated nutrition.",
    "Instead of showing the future from a citizen's view, I built an employee onboarding demo. The system tracks how you read, click, and move through departments, then assigns your badge based on that behavior.",
  ],
  hero: {
    src: "/work/iong/intro.mp4",
    poster: "/work/iong/welcome-onboard.png",
    alt: "IONG welcome onboarding screen with employee badge assignment",
  },
  demoUrl: "https://iong.vercel.app/index.html",
  world: {
    conceptHeadline: "Food as a system, not a choice",
    headline: "2070: A Low-Fertility Future",
    body:
      "Declining birth rates and pressure on public health systems have turned food into a government-managed resource. IONG 養 is a centralized nutrition program that supports population health without ever describing participation as mandatory.",
    context:
      "Citizens receive meals generated through continuous biometric analysis. The demo places you on the employee side of the institution, where care, scoring, monitoring, and access start to blur.",
    premiseContext:
      "Food feels personal, but many choices are already shaped before we make them, through packaging, grocery systems, health tracking, and algorithms. IONG extends that condition into a future where food decisions become fully automated.",
    designQuestion:
      "IONG reimagines food as a system rather than a choice, exploring how care and optimization can slowly reshape human autonomy.",
    image: {
      src: "/work/iong/low-fertility-future.jpg",
      alt: "2070 low-fertility future scenario showing population decline, public health response, and the establishment of IONG",
    },
    goals: [
      {
        title: "Explore automation and care",
        body: "Show how a helpful system can quietly shape behavior and reduce autonomy.",
      },
      {
        title: "Connect speculation to the present",
        body: "Tie the fiction to health tracking, personalization, and AI-driven decisions.",
      },
      {
        title: "No clear right or wrong",
        body: "Let curiosity and discomfort coexist instead of labeling the system as good or bad.",
      },
    ] satisfies IongInsight[],
  },
  research: {
    headline: "Why food? Because choice is already structured",
    intro:
      "Before the institution took shape, I looked at how food choice already works today. Food feels personal, but many decisions are shaped before we make them, through packaging, grocery layouts, health tracking, and recommendation algorithms. IONG builds on these existing systems and imagines what happens when the process becomes fully automated.",
    literature: [
      {
        title: "Food choice is socially shaped",
        body: "Drawing on Pierre Bourdieu’s Distinction, I treated food as culturally learned, not purely individual preference, which informed IONG’s institutional framing.",
      },
      {
        title: "“Good” food is moralized",
        body: "Labels like “healthy,” “clean,” and “natural” tie eating to responsibility and identity. This shaped systems like the Health Credit Score.",
      },
      {
        title: "Everyday decisions are structured",
        body: "Packaging, layouts, algorithms, and trackers organize choices before they feel conscious. IONG extends that condition into full automation.",
      },
    ] satisfies IongInsight[],
    pillars: [
      {
        title: "Packaging",
        body: "Labels like “organic” and “high protein” shape what “good” food looks like before anyone reads the details.",
      },
      {
        title: "Grocery systems",
        body: "Eye-level placement and personalized rankings shape visibility long before a choice feels deliberate.",
      },
      {
        title: "Health tracking",
        body: "Calories, sleep, and biometric feedback turn eating into measurable optimization.",
      },
      {
        title: "Social media",
        body: "Algorithms repeatedly promote certain diets and wellness trends, normalizing some behaviors over others.",
      },
    ] satisfies IongInsight[],
    signals: [
      {
        title: "Fewer options than we think",
        body: "Recommendation systems filter what people see before decisions are made.",
      },
      {
        title: "Food becomes data",
        body: "Nutrition is increasingly evaluated through metrics and predictive health analysis.",
      },
      {
        title: "Systems start deciding for us",
        body: "Platforms move from suggesting choices to generating them. Users only approve or adjust.",
      },
    ] satisfies IongInsight[],
  },
  process: {
    headline: "How the concept became interactive",
    intro:
      "IONG started as research into how food choices are already shaped, then moved from speculative object design into an interactive employee system. The final demo became a way to make the institution feel usable, believable, and slightly uncomfortable.",
    points: [
      [
        "01",
        "Food choice research",
        "I looked at packaging, grocery layouts, health tracking, and recommendation systems to understand how everyday choices are structured before they feel personal.",
      ],
      [
        "02",
        "Speculative object",
        "I prototyped an early compliance device and food substrate system, testing how wellness language, minimal interfaces, and small rewards could make control feel ordinary.",
      ],
      [
        "03",
        "Interactive onboarding",
        "The project became an employee demo with biometric entry, locked departments, behavior tracking, and a badge assigned by the system instead of selected by the user.",
      ],
    ] as const,
    images: [
      {
        src: "/work/iong/severance-analysis.png",
        alt: "Severance worldbuilding analysis cover",
        caption: "Severance analysis",
      },
      {
        src: "/work/iong/circadian-compliance-unit.png",
        alt: "Circadian Compliance Unit prototype showing minimal interface, yes-or-no buttons, and printed note output",
        caption: "Circadian Compliance Unit",
      },
    ],
  },
  system: {
    headline: "One centralized system, five departments",
    intro:
      "IONG operates through five departments. The onboarding experience only grants partial access, so the system feels larger than what a new employee is allowed to see.",
    inDemo: {
      label: "In the demo",
      lead: "As a new employee, you can open Mete Systems, Hæl Intelligence, and Wēl Outreach. You also pass through biometric verification and, eventually, receive a badge.",
    },
    beyondDemo: {
      label: "Outside your clearance",
      lead: "Lif Continuity and Lic Analytics stay locked during onboarding. Substrates, delivery, and Petizen extend the system into citizen daily life: context you read about on employee screens, not paths you walk yourself.",
    },
    departmentMap: {
      src: "/work/iong/department-map.png",
      alt: "IONG department map showing Mete Systems, Hæl Intelligence, Wēl Outreach, Lif Continuity, and Lic Analytics",
    },
    departments: [
      {
        name: "Mete Systems",
        tagline: "Surplus to sustenance",
        body: "Processes surplus materials into daily sachets while keeping composition mostly invisible.",
        accessible: true,
      },
      {
        name: "Hæl Intelligence",
        tagline: "Biometric data analysis",
        body: "Uses wearable data to update nutrition plans and citizen profiles in real time.",
        accessible: true,
      },
      {
        name: "Wēl Outreach",
        tagline: "Trust and communication",
        body: "Explains the Health Credit Score and turns compliance into public-facing guidance.",
        accessible: true,
      },
      {
        name: "Lif Continuity",
        tagline: "Population monitoring",
        body: "You cannot access this department during onboarding. Your clearance level does not permit entry.",
        accessible: false,
      },
      {
        name: "Lic Analytics",
        tagline: "Data processing",
        body: "You cannot access this department during onboarding. Your clearance level does not permit entry.",
        accessible: false,
      },
    ] satisfies IongDepartment[],
    substrates: [
      {
        name: "Flǣsc",
        macro: "Protein",
        body: "Made from algae-based protein. High-protein, low-resource, and land-efficient, designed to maintain muscle function and support recovery.",
        image: {
          src: "/work/iong/flaesc.png",
          alt: "Flǣsc protein substrate made from algae-based biomass",
        },
      },
      {
        name: "Hwǣte",
        macro: "Carbohydrate",
        body: "Made from surplus vegetables. Reduces food waste and resource use while providing steady energy throughout the day.",
        image: {
          src: "/work/iong/hwaete.png",
          alt: "Hwǣte carbohydrate substrate made from surplus vegetables",
        },
      },
      {
        name: "Fǣtt",
        macro: "Lipid",
        body: "Made from seed-derived oils. A renewable, widely available source that maintains stable energy regulation over time.",
        image: {
          src: "/work/iong/faett.png",
          alt: "Fǣtt lipid substrate made from seed-derived oils",
        },
      },
    ] satisfies IongSubstrate[],
    interfaces: [
      {
        label: "Hæl Intelligence · Citizen view",
        headline: "Real-time biometric tracking",
        body:
          "During onboarding, employees review the citizen dashboard: health scores, mood, delivery status, and today’s formula in one view. Continuous monitoring is presented as care before it reads as surveillance.",
        image: {
          src: "/work/iong/hael-citizen-dashboard.png",
          alt: "Hæl Intelligence citizen dashboard with health credit score, mood, diagnosis, and daily requirements",
        },
      },
      {
        label: "Wēl Outreach · Citizen view",
        headline: "Behavior-based scoring",
        body:
          "Employees see how Wēl communicates score changes to citizens. Family participation earns bonuses; missed daily requirements quietly reduce the score and access to stores and services.",
        image: {
          src: "/work/iong/health-credit-score.png",
          alt: "Health Credit Score notifications showing family planning bonus and missed requirement penalty",
        },
      },
      {
        label: "Hæl Intelligence · Employee view",
        headline: "Daily data recalibration",
        body:
          "Employees recalibrate citizen profiles to maintain stable nutritional and behavioral conditions. Small adjustments across alignment, mood, and engagement metrics keep the system optimized.",
        image: {
          src: "/work/iong/hael-recalibrate.png",
          alt: "Hæl Intelligence employee recalibration dashboard with profile metrics and 3D body scan",
        },
      },
    ] satisfies IongInterface[],
    delivery: {
      headline: "Personalized allocation, once per cycle",
      body: "Citizens receive a personalized allocation once per 30-day cycle, exactly what the system calculates their body needs, without asking them to decide. Employees encounter this service as part of the program they help operate.",
      image: {
        src: "/work/iong/delivery.png",
        alt: "IONG personalized allocation delivery box with teal wave branding, held in hand",
      },
    },
    petizen: {
      headline: "Pets are included in the system",
      body: "Citizen household scoring extends to pets. Petizen profiles monitor health data and allow personalized nutrition. Employees see how deeply the system reaches into domestic life.",
      image: {
        src: "/work/iong/petizen.png",
        alt: "Hæl Intelligence Petizen dashboard showing Billy and Charlie",
      },
    },
  },
  experience: {
    headline: "Employee onboarding as the experience",
    intro:
      "The demo has no fixed path. You enter with partial employee access, complete biometric scans, and explore departments freely. The system tracks reading time and interactions, then uses that behavior to assign your employee badge. You never choose a role directly; browsing becomes participation.",
    steps: [
      {
        index: "welcome",
        title: "Welcome onboard",
        finding: "Enter as a new employee",
        description:
          "The experience opens with a partial-access employee ID, then moves through fingerprint and facial recognition. Participation begins before anyone reads the fine print.",
        media: [
          {
            src: "/work/iong/intro.mp4",
            type: "video",
            alt: "IONG welcome onboarding introduction with employee ID and biometric verification",
            poster: "/work/iong/welcome-onboard.png",
          },
        ],
      },
      {
        index: "mete",
        title: "Mete Systems",
        finding: "Surplus to sustenance",
        description:
          "Mete Systems converts surplus into daily sachets. Employees can linger or move on, but the system logs reading time either way.",
        media: [
          {
            src: "/work/iong/mete.mp4",
            type: "video",
            alt: "Mete Systems department walkthrough in the IONG employee onboarding demo",
            poster: "/work/iong/flaesc.png",
          },
        ],
      },
      {
        index: "hael",
        title: "Hæl Intelligence",
        finding: "Citizen data, employee access",
        description:
          "Hæl Intelligence shows citizen health scores, mood, and delivery status in real time: food as an output of continuous data collection.",
        media: [
          {
            src: "/work/iong/heal.mp4",
            type: "video",
            alt: "Hæl Intelligence citizen dashboard viewed during employee onboarding",
            poster: "/work/iong/hael-citizen-dashboard.png",
          },
        ],
      },
      {
        index: "wel",
        title: "Wēl Outreach",
        finding: "How compliance is explained",
        description:
          "Wēl Outreach shows how bonuses and penalties are communicated, and how access to services quietly depends on daily behavior.",
        media: [
          {
            src: "/work/iong/wel.mp4",
            type: "video",
            alt: "Wēl Outreach Health Credit Score flow viewed during employee onboarding",
            poster: "/work/iong/health-credit-score.png",
          },
        ],
      },
      {
        index: "lif",
        title: "Lif Continuity",
        finding: "Access restricted",
        description:
          "Lif Continuity handles population monitoring. The locked screen reinforces that the institution extends beyond what a new employee can see.",
        media: [
          {
            src: "/work/iong/lif-continuity-locked.png",
            type: "image",
            alt: "Lif Continuity locked department screen showing access restricted during employee onboarding",
          },
        ],
      },
      {
        index: "lic",
        title: "Lic Analytics",
        finding: "Access restricted",
        description:
          "Lic Analytics processes data at a scale onboarding does not expose. Its lock makes limited access part of the interaction.",
        media: [
          {
            src: "/work/iong/lic-analytics-locked.png",
            type: "image",
            alt: "Lic Analytics locked department screen showing access restricted during employee onboarding",
          },
        ],
      },
      {
        index: "badge",
        title: "Employee badge",
        finding: "Assigned by your behavior",
        description:
          "The badge reflects how you moved through onboarding, not a role you selected. Reading time, tracked interactions, and biometric entry feed the assignment.",
        media: [
          {
            src: "/work/iong/badge.mp4",
            type: "video",
            alt: "Employee badge assignment based on onboarding behavior in the IONG demo",
            poster: "/work/iong/welcome-onboard.png",
          },
        ],
      },
    ] satisfies GtStep[],
    outro:
      "The demo is the entry point. What follows traces how the idea became a system.",
  },
  reflection: {
    headline: "Speculation as a mirror for the present",
    paragraphs: [
      "IONG was my final project at Pratt, a chance to experiment with worldbuilding and systems thinking outside the constraints of a typical product brief. Imagining a future where food is managed, not chosen, made me look more critically at the health apps, recommendation engines, and behavioral nudges that already shape everyday life.",
      "This may not be a conventional UX project, but it became one of the most meaningful to me as a designer: building a fictional system coherent enough to feel plausible and close enough to the present to feel uncomfortable.",
    ],
  },
} as const;
