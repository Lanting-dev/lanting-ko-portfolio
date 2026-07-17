import type {
  CaseStudyDesignSection,
  CaseStudyFinding,
  CaseStudyImageRef,
  CaseStudyInsight,
  CaseStudyMetaItem,
} from "../nga";

export const NGA_CASE_STUDY_ZH = {
  slug: "nga",
  accent: "#F85525",
  title: "把看展變成 Gen Z 會想一起玩的體驗",
  meta: [
    { label: "專案期程", value: "12 週" },
    { label: "團隊", value: "Lanting K, Claire P, Isadora O, Eric L" },
    { label: "客戶", value: "National Gallery of Art" },
    {
      label: "服務",
      value: "UX 策略、使用者研究、產品設計",
    },
    { label: "工具", value: "Figma, Panelfox, Zoom, Google Sheets" },
  ] satisfies CaseStudyMetaItem[],
  summary: {
    title: "重點整理",
    paragraphs: [
      "NGA 網站使用者中有 13% 是 Fun Seekers，也是最年輕的一群，多半屬於 Z 世代。但他們在所有族群中滿意度最低。Artle 每天約有一萬人玩，卻比較偏向猜謎，主動參與的空間有限。",
      "我們把藝術參與從「認出作品」轉向「一起創作」，最後設計出一款結合繪畫、競賽與分享的多人遊戲體驗。",
    ],
  },
  heroImages: [
    {
      src: "/work/nga/home.png",
      alt: "Art or Fart · 首頁",
    },
    {
      src: "/work/nga/public-room-selection.png",
      alt: "Art or Fart · 公開房間選擇",
    },
    {
      src: "/work/nga/ai-tool.png",
      alt: "Art or Fart · AI 繪圖工具",
    },
  ] satisfies CaseStudyImageRef[],
  toc: [
    { id: "problem", label: "問題" },
    { id: "research", label: "研究" },
    { id: "design", label: "設計" },
    { id: "conclusion", label: "結語" },
  ] as const,
  problem: {
    label: "問題",
    headline: "流量高，Z 世代滿意度卻最低",
    intro:
      "NGA 是世界級美術館，線上流量很大，但 Fun Seekers（多半是 Z 世代）在六個族群中滿意度最低。NGA 已經嘗試用不同方式吸引他們，例如每日猜畫遊戲 Artle。Artle 每天約有一萬人玩，Fun Seekers 也是主要族群之一，代表遊戲確實有吸引力。但和許多輕量猜謎遊戲一樣，Artle 能做的互動很有限。這也給了我們一個機會：設計一個更貼近 Fun Seekers 參與習慣的行動體驗。",
    insightsTitle: "National Gallery of Art 已經知道的事",
    insights: [
      {
        title:
          "Fun Seekers 占線上流量 13%，但滿意度最低",
        body: "Fun Seekers 占線上流量 13%，但滿意度在所有族群中最低。",
      },
      {
        title: "能互動的方式太少",
        body: "Artle 帶來很高的回訪率：54% 的 Fun Seekers 會再回來。但互動內容不夠豐富，仍是他們最大的痛點。",
      },
      {
        title: "57% 流量來自行動裝置",
        body: "Fun Seekers 主要用行動裝置造訪 NGA 網站。",
      },
    ] satisfies CaseStudyInsight[],
  },
  research: {
    label: "研究",
    headline:
      "有趣、有料，而且要有社交感和真實感",
    intro:
      "根據這些洞察，我們把焦點放在兩件事：Z 世代 Fun Seekers 覺得什麼有趣，以及他們實際上怎麼使用博物館網站。",
    findings: [
      {
        text: "博物館網站有料，但不夠有趣",
        methods: ["Survey", "Interview"],
      },
      {
        text: "樂趣來自社交互動、分享和共同創作",
        methods: ["Survey", "Literature Review", "Interview"],
      },
      {
        text: "Z 世代重視真實感",
        methods: ["Interview", "Literature Review"],
      },
    ] satisfies CaseStudyFinding[],
    image: {
      src: "/work/nga/case-research.png",
      alt: "研究綜整看板與競品分析",
    },
  },
  designSections: [
    {
      id: "strategic-direction",
      label: "策略方向",
      headline: "從 Z 世代原有的行為切入",
      bodies: [
        "我們想把單向瀏覽改成可以參與、可以分享的體驗，也讓找資訊這件事本身變得更有趣。與其另外做一個和館藏無關的小遊戲，我們把社交和共同創作放進藝術體驗裡。",
        "最後，我們設計了一個參與式藝術體驗，讓探索館藏變成由社交帶動的遊戲互動。",
      ],
      journey: [
        {
          title: "Discover",
          description: "在 NGA 網站發現遊戲",
          emoji: "🤔",
        },
        {
          title: "Join",
          description: "閱讀規則並進入大廳",
          emoji: "😌",
        },
        {
          title: "Play",
          description: "揭曉主題並開始玩",
          emoji: "🤯",
        },
        { title: "Social", description: "投票和反應", emoji: "😄" },
        {
          title: "Results",
          description: "查看排行榜並分享",
          emoji: "😊",
        },
      ],
    },
    {
      id: "ideation",
      label: "發想",
      headline: "把創作變成競賽",
      body: "突破點是 Art or Fart。這個概念借鏡 Z 世代熟悉的快速數位文化，把藝術欣賞變成帶有競賽感的社交遊戲。相較之下，早期構想不是回饋太慢，就是社交互動不夠明確，所以沒有繼續發展。",
      image: {
        src: "/work/nga/case-ideation.png",
        alt: "Art or Fart 早期概念探索",
      },
    },
    {
      id: "discoverability",
      label: "設計決策 01",
      headline: "順著既有行為，讓入口更容易被看見",
      body: "Z 世代造訪博物館網站時，多半是查開放時間、當期展覽等實用資訊。我們把遊戲入口放在展覽資訊旁邊，讓它更容易被看見，也鼓勵他們出發前先接觸相關藝術風格。另外，我們也在 Artle 結果頁加入入口，讓既有玩家更容易試試新遊戲。",
      images: [
        {
          src: "/work/nga/case-entry-point-1.png",
          alt: "Mary Cassatt 展覽頁的 Art or Fart 進入點",
        },
        {
          src: "/work/nga/case-entry-point-2.png",
          alt: "Artle 結果頁的 Art or Fart 進入點",
        },
      ],
    },
    {
      id: "drawing-assist",
      label: "設計決策 02",
      headline: "用手指畫，降低門檻",
      body: "在小螢幕上只用手指畫圖，其實很容易挫折。我們整合多種繪圖輔助工具，協助解讀草稿並給出建議，讓創作比較好上手。",
      image: {
        src: "/work/nga/case-drawing-tools.png",
        alt: "行動裝置上的 AI 繪圖輔助工具",
      },
    },
    {
      id: "reactions",
      label: "設計決策 03",
      headline: "保留社交表達，但不失控",
      body: "開放式聊天可能影響 NGA 的機構語氣，也會增加內容管理成本。因此我們改用表情回應，保留社交表達，同時讓互動維持在可控範圍內。",
      image: {
        src: "/work/nga/case-reactions.png",
        alt: "以表情回應功能取代開放式聊天",
      },
    },
    {
      id: "theme-shuffle",
      label: "設計決策 04",
      headline: "邊玩邊學",
      body: "讓使用者投票選主題會增加不少複雜度，但實際價值有限。因此我們改用輪播選擇器，將藝術風格與物件組合在一起，提供更多變化和更清楚的背景，也自然創造邊玩邊學的機會。",
      image: {
        src: "/work/nga/case-theme-shuffle.png",
        alt: "以主題輪播機制取代主題投票",
      },
    },
    {
      id: "impact",
      label: "成效",
      headline: "把學習變成遊戲",
      body: "Art or Fart 是一款競技多人繪畫遊戲。玩家依照主題作畫、互相投票，最後在週排行榜上競爭。",
      image: {
        src: "/work/nga/case-impact-review.png",
        alt: "NGA 團隊 Zoom review 會議",
      },
      points: [
        {
          index: "01",
          text: "把單向資訊管道變成可參與的平台",
        },
        {
          index: "02",
          text: "競技遊戲循環維持社交參與",
        },
        {
          index: "03",
          text: "主題提示自然帶出 NGA 館藏",
        },
      ],
    },
  ] as const satisfies readonly CaseStudyDesignSection[],
  conclusion: {
    quote:
      "很多部分對我們的開發者來說不陌生。我覺得這可以很容易接進現有的產品線。",
    quoteAttribution: "NGA Team",
    label: "結語",
    headline: "讓體驗延伸到更多 NGA 遊戲",
    body: "下一步可以擴充主題目錄，並整合共用的參與系統，把這套體驗和其他 NGA 遊戲串起來，鼓勵使用者長期回來玩，也讓整個 NGA 的互動更連貫。",
  },
} as const;
