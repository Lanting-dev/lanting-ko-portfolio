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
    "Bungee 是 Cooper Hewitt 數位館藏中的彩色疊層展示字型，但原本的 Bungee font tester 完全依賴視覺互動，讓視覺障礙使用者無法參與。",
    "我依循 WCAG 指引重新設計介面，以鍵盤可操作的元件取代原本的控制項，並加入聲音回饋，將純視覺工具轉化為多感官體驗。",
  ],
  hero: {
    src: "/work/copper/hero.png",
    alt: "Bungee accessible font tester，顯示 BUNGEE 字樣與控制面板",
  },
  problem: {
    headline: "只有看得見才用得起的 Bungee font tester",
    body:
      "Bungee 是 Cooper Hewitt 數位館藏中的模組化彩色疊層展示字型。Bungee font tester 讓使用者疊加顏色、調整方向與建立排版，但所有互動都依賴視覺輸入，視覺障礙使用者因而無法操作。美國有近兩千萬人受到視覺障礙影響，這也凸顯博物館數位無障礙體驗的重要缺口。",
  },
  designDecisions: [
    {
      id: "unfold-panel",
      label: "設計決策 01",
      headline: "展開控制面板，支援鍵盤操作",
      body:
        "收合式面板增加了操作步驟，也無法以鍵盤瀏覽。我將面板展開、建立合理的 Tab 順序，並以語意化 <form> 組織控制項，讓使用者更容易理解與瀏覽介面。",
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
        "原本的選色器要在視覺色譜裡拖曳，沒有視力就無法操作。我改成有標籤的色票格，並加上 HEX/RGB 輸入自訂顏色。",
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
        "光靠文字描述抓不住視覺設計的感覺。聲音回饋讓使用者在調整參數時，能聽到字型怎麼變。",
      media: {
        src: "/work/copper/audio-feedback.mp4",
        type: "video",
        alt: "調整字型參數時的聲音回饋",
      },
      mapping: {
        heading: "Sonic Typography Mapping System",
        intro:
          "在改善技術基礎之後，第二階段加入聲音體驗，把視覺特徵轉成對應的聲音元素：",
        items: [
          {
            from: "Internal Contrast",
            to: "Voice Depth",
            body: "對比越高，聲音越深、越渾厚；對比較輕則偏高、較空靈。",
          },
          {
            from: "Overall Contrast",
            to: "Timbre",
            body: "不同配色對應不同音色，喚起類似的情緒：亮色有活力，柔和色更溫和。",
          },
          {
            from: "Layering",
            to: "Audio Effects",
            body: "Bungee 特有的圖層變成特定音效：",
            sub: [
              "Inline：輕微回音",
              "Outline：混響深度",
              "Shade：合唱效果，增加層次",
            ],
          },
          {
            from: "Orientation",
            to: "Pacing",
            body: "直排文字變成有節奏的模式，字母之間刻意停頓，跟橫排流動清楚區分。",
          },
          {
            from: "Background Shapes",
            to: "Ambient Sound",
            body: "不同裝飾元素創造不同聲音環境：",
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
      headline: "Guide every visitor through onboarding",
      body:
        "互動式數位作品對博物館訪客不一定直覺。我設計了可由滑鼠停留或鍵盤焦點觸發的 contextual onboarding，也提供可隨時重新開啟的教學面板。",
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
      body: "簡化介面，移除不必要的收合區塊，提高能見度、減少操作步驟。",
    },
    {
      title: "Accessible Color Picker",
      body: "用色票式介面取代預設選色器，支援鍵盤操作和螢幕閱讀器。",
    },
    {
      title: "Guided Tutorial",
      body: "為首次與回訪使用者設計 contextual onboarding，支援 hover、focus 和可選教學面板。",
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
      "這個專案讓我有機會在博物館情境裡設計。我很享受做多感官體驗，過程也看見還可以改進的地方，期待之後繼續探索。",
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
        title: "設計中性化的聲音",
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
