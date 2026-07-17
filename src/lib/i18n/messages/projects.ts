import type { Locale } from "@/lib/i18n/locale";
import type { ProjectItem } from "@/lib/projects";

type LocalizedProjectFields = Pick<
  ProjectItem,
  "alt" | "title" | "meta" | "description"
>;

const en: Record<string, LocalizedProjectFields> = {
  nga: {
    alt: "National Gallery of Art · UX research and product design",
    title: "Designing a Multiplayer Experience for Gen Z Museum Engagement",
    meta: "National Gallery of Art · UX Research · Product Design",
    description:
      "A multiplayer drawing game that turns art appreciation into social, competitive play for Gen Z.",
  },
  gt: {
    alt: "Gutenberg Technology · AI Course Builder research and product design",
    title: "Making System State Visible in AI Course Creation",
    meta: "Gutenberg Technology · UX Research · Product Design",
    description:
      "Surfacing system state in an AI course builder so users act with confidence, not trial and error.",
  },
  foru: {
    alt: "Amazon Music, For Ü personalized recommendation strategy",
    title: "Making Amazon Music Part of Everyday Life Through Personalization",
    meta: "Amazon Music · User Research · Product Design",
    description:
      "Cross-ecosystem recommendations, routine-based For You rows, and Maestro AI, with user control over data sources.",
  },
  copper: {
    alt: "Cooper Hewitt · accessible Bungee font tester redesign",
    title: "Redesigning an Accessible Font Exploration Interface",
    meta: "Cooper Hewitt · Accessibility · Product Design",
    description:
      "Rebuilding the Bungee font tester for keyboard and screen-reader access, plus audio that turns a visual tool multisensory.",
  },
  iong: {
    alt: "IONG · speculative design and interaction design",
    title: "When Biometric Systems Decide What We Eat",
    meta: "Individual Project · Speculative Design · Interaction Design",
    description:
      "A 2070 employee onboarding experience where reading time and biometric tracking quietly determine your role in a system that manages citizen nutrition.",
  },
};

const zhTW: Record<string, LocalizedProjectFields> = {
  nga: {
    alt: "National Gallery of Art · UX 研究與產品設計",
    title: "把看展變成 Gen Z 會想一起玩的體驗",
    meta: "National Gallery of Art · UX 研究 · 產品設計",
    description: "用多人繪畫遊戲，把藝術欣賞變成可以一起玩、一起比、一起聊的社交體驗。",
  },
  gt: {
    alt: "Gutenberg Technology · AI Course Builder 研究與產品設計",
    title: "讓 AI Course Builder 的系統狀態看得見",
    meta: "Gutenberg Technology · UX 研究 · 產品設計",
    description:
      "把 AI Course Builder 現在在做什麼、下一步會發生什麼說清楚，減少使用者一路猜、一路試錯。",
  },
  foru: {
    alt: "Amazon Music · For Ü 個人化推薦策略",
    title: "用 For Ü 讓 Amazon Music 走進日常",
    meta: "Amazon Music · 使用者研究 · 產品設計",
    description:
      "用跨服務推薦、日常情境歌單和 Maestro AI 建歌單，讓個人化更貼近日常，也把資料控制權留給使用者。",
  },
  copper: {
    alt: "Cooper Hewitt · accessible Bungee font tester redesign",
    title: "重新設計無障礙字型探索介面",
    meta: "Cooper Hewitt · 無障礙 · 產品設計",
    description:
      "重建 Bungee font tester，讓鍵盤與螢幕閱讀器使用者也能操作，並用聲音補上純視覺工具缺少的回饋。",
  },
  iong: {
    alt: "IONG 養 · 推測性設計與互動設計",
    title: "當生物辨識系統替人決定吃什麼",
    meta: "個人專案 · 推測性設計 · 互動設計",
    description:
      "一個設定在 2070 年的 employee onboarding 原型。系統會根據閱讀時間、互動紀錄和生物辨識資料，悄悄判斷你在營養管控系統裡的位置。",
  },
};

export function getLocalizedProjectFields(
  id: string,
  locale: Locale,
): LocalizedProjectFields | undefined {
  const table = locale === "zh-TW" ? zhTW : en;
  return table[id];
}
