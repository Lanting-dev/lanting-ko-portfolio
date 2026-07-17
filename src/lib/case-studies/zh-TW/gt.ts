import type { GtStep } from "../gt";

export const GT_CASE_STUDY_ZH = {
  slug: "gt",
  title: "讓 AI Course Builder 的系統狀態看得見",
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
    "Gutenberg 的 AI Course Builder 可以把 PDF、PowerPoint 等文件整理成結構化課程。但 AI 產出本來就不穩定，使用者更需要知道自己該提供什麼、系統現在在做什麼，以及下一步會發生什麼。資訊不夠清楚時，參與者會猶豫、避開操作，最後只能一路試錯。",
    "我觀察參與者如何走完整個流程，發現真正卡住的點其實是「使用者看不見系統狀態」。接著我重新設計引導與回饋，讓使用者更清楚預期，也更敢嘗試下一版。",
  ],
  problem: {
    headline:
      "參與者一直猶豫，也一直在流程裡來回跳",
    body:
      "參與者常在動作前停下來、反覆回到同一個輸入欄，或在不同區塊之間來回切換。也有人直接跳過某些步驟。從建立專案到生成內容，這些行為一路都出現。",
    signals: [
      {
        title: "輸入目的",
        body: "參與者反覆回到同一個輸入欄，試著判斷自己到底該填什麼。",
      },
      {
        title: "操作結果",
        body: "8 位參與者中有 6 位在重新生成內容前猶豫，因為不確定這個動作會不會改到已經產出的內容。",
      },
      {
        title: "系統狀態",
        body: "參與者看不出目前進度有沒有被儲存。",
      },
    ],
  },
  research: {
    headline:
      "理解使用者為什麼在 AI 流程裡不敢按下一步",
    methods: [
      {
        title: "8 場眼動追蹤與 RTA 測試",
        body: "我做了 8 場面對面眼動追蹤，參與者都是第一次使用產品。每場測試搭配回溯式出聲思考（RTA），了解他們怎麼判斷、在哪裡卡住。",
      },
      {
        title: "系統可用性量表（SUS）得分 61.3",
        body: "每場測試後，參與者都填寫系統可用性量表。產品的 SUS 分數是 61.3，代表整體體驗還有明顯的改善空間。",
      },
      {
        title: "Hotjar 也出現相同模式",
        body: "Hotjar 也看到類似的互動模式，代表既有使用者同樣會猶豫、重試，或花時間理解下一步。",
      },
    ],
  },
  insight: {
    headline: "參與者看不見系統狀態",
    body:
      "AI Course Builder 會依照使用者輸入產生草稿，細部編輯則要到後續 CMS 裡完成。看完整個流程後，我發現許多卡點其實都指向同一件事：系統沒有把目前狀態說清楚。參與者不知道該提供哪些資訊、輸入會怎麼被使用、內容有沒有存起來，或某個操作會改動什麼，所以只能靠試錯前進。",
    steps: [
      {
        index: "01",
        title: "設定課程輸入",
        finding: "「課程描述」與「學習目標」容易混淆",
        description:
          "參與者很難區分「Description」和「Learning Objectives」兩個欄位。眼動回放裡可以看到，使用者反覆在兩欄之間複製文字，代表他們不確定各欄到底要填什麼。這種猶豫也拖慢了整個流程。",
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
          "從使用者輸入到 AI 生成大綱，中間幾乎看不出系統怎麼使用這些內容，也很難預期會產出什麼。",
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
        title: "查看並微調課程大綱",
        finding: "無法確認內容是否已儲存",
        description:
          "生成多頁內容後，8 位參與者中有 4 位對「Update Information」按鈕感到困惑。他們不知道內容是否已經儲存，因此操作時更猶豫，也比較不信任系統。",
        media: [
          {
            src: "/work/gt/step-outline-gaze.mp4",
            type: "video",
            alt: "查看生成課程大綱時的眼動追蹤回放",
            poster: "/work/gt/step-outline.png",
          },
        ],
      },
      {
        index: "04",
        title: "生成課程內容",
        description:
          "重新生成可能會覆蓋先前結果，但參與者沒有一個安全的方法，可以一邊試另一版輸出，一邊保留目前成果。",
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
        title: "查看並微調內容",
        description:
          "流程結束時，畫面沒有清楚告訴使用者進度有沒有存，也沒有說明能不能回到先前版本。",
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
        "這有點像叫人畫一張圖，卻沒有說要畫什麼。多數人不是沒有想法，而是不知道標準在哪裡。AI Course Builder 當時也有類似問題：畫面給了輸入欄，卻沒有說清楚該填什麼、填了之後會怎麼被使用。",
        "所以我加入四種引導，幫助使用者理解每個欄位，也降低一開始填寫時的負擔。",
      ],
      image: "/work/gt/clear-expectations.jpg",
      alt: "改版後的學習目標表單，包含四種引導模式",
      points: [
        ["01", "說明目的", "使用者現在正在填寫什麼？"],
        ["02", "提示長度", "大約需要寫多少？"],
        ["03", "引導內容", "這裡應該提供哪類資訊？"],
        ["04", "說清楚 AI 會怎麼用", "這些內容會如何影響生成結果？"],
      ],
    },
    {
      id: "safe-iteration",
      label: "設計決策 02",
      headline: "讓使用者安心試下一版",
      paragraphs: [
        "參與者會找儲存選項，也會在重新生成前猶豫，代表他們需要保留既有成果。AI 每次產出都不一樣，同樣輸入不保證會得到同樣結果，所以先前內容很重要。",
        "我用通知讓已儲存進度更明確，也加入版本紀錄，讓使用者在嘗試新版本前，知道自己可以回到較早的節點。",
      ],
      image: "/work/gt/safe-iteration.jpg",
      alt: "儲存狀態通知與版本紀錄概念",
      points: [
        ["01", "系統狀態", "說清楚目前狀態與已儲存的進度。"],
        ["02", "版本紀錄", "讓使用者可以回到先前版本。"],
      ],
    },
  ],
  impact: {
    quote: "我們全程都在做筆記，真的很有幫助。",
    attribution: "GT Course Builder AI Product Manager",
  },
  conclusion: {
    headline: "問題不只在操作，而是系統狀態不夠清楚",
    paragraphs: [
      "交叉比對多種資料後，我確認這些不是零散的操作問題，而是一致的行為模式。眼動、RTA 和行為資料放在一起看，讓我能追到猶豫與困惑背後的原因，也把焦點從單點可用性問題，拉回「使用者看不懂系統正在做什麼」這件事。",
      "這次測試是在尚未完整整合 CMS 的情境下完成，可能會影響參與者行為。下一步可以在 CMS 整合環境中再驗證，也繼續調整 AI 生成和人工編輯之間的銜接。",
    ],
  },
} as const;
