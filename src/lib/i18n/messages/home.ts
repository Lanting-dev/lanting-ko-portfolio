import type { Locale } from "@/lib/i18n/locale";

const en = {
  heroBio:
    "Lanting is a product designer who cares about structure, function, and visual craft. She creates clear, thoughtful digital experiences grounded in how people actually use them.",
  heroTapeLabel: "PRODUCT DESIGNER · STRUCTURE · FUNCTION · VISUAL CRAFT · ",
  heroTapeTagline: "PRODUCT DESIGNER · STRUCTURE · FUNCTION · VISUAL CRAFT · ",
  heroTapeExtraA: "PRODUCT DESIGNER · STRUCTURE · FUNCTION · VISUAL CRAFT · ",
  heroTapeExtraB: "PRODUCT DESIGNER · STRUCTURE · FUNCTION · VISUAL CRAFT · ",
  heroTapeAria: "Product Designer — Structure, Function, and Visual Craft",
  aboutLead:
    "Lanting Ko is a product designer focused on structure, function, and visual craft.",
  aboutBody: [
    "She was born and raised in Taiwan and now lives in New York, surrounded by bagels and unpredictable subway performances.",
    "Working with her is like brainstorming with someone who interrupts to ask, “Wait, who is this actually for?”",
    "When she’s not designing or doing research, you can find her watching movies, going to Broadway shows, or getting some vitamin D outdoors.",
  ],
} as const;

const zhTW = {
  heroBio:
    "Lanting 是一位產品設計師，重視結構、功能與視覺細節。她從真實的使用情境出發，打造清楚、直覺的數位體驗。",
  heroTapeLabel:
    "ㄔㄢˇ ㄆㄧㄣˇ ㄕㄜˋ ㄐㄧˋ PRODUCT DESIGNER · ㄐㄧㄝ ㄍㄡˋ STRUCTURE · ㄍㄨㄥ ㄋㄥˊ FUNCTION · ㄕˋ ㄐㄩˋ ㄒㄧˋ ㄐㄧㄝˊ VISUAL CRAFT · ",
  heroTapeTagline:
    "ㄔㄢˇ ㄆㄧㄣˇ ㄕㄜˋ ㄐㄧˋ PRODUCT DESIGNER · ㄐㄧㄝ ㄍㄡˋ STRUCTURE · ㄍㄨㄥ ㄋㄥˊ FUNCTION · ㄕˋ ㄐㄩˋ ㄒㄧˋ ㄐㄧㄝˊ VISUAL CRAFT · ",
  heroTapeExtraA:
    "ㄔㄢˇ ㄆㄧㄣˇ ㄕㄜˋ ㄐㄧˋ PRODUCT DESIGNER · ㄐㄧㄝ ㄍㄡˋ STRUCTURE · ㄍㄨㄥ ㄋㄥˊ FUNCTION · ㄕˋ ㄐㄩˋ ㄒㄧˋ ㄐㄧㄝˊ VISUAL CRAFT · ",
  heroTapeExtraB:
    "ㄔㄢˇ ㄆㄧㄣˇ ㄕㄜˋ ㄐㄧˋ PRODUCT DESIGNER · ㄐㄧㄝ ㄍㄡˋ STRUCTURE · ㄍㄨㄥ ㄋㄥˊ FUNCTION · ㄕˋ ㄐㄩˋ ㄒㄧˋ ㄐㄧㄝˊ VISUAL CRAFT · ",
  heroTapeAria: "ㄔㄢˇ ㄆㄧㄣˇ ㄕㄜˋ ㄐㄧˋ Product Designer — ㄐㄧㄝ ㄍㄡˋ Structure、ㄍㄨㄥ ㄋㄥˊ Function、ㄕˋ ㄐㄩˋ ㄒㄧˋ ㄐㄧㄝˊ Visual Craft",
  aboutLead: "Lanting Ko 是一位專注於結構、功能與視覺細節的產品設計師。",
  aboutBody: [
    "她在台灣長大，現在住在紐約，日常被貝果和地鐵裡突如其來的表演包圍。",
    "跟她一起腦力激盪，像是有人會突然打斷你問：「等等，這到底是給誰用的？」",
    "不設計、不做研究的時候，她可能在看電影、看百老匯音樂劇，或到戶外曬太陽。",
  ],
} as const;

export type HomeMessages = {
  heroBio: string;
  heroTapeLabel: string;
  heroTapeTagline: string;
  heroTapeExtraA: string;
  heroTapeExtraB: string;
  heroTapeAria: string;
  aboutLead: string;
  aboutBody: readonly string[];
};

export const HOME_MESSAGES: Record<Locale, HomeMessages> = {
  en,
  "zh-TW": zhTW,
};
