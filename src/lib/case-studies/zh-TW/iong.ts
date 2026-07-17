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
    "在 2070 年，吃什麼不再只是個人選擇，而是被生物辨識、健康分數和自動化營養系統一起管理。IONG 想問的是：當照顧、便利和效率慢慢取代日常判斷，我們會不會也在不知不覺中交出選擇權？",
    "你不是以公民身分進入系統，而是一位新進員工。體驗沒有固定路線，系統會記錄你的閱讀時間、點擊和生物辨識掃描，再依照這些行為分配員工識別證。你以為自己只是在瀏覽，其實已經被系統讀取了。",
  ],
  hero: {
    src: "/work/iong/intro.mp4",
    poster: "/work/iong/welcome-onboard.png",
    alt: "IONG welcome onboarding screen，畫面呈現員工識別證分配結果",
  },
  demoUrl: "https://iong.vercel.app/index.html",
  world: {
    headline: "2070：低生育率的未來",
    body:
      "在低生育率和公共衛生壓力不斷升高的未來，飲食被納入政府管理。政府與私人企業合作建立 IONG 養，表面上是一套照顧全民健康的集中式營養計畫，卻從不明說參與是否真的可以拒絕。",
    context:
      "公民透過持續的生物辨識分析取得餐食，食物則由加工剩餘物與替代材料製成。onboarding demo 讓你從機構內部看見健康評分、監控和配給如何串在一起。",
    designQuestion: "如果 onboarding 讓服從看起來像自願，會發生什麼事？",
    image: {
      src: "/work/iong/world-2070.png",
      alt: "2070 世界觀：人口下降、政府公共衛生回應與 IONG 的建立",
    },
    goals: [
      {
        title: "看見自動化和照顧之間的拉扯",
        body: "看看一套自動化系統如何看似貼心，卻也在不知不覺中影響行為、削弱自主性。",
      },
      {
        title: "把推測連回現在",
        body: "把 IONG 的世界觀連回當下的健康追蹤、個人化演算法，以及越來越常替人做判斷的 AI。",
      },
      {
        title: "沒有明確的對或錯",
        body: "不急著把這套系統定義成好或壞，而是保留那種又好奇、又不太舒服的感覺。",
      },
    ] satisfies IongInsight[],
  },
  research: {
    headline: "為什麼是食物？因為選擇早就被安排好了",
    intro:
      "在設計 IONG 之前，我先回頭看現在的飲食選擇是怎麼被影響的。食物看起來很個人，但很多決策其實早在我們伸手之前就已經被安排好了：包裝怎麼說、超市怎麼陳列、健康 App 怎麼提醒、演算法怎麼推薦。IONG 就是把這些已經存在的機制往前推，想像它們被完全自動化後會變成什麼樣子。",
    literature: [
      {
        title: "飲食選擇其實很受社會影響",
        body: "借鑑 Pierre Bourdieu 的《區隔》，我把飲食看成一種被文化學會的偏好，而不只是個人喜歡什麼。這也影響了 IONG 作為一個機構的設定。",
      },
      {
        title: "「好」的食物被道德化",
        body: "「健康」「乾淨」「天然」這些標籤，常把飲食和責任感、身分認同綁在一起。Health Credit Score 這類設定就是從這裡延伸出來的。",
      },
      {
        title: "日常決策早就被整理好了",
        body: "包裝、動線、演算法和追蹤器，會在我們意識到自己要選擇之前，就先整理好可見的選項。IONG 把這個狀態推到完全自動化。",
      },
    ] satisfies IongInsight[],
    pillars: [
      {
        title: "包裝",
        body: "「有機」「高蛋白」這類標籤，常在我們細看成分之前，就先定義了什麼叫「好」的食物。",
      },
      {
        title: "超市系統",
        body: "視線高度的陳列和個人化排序，會在選擇真正發生前，就先決定哪些東西被看見。",
      },
      {
        title: "健康追蹤",
        body: "卡路里、睡眠和生物數據回饋，讓飲食慢慢變成一件可以被量化、也可以被系統調整的事。",
      },
      {
        title: "社群媒體",
        body: "演算法反覆推送特定飲食和健康趨勢，也讓某些行為看起來比其他選擇更「正常」。",
      },
    ] satisfies IongInsight[],
    signals: [
      {
        title: "選項比想像中少",
        body: "推薦機制會在使用者真正做決定前，就先篩掉一部分可能性。",
      },
      {
        title: "食物變成資料",
        body: "營養越來越常被轉成指標，再透過預測式健康分析來評估。",
      },
      {
        title: "平台開始替人決定",
        body: "平台不只是推薦選項，而是開始直接生成選項。使用者能做的，往往只剩同意或稍微調整。",
      },
    ] satisfies IongInsight[],
  },
  process: {
    headline: "從實體物件到 employee onboarding",
    intro:
      "employee onboarding 是這個專案最後長出來的形式。IONG 一開始是實體推測物件，後來慢慢發展成一套互相連結的數位生態系。我想探討的是：系統不一定要明著強迫，也能靠日常流程、資訊限制和小獎勵改變人的行為。",
    points: [
      [
        "01",
        "Severance 分析",
        "我分析 Severance 如何用極簡介面、有限的透明度，以及看似體貼的機構環境製造不安，同時悄悄限制人的自主性。",
      ],
      [
        "02",
        "Circadian Compliance Unit",
        "早期的推測裝置用提醒和小獎勵，鼓勵使用者配合健康規範。互動只剩是或否，也成為後來 IONG Health Credit Score 和生物監控的基礎。",
      ],
      [
        "03",
        "設計食物本身",
        "我把食物拆成三種巨量營養素，反覆調整包裝、形狀和顏色。葉片造型的參考，讓整體慢慢變成乾淨、系統化的三種基質：Flǣsc、Hwǣte、Fǣtt。",
      ],
      [
        "04",
        "從物件到數位",
        "IONG 後來變成一套由部門與介面組成的數位生態系。載入畫面演化成內部員工入口，指紋與臉部掃描則讓 onboarding 更像是進入一個被嚴密管理的機構。",
      ],
      [
        "05",
        "用互動來分類",
        "我沒有讓使用者自己選部門，而是讓原型追蹤閱讀時間和互動行為，再分配員工識別證。單純瀏覽這個體驗，就已經被納入判斷。",
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
        alt: "Circadian Compliance Unit 原型，包含極簡介面、是/否按鈕和列印紙條輸出",
        caption: "Circadian Compliance Unit",
      },
    ],
  },
  system: {
    headline: "五個部門，組成一套集中管理的制度",
    intro:
      "IONG 由五個互相連動的部門組成。onboarding 只開放部分權限；以下整理你在原型裡看得到的內容，以及那些被擋在權限之外的部分。",
    inDemo: {
      label: "原型裡看得到",
      lead: "身為新進員工，你可以進入 Mete Systems、Hæl Intelligence 和 Wēl Outreach，也會完成生物辨識驗證，最後拿到一張被分配好的員工識別證。",
    },
    beyondDemo: {
      label: "權限以外",
      lead: "Lif Continuity 和 Lic Analytics 在 onboarding 期間維持鎖定。基質、配送與 Petizen 則把 IONG 延伸到公民日常；新進員工只能從畫面上讀到它們，無法真正操作。",
    },
    departmentMap: {
      src: "/work/iong/department-map.png",
      alt: "IONG 部門地圖，包含 Mete Systems、Hæl Intelligence、Wēl Outreach、Lif Continuity 和 Lic Analytics",
    },
    departments: [
      {
        name: "Mete Systems",
        tagline: "從剩餘到營養",
        body: "收集並處理營養材料，再製成每日配給的小袋。成分不公開，大部分流程也不會被公民看見。",
        accessible: true,
      },
      {
        name: "Hæl Intelligence",
        tagline: "生物辨識資料分析",
        body: "根據穿戴式資料為公民安排每日營養計畫，即時更新配方，同時把個人資料分散在不同部門。",
        accessible: true,
      },
      {
        name: "Wēl Outreach",
        tagline: "信任與溝通",
        body: "負責向公民解釋 Health Credit Score、發布更新，是大眾和這套計畫之間最主要的溝通管道。",
        accessible: true,
      },
      {
        name: "Lif Continuity",
        tagline: "人口監控",
        body: "onboarding 期間無法進入。用目前的員工權限，還不能存取這個部門。",
        accessible: false,
      },
      {
        name: "Lic Analytics",
        tagline: "資料處理",
        body: "onboarding 期間無法進入。用目前的員工權限，還不能存取這個部門。",
        accessible: false,
      },
    ] satisfies IongDepartment[],
    substrates: [
      {
        name: "Flǣsc",
        macro: "蛋白質",
        body: "由藻類蛋白製成。高蛋白、低資源、占地少，被設定為維持肌肉功能與身體恢復的基質。",
        image: {
          src: "/work/iong/flaesc.png",
          alt: "Flǣsc 蛋白質基質，由藻類生物質製成",
        },
      },
      {
        name: "Hwǣte",
        macro: "碳水化合物",
        body: "由剩餘蔬菜製成。它能減少食物浪費與資源消耗，同時提供穩定的日常能量。",
        image: {
          src: "/work/iong/hwaete.png",
          alt: "Hwǣte 碳水化合物基質，由剩餘蔬菜製成",
        },
      },
      {
        name: "Fǣtt",
        macro: "脂質",
        body: "由種子萃取油製成。來源廣、可再生，用來支撐較長時間的能量調節。",
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
          "onboarding 期間，員工會看到公民儀表板：健康分數、情緒、配送狀態和今日配方都集中在同一個畫面。持續監控一開始被包裝成照顧，久了才慢慢露出監視的意味。",
        image: {
          src: "/work/iong/hael-citizen-dashboard.png",
          alt: "Hæl Intelligence 公民儀表板，包含 health credit score、情緒、診斷和每日需求",
        },
      },
      {
        label: "Wēl Outreach · 公民視角",
        headline: "用行為決定分數",
        body:
          "員工會看到 Wēl 如何向公民說明分數變化。家庭參與會得到獎勵；如果錯過每日要求，分數和部分商店、服務的存取權限就會悄悄下降。",
        image: {
          src: "/work/iong/health-credit-score.png",
          alt: "Health Credit Score 通知，呈現家庭規劃獎勵和未達標懲罰",
        },
      },
      {
        label: "Hæl Intelligence · 員工視角",
        headline: "每天重新校準資料",
        body:
          "員工可以重新校準公民檔案，讓營養和行為狀態維持在平台認定的穩定範圍內。對齊度、情緒和參與度看似只是小幅調整，卻會持續把整套機制推向平台認定的理想狀態。",
        image: {
          src: "/work/iong/hael-recalibrate.png",
          alt: "Hæl Intelligence 員工校準儀表板，包含檔案指標和 3D 身體掃描",
        },
      },
    ] satisfies IongInterface[],
    delivery: {
      headline: "每 30 天一次的個人化配給",
      body: "公民每 30 天會收到一次個人化配給，由平台計算身體需要什麼，不再需要自己決定。員工則是在協助計畫運作時，接觸到這項服務。",
      image: {
        src: "/work/iong/delivery.png",
        alt: "手中拿著 IONG 個人化配給配送盒，盒身有 teal 波浪品牌圖形",
      },
    },
    petizen: {
      headline: "寵物也被納入系統",
      body: "公民家庭評分也延伸到寵物身上。Petizen 檔案會監控健康資料，並安排個人化營養。員工從這裡看見，IONG 已經滲透到家庭生活裡很細的地方。",
      image: {
        src: "/work/iong/petizen.png",
        alt: "Hæl Intelligence Petizen 儀表板，畫面中有 Billy 和 Charlie",
      },
    },
  },
  experience: {
    headline: "用 employee onboarding 作為體驗入口",
    intro:
      "onboarding demo 沒有固定路線。你帶著部分權限進入系統，通過生物辨識掃描後，可以自由探索各個部門；有些區塊則會因權限不足而被鎖住。系統會追蹤你的閱讀時間和互動方式，再依照停留行為分配員工識別證。你沒有直接選角色，但瀏覽本身就已經成為判斷依據。",
    steps: [
      {
        index: "welcome",
        title: "Welcome onboard",
        finding: "以新進員工身分進入",
        description:
          "體驗從一張只有部分權限的員工 ID 開始，接著進入指紋和臉部辨識。從第一個畫面起，語氣就帶著機構式的友善，也有一點說不上來的不對勁。在使用者讀完任何細則之前，系統就已經開始記錄。",
        media: [
          {
            src: "/work/iong/intro.mp4",
            type: "video",
            alt: "IONG welcome onboarding introduction，包含員工 ID 與生物辨識驗證",
            poster: "/work/iong/welcome-onboard.png",
          },
        ],
      },
      {
        index: "mete",
        title: "Mete Systems",
        finding: "從剩餘到營養",
        description:
          "Mete Systems 把剩餘材料轉成公民每日領取的小袋。流程被藏在背後，確切成分也不公開。身為進入這個部門的新進員工，你可以停留，也可以離開，但系統都會記下你的閱讀時間。",
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
          "Hæl Intelligence 呈現公民的健康分數、情緒和配送狀態如何被即時追蹤。新進員工會從公民端看見生物監控的結果：餐食不再只是食物，而是資料被持續蒐集後的輸出。",
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
          "Wēl Outreach 是公民理解 Health Credit Score 的主要管道。onboarding 期間，員工會看到獎勵與懲罰如何被包裝，也會看見服務權限如何悄悄被日常行為影響。",
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
          "Lif Continuity 負責人口監控。onboarding 期間，你的權限不足，無法進入。鎖定畫面本身也是體驗的一部分：你可以嘗試打開，但系統會提醒你，這個機構遠比新進員工被允許看見的範圍更大。",
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
          "Lic Analytics 處理的資料規模不會在 onboarding 中被揭露。它和 Lif Continuity 一樣出現在部門地圖上，卻始終維持鎖定。這些限制讓人意識到，IONG 的範圍遠大於新進員工能瀏覽的部分。",
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
          "識別證反映的是你如何完成 onboarding，而不是你主動選了哪個角色。各部門的閱讀時間、互動紀錄和生物辨識資料，都會影響最後被分配到哪裡；不同員工很少會得到完全相同的結果。",
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
    outro: "這個原型是入口。接著回頭看它是怎麼長出來的，以及為什麼我選擇用食物作為主題。",
  },
  reflection: {
    headline: "推測設計其實是在照現在",
    paragraphs: [
      "IONG 是我在 Pratt 的畢業專案，也讓我有機會跳脫典型產品設計題目，練習世界觀建構和系統思考。想像一個飲食被管理、而不是被選擇的未來，也讓我重新看待那些早已影響日常生活的健康 App、推薦引擎和行為引導。",
      "它也許不是最典型的 UX 專案，卻是對我很重要的一件作品：我想建立一套連貫到幾乎可信的虛構系統，同時讓它因為太貼近現實，而產生一點不安。",
    ],
  },
} as const;
