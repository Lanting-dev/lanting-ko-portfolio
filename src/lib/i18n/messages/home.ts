import type { Locale } from "@/lib/i18n/locale";

const en = {
  heroBio:
    "I’m a Product Designer who thinks about the product, the people using it, and the constraints around it. I like making everyday experiences easier to understand.",
  heroTapeLabel: "PRODUCT DESIGNER · STRUCTURE · FUNCTION · VISUAL CRAFT · ",
  heroTapeTagline: "PRODUCT DESIGNER · STRUCTURE · FUNCTION · VISUAL CRAFT · ",
  heroTapeExtraA: "PRODUCT DESIGNER · STRUCTURE · FUNCTION · VISUAL CRAFT · ",
  heroTapeExtraB: "PRODUCT DESIGNER · STRUCTURE · FUNCTION · VISUAL CRAFT · ",
  heroTapeAria: "Product Designer — Structure, Function, and Visual Craft",
  aboutLead: "NYC-based Product Designer",
  aboutBody: [
    "Born and raised in Taiwan, she now lives in New York, surrounded by bagels, Broadway shows, and unpredictable subway performances.",
    "Before design, she worked with engineers and manufacturing teams, where she learned to turn constraints into clear next steps. Today, that background shapes how she designs across user needs, technical limits, accessibility, business goals, and existing systems.",
    "Working with her is like brainstorming with someone who interrupts to ask, “Wait, who is this actually for, and what needs to be clearer?”",
  ],
} as const;

const zhTW = {
  heroBio:
    "我是產品設計師，會同時思考產品、使用它的人，以及它周圍的限制。我喜歡讓日常體驗變得更容易理解。",
  heroTapeLabel:
    "ㄔㄢˇ ㄆㄧㄣˇ ㄕㄜˋ ㄐㄧˋ PRODUCT DESIGNER · ㄐㄧㄝ ㄍㄡˋ STRUCTURE · ㄍㄨㄥ ㄋㄥˊ FUNCTION · ㄕˋ ㄐㄩˋ ㄒㄧˋ ㄐㄧㄝˊ VISUAL CRAFT · ",
  heroTapeTagline:
    "ㄔㄢˇ ㄆㄧㄣˇ ㄕㄜˋ ㄐㄧˋ PRODUCT DESIGNER · ㄐㄧㄝ ㄍㄡˋ STRUCTURE · ㄍㄨㄥ ㄋㄥˊ FUNCTION · ㄕˋ ㄐㄩˋ ㄒㄧˋ ㄐㄧㄝˊ VISUAL CRAFT · ",
  heroTapeExtraA:
    "ㄔㄢˇ ㄆㄧㄣˇ ㄕㄜˋ ㄐㄧˋ PRODUCT DESIGNER · ㄐㄧㄝ ㄍㄡˋ STRUCTURE · ㄍㄨㄥ ㄋㄥˊ FUNCTION · ㄕˋ ㄐㄩˋ ㄒㄧˋ ㄐㄧㄝˊ VISUAL CRAFT · ",
  heroTapeExtraB:
    "ㄔㄢˇ ㄆㄧㄣˇ ㄕㄜˋ ㄐㄧˋ PRODUCT DESIGNER · ㄐㄧㄝ ㄍㄡˋ STRUCTURE · ㄍㄨㄥ ㄋㄥˊ FUNCTION · ㄕˋ ㄐㄩˋ ㄒㄧˋ ㄐㄧㄝˊ VISUAL CRAFT · ",
  heroTapeAria: "ㄔㄢˇ ㄆㄧㄣˇ ㄕㄜˋ ㄐㄧˋ Product Designer — ㄐㄧㄝ ㄍㄡˋ Structure、ㄍㄨㄥ ㄋㄥˊ Function、ㄕˋ ㄐㄩˋ ㄒㄧˋ ㄐㄧㄝˊ Visual Craft",
  aboutLead: "現居紐約的產品設計師",
  aboutBody: [
    "她在台灣長大，現在住在紐約，日常被貝果、百老匯音樂劇和地鐵裡突如其來的表演包圍。",
    "在進入設計之前，她曾與工程師和製造團隊合作，學會把限制轉化成清楚的下一步。這段背景也影響她現在的設計方式，讓她在使用者需求、技術限制、無障礙考量、商業目標與既有系統之間做出清楚的設計判斷。",
    "跟她一起腦力激盪，像是有人會突然打斷你問：「等等，這到底是給誰用的？哪裡可以更清楚？」",
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
