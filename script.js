const translations = {
  en: {
    languageLabel: "Language",
    landingTitle: "Will you be my valentines?",
    landingSubtitle: "You make my world brighter every day.",
    yes: "Yes",
    no: "No",
    optionsTitle: "Things I like about you",
    optionsSubtitle: "Little moments and words from my heart.",
    option1: "Our Memories",
    option2: "My Letter",
    option3: "Why I Love You",
    option4: "Catch My Love",
    memoriesTitle: "Our Best Moments",
    memoriesSubtitle: "A few snapshots of us.",
    letterTitle: "My Letter",
    letterSubtitle: "A love note just for you.",
    letterPlaceholder: "Write your letter here.",
    loveTitle: "Why I Love You",
    loveSubtitle: "A few reasons you mean the world to me.",
    gameTitle: "Catch My Love",
    gameSubtitle: "Catch the hearts and kisses. Avoid the angry faces.",
    scoreLabel: "Score",
    livesLabel: "Lives",
    startGame: "Start Game",
    pauseGame: "Pause",
    resumeGame: "Resume",
    soundLabel: "Sound",
    gameOverTitle: "Game Over",
    winTitle: "You win",
    gameOverMessage: "You caught my heart 💕 (Like you always do)",
    gameOverLose: "Try again",
    musicOn: "Music: On",
    musicOff: "Music: Off",
    musicPlay: "Play music",
    finalScore: "Final score",
    playAgain: "Play Again",
    loveItem1: "Your smile",
    loveItem2: "Your kindness",
    loveItem3: "The way you laugh",
    backToQuestion: "Back to the question",
    backToOptions: "Back to options",
    tryAgain: "Try again",
  },
  ja: {
    languageLabel: "言語",
    landingTitle: "私のバレンタインになってくれますか？",
    landingSubtitle: "あなたは毎日、私の世界を明るくしてくれる。",
    yes: "はい",
    no: "いいえ",
    optionsTitle: "あなたの好きなところ",
    optionsSubtitle: "小さな思い出と、心からの言葉。",
    option1: "私たちの思い出",
    option2: "私の手紙",
    option3: "好きな理由",
    option4: "愛をキャッチ",
    memoriesTitle: "私たちの最高の瞬間",
    memoriesSubtitle: "私たちの写真を少し。",
    letterTitle: "私の手紙",
    letterSubtitle: "あなたへのラブレター。",
    letterPlaceholder: "ここに手紙を書いてね。",
    loveTitle: "好きな理由",
    loveSubtitle: "あなたが大切な理由を少し。",
    gameTitle: "愛をキャッチ",
    gameSubtitle: "ハートとキスをキャッチ。怒り顔は避けてね。",
    scoreLabel: "スコア",
    livesLabel: "ライフ",
    startGame: "スタート",
    pauseGame: "一時停止",
    resumeGame: "再開",
    soundLabel: "サウンド",
    gameOverTitle: "ゲームオーバー",
    winTitle: "勝ち",
    gameOverMessage: "あなたは私の心を捕まえた（いつも通りね）",
    gameOverLose: "もう一度",
    musicOn: "音楽: オン",
    musicOff: "音楽: オフ",
    musicPlay: "音楽を再生",
    finalScore: "最終スコア",
    playAgain: "もう一回",
    loveItem1: "あなたの笑顔",
    loveItem2: "あなたの優しさ",
    loveItem3: "笑い方",
    backToQuestion: "質問に戻る",
    backToOptions: "オプションに戻る",
    tryAgain: "もう一度",
  },
};

const languageSelect = document.getElementById("languageSelect");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const musicToggle = document.getElementById("musicToggle");
const getMusicElement = () => {
  const local = document.getElementById("bgMusic");
  if (local) {
    return local;
  }
  try {
    if (window.parent && window.parent !== window) {
      return window.parent.document.getElementById("bgMusic");
    }
  } catch (error) {
    return null;
  }
  return null;
};

const applyLanguage = (lang) => {
  const strings = translations[lang] || translations.en;
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.getAttribute("data-i18n");
    if (strings[key]) {
      element.textContent = strings[key];
    }
  });
  updateMusicButton();
};

const savedLanguage = localStorage.getItem("language") || "en";
const MUSIC_KEY = "musicEnabled";
const MUSIC_TIME_KEY = "musicTime";
const MUSIC_PLAYING_KEY = "musicPlaying";
let musicBlocked = false;
let musicTimeInterval = null;

const updateMusicButton = () => {
  const bgMusic = getMusicElement();
  if (!musicToggle || !bgMusic) {
    return;
  }
  const lang = languageSelect?.value || savedLanguage;
  const strings = translations[lang] || translations.en;
  if (musicBlocked && bgMusic.paused) {
    musicToggle.textContent = strings.musicPlay || "Play music";
    return;
  }
  musicToggle.textContent = bgMusic.paused
    ? strings.musicOff || "Music: Off"
    : strings.musicOn || "Music: On";
};
if (languageSelect) {
  languageSelect.value = savedLanguage;
  languageSelect.addEventListener("change", (event) => {
    const newLanguage = event.target.value;
    localStorage.setItem("language", newLanguage);
    applyLanguage(newLanguage);
  });
}
applyLanguage(savedLanguage);

const bgMusic = getMusicElement();
if (bgMusic) {
  bgMusic.volume = 0.5;
  const shouldPlay = localStorage.getItem(MUSIC_KEY) !== "false";
  const savedTime = parseFloat(localStorage.getItem(MUSIC_TIME_KEY) || "0");
  const wasPlaying = localStorage.getItem(MUSIC_PLAYING_KEY) === "true";

  if (!Number.isNaN(savedTime) && savedTime > 0) {
    bgMusic.addEventListener(
      "loadedmetadata",
      () => {
        bgMusic.currentTime = Math.min(savedTime, bgMusic.duration || savedTime);
      },
      { once: true }
    );
  }

  if (shouldPlay) {
    if (wasPlaying || localStorage.getItem(MUSIC_KEY) === "true") {
      bgMusic
        .play()
        .then(() => {
          musicBlocked = false;
          updateMusicButton();
        })
        .catch(() => {
          musicBlocked = true;
          updateMusicButton();
        });
    }
  } else {
    bgMusic.pause();
    updateMusicButton();
  }

  const tryPlayOnGesture = () => {
    if (bgMusic.paused && localStorage.getItem(MUSIC_KEY) !== "false") {
      bgMusic
        .play()
        .then(() => {
          musicBlocked = false;
          updateMusicButton();
        })
        .catch(() => {
          musicBlocked = true;
          updateMusicButton();
        });
    }
  };

  window.addEventListener("pointerdown", tryPlayOnGesture, { once: true });

  bgMusic.addEventListener("play", () => {
    localStorage.setItem(MUSIC_PLAYING_KEY, "true");
    if (!musicTimeInterval) {
      musicTimeInterval = setInterval(() => {
        localStorage.setItem(MUSIC_TIME_KEY, String(bgMusic.currentTime));
      }, 1000);
    }
  });

  bgMusic.addEventListener("pause", () => {
    localStorage.setItem(MUSIC_PLAYING_KEY, "false");
    localStorage.setItem(MUSIC_TIME_KEY, String(bgMusic.currentTime));
    if (musicTimeInterval) {
      clearInterval(musicTimeInterval);
      musicTimeInterval = null;
    }
  });

  window.addEventListener("beforeunload", () => {
    localStorage.setItem(MUSIC_TIME_KEY, String(bgMusic.currentTime));
    localStorage.setItem(MUSIC_PLAYING_KEY, bgMusic.paused ? "false" : "true");
  });
}

if (musicToggle && bgMusic) {
  musicToggle.addEventListener("click", () => {
    if (bgMusic.paused) {
      bgMusic
        .play()
        .then(() => {
          localStorage.setItem(MUSIC_KEY, "true");
          musicBlocked = false;
          updateMusicButton();
        })
        .catch(() => {
          musicBlocked = true;
          updateMusicButton();
        });
    } else {
      bgMusic.pause();
      localStorage.setItem(MUSIC_KEY, "false");
      updateMusicButton();
    }
  });
}

if (yesBtn) {
  yesBtn.addEventListener("click", () => {
    window.location.href = "options.html";
  });
}

if (noBtn) {
  const moveNoButton = () => {
    const maxX = window.innerWidth - noBtn.offsetWidth - 20;
    const maxY = window.innerHeight - noBtn.offsetHeight - 20;
    const nextX = Math.max(10, Math.random() * maxX);
    const nextY = Math.max(10, Math.random() * maxY);
    noBtn.style.position = "fixed";
    noBtn.style.left = `${nextX}px`;
    noBtn.style.top = `${nextY}px`;
  };

  noBtn.addEventListener("mouseenter", moveNoButton);
  noBtn.addEventListener("click", () => {
    const lang = localStorage.getItem("language") || "en";
    const message = translations[lang]?.tryAgain || translations.en.tryAgain;
    window.alert(message);
    moveNoButton();
  });
}

const gameArea = document.getElementById("gameArea");
const catcher = document.getElementById("catcher");
const startGameBtn = document.getElementById("startGameBtn");
const pauseGameBtn = document.getElementById("pauseGameBtn");
const restartGameBtn = document.getElementById("restartGameBtn");
const gameScore = document.getElementById("gameScore");
const gameLives = document.getElementById("gameLives");
const gameOver = document.getElementById("gameOver");
const finalScore = document.getElementById("finalScore");
const soundToggle = document.getElementById("soundToggle");
const gameOverMessage = document.querySelector("[data-i18n='gameOverMessage']");
const gameOverTitle = document.querySelector("[data-i18n='gameOverTitle']");

if (
  gameArea &&
  catcher &&
  startGameBtn &&
  pauseGameBtn &&
  gameScore &&
  gameLives &&
  gameOver &&
  finalScore &&
  soundToggle &&
  gameOverMessage &&
  gameOverTitle
) {
  let score = 0;
  let lives = 3;
  let running = false;
  let paused = false;
  let spawnTimer = null;
  let animationId = null;
  const items = new Set();

  const types = [
    { emoji: "❤️", points: 1, className: "item-heart" },
    { emoji: "💋", points: 5, className: "item-kiss" },
    { emoji: "😈", points: -3, className: "item-avoid" },
  ];

  const playTone = (frequency, duration) => {
    if (!soundToggle.checked) {
      return;
    }
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.frequency.value = frequency;
    oscillator.type = "sine";
    gainNode.gain.value = 0.08;
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.start();
    setTimeout(() => {
      oscillator.stop();
      audioContext.close();
    }, duration);
  };

  const setScore = (nextScore) => {
    score = nextScore;
    gameScore.textContent = String(score);
  };

  const setLives = (nextLives) => {
    lives = nextLives;
    gameLives.textContent = String(lives);
  };

  let spawnInterval = 700;

  const centerCatcher = () => {
    const maxX = gameArea.clientWidth - catcher.offsetWidth;
    catcher.style.left = `${Math.max(0, maxX / 2)}px`;
  };

  const resetGame = () => {
    items.forEach((item) => item.element.remove());
    items.clear();
    setScore(0);
    setLives(3);
    gameOver.classList.add("is-hidden");
    paused = false;
    pauseGameBtn.textContent = translations[languageSelect?.value || savedLanguage]?.pauseGame || "Pause";
    spawnInterval = 700;
    centerCatcher();
  };

  const createItem = () => {
    const progress = Math.min(1, score / 200);
    const avoidChance = 0.3 + progress * 0.4;
    const rand = Math.random();
    const type =
      rand < avoidChance
        ? types[2]
        : rand < avoidChance + 0.2
          ? types[1]
          : types[0];
    const element = document.createElement("div");
    element.className = `falling-item ${type.className}`;
    element.textContent = type.emoji;
    gameArea.appendChild(element);

    const maxX = gameArea.clientWidth - 30;
    const x = Math.random() * Math.max(10, maxX);
    element.style.left = `${x}px`;

    const speedBoost = Math.min(1.8, score / 120);
    items.add({
      element,
      y: -20,
      speed: 1.5 + Math.random() * 1.5 + speedBoost,
      type,
    });
  };

  const startSpawner = () => {
    if (spawnTimer) {
      clearInterval(spawnTimer);
    }
    spawnTimer = setInterval(createItem, spawnInterval);
  };

  const moveCatcher = (clientX) => {
    const rect = gameArea.getBoundingClientRect();
    const x = clientX - rect.left;
    const maxX = rect.width - catcher.offsetWidth;
    const nextX = Math.min(Math.max(0, x - catcher.offsetWidth / 2), maxX);
    catcher.style.left = `${nextX}px`;
  };

  const moveCatcherBy = (deltaX) => {
    const currentLeft = catcher.offsetLeft;
    const maxX = gameArea.clientWidth - catcher.offsetWidth;
    const nextX = Math.min(Math.max(0, currentLeft + deltaX), maxX);
    catcher.style.left = `${nextX}px`;
  };

  let keyMoveLeft = false;
  let keyMoveRight = false;
  let keyMoveId = null;
  const keyMoveSpeed = 7;

  const stepKeyMove = () => {
    if (!running || paused) {
      keyMoveId = null;
      return;
    }
    if (keyMoveLeft) {
      moveCatcherBy(-keyMoveSpeed);
    }
    if (keyMoveRight) {
      moveCatcherBy(keyMoveSpeed);
    }
    keyMoveId = requestAnimationFrame(stepKeyMove);
  };

  const update = () => {
    const catcherRect = catcher.getBoundingClientRect();
    items.forEach((item) => {
      item.y += item.speed;
      item.element.style.top = `${item.y}px`;

      const itemRect = item.element.getBoundingClientRect();
      const hit =
        itemRect.bottom >= catcherRect.top &&
        itemRect.top <= catcherRect.bottom &&
        itemRect.left <= catcherRect.right &&
        itemRect.right >= catcherRect.left;

    if (hit) {
        if (item.type.emoji === "😈") {
          const nextLives = Math.max(0, lives - 1);
          setLives(nextLives);
          setScore(Math.max(0, score + item.type.points));
          playTone(180, 180);
          const popup = document.createElement("div");
          popup.className = "score-popup score-popup-negative";
          popup.textContent = "-1";
          popup.style.left = `${item.element.offsetLeft}px`;
          popup.style.top = `${item.y}px`;
          gameArea.appendChild(popup);
          setTimeout(() => popup.remove(), 700);
          if (nextLives <= 0) {
          endGame("lose");
          }
        } else {
          setScore(Math.max(0, score + item.type.points));
          playTone(item.type.emoji === "💋" ? 700 : 520, 120);
          const popup = document.createElement("div");
          popup.className = "score-popup";
          popup.textContent = item.type.emoji === "💋" ? "+5" : "+1";
          popup.style.left = `${item.element.offsetLeft}px`;
          popup.style.top = `${item.y}px`;
          gameArea.appendChild(popup);
          setTimeout(() => popup.remove(), 700);
        }
      if (score >= 200) {
        endGame("win");
      }
        item.element.remove();
        items.delete(item);
        return;
      }

      if (item.y > gameArea.clientHeight + 40) {
        item.element.remove();
        items.delete(item);
      }
    });

    if (running) {
      animationId = requestAnimationFrame(update);
    }
  };

  const startGame = () => {
    if (running) {
      return;
    }
    running = true;
    paused = false;
    resetGame();
    startGameBtn.disabled = true;
    pauseGameBtn.disabled = false;
    if (restartGameBtn) {
      restartGameBtn.disabled = true;
    }
    startSpawner();
    animationId = requestAnimationFrame(update);
  };

  const stopGame = () => {
    running = false;
    startGameBtn.disabled = false;
    pauseGameBtn.disabled = true;
    if (restartGameBtn) {
      restartGameBtn.disabled = false;
    }
    if (spawnTimer) {
      clearInterval(spawnTimer);
      spawnTimer = null;
    }
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  };

  const endGame = (result) => {
    stopGame();
    finalScore.textContent = String(score);
    const lang = languageSelect?.value || savedLanguage;
    const strings = translations[lang] || translations.en;
    const title =
      result === "win" ? strings.winTitle || "You win" : strings.gameOverTitle;
    gameOverTitle.textContent = title;
    gameOverMessage.textContent =
      result === "win" ? strings.gameOverMessage : strings.gameOverLose;
    gameOver.classList.remove("is-hidden");
    playTone(220, 250);
  };

  const pauseGame = () => {
    if (!running || paused) {
      return;
    }
    paused = true;
    if (spawnTimer) {
      clearInterval(spawnTimer);
      spawnTimer = null;
    }
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
    pauseGameBtn.textContent = translations[languageSelect?.value || savedLanguage]?.resumeGame || "Resume";
  };

  const resumeGame = () => {
    if (!running || !paused) {
      return;
    }
    paused = false;
    startSpawner();
    animationId = requestAnimationFrame(update);
    pauseGameBtn.textContent = translations[languageSelect?.value || savedLanguage]?.pauseGame || "Pause";
  };

  startGameBtn.addEventListener("click", startGame);
  pauseGameBtn.addEventListener("click", () => {
    if (paused) {
      resumeGame();
    } else {
      pauseGame();
    }
  });
  window.addEventListener("keydown", (event) => {
    if (!running || paused) {
      return;
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      keyMoveLeft = true;
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      keyMoveRight = true;
    }
    if (!keyMoveId && (keyMoveLeft || keyMoveRight)) {
      keyMoveId = requestAnimationFrame(stepKeyMove);
    }
  });

  window.addEventListener("keyup", (event) => {
    if (event.key === "ArrowLeft") {
      keyMoveLeft = false;
    }
    if (event.key === "ArrowRight") {
      keyMoveRight = false;
    }
  });
  if (restartGameBtn) {
    restartGameBtn.addEventListener("click", startGame);
  }
  window.addEventListener("blur", stopGame);
  window.addEventListener("resize", centerCatcher);
  centerCatcher();
}
