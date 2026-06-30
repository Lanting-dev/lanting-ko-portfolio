import { getMediaSize } from "./dimensions";
import type { ExperimentalShowcase, ExperimentalSlug } from "./types";

const base = "/experimental";

function img(path: string, alt: string) {
  const src = `${base}/${path}`;
  return { type: "image" as const, src, alt, ...getMediaSize(src) };
}

function vid(path: string, alt: string, poster?: string) {
  const src = `${base}/${path}`;
  return {
    type: "video" as const,
    src,
    alt,
    poster,
    ...(poster ? getMediaSize(poster) : undefined),
  };
}

function slide(path: string, alt: string) {
  const src = `${base}/${path}`;
  return { src, alt, ...getMediaSize(src) };
}

export const EXPERIMENTAL_SHOWCASES: Record<
  ExperimentalSlug,
  ExperimentalShowcase
> = {
  suma: {
    slug: "suma",
    title: "SUMA",
    tag: "VR mindfulness · spatial UX",
    year: "2025",
    lede:
      "I designed SUMA's initial VR space and growth companion, shaping the first moment where users check in, feel welcomed, and enter a calmer world.",
    summary: [
      {
        label: "Problem",
        text: "Traditional guided meditation can feel too scripted when users are stressed and unsure whether they need comfort, reflection, or a quick emotional reset.",
      },
      {
        label: "My Role",
        text: "I designed the initial VR space, modeled and tested SUMA as a growth companion, and explored short AI-driven dialogue with emotion-based feedback.",
      },
      {
        label: "Outcome",
        text: "The prototype became a soft entry point into the VR experience, where users could meet SUMA, share how they feel, and receive a more personal response.",
      },
    ],
    role: ["Initial space design", "Growth companion", "3D modeling", "AI dialogue"],
    stack: ["Figma", "Blender", "Unity"],
    with: "Lan Ting, Minh, Krathish",
    slides: [
      slide("suma/slides/01.png", "SUMA title slide"),
      slide("suma/slides/02.png", "What's SUMA — a mindful relaxation companion"),
      slide("suma/slides/03.png", "Meeting SUMA: a calmer headspace when stress hits"),
      slide(
        "suma/slides/04.png",
        "Value: mindful relaxation that meets you where you're at — your mood, your own space",
      ),
      slide("suma/slides/05.png", "Tailored to user needs, not a one-time interaction"),
      slide("suma/slides/06.png", "How did we make it — process"),
      slide("suma/slides/07.png", "Moodboard: dreamy, playful, surreal"),
      slide(
        "suma/slides/08.png",
        "Research key takeaways: a need for a personalized experience and a preference for nature sounds",
      ),
      slide("suma/slides/09.png", "Onboarding flow: meet the growth companion and walk through the rooms"),
      slide("suma/slides/10.png", "Interaction scenario storyboard"),
      slide("suma/slides/11.png", "User testing"),
      slide(
        "suma/slides/12.png",
        "User testing results: participants loved the calming sunset palette, nature sounds, and playful feel",
      ),
      slide("suma/slides/13.png", "SUMA mobile companion: a 'how are you feeling' check-in"),
      slide("suma/slides/14.png", "Final demo"),
      slide(
        "suma/slides/15.png",
        "Reflection: VR is challenging but rewarding; personalized over cookie-cutter experiences",
      ),
      slide("suma/slides/16.png", "Reflection: creating an onboarding journey and SUMA's custom menu"),
    ],
    blocks: [
      img("suma/hero.png", "SUMA immersive wellness world"),
      vid(
        "suma/demo.mp4",
        "SUMA final demo",
        `${base}/suma/hero.png`,
      ),
      img("suma/02.gif", "SUMA VR scene walkthrough"),
      img("suma/lan-growth-companion-process.png", "Lan Ting growth companion form and material exploration"),
      img("suma/lan-initial-space-process.png", "Lan Ting initial VR space development"),
      img("suma/lan-companion-interaction.png", "Lan Ting SUMA companion dialogue interaction"),
    ],
  },
  resonant: {
    slug: "resonant",
    title: "Resonant",
    tag: "VR installation · spatial UX",
    year: "2025",
    lede:
      "An immersive VR space where sound, color, and emotions resonate together. Music sets the mood, a tap on an emoji names the feeling, and the room shifts color so a private response becomes a shared, collective space.",
    summary: [
      {
        label: "Problem",
        text: "Listening to music is deeply emotional, yet that feeling stays invisible. In a shared listening space there is no way to express what a song stirs up, or to see your emotion reflected back in the environment around you.",
      },
      {
        label: "My Role",
        text: "An individual project. I shaped the concept, the interaction flow, and the VR space itself: a record player to start the music, emoji reactions to express emotion, color-shifting walls, and spatial cues like the ground plane, cubes, and sound feedback.",
      },
      {
        label: "Outcome",
        text: "A walkable VR demo where clicking the record player starts the music and emojis appear. Selecting one recolors the whole room and enlarges the emoji, turning a single listener's emotion into a collective, ambient atmosphere.",
      },
    ],
    role: ["Concept", "Interaction design", "Spatial / VR design", "3D scene"],
    stack: ["Figma", "Unity"],
    slides: [
      slide("resonant/slides/01.png", "Resonant title slide with floating emoji faces"),
      slide(
        "resonant/slides/02.png",
        "Inspiration: Clubhouse social audio, Spotify mood playlists, and Gris using color to visualize emotion",
      ),
      slide(
        "resonant/slides/03.png",
        "Design concept: music sets the mood and users express emotion by clicking a reaction emoji",
      ),
      slide(
        "resonant/slides/04.png",
        "Design concept: color visualizes emotion, and blended colors create a unique collective space",
      ),
      slide(
        "resonant/slides/05.png",
        "Interaction flow: click the record player, light turns on, music plays, emojis appear, then a tap changes color and enlarges the emoji",
      ),
      slide(
        "resonant/slides/06.png",
        "What changed: color the platform as well as the walls, add sound feedback on tap, and add cubes for spatial depth",
      ),
      slide(
        "resonant/slides/07.png",
        "What I learned: 2D design principles carry into 3D, which adds sound, light, and spatial depth, and always consider the camera",
      ),
    ],
    blocks: [
      vid(
        "resonant/vr.mp4",
        "Resonant VR walkthrough: record player, floating emojis, and color-shifting room",
        `${base}/resonant/hero.png`,
      ),
    ],
  },
  "travel-pal": {
    slug: "travel-pal",
    title: "Travel Pal",
    tag: "Web · VR",
    year: "2025",
    lede:
      "A browser-based travel companion built with A-Frame, using spatial scenes for planning less and experiencing more.",
    role: ["Creative development", "Spatial UX", "Web VR"],
    stack: ["A-Frame", "WebXR", "HTML", "Figma"],
    blocks: [
      vid(
        "travel-pal/demo.mov",
        "Travel Pal A-Frame prototype walkthrough",
        `${base}/travel-pal/hero.png`,
      ),
      img("travel-pal/hero.png", "Travel Pal cover spread"),
      img("travel-pal/gallery-concept.png", "Travel Pal design concept boards"),
      img("travel-pal/gallery-01.png", "Travel Pal interface screens"),
      img("travel-pal/gallery-02.png", "Travel Pal journey map"),
      img("travel-pal/gallery-03.png", "Travel Pal spatial layout"),
      img("travel-pal/gallery-04.png", "Travel Pal detail screens"),
      img("travel-pal/gallery-05.png", "Travel Pal prototype states"),
      img("travel-pal/gallery-06.png", "Travel Pal visual system"),
      img("travel-pal/gallery-07.png", "Travel Pal interaction flow"),
      img("travel-pal/gallery-08.png", "Travel Pal scene study"),
      img("travel-pal/gallery-09.png", "Travel Pal mobile views"),
      img("travel-pal/gallery-10.png", "Travel Pal environment"),
      vid(
        "travel-pal/eye-aframe.mov",
        "A-Frame exploration, Eye project",
        `${base}/travel-pal/hero.png`,
      ),
    ],
  },
  boojie: {
    slug: "boojie",
    title: "Boojie",
    tag: "IoT focus · physical interaction",
    year: "2026",
    lede:
      "An indoor IoT wellness system for remote workers. Instead of dismissing an on-screen reminder, you get up, find a flickering candle somewhere in your home, and blow it out to start your break, turning a passive notification into an embodied ritual with Boojie, a small ghost companion living on your desktop.",
    summary: [
      {
        label: "Problem",
        text: "Working from home blurred the line between focus, rest, and movement. Pomodoro timers and desktop reminders stay entirely on-screen, so breaks get snoozed or ignored without ever leaving the desk. Wellness tools fail because they ask for almost no physical commitment.",
      },
      {
        label: "My Role",
        text: "A four-person team. I worked across the concept, the candle interaction, and the desktop ghost companion, and helped run the usability testing that shaped how the candle is extinguished.",
      },
      {
        label: "Outcome",
        text: "A working prototype: a Micro:bit candle flickers every 45 minutes, and blowing it out starts the break and rewards Boojie with new objects, outfits, and cozy rooms. Testing showed the physical task made the reminder far harder to dismiss than a screen-only nudge.",
      },
    ],
    role: ["Concept", "Interaction design", "Physical computing", "Usability testing"],
    stack: ["Micro:bit", "BLE", "MakeCode", "Electron", "Figma"],
    with: "Lanting Ko, Xinyao Guo, Conor Mack, Youyuan Wang",
    slides: [
      slide("boojie/slides/01.png", "Boojie title"),
      slide(
        "boojie/slides/02.png",
        "Remote workers know they should take breaks, they just never do",
      ),
      slide("boojie/slides/03.png", "What if taking a break required leaving your desk?"),
      slide("boojie/slides/04.png", "Two environments, one connected loop: the system diagram"),
      slide("boojie/slides/05.png", "Just blow: the candle interaction"),
      slide("boojie/slides/06.png", "From low-fi to believable in three weeks: the build"),
      slide("boojie/slides/07.png", "A ghost that lives on your screen: the desktop companion"),
      slide("boojie/slides/08.png", "The physical candle device in use"),
      slide("boojie/slides/09.png", "Physical stakes change how people behave: reflections"),
      slide("boojie/slides/10.png", "Boojie closing"),
    ],
    blocks: [
      vid(
        "boojie/demo.mp4",
        "Boojie demo: a candle flickers and the user blows it out to start a break",
        `${base}/boojie/01.jpg`,
      ),
      vid(
        "boojie/physical-demo.mp4",
        "Boojie physical demo: blowing out the candle to start a break",
        `${base}/boojie/01.jpg`,
      ),
      vid(
        "boojie/digital-demo.mp4",
        "Boojie digital demo: the desktop companion responds during focus and break time",
        `${base}/boojie/02.jpg`,
      ),
    ],
  },
  doorbear: {
    slug: "doorbear",
    title: "Doorbear",
    tag: "Hardware · IoT",
    year: "2025",
    lede:
      "A portable Micro:bit companion that alerts you when someone rings the door. Wear it, hang it, or place it on the table.",
    role: ["Physical computing", "Product prototyping"],
    stack: ["Micro:bit", "MakeCode", "Radio"],
    blocks: [
      img("doorbear/hero.jpg", "Doorbear system overview"),
      img("doorbear/02.jpg", "Doorbear companion unit"),
      img("doorbear/03.jpg", "Doorbear doorbell unit"),
      img("doorbear/04.jpg", "Doorbear wearable mode"),
      img("doorbear/05.jpg", "Doorbear hangable mode"),
      img("doorbear/06.jpg", "Doorbear tabletop mode"),
      img("doorbear/07.jpg", "Doorbear circuit detail"),
      img("doorbear/08.jpg", "Doorbear prototyping"),
      img("doorbear/09.jpg", "Doorbear radio pairing"),
      img("doorbear/10.jpg", "Doorbear enclosure"),
      img("doorbear/11.jpg", "Doorbear in use"),
      img("doorbear/12.jpg", "Doorbear documentation"),
    ],
  },
};

// travel-pal and doorbear are temporarily hidden — keep their data in
// EXPERIMENTAL_SHOWCASES, just drop them from the visible list / routes.
export const EXPERIMENTAL_SLUGS: ExperimentalSlug[] = [
  "suma",
  "resonant",
  "boojie",
];

export function getExperimentalShowcase(
  slug: string,
): ExperimentalShowcase | undefined {
  return EXPERIMENTAL_SHOWCASES[slug as ExperimentalSlug];
}
