import type { Locale } from "@/lib/i18n/locale";

const en = {
  nav: {
    brand: "Lanting • Design",
    work: "Work",
    about: "About",
    menu: "Menu",
    close: "Close",
    backToWork: "← Back to Work",
    language: "Language",
    switchLanguage: "Switch language to",
  },
  work: {
    heading: "Work",
    subheading: "Selected product design work",
    viewCaseStudy: "View case study →",
  },
  about: {
    heading: "About",
    ariaLabel: "About Lanting Ko",
  },
  footer: {
    ariaSite: "Site footer",
    ariaContact: "Contact",
    email: "Email",
    linkedIn: "LinkedIn",
    rights: "All rights reserved.",
  },
  caseStudy: {
    sections: "Sections",
    longStoryShort: "Long Story Short",
    explorePrototype: "Explore the Figma prototype →",
    tryLiveDemo: "Try the live onboarding demo →",
    continueExploring: "Continue exploring",
    seeMoreProjects: "See More Projects",
    backToTop: "Back to top",
    workflowSteps: "Workflow steps",
    step: "Step",
    usabilityParticipant: "Usability testing participant",
    visual: "Visual",
    sound: "Sound",
    designQuestion: "Design question",
    designGoals: "Design goals",
    literatureReview: "Literature review",
    weakSignals: "Weak signals",
    delivery: "Delivery",
    petizen: "Petizen",
    meta: {
      duration: "Duration",
      team: "Team",
      client: "Client",
      service: "Service",
      tools: "Tools",
    },
    sectionsMap: {
      overview: "Overview",
      problem: "Problem",
      research: "Research",
      strategy: "Strategy",
      design: "Design",
      impact: "Impact",
      conclusion: "Conclusion",
      outcome: "Outcome",
      world: "World",
      experience: "Experience",
      process: "Process",
      system: "System",
      reflection: "Reflection",
      coreInsight: "Core Insight",
    },
  },
  site: {
    title: "Lanting Ko · Product Designer",
    description:
      "Lanting is a product designer focused on structure, function, and visual craft.",
  },
} as const;

const zhTW = {
  nav: {
    brand: "Lanting • Design",
    work: "作品",
    about: "關於",
    menu: "選單",
    close: "關閉",
    backToWork: "← 返回作品",
    language: "語言",
    switchLanguage: "切換語言至",
  },
  work: {
    heading: "作品",
    subheading: "精選產品設計案例",
    viewCaseStudy: "看案例 →",
  },
  about: {
    heading: "關於",
    ariaLabel: "關於 Lanting Ko",
  },
  footer: {
    ariaSite: "頁尾",
    ariaContact: "聯絡方式",
    email: "Email",
    linkedIn: "LinkedIn",
    rights: "版權所有。",
  },
  caseStudy: {
    sections: "章節",
    longStoryShort: "重點整理",
    explorePrototype: "探索 Figma 原型 →",
    tryLiveDemo: "Try the live onboarding demo →",
    continueExploring: "繼續探索",
    seeMoreProjects: "更多作品",
    backToTop: "回到頁首",
    workflowSteps: "流程步驟",
    step: "步驟",
    usabilityParticipant: "可用性測試參與者",
    visual: "視覺",
    sound: "聲音",
    designQuestion: "設計問題",
    designGoals: "設計目標",
    literatureReview: "文獻回顧",
    weakSignals: "弱訊號",
    delivery: "配送",
    petizen: "Petizen",
    meta: {
      duration: "專案期程",
      team: "團隊",
      client: "客戶",
      service: "服務",
      tools: "工具",
    },
    sectionsMap: {
      overview: "概覽",
      problem: "問題",
      research: "研究",
      strategy: "策略",
      design: "設計",
      impact: "成效",
      conclusion: "結語",
      outcome: "成果",
      world: "世界觀",
      experience: "體驗",
      process: "流程",
      system: "系統",
      reflection: "反思",
      coreInsight: "核心洞察",
    },
  },
  site: {
    title: "Lanting Ko · 產品設計師",
    description: "Lanting 是一位重視結構、功能與視覺細節的產品設計師。",
  },
} as const;

export type UiMessages = {
  nav: {
    brand: string;
    work: string;
    about: string;
    menu: string;
    close: string;
    backToWork: string;
    language: string;
    switchLanguage: string;
  };
  work: {
    heading: string;
    subheading: string;
    viewCaseStudy: string;
  };
  about: {
    heading: string;
    ariaLabel: string;
  };
  footer: {
    ariaSite: string;
    ariaContact: string;
    email: string;
    linkedIn: string;
    rights: string;
  };
  caseStudy: {
    sections: string;
    longStoryShort: string;
    explorePrototype: string;
    tryLiveDemo: string;
    continueExploring: string;
    seeMoreProjects: string;
    backToTop: string;
    workflowSteps: string;
    step: string;
    usabilityParticipant: string;
    visual: string;
    sound: string;
    designQuestion: string;
    designGoals: string;
    literatureReview: string;
    weakSignals: string;
    delivery: string;
    petizen: string;
    meta: {
      duration: string;
      team: string;
      client: string;
      service: string;
      tools: string;
    };
    sectionsMap: Record<
      | "overview"
      | "problem"
      | "research"
      | "strategy"
      | "design"
      | "impact"
      | "conclusion"
      | "outcome"
      | "world"
      | "experience"
      | "process"
      | "system"
      | "reflection"
      | "coreInsight",
      string
    >;
  };
  site: {
    title: string;
    description: string;
  };
};

export const UI_MESSAGES: Record<Locale, UiMessages> = {
  en,
  "zh-TW": zhTW,
};
