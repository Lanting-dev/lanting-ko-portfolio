import type { GtStep } from "../gt";
import type {
  ForuDesignPillar,
  ForuFinding,
  ForuImpactQuote,
  ForuPersona,
} from "../foru";

const FORU_ASSET_VERSION = "2026-06-24g";
const foruAsset = (path: string) => `${path}?v=${FORU_ASSET_VERSION}`;

export const FORU_CASE_STUDY_ZH = {
  slug: "foru",
  kicker: "For Ü",
  title: "讓 Amazon Music 走進日常的個人化推薦策略",
  meta: [
    { label: "專案期程", value: "4 週" },
    { label: "團隊", value: "Allison Chen, Lanting Ko" },
    { label: "客戶", value: "Amazon Music" },
    { label: "服務", value: "使用者研究、客戶生命週期分析、產品思考、原型製作" },
    { label: "工具", value: "Figma, Google Survey" },
  ],
  toc: [
    { id: "overview", label: "概覽" },
    { id: "problem", label: "問題" },
    { id: "research", label: "研究" },
    { id: "strategy", label: "策略" },
    { id: "design", label: "設計" },
    { id: "impact", label: "成效" },
    { id: "conclusion", label: "結語" },
  ],
  summary: [
    "For Ü 是一套針對 Amazon Music 分級方案的個人化推薦策略，目標是留住休閒聽眾。這群人是平台最大的聽眾族群，卻會在推薦缺乏個人感時逐漸流失。",
    "我們整理出兩種休閒聽眾類型，找出 Amazon Music 與競品的體驗差距，並設計跨生態系推薦、日常情境歌單與 Maestro AI 建歌單；推薦使用哪些資料，則由使用者自行決定。",
  ],
  hero: {
    src: "/work/foru/foru.mp4",
    poster: foruAsset("/work/foru/hero.png"),
    alt: "For Ü · Amazon Music 個人化推薦策略流程展示",
  },
  prototypeUrl:
    "https://www.figma.com/proto/ApWUNGLo6E0KHnY7LSoLB4/High-Fidelity-Prototype?node-id=318-14232&p=f&viewport=97%2C217%2C0.05&t=qKY9EHQy3pq1GIuo-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=318%3A14232&show-proto-sidebar=1&page-id=0%3A1",
  problem: {
    headline: "怎麼讓使用者覺得 Amazon Music 真的懂他們？",
    body:
      "休閒聽眾是否留下，取決於服務能不能貼近他們的生活。當 For You 推薦失準，Amazon Music 就會變得和其他串流平台沒有差別。",
    challenge:
      "設計一套顧客體驗策略，提升各級方案的留存率，讓個人化感覺像「真的懂我」，而不是「演算法在猜」。",
    signals: [
      {
        title: "29% 因推薦不準而離開",
        body: "在已流失的休閒使用者中，29% 表示推薦不準是離開的原因之一。",
      },
      {
        title: "75% 認為競品更個人化",
        body: "在已流失使用者中，75% 認為 Spotify、Apple Music 或 YouTube Music 的個人化體驗更好。",
      },
      {
        title: "休閒聽眾最重要",
        body: "被動型與主動型休閒聽眾是最大族群，也是留存的最大槓桿。",
      },
    ] satisfies ForuFinding[],
  },
  research: {
    headline: "兩種休閒聽眾",
    intro:
      "我們透過使用者調查，將行為整理成兩種人物誌。兩者都屬於休閒聽眾，但與音樂的關係並不相同。",
    personas: [
      {
        name: "Brooke Harper",
        role: "平面設計師",
        age: 29,
        location: "Brooklyn, NY",
        quote: "Music bridges me, myself, and others.",
        type: "主動型聽眾",
        insight: "想要能反映品味、心情和身份的推薦，不只是播放紀錄。",
        image: {
          src: "/work/foru/persona-active-brooke.jpg",
          alt: "Brooke Harper，Active Listener，29 歲，Brooklyn 平面設計師",
        },
      },
      {
        name: "Jamie Walker",
        role: "記者",
        age: 35,
        location: "Newark, NJ",
        quote: "Music is just there in the background of my life.",
        type: "被動型聽眾",
        insight: "需要符合情境的歌單，不用自己搜尋或建資料庫。",
        image: {
          src: "/work/foru/persona-passive-jamie.jpg",
          alt: "Jamie Walker，Passive Listener，35 歲，Newark 記者",
        },
      },
    ] satisfies ForuPersona[],
    findings: [
      {
        title: "推薦感覺很泛用",
        body: "For You 一直推同一批藝人，或忽略最近活動，就像在亂猜。",
      },
      {
        title: "生態系資料沒用好",
        body: "購物、閱讀、觀影等訊號很少以使用者信任的方式出現在 Music 裡。",
      },
      {
        title: "競品在控制感上領先",
        body: "Spotify 和 Apple Music 的口味調整更清楚；Amazon 有資料，但體驗還沒跟上。",
      },
    ] satisfies ForuFinding[],
  },
  strategy: {
    headline: "For Ü：懂你的個人化",
    body:
      "For Ü 把 Amazon 生態系連到日常聆聽：使用者可以追溯跨服務推薦的資料來源、取得符合日常情境的歌單，也能透過 Maestro AI 輕鬆建立歌單。",
    principles: [
      {
        title: "預設透明",
        body: "使用者選擇哪些 Amazon 服務餵給推薦，隨時可以調整。",
      },
      {
        title: "情境優於曲庫",
        body: "歌單回應心情、天氣和日常節奏，不只是聽歌紀錄。",
      },
      {
        title: "創作零摩擦",
        body: "Maestro Beta 依文字或圖片提示生成歌單；是否儲存與如何微調，則由聽眾自行決定。",
      },
    ] satisfies ForuFinding[],
    comparison: {
      src: foruAsset("/work/foru/competitive-comparison.png"),
      alt: "For Ü 與 Spotify、Apple Music、YouTube Music 在推薦因素、日常情境控制、AI 建歌單上的競品比較",
    },
  },
  design: [
    {
      id: "ecosystem",
      label: "設計支柱 01",
      headline: "跨生態系推薦",
      paragraphs: [
        "Amazon 已經掌握使用者閱讀、觀看與購物的部分訊號。For Ü 會先取得明確同意，再把使用者選擇的訊號帶進 Music，並說明它們如何影響推薦。",
      ],
      figure: {
        src: foruAsset("/work/foru/ecosystem-flow.png"),
        alt: "依 Prime Video、IMDb、Twitch、Goodreads 整理的跨生態系 For You 模組，以及使用者可控管資料來源的推薦設定",
      },
      steps: [],
    },
    {
      id: "routine",
      label: "設計支柱 02",
      headline: "依日常情境整理的 For You",
      paragraphs: [
        "被動型聽眾打開 Music，是因為當下需要配樂。For Ü 把 For You 分頁圍繞日常情境整理：天氣、通勤、工作節奏和情緒線索。",
      ],
      steps: [
        {
          index: "01",
          title: "貼合一天的日常節奏",
          finding: "曼哈頓雨天、辦公室專注",
          description:
            "情境列會依位置和行程調整：雨天早晨的通勤歌單、工作日的專注曲目。",
          media: [
            {
              src: foruAsset("/work/foru/routines-flow.png"),
              type: "image",
              alt: "For You 日常節奏流程：For You 分頁、推薦設定、編輯日常節奏畫面",
            },
          ],
        },
        {
          index: "02",
          title: "依語錄推薦",
          finding: "從情緒出發",
          description:
            "使用者輸入一句話或歌詞；For Ü 回傳貼合那種情緒的歌單。",
          media: [
            {
              src: foruAsset("/work/foru/for-you-quote.png"),
              type: "image",
              alt: "For You 分頁的語錄式情緒音樂推薦功能",
            },
          ],
        },
      ],
    },
    {
      id: "maestro",
      label: "設計支柱 03",
      headline: "Maestro Beta：AI 建歌單",
      paragraphs: [
        "主動型聽眾想塑造自己的聲音，卻不想逐首建立歌單。Maestro Beta 接受文字或圖片提示，最後控制權仍在聽眾手上。",
      ],
      steps: [
        {
          index: "01",
          title: "用文字或圖片創作",
          finding: "文字與圖片輸入",
          description:
            "使用者可以選擇靈感卡片，或輸入城市散步、心情、曲風等提示來開始生成。",
          media: [
            {
              src: foruAsset("/work/foru/maestro-create.png"),
              type: "image",
              alt: "Maestro Beta 創作畫面：靈感卡片與提示建議",
            },
          ],
        },
        {
          index: "02",
          title: "結合圖片與文字提示",
          finding: "多模態輸入",
          description:
            "城市照片搭配文字提示，展示 Maestro 如何同時解讀視覺與文字線索。",
          media: [
            {
              src: foruAsset("/work/foru/maestro-create-prompt.png"),
              type: "image",
              alt: "Maestro Beta 搭配城市照片與城市散步流行歌單提示",
            },
          ],
        },
        {
          index: "03",
          title: "AI 讀懂氛圍",
          finding: "透明的分析過程",
          description:
            "Maestro 在生成前會說明它從圖片裡看到什麼，讓使用者知道為什麼這張歌單合適。",
          media: [
            {
              src: foruAsset("/work/foru/maestro-analysis.png"),
              type: "image",
              alt: "Maestro Beta 分析紐約街景照片並描述氛圍",
            },
          ],
        },
        {
          index: "04",
          title: "儲存前先預覽",
          finding: "安心嘗試",
          description:
            "使用者可以先查看曲目並在播放器中預聽，再決定是否存進音樂庫。",
          media: [
            {
              src: foruAsset("/work/foru/maestro-preview.png"),
              type: "image",
              alt: "Maestro Beta 預覽 Skyscraper Melodies NYC Pop Panorama 歌單",
            },
          ],
        },
        {
          index: "05",
          title: "存進你的音樂庫",
          finding: "從提示詞到歌單",
          description:
            "完成的歌單會存進音樂庫，方便隨機播放、編輯或分享。",
          media: [
            {
              src: foruAsset("/work/foru/maestro-result.png"),
              type: "image",
              alt: "Maestro Beta 完成的歌單，含隨機播放與曲目列表",
            },
          ],
        },
        {
          index: "06",
          title: "分享今日精選",
          finding: "延伸到社群分享",
          description:
            "分享卡片把歌單變成可以發到限動或訊息裡的內容。",
          media: [
            {
              src: foruAsset("/work/foru/maestro-share.png"),
              type: "image",
              alt: "Maestro Beta 分享 Skyscraper Melodies 歌單的分享卡片",
            },
          ],
        },
      ],
    },
  ] satisfies ForuDesignPillar[],
  impact: {
    headline:
      "5 位參與者對「隔天再次使用」的意願評分為 7.8/10，「一個月內再次使用」則為 7.0/10。",
    lead: "我們訪談了 5 位參與者，評估這套設計的留存潛力。",
    quotes: [
      {
        quote:
          "我會再打開應用程式，找最近追的節目配樂。",
        attribution: "可用性測試參與者",
      },
      {
        quote:
          "用 AI 建歌單很酷，我想試不同照片。",
        attribution: "可用性測試參與者",
      },
      {
        quote:
          "我喜歡可以查看和編輯日常節奏的設計，我通常是依情境聽音樂。",
        attribution: "可用性測試參與者",
      },
      {
        quote: "有時候，圖片能說出我說不出口的話。",
        attribution: "可用性測試參與者",
      },
    ] satisfies ForuImpactQuote[],
  },
  conclusion: {
    headline: "讓 Amazon Music 成為日常不可或缺的一部分",
    paragraphs: [
      "For Ü 把個人化當成信任：說清楚推薦從哪來、音樂貼合日常節奏，並提供 AI 創作但不拿走主控權。",
      "這是一個為期四週的概念專案。下一步會測試推薦設定是否足夠透明、用聆聽資料驗證日常情境的觸發條件，並讓 Maestro 概念與正式產品的儲存流程對齊。",
    ],
  },
} as const;
