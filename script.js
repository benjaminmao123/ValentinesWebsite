const translations = {
  en: {
    languageLabel: "Language",
    landingTitle: "Will you be my valentines?",
    landingSubtitle: "You make my world brighter every day.",
    yes: "Yes",
    no: "No",
    optionsTitle: "Pick a cute date idea",
    optionsSubtitle: "Placeholders for now — we can fill these in later.",
    option1: "Option 1",
    option2: "Option 2",
    option3: "Option 3",
    backToQuestion: "Back to the question",
    tryAgain: "Try again",
  },
  ja: {
    languageLabel: "言語",
    landingTitle: "私のバレンタインになってくれますか？",
    landingSubtitle: "あなたは毎日、私の世界を明るくしてくれる。",
    yes: "はい",
    no: "いいえ",
    optionsTitle: "かわいいデート案を選んでね",
    optionsSubtitle: "今は仮の項目。あとで決めよう。",
    option1: "オプション 1",
    option2: "オプション 2",
    option3: "オプション 3",
    backToQuestion: "質問に戻る",
    tryAgain: "もう一度",
  },
};

const languageSelect = document.getElementById("languageSelect");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");

const applyLanguage = (lang) => {
  const strings = translations[lang] || translations.en;
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.getAttribute("data-i18n");
    if (strings[key]) {
      element.textContent = strings[key];
    }
  });
};

const savedLanguage = localStorage.getItem("language") || "en";
if (languageSelect) {
  languageSelect.value = savedLanguage;
  languageSelect.addEventListener("change", (event) => {
    const newLanguage = event.target.value;
    localStorage.setItem("language", newLanguage);
    applyLanguage(newLanguage);
  });
}
applyLanguage(savedLanguage);

if (yesBtn) {
  yesBtn.addEventListener("click", () => {
    window.location.href = "options.html";
  });
}

if (noBtn) {
  noBtn.addEventListener("click", () => {
    const lang = localStorage.getItem("language") || "en";
    const message = translations[lang]?.tryAgain || translations.en.tryAgain;
    window.alert(message);
  });
}
