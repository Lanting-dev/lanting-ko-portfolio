export type GtStep = {
  index: string;
  title: string;
  finding?: string;
  description: string;
  media: readonly {
    src: string;
    type: "image" | "video";
    alt: string;
    poster?: string;
  }[];
};

export const GT_CASE_STUDY = {
  slug: "gt",
  title: "Making System State Visible in AI Course Creation",
  meta: [
    { label: "Duration", value: "12 weeks" },
    { label: "Team", value: "Lanting K., Claire P., Jeffery Y., Aswathi T." },
    { label: "Client", value: "Gutenberg Technology" },
    { label: "Service", value: "UX Research, Product Design" },
    { label: "Tools", value: "Figma, Tobii, Hotjar" },
  ],
  toc: [
    { id: "problem", label: "Problem" },
    { id: "research", label: "Research" },
    { id: "design", label: "Design" },
    { id: "conclusion", label: "Conclusion" },
  ],
  summary: [
    "Gutenberg’s AI Course Builder converts PDFs, PowerPoint files, and other documents into structured courses. AI-generated results are non-deterministic, but the system does not clearly communicate what users should provide or what will happen next. As a result, participants feel stuck, hesitate to take action, and rely on trial and error.",
    "In this project, I studied how participants interacted with the system and redesigned how the system communicates its behavior.",
  ],
  problem: {
    headline:
      "Participants hesitate and move back and forth throughout the workflow",
    body:
      "Participants frequently hesitate before taking action, revisit the same input fields, and move back and forth between sections. Some skip steps entirely. These patterns appear throughout the flow, from creating a project to generating content.",
    signals: [
      {
        title: "Input Purpose",
        body: "Participants repeatedly returned to input fields.",
      },
      {
        title: "Action Outcome",
        body: "Six of eight participants hesitated before regenerating content because they were unsure how it would affect their existing work.",
      },
      {
        title: "System Status",
        body: "Participants were unsure whether their work was saved.",
      },
    ],
  },
  research: {
    headline:
      "Understanding why users feel uncertain when interacting with an AI system",
    methods: [
      {
        title: "Eight Eye-Tracking and RTA Sessions",
        body: "I conducted eight in-person eye-tracking sessions with first-time users and paired each with a retrospective think-aloud (RTA) to understand how they made decisions and where confusion occurred during tasks.",
      },
      {
        title: "61.3 System Usability Scale Score",
        body: "Participants completed the System Usability Scale after each session. The product received a SUS score of 61.3, suggesting that participants did not feel fully comfortable using it.",
      },
      {
        title: "The Same Patterns Appeared in Hotjar",
        body: "Hotjar revealed the same interaction patterns, showing where existing users hesitated, retried actions, or tried to figure out what to do next.",
      },
    ],
  },
  insight: {
    headline: "System state is not visible to participants",
    body:
      "The AI course builder generates a draft based on user input, and detailed editing is expected to happen later in the CMS. Watching participants go through the process, I found they were stuck during several steps. These issues share some common areas: the system state is not visible, which causes confusion throughout the process. Participants don’t know what to provide or what will happen next, so they rely on trial and error.",
    steps: [
      {
        index: "01",
        title: "Set up course input",
        finding: "Confusion Between Description and Learning Objectives Fields",
        description:
          "Participants struggled to differentiate between the “Description” and “Learning Objectives” fields. In gaze replay, users repeatedly copied text between the two, indicating uncertainty about what each field required. This hesitation slowed down their progress.",
        media: [
          {
            src: "/work/gt/step-input-gaze.mp4",
            type: "video",
            alt: "Eye-tracking gaze replay on the Course Builder input form",
            poster: "/work/gt/step-input.png",
          },
        ],
      },
      {
        index: "02",
        title: "Generate course outline",
        description:
          "The transition from user input to an AI-generated outline provided little visibility into how the system used their input or what it would produce.",
        media: [
          {
            src: "/work/gt/step-outline-loading.mp4",
            type: "video",
            alt: "Course Builder generating a course outline",
          },
        ],
      },
      {
        index: "03",
        title: "Review & Refine course outline",
        finding: "Uncertainty Around Saved Work",
        description:
          "After generating pages of content, 4/8 participants were confused by the wording of the “Update Information” button. They weren’t sure if their work was saved, which made them hesitate and lowered their confidence in the system.",
        media: [
          {
            src: "/work/gt/step-outline-gaze.mp4",
            type: "video",
            alt: "Eye-tracking gaze replay while reviewing a generated course outline",
            poster: "/work/gt/step-outline.png",
          },
        ],
      },
      {
        index: "04",
        title: "Generate course content",
        description:
          "Because generation could replace previous results, participants lacked a safe way to explore another output while preserving their work.",
        media: [
          {
            src: "/work/gt/course-content.png",
            type: "image",
            alt: "Course Builder regeneration dialog",
          },
        ],
      },
      {
        index: "05",
        title: "Review & Refine content",
        description:
          "The workflow ended without clearly showing whether progress was saved or whether participants could return to an earlier version.",
        media: [
          {
            src: "/work/gt/step-save-at-end.mp4",
            type: "video",
            alt: "Participant attempting to save work at the end of a Course Builder session",
            poster: "/work/gt/research-screen.jpg",
          },
        ],
      },
    ] satisfies GtStep[],
  },
  design: [
    {
      id: "clear-expectations",
      label: "Design Decision 01",
      headline: "Set Clear Expectations for Users",
      paragraphs: [
        "It’s like being asked to draw something without knowing what is expected. Most people do not feel stuck because they lack creativity, but because they do not know what to draw. The existing AI Course Builder creates a similar experience: participants are given input fields, but it is unclear what information they should provide or how it will be used.",
        "To address this, I added four types of guidance to help participants understand each field and reduce cognitive load.",
      ],
      image: "/work/gt/clear-expectations.jpg",
      alt: "Redesigned learning-objectives form with four guidance patterns",
      points: [
        ["01", "Indicate Purpose", "What are they filling out right now?"],
        ["02", "Length Guidance", "How much should they write?"],
        ["03", "Content Guidance", "What kind of information belongs here?"],
        ["04", "AI Transparency", "How will this affect the generated course?"],
      ],
    },
    {
      id: "safe-iteration",
      label: "Design Decision 02",
      headline: "Support Safe Iteration",
      paragraphs: [
        "Participants’ search for a save option and hesitation to regenerate content signaled a need to preserve existing work. Because AI is non-deterministic, the same input does not guarantee the same output, making previous content important as a reference.",
        "I made saved progress visible through notifications and added version history so users could return to an earlier point before taking action.",
      ],
      image: "/work/gt/safe-iteration.jpg",
      alt: "Save-status notification and version-history concepts",
      points: [
        ["01", "User Awareness", "Make the current system status visible."],
        ["02", "Version History", "Allow users to return to a previous point."],
      ],
    },
  ],
  impact: {
    quote: "We were taking notes the whole time. This was really helpful.",
    attribution: "GT Course Builder AI Product Manager",
  },
  conclusion: {
    headline: "From Usability Issues to System Visibility",
    paragraphs: [
      "Triangulating multiple data sources helped validate consistent patterns in user behavior. By combining eye-tracking, RTA, and behavioral data, I identified the underlying reasons for hesitation and confusion rather than relying on a single signal. This shifted the focus from isolated usability issues to the broader problem of system visibility.",
      "Testing was conducted in isolation without the full CMS context, which may have influenced how participants behaved during the study. Future work would validate these findings in a CMS-integrated environment and explore how different interaction models support both generation and editing.",
    ],
  },
} as const;
