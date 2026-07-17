import type {
  CopperDesignDecision,
  CopperFutureStep,
  CopperMedia,
  CopperOutcome,
} from "../copper";

export const COPPER_CASE_STUDY_ZH = {
  slug: "copper",
  kicker: "Cooper Hewitt",
  title: "重新設計無障礙字型探索介面",
  meta: [
    { label: "專案期程", value: "4 週" },
    { label: "團隊", value: "Lanting K, Smridhi G, Simran K, Gloria Y, Nandita M" },
    { label: "客戶", value: "Cooper Hewitt" },
    { label: "服務", value: "無障礙設計" },
    { label: "工具", value: "Figma, VoiceOver, Hume AI" },
  ],
  toc: [
    { id: "problem", label: "問題" },
    { id: "design", label: "設計" },
    { id: "outcome", label: "成效" },
    { id: "conclusion", label: "結語" },
  ],
  summary: [
    "Bungee 是 Cooper Hewitt 數位館藏中的彩色疊層展示字型，但原本的 Bungee font tester 幾乎完全依賴視覺互動，視覺障礙使用者很難真的用起來。",
    "我依循 WCAG 指引重新設計介面，把原本的控制項改成鍵盤也能操作的元件，並加入聲音回饋，讓這個原本偏視覺的工具也能被聽見、被理解。",
  ],
  hero: {
    src: "/work/copper/hero.png",
    alt: "Bungee accessible font tester，畫面中有 BUNGEE 字樣與控制面板",
  },
  problem: {
    headline: "只有看得見才用得起的 Bungee font tester",
    body:
      "Bungee 是 Cooper Hewitt 數位館藏中的模組化彩色疊層展示字型。Bungee font tester 讓使用者疊加顏色、調整方向和建立排版，但這些操作幾乎都需要看得見畫面才能完成。對視覺障礙使用者來說，這不只是不好用，而是根本進不去這個體驗。美國有近兩千萬人受到視覺障礙影響，也讓博物館數位體驗的無障礙缺口更明顯。",
  },
  designDecisions: [
    {
      id: "unfold-panel",
      label: "設計決策 01",
      headline: "展開控制面板，讓鍵盤也能操作",
      body:
        "原本的收合式面板增加了操作步驟，也無法順利用鍵盤瀏覽。我將面板展開，重新安排 Tab 順序，並用語意化 <form> 組織控制項，讓介面更容易理解，也更容易操作。",
      media: {
        src: "/work/copper/tab-order.png",
        type: "image",
        alt: "展開後 Bungee 控制面板的 tab 順序標註",
      },
    },
    {
      id: "color-swatches",
      label: "設計決策 02",
      headline: "用有標籤的色票取代選色器",
      body:
        "原本的選色器需要在視覺色譜裡拖曳，沒有視力就很難操作。我改成有標籤的色票格，並加入 HEX/RGB 輸入，讓使用者仍然可以自訂顏色。",
      media: {
        src: "/work/copper/color-swatches.png",
        type: "image",
        alt: "有標籤色票格與 HEX、RGB 輸入，取代色譜選色器",
      },
    },
    {
      id: "audio-feedback",
      label: "設計決策 03",
      headline: "用聲音補上視覺缺口",
      body:
        "光靠文字描述，很難傳達視覺設計的感覺。聲音回饋讓使用者在調整參數時，也能聽見字型如何變化。",
      media: {
        src: "/work/copper/audio-feedback.mp4",
        type: "video",
        alt: "調整字型參數時的聲音回饋",
      },
      mapping: {
        heading: "Sonic Typography Mapping System",
        intro:
          "改善介面基礎後，第二階段我加入聲音體驗，把視覺特徵對應到不同聲音元素：",
        items: [
          {
            from: "Internal Contrast",
            to: "Voice Depth",
            body: "對比越高，聲音越深、越厚；對比較輕時，聲音則偏高、比較空靈。",
          },
          {
            from: "Overall Contrast",
            to: "Timbre",
            body: "不同配色對應不同音色，也會帶出相近的情緒：亮色更有活力，柔和色更溫和。",
          },
          {
            from: "Layering",
            to: "Audio Effects",
            body: "Bungee 特有的圖層被轉成不同音效：",
            sub: [
              "Inline：輕微回音",
              "Outline：混響深度",
              "Shade：合唱效果，增加層次",
            ],
          },
          {
            from: "Orientation",
            to: "Pacing",
            body: "直排文字會變成比較有節奏的聲音模式，字母之間刻意停頓，和橫排文字的流動感做出區隔。",
          },
          {
            from: "Background Shapes",
            to: "Ambient Sound",
            body: "不同裝飾元素對應不同聲音環境：",
            sub: [
              "Banner 形狀產生連續環境音",
              "Block 形狀創造間歇式聲紋",
              "裝飾元素加入細微聲音點綴",
            ],
          },
        ],
      },
    },
    {
      id: "onboarding",
      label: "設計決策 04",
      headline: "引導每位訪客開始操作",
      body:
        "互動式數位作品對博物館訪客來說不一定直覺。我設計了可由滑鼠停留或鍵盤焦點觸發的 contextual onboarding，也放了一個可以隨時打開的教學面板。",
      media: {
        src: "/work/copper/onboarding.mp4",
        type: "video",
        alt: "Contextual tutorial tooltip 引導訪客使用 Bungee font tester",
        sound: true,
      },
    },
  ] satisfies CopperDesignDecision[],
  outcomes: [
    {
      title: "Unfolded Control Panel",
      body: "簡化介面，移除不必要的收合區塊，讓控制項更容易被看見，也減少操作步驟。",
    },
    {
      title: "Accessible Color Picker",
      body: "用色票式介面取代預設選色器，讓鍵盤和螢幕閱讀器使用者也能操作。",
    },
    {
      title: "Guided Tutorial",
      body: "為首次與回訪使用者設計 contextual onboarding，可用 hover 或 focus 觸發，也保留可選的教學面板。",
    },
    {
      title: "From Visual to Multisensory",
      body: "加入聲音回饋，讓使用者不只靠視覺，也能用聲音感知字型變化。",
    },
  ] satisfies CopperOutcome[],
  outcomeDemo: {
    src: "/work/copper/audio-feedback.mp4",
    type: "video",
    alt: "Full walkthrough of the redesigned accessible Bungee font tester",
  } satisfies CopperMedia,
  conclusion: {
    headline: "超越螢幕，超越視覺",
    paragraphs: [
      "這個專案讓我有機會在博物館情境裡思考無障礙設計。我很喜歡探索多感官體驗，也在過程中看見更多可以延伸的方向。",
      "以下是一些後續方向：",
    ],
    futureSteps: [
      {
        index: "01",
        title: "用更有感的方式描述顏色",
        body: "與其只說「橘色」，不如描述成「海邊夕陽的橘色」，幫助使用者感受顏色，而不只是辨識名稱。",
      },
      {
        index: "02",
        title: "讓聲音更中性",
        body: "聲音線索要有表現力，但不要強化刻板印象。",
      },
      {
        index: "03",
        title: "超越鍵盤操作",
        body: "Bungee 會在 Cooper Hewitt 實體展出。其他互動形式可能改變訪客在實體空間的參與方式。",
      },
    ] satisfies CopperFutureStep[],
  },
} as const;
