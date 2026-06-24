import type { GtStep } from "../gt";

export const GT_CASE_STUDY_ZH = {
  slug: "gt",
  title: "讓 AI 建課流程的系統狀態看得見",
  meta: [
    { label: "專案期程", value: "12 週" },
    { label: "團隊", value: "Lanting K., Claire P., Jeffery Y., Aswathi T." },
    { label: "客戶", value: "Gutenberg Technology" },
    { label: "服務", value: "使用者研究、產品設計" },
    { label: "工具", value: "Figma, Tobii, Hotjar" },
  ],
  toc: [
    { id: "problem", label: "問題" },
    { id: "research", label: "研究" },
    { id: "design", label: "設計" },
    { id: "conclusion", label: "結語" },
  ],
  summary: [
    "Gutenberg 的 AI Course Builder 能把 PDF、PowerPoint 等文件轉成結構化課程。由於 AI 每次產出都可能不同，使用者更需要知道該提供什麼、系統正在做什麼，以及接下來會發生什麼。資訊不足時，參與者便會猶豫、避免操作，只能靠反覆試錯。",
    "我觀察參與者如何走完整個流程，找出「系統狀態不可見」這個核心問題，並重新設計引導與回饋，建立清楚預期，也讓迭代更安心。",
  ],
  problem: {
    headline:
      "參與者在流程中猶豫、來回跳",
    body:
      "參與者常在動作前猶豫、反覆回到同一個輸入欄，在不同區塊之間來回。有人直接跳步。從建立專案到生成內容，這些模式貫穿整個流程。",
    signals: [
      {
        title: "輸入目的",
        body: "參與者反覆回到輸入欄。",
      },
      {
        title: "操作結果",
        body: "八位參與者中有六位在重新生成內容前猶豫，因為不確定會怎麼影響既有作品。",
      },
      {
        title: "系統狀態",
        body: "參與者不確定作品有沒有存起來。",
      },
    ],
  },
  research: {
    headline:
      "理解使用者跟 AI 系統互動時為什麼會不確定",
    methods: [
      {
        title: "8 場眼動追蹤與 RTA 測試",
        body: "我做了八場面對面眼動追蹤，對象是首次使用者，每場搭配回溯式出聲思考（RTA），了解他們如何做決定、在哪裡困惑。",
      },
      {
        title: "系統可用性量表（SUS）得分 61.3",
        body: "每場測試結束後，參與者填寫系統可用性量表。產品的 SUS 分數為 61.3，顯示整體體驗仍有明顯改善空間。",
      },
      {
        title: "Hotjar 也出現相同模式",
        body: "Hotjar 也出現相同互動模式，顯示既有使用者在哪裡猶豫、重試，或試著搞懂下一步。",
      },
    ],
  },
  insight: {
    headline: "參與者看不見系統狀態",
    body:
      "AI Course Builder 會依使用者輸入產生草稿，細部編輯則在後續的 CMS 中完成。觀察完整流程後，我發現多個卡點都指向同一個核心問題：系統沒有清楚顯示目前狀態。參與者不知道該提供什麼、輸入會如何被使用、內容是否已儲存，或某個操作會改變什麼，因此只能靠試錯前進。",
    steps: [
      {
        index: "01",
        title: "設定課程輸入",
        finding: "「課程描述」與「學習目標」容易混淆",
        description:
          "參與者很難區分「Description」和「Learning Objectives」欄位。眼動回放裡，使用者反覆在兩欄之間複製文字，表示不確定各欄要填什麼。這種猶豫拖慢進度。",
        media: [
          {
            src: "/work/gt/step-input-gaze.mp4",
            type: "video",
            alt: "Course Builder 輸入表單的眼動追蹤回放",
            poster: "/work/gt/step-input.png",
          },
        ],
      },
      {
        index: "02",
        title: "生成課程大綱",
        description:
          "從使用者輸入到 AI 生成大綱，幾乎看不出系統怎麼用這些輸入、會產出什麼。",
        media: [
          {
            src: "/work/gt/step-outline-loading.mp4",
            type: "video",
            alt: "Course Builder 生成課程大綱",
          },
        ],
      },
      {
        index: "03",
        title: "檢視與微調課程大綱",
        finding: "無法確認內容是否已儲存",
        description:
          "生成多頁內容後，8 位參與者中有 4 位對「Update Information」按鈕感到困惑。他們無法判斷內容是否已儲存，因此操作時更加猶豫，也降低了對系統的信心。",
        media: [
          {
            src: "/work/gt/step-outline-gaze.mp4",
            type: "video",
            alt: "檢視生成課程大綱時的眼動追蹤回放",
            poster: "/work/gt/step-outline.png",
          },
        ],
      },
      {
        index: "04",
        title: "生成課程內容",
        description:
          "生成可能覆蓋先前結果，參與者缺少安全探索另一版輸出、同時保留作品的方式。",
        media: [
          {
            src: "/work/gt/course-content.png",
            type: "image",
            alt: "Course Builder 重新生成對話框",
          },
        ],
      },
      {
        index: "05",
        title: "檢視與微調內容",
        description:
          "流程結束時沒清楚顯示進度有沒有存、能不能回到先前版本。",
        media: [
          {
            src: "/work/gt/step-save-at-end.mp4",
            type: "video",
            alt: "參與者在 Course Builder 流程結尾嘗試儲存作品",
            poster: "/work/gt/research-screen.jpg",
          },
        ],
      },
    ] satisfies GtStep[],
  },
  design: [
    {
      id: "clear-expectations",
      label: "設計決策 01",
      headline: "建立清楚預期",
      paragraphs: [
        "就像叫你在不知道要畫什麼的情況下作畫。多數人卡住不是因為沒創意，而是不知道該畫什麼。現有的 AI Course Builder 也類似：給了輸入欄，但不清楚該填什麼、會怎麼被使用。",
        "為此我加了四種引導，幫參與者理解每個欄位、降低認知負擔。",
      ],
      image: "/work/gt/clear-expectations.jpg",
      alt: "改版後的學習目標表單，含四種引導模式",
      points: [
        ["01", "說明目的", "使用者現在正在填寫什麼？"],
        ["02", "提示長度", "大約需要寫多少？"],
        ["03", "引導內容", "這裡應該提供哪類資訊？"],
        ["04", "提高 AI 透明度", "這些內容會如何影響生成結果？"],
      ],
    },
    {
      id: "safe-iteration",
      label: "設計決策 02",
      headline: "支援安全迭代",
      paragraphs: [
        "參與者找儲存選項、重新生成前猶豫，表示需要保留既有作品。AI 每次產出都不一樣，同樣輸入不保證同樣結果，先前內容因此很重要。",
        "我用通知讓已存進度可見，並加上版本紀錄，讓使用者在動作前能回到較早的節點。",
      ],
      image: "/work/gt/safe-iteration.jpg",
      alt: "儲存狀態通知與版本紀錄概念",
      points: [
        ["01", "系統狀態", "清楚顯示目前狀態與已儲存的進度。"],
        ["02", "版本紀錄", "讓使用者可以回到先前版本。"],
      ],
    },
  ],
  impact: {
    quote: "我們全程都在做筆記，真的很有幫助。",
    attribution: "GT Course Builder AI Product Manager",
  },
  conclusion: {
    headline: "從可用性問題到系統能見度",
    paragraphs: [
      "交叉比對多種資料來源，驗證了使用者行為的一致模式。眼動、RTA 和行為資料結合，我找到猶豫和困惑的深層原因，而不是只靠單一訊號。焦點從零散的可用性問題，轉向更廣的系統能見度問題。",
      "測試在沒有完整 CMS 的情境下進行，可能影響參與者行為。後續會在 CMS 整合環境驗證，並探索不同互動模型如何同時支援生成和編輯。",
    ],
  },
} as const;
