import type { Locale } from "@/lib/i18n/locale";

const en = {
  heroKicker: "Hi, I’m Lanting, the product designer",
  heroBio:
    "who turns “wait, what?” into “oh, that makes sense.”",
  heroIdentity: ["Product Design", "UX Research", "Interaction Design"],
  aboutLead: "Product designer turning “wait, what?” into “that makes sense.”",
  aboutBody: [
    "Born and raised in Taiwan, she now lives in New York, surrounded by bagels, Broadway shows, and unpredictable subway performances.",
    "Before design, she worked with engineers and manufacturing teams, where she learned to translate constraints into clear next steps. Today, that background shapes how she designs across user needs, technical limits, accessibility, business goals, and existing systems.",
    "Her sweet spot is the moment when a vague problem starts becoming a structure: what matters, what can wait, what needs to be tested, and what needs to feel obvious to the person using it.",
  ],
} as const;

const zhTW = {
  heroKicker: "Hi，我是 Lanting，那個產品設計師",
  heroBio:
    "把「蛤？」整理成「喔，懂了。」",
  heroIdentity: ["產品設計", "UX 研究", "互動設計"],
  aboutLead: "把「蛤？」整理成「喔，懂了」的產品設計師。",
  aboutBody: [
    "我在台灣長大，現在住在紐約，日常被貝果、百老匯音樂劇和地鐵裡突如其來的表演包圍。",
    "進入設計之前，我曾和工程師、製造團隊一起工作，也是在那時學會把限制翻譯成清楚的下一步。這段背景影響了我現在的設計方式：在使用者需求、技術限制、無障礙、商業目標和既有系統之間，做出說得通的設計判斷。",
    "我最喜歡的是模糊問題慢慢長出結構的時刻：哪些事情重要、哪些可以晚一點、哪些需要驗證，以及哪些細節必須讓使用者一看就懂。",
  ],
} as const;

export type HomeMessages = {
  heroKicker: string;
  heroBio: string;
  heroIdentity: readonly string[];
  aboutLead: string;
  aboutBody: readonly string[];
};

export const HOME_MESSAGES: Record<Locale, HomeMessages> = {
  en,
  "zh-TW": zhTW,
};
