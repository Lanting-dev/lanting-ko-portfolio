import type { Locale } from "@/lib/i18n/locale";
import type { ProjectItem } from "@/lib/projects";

type LocalizedProjectFields = Pick<
  ProjectItem,
  "alt" | "title" | "meta" | "focus" | "description"
>;

const en: Record<string, LocalizedProjectFields> = {
  nga: {
    alt: "National Gallery of Art · UX research and product design",
    title: "Designing a Multiplayer Experience for Gen Z Museum Engagement",
    meta: "National Gallery of Art · UX Research · Product Design",
    focus: "Engagement strategy",
    description:
      "Turned a passive gallery visit into social, competitive play through research, game mechanics, and museum-friendly interaction design.",
  },
  gt: {
    alt: "Gutenberg Technology · AI Course Builder research and product design",
    title: "Making System State Visible in AI Course Creation",
    meta: "Gutenberg Technology · UX Research · Product Design",
    focus: "AI workflow clarity",
    description:
      "Clarified what the AI is doing, what changed, and what comes next so educators can move with confidence.",
  },
  foru: {
    alt: "Amazon Music, For Ü personalized recommendation strategy",
    title: "Making Amazon Music Part of Everyday Life Through Personalization",
    meta: "Amazon Music · User Research · Product Design",
    focus: "Personalization strategy",
    description:
      "Designed routine-aware recommendations, Maestro creation flows, and data controls that make personalization feel useful instead of opaque.",
  },
  copper: {
    alt: "Cooper Hewitt · accessible Bungee font tester redesign",
    title: "Redesigning an Accessible Font Exploration Interface",
    meta: "Cooper Hewitt · Accessibility · Product Design",
    focus: "Accessible interaction",
    description:
      "Rebuilt a visual font tool for keyboard and screen-reader access, then added audio feedback to make exploration more multisensory.",
  },
  iong: {
    alt: "IONG · speculative design and interaction design",
    title: "When Biometric Systems Decide What We Eat",
    meta: "Individual Project · Speculative Design · Interaction Design",
    focus: "Critical interaction design",
    description:
      "Built a 2070 onboarding experience that makes biometric decision-making feel ordinary, then lets that ordinariness become the critique.",
  },
};

const zhTW: Record<string, LocalizedProjectFields> = {
  nga: {
    alt: "National Gallery of Art · UX 研究與產品設計",
    title: "把看展變成 Gen Z 會想一起玩的體驗",
    meta: "National Gallery of Art · UX 研究 · 產品設計",
    focus: "參與策略",
    description: "透過研究、遊戲機制與適合博物館場域的互動設計，把被動看展轉成可以一起玩、一起比、一起聊的體驗。",
  },
  gt: {
    alt: "Gutenberg Technology · AI Course Builder 研究與產品設計",
    title: "讓 AI Course Builder 的系統狀態看得見",
    meta: "Gutenberg Technology · UX 研究 · 產品設計",
    focus: "AI 工作流清晰度",
    description:
      "把 AI 正在做什麼、哪些內容被改動、下一步會發生什麼說清楚，讓教育工作者不用一路猜、一路試錯。",
  },
  foru: {
    alt: "Amazon Music · For Ü 個人化推薦策略",
    title: "用 For Ü 讓 Amazon Music 走進日常",
    meta: "Amazon Music · 使用者研究 · 產品設計",
    focus: "個人化策略",
    description:
      "設計情境化推薦、Maestro AI 建歌單流程與資料控制，讓個人化更貼近日常，也更透明可控。",
  },
  copper: {
    alt: "Cooper Hewitt · accessible Bungee font tester redesign",
    title: "重新設計無障礙字型探索介面",
    meta: "Cooper Hewitt · 無障礙 · 產品設計",
    focus: "無障礙互動",
    description:
      "重建以視覺為主的字型工具，支援鍵盤與螢幕閱讀器操作，並用聲音回饋讓探索變得更多感官。",
  },
  iong: {
    alt: "IONG 養 · 推測性設計與互動設計",
    title: "當生物辨識系統替人決定吃什麼",
    meta: "個人專案 · 推測性設計 · 互動設計",
    focus: "批判性互動設計",
    description:
      "建立一個 2070 年的 onboarding 體驗，讓生物辨識決策看起來很日常，再讓那份日常感成為批判本身。",
  },
};

export function getLocalizedProjectFields(
  id: string,
  locale: Locale,
): LocalizedProjectFields | undefined {
  const table = locale === "zh-TW" ? zhTW : en;
  return table[id];
}
