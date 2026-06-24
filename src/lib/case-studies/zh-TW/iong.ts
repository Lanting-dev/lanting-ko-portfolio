import type { GtStep } from "../gt";
import type {
  IongDepartment,
  IongInsight,
  IongInterface,
  IongSubstrate,
} from "../iong";

export const IONG_CASE_STUDY_ZH = {
  slug: "iong",
  kicker: "IONG 養",
  title: "當生物辨識系統替人決定吃什麼",
  meta: [
    { label: "專案期程", value: "4 週" },
    { label: "團隊", value: "Lanting Ko" },
    { label: "客戶", value: "個人專案" },
    { label: "服務", value: "推測性設計、互動設計" },
    { label: "工具", value: "Figma, Codex, Claude Code" },
  ],
  toc: [
    { id: "world", label: "世界觀" },
    { id: "experience", label: "體驗" },
    { id: "process", label: "流程" },
    { id: "research", label: "研究" },
    { id: "system", label: "系統" },
    { id: "reflection", label: "反思" },
  ],
  summary: [
    "2070 年，飲食不再是個人選擇，而是由生物辨識追蹤與自動化營養驅動的政府管控系統。IONG 想像：當照顧、便利與最佳化悄悄取代日常決策，會發生什麼事？",
    "你以新進員工的身分進入系統，不是領取餐食的公民，而是學習這套制度如何運作的人。體驗沒有固定路線：系統會記錄閱讀時間、點擊與生物辨識掃描，再依這些行為分配員工識別證。互動本身，就是參與。",
  ],
  hero: {
    src: "/work/iong/intro.mp4",
    poster: "/work/iong/welcome-onboard.png",
    alt: "IONG welcome onboarding screen，顯示員工識別證分配結果",
  },
  demoUrl: "https://iong.vercel.app/index.html",
  world: {
    headline: "2070：低生育率的未來",
    body:
      "出生率下降和公共衛生系統的壓力，讓飲食變成政府管理的資源。Valoria 共和國與私人企業合作建立 IONG 養，一套集中式營養計畫，支持人口健康，但從不把參與描述成強制。",
    context:
      "公民透過持續的生物辨識分析取得餐食，食物則由加工剩餘物與替代材料製成。onboarding demo 讓你從機構內部探索健康評分、監控與配給如何運作。",
    designQuestion: "當 onboarding 讓服從看起來像自願，會發生什麼事？",
    image: {
      src: "/work/iong/world-2070.png",
      alt: "2070 世界觀：人口下降、政府公共衛生回應，以及 IONG 的建立",
    },
    goals: [
      {
        title: "探索自動化與照顧",
        body: "檢視自動化系統如何看起來很有幫助，同時悄悄影響行為、降低個人自主性。",
      },
      {
        title: "把推測連回現在",
        body: "把 IONG 的世界連到現有的健康追蹤、個人化演算法和 AI 驅動的決策。",
      },
      {
        title: "沒有明確的對或錯",
        body: "呈現這套系統，但不把它定義成純好或純壞。好奇和不舒服應該可以同時存在。",
      },
    ] satisfies IongInsight[],
  },
  research: {
    headline: "為什麼是食物？因為選擇早就被結構化了",
    intro:
      "在機構成形之前，我先看現今的飲食選擇如何運作。食物感覺很個人，但很多決策在我們動手之前就被決定了：包裝、超市動線、健康追蹤、推薦演算法。IONG 建立在這些既有系統上，想像當流程完全自動化會怎樣。",
    literature: [
      {
        title: "飲食選擇其實很受社會影響",
        body: "借鑑 Pierre Bourdieu 的《區隔》，我把飲食視為文化學習的結果，而非純個人偏好，這也影響了 IONG 的機構框架。",
      },
      {
        title: "「好」的食物被道德化",
        body: "「健康」「乾淨」「天然」這類標籤把飲食跟責任和身份綁在一起。這也影響了 Health Credit Score 這類系統。",
      },
      {
        title: "日常決策早就被結構化",
        body: "包裝、動線、演算法、追蹤器在選擇變得有意識之前就組織好了選項。IONG 把這個條件延伸到完全自動化。",
      },
    ] satisfies IongInsight[],
    pillars: [
      {
        title: "包裝",
        body: "「有機」「高蛋白」這類標籤，在任何人細看成分之前就定義了什麼叫「好」的食物。",
      },
      {
        title: "超市系統",
        body: "視線高度的陳列和個人化排序，在選擇變得有意識之前就決定了能看見什麼。",
      },
      {
        title: "健康追蹤",
        body: "卡路里、睡眠、生物數據回饋，把飲食變成可量化的最佳化。",
      },
      {
        title: "社群媒體",
        body: "演算法反覆推某些飲食和健康趨勢，讓部分行為比其他的更「正常」。",
      },
    ] satisfies IongInsight[],
    signals: [
      {
        title: "選項比想像中少",
        body: "推薦系統在決策發生前就篩掉了使用者能看到的內容。",
      },
      {
        title: "食物變成資料",
        body: "營養越來越透過指標和預測性健康分析來評估。",
      },
      {
        title: "系統開始替人決定",
        body: "平台從建議選擇，走向直接生成選擇。使用者只剩批准或微調。",
      },
    ] satisfies IongInsight[],
  },
  process: {
    headline: "從實體物件到 employee onboarding",
    intro:
      "onboarding demo 是最後一層。IONG 從實體推測物件發展成相互連結的數位生態系，探討系統如何透過日常流程、資訊限制與小幅獎勵影響行為，而不需要直接強迫。",
    points: [
      [
        "01",
        "Severance 分析",
        "我分析 Severance 如何用極簡介面、有限透明度和看似有幫忙的機構環境製造不安，同時悄悄限制自主性。",
      ],
      [
        "02",
        "Circadian Compliance Unit",
        "早期推測裝置用提醒和小獎勵促進健康規範下的配合。互動限制在是/否，成為 IONG Health Credit Score 和生物監控的基礎。",
      ],
      [
        "03",
        "設計食物本身",
        "我把食物簡化成三種巨量營養素，反覆調整包裝、形狀與顏色。葉片造型的參考，讓設計逐漸走向乾淨、系統化的基質：Flǣsc、Hwǣte、Fǣtt。",
      ],
      [
        "04",
        "從物件到數位",
        "IONG 逐漸成為由部門與介面組成的數位生態系。載入畫面演化成內部員工系統，指紋與臉部掃描則讓 onboarding 像是進入一個受到嚴密管控的機構。",
      ],
      [
        "05",
        "用互動來分類",
        "與其讓使用者選部門，原型追蹤閱讀時間和行為，再分配員工識別證。單純瀏覽這個體驗，本身就是一種參與。",
      ],
    ] as const,
    images: [
      {
        src: "/work/iong/severance-analysis.png",
        alt: "Severance 世界觀分析封面",
        caption: "Severance 分析",
      },
      {
        src: "/work/iong/circadian-compliance-unit.png",
        alt: "Circadian Compliance Unit 原型，顯示極簡介面、是/否按鈕和列印紙條輸出",
        caption: "Circadian Compliance Unit",
      },
    ],
  },
  system: {
    headline: "一套集中系統，五個部門",
    intro:
      "IONG 由五個相互連結的部門運作。onboarding 只提供部分權限；以下內容分別說明原型中可以探索的範圍，以及權限以外的系統。",
    inDemo: {
      label: "原型中可探索",
      lead: "身為新進員工，你可以進入 Mete Systems、Hæl Intelligence 與 Wēl Outreach，也會通過生物辨識驗證，最後取得員工識別證。",
    },
    beyondDemo: {
      label: "權限以外",
      lead: "Lif Continuity 與 Lic Analytics 在 onboarding 期間維持鎖定。基質、配送與 Petizen 則把系統延伸到公民日常；這些是員工從螢幕上讀到的背景，而非親自操作的流程。",
    },
    departmentMap: {
      src: "/work/iong/department-map.png",
      alt: "IONG 部門地圖，顯示 Mete Systems、Hæl Intelligence、Wēl Outreach、Lif Continuity 和 Lic Analytics",
    },
    departments: [
      {
        name: "Mete Systems",
        tagline: "從剩餘到營養",
        body: "收集並處理營養材料，製成每日小袋。成分不公開，大多數流程對大眾不可見。",
        accessible: true,
      },
      {
        name: "Hæl Intelligence",
        tagline: "生物辨識資料分析",
        body: "使用穿戴式資料為公民建立每日營養計畫，即時更新配方，同時把個人資料分散在不同部門。",
        accessible: true,
      },
      {
        name: "Wēl Outreach",
        tagline: "信任與溝通",
        body: "向公民解釋 Health Credit Score、發布更新，是公眾與計畫之間的主要連結。",
        accessible: true,
      },
      {
        name: "Lif Continuity",
        tagline: "人口監控",
        body: "onboarding 期間無法進入這個部門；目前的權限等級不允許存取。",
        accessible: false,
      },
      {
        name: "Lic Analytics",
        tagline: "資料處理",
        body: "onboarding 期間無法進入這個部門；目前的權限等級不允許存取。",
        accessible: false,
      },
    ] satisfies IongDepartment[],
    substrates: [
      {
        name: "Flǣsc",
        macro: "蛋白質",
        body: "由藻類蛋白製成。高蛋白、低資源、省土地，設計用來維持肌肉功能和支援恢復。",
        image: {
          src: "/work/iong/flaesc.png",
          alt: "Flǣsc 蛋白質基質，由藻類生物質製成",
        },
      },
      {
        name: "Hwǣte",
        macro: "碳水化合物",
        body: "由剩餘蔬菜製成。減少食物浪費和資源消耗，同時提供穩定的日常能量。",
        image: {
          src: "/work/iong/hwaete.png",
          alt: "Hwǣte 碳水化合物基質，由剩餘蔬菜製成",
        },
      },
      {
        name: "Fǣtt",
        macro: "脂質",
        body: "由種子萃取油製成。可再生、來源廣泛，維持長時間穩定的能量調節。",
        image: {
          src: "/work/iong/faett.png",
          alt: "Fǣtt 脂質基質，由種子萃取油製成",
        },
      },
    ] satisfies IongSubstrate[],
    interfaces: [
      {
        label: "Hæl Intelligence · 公民視角",
        headline: "即時生物辨識追蹤",
        body:
          "onboarding 期間，員工會檢視公民儀表板：健康分數、情緒、配送狀態與今日配方都集中在同一個畫面。持續監控先被包裝成照顧，之後才逐漸顯露出監視的意味。",
        image: {
          src: "/work/iong/hael-citizen-dashboard.png",
          alt: "Hæl Intelligence 公民儀表板，含 health credit score、情緒、診斷和每日需求",
        },
      },
      {
        label: "Wēl Outreach · 公民視角",
        headline: "以行為為基礎的評分",
        body:
          "員工會看到 Wēl 如何向公民溝通分數變化。家庭參與有獎勵；錯過每日要求會悄悄降低分數，以及對商店和服務的存取。",
        image: {
          src: "/work/iong/health-credit-score.png",
          alt: "Health Credit Score 通知，顯示家庭規劃獎勵和未達標懲罰",
        },
      },
      {
        label: "Hæl Intelligence · 員工視角",
        headline: "每日資料重新校準",
        body:
          "員工重新校準公民檔案，維持穩定的營養和行為狀態。對齊度、情緒和參與度的小幅調整，讓系統保持最佳化。",
        image: {
          src: "/work/iong/hael-recalibrate.png",
          alt: "Hæl Intelligence 員工校準儀表板，含檔案指標和 3D 身體掃描",
        },
      },
    ] satisfies IongInterface[],
    delivery: {
      headline: "個人化配給，每週期一次",
      body: "公民每 30 天週期收到一次個人化配給，正是系統計算出他們身體需要的，不需要他們自己決定。員工是在協助運作這套計畫時接觸這項服務。",
      image: {
        src: "/work/iong/delivery.png",
        alt: "IONG 個人化配給配送盒，帶 teal 波浪品牌，拿在手中",
      },
    },
    petizen: {
      headline: "寵物也被納入系統",
      body: "公民家庭評分延伸到寵物。Petizen 檔案監控健康資料，提供個人化營養。員工會看到這套系統滲透家庭生活有多深。",
      image: {
        src: "/work/iong/petizen.png",
        alt: "Hæl Intelligence Petizen 儀表板，顯示 Billy 和 Charlie",
      },
    },
  },
  experience: {
    headline: "Employee onboarding as the experience",
    intro:
      "onboarding demo 沒有固定路線。你以部分權限進入系統，通過生物辨識掃描，再自由探索各個部門；部分區塊則受權限等級限制。系統會追蹤閱讀時間與互動，並依你在各區塊的停留方式分配員工識別證。你不會直接選擇角色；瀏覽本身就是一種參與。",
    steps: [
      {
        index: "welcome",
        title: "Welcome onboard",
        finding: "以新進員工身份進入",
        description:
          "體驗以部分存取的員工 ID 開場，接著是指紋和臉部辨識。從第一個畫面起，語氣就是機構式、有幫助、又有點不太對勁。在任何人讀完細則之前，參與就已經開始。",
        media: [
          {
            src: "/work/iong/intro.mp4",
            type: "video",
            alt: "IONG welcome onboarding introduction，含員工 ID 與生物辨識驗證",
            poster: "/work/iong/welcome-onboard.png",
          },
        ],
      },
      {
        index: "mete",
        title: "Mete Systems",
        finding: "從剩餘到營養",
        description:
          "Mete Systems 把剩餘轉成公民的每日小袋。流程隱藏，確切成分從不公開。身為探索這個部門的員工，你可以停留或離開，系統都會記錄閱讀時間。",
        media: [
          {
            src: "/work/iong/mete.mp4",
            type: "video",
            alt: "Mete Systems department walkthrough in the IONG employee onboarding demo",
            poster: "/work/iong/flaesc.png",
          },
        ],
      },
      {
        index: "hael",
        title: "Hæl Intelligence",
        finding: "公民資料，員工存取",
        description:
          "Hæl Intelligence 展示公民的健康分數、情緒與配送狀態如何被即時追蹤。新進員工會從公民端看見生物監控的結果：餐食成為持續蒐集資料後的輸出。",
        media: [
          {
            src: "/work/iong/heal.mp4",
            type: "video",
            alt: "Hæl Intelligence citizen dashboard viewed during employee onboarding",
            poster: "/work/iong/hael-citizen-dashboard.png",
          },
        ],
      },
      {
        index: "wel",
        title: "Wēl Outreach",
        finding: "服從如何被解釋",
        description:
          "Wēl Outreach 是公民了解 Health Credit Score 的管道。onboarding 期間，員工會看到系統如何溝通獎勵與懲罰，以及服務權限如何悄悄取決於日常行為。",
        media: [
          {
            src: "/work/iong/wel.mp4",
            type: "video",
            alt: "Wēl Outreach Health Credit Score flow viewed during employee onboarding",
            poster: "/work/iong/health-credit-score.png",
          },
        ],
      },
      {
        index: "lif",
        title: "Lif Continuity",
        finding: "存取受限",
        description:
          "Lif Continuity 負責人口監控。onboarding 期間，你的權限不足，無法進入。鎖定畫面仍是體驗的一部分：你可以嘗試開啟，但系統會提醒你，這個機構遠比新進員工獲准看見的範圍更大。",
        media: [
          {
            src: "/work/iong/lif-continuity-locked.png",
            type: "image",
            alt: "Lif Continuity locked department screen showing access restricted during employee onboarding",
          },
        ],
      },
      {
        index: "lic",
        title: "Lic Analytics",
        finding: "存取受限",
        description:
          "Lic Analytics 處理的資料規模不會在 onboarding 中揭露。它和 Lif Continuity 一樣出現在部門地圖上，卻維持鎖定。這些限制讓人意識到，IONG 的範圍遠大於新進員工獲准瀏覽的部分。",
        media: [
          {
            src: "/work/iong/lic-analytics-locked.png",
            type: "image",
            alt: "Lic Analytics locked department screen showing access restricted during employee onboarding",
          },
        ],
      },
      {
        index: "badge",
        title: "員工識別證",
        finding: "由你的行為分配",
        description:
          "識別證反映你如何完成 onboarding，而不是你主動選擇的角色。各部門的閱讀時間、互動紀錄與生物辨識資料，都會影響系統將你分配到哪個部門；不同員工很少得到完全相同的結果。",
        media: [
          {
            src: "/work/iong/badge.mp4",
            type: "video",
            alt: "Employee badge assignment based on onboarding behavior in the IONG demo",
            poster: "/work/iong/welcome-onboard.png",
          },
        ],
      },
    ] satisfies GtStep[],
    outro: "原型是入口。後面會追溯它如何被建構，以及為什麼食物成為主題。",
  },
  reflection: {
    headline: "推測是照向現今的鏡子",
    paragraphs: [
      "IONG 是我在 Pratt 的畢業專案，也讓我能跳脫典型產品設計題目，實驗世界觀建構與系統思考。想像一個飲食被管理、而非被選擇的未來，也讓我重新審視已經在影響日常生活的健康應用程式、推薦引擎與行為引導。",
      "這也許不是最傳統的 UX 專案，卻是對我最有意義的作品之一：建立一套連貫到近乎可信的虛構系統，同時又因為太貼近現實而令人不安。",
    ],
  },
} as const;
