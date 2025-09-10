// ==========================
// 1. Ambil elemen dari HTML
// ==========================
const english = document.getElementsByClassName("english");
const indonesia = document.getElementsByClassName("indonesia");
const alertBetul = document.querySelector(".alert-betul");
const alertSalah = document.querySelector(".alert-salah");
const rightSound = document.querySelector(".right-sound");
const wrongSound = document.querySelector(".wrong-sound");
const timeElement = document.querySelector(".remain-time");
const hitungMundur = document.querySelector(".hitung-mundur");

// ==========================
// 2. Variabel skor + LocalStorage
// ==========================
let userScore = 0;

// ambil skor dari localStorage kalau ada
if (localStorage.getItem("userScore")) {
  userScore = parseInt(localStorage.getItem("userScore"));
  document.querySelector(".user-score").innerHTML = userScore;
}

function updateScore(point) {
  const scoreElement = document.querySelector(".user-score");
  userScore += point;
  scoreElement.innerHTML = userScore;

  // simpan ke localStorage
  localStorage.setItem("userScore", userScore);
}

// ==========================
// 3. Level management + LocalStorage
// ==========================
let currentLevel = 1;

// ambil level dari localStorage kalau ada
if (localStorage.getItem("currentLevel")) {
  currentLevel = parseInt(localStorage.getItem("currentLevel"));
}

// fungsi untuk set level dan simpan
function setLevel(level) {
  currentLevel = level;
  localStorage.setItem("currentLevel", currentLevel);
}

// ambil semua item (English + Indonesia) di level tertentu
function getAllItems() {
  return document.querySelectorAll(
    `.game.${getLevelName(currentLevel)} .english,
     .game.${getLevelName(currentLevel)} .indonesia`
  );
}

// reset ulang kondisi elemen di level tertentu

function resetLevel(level) {
  document
    .querySelectorAll(
      `.game.${getLevelName(level)} .english,
       .game.${getLevelName(level)} .indonesia`
    )
    .forEach((el) => {
      el.style.display = "block";
      el.classList.remove("border", "shake");
      el.setAttribute("draggable", true);
    });
}

// ==========================
// 4. Skor hanya sekali per pasangan
// ==========================
let scoredPairs = JSON.parse(localStorage.getItem("scoredPairs")) || {};
function saveScoredpairs() {
  localStorage.setItem("scoredPairs", JSON.stringify(scoredPairs));
}
function markPair(level, pairKey) {
  if (!scoredPairs[level]) {
    scoredPairs[level] = [];
  }
  if (!scoredPairs[level].includes(pairKey)) {
    scoredPairs[level].push(pairKey);
    saveScoredpairs();
  }
}
function hasPairScored(level, pairKey) {
  return scoredPairs[level] && scoredPairs[level].includes(pairKey);
}

// ==========================
// 5. Tombol Play Again
// ==========================
const playAgainBtn = document.querySelector(".play-again");
playAgainBtn.addEventListener("click", (e) => {
  e.preventDefault();
  gameOver.style.display = "none";

  showLevel(currentLevel);
  resetLevel(currentLevel);

  clearInterval(countdown);
  timeLeft = 2 * 60;
  startTimer();

  getAllItems().forEach((el) => {
    el.style.display = "block";
    el.classList.remove("border", "shake");
    el.setAttribute("draggable", true);
  });
});

// ==========================
// 6. Fungsi untuk menampilkan level
// ==========================
function showLevel(level) {
  document.querySelectorAll(".game").forEach((g) => (g.style.display = "none"));

  let game = document.querySelector(`.game.${getLevelName(level)}`);
  if (game) {
    game.style.display = "block";
  }

  document
    .querySelectorAll(
      `.game.${getLevelName(currentLevel)} .english, 
       .game.${getLevelName(currentLevel)} .indonesia`
    )
    .forEach((el) => {
      el.style.display = "block";
      el.classList.remove("border", "shake");
      el.setAttribute("draggable", true);
    });
}

// mapping angka level ke nama class
function getLevelName(level) {
  switch (level) {
    case 1:
      return "satu";
    case 2:
      return "dua";
    case 3:
      return "tiga";
    case 4:
      return "empat";
    case 5:
      return "lima";
    case 6:
      return "enam";
    case 7:
      return "tujuh";
    case 8:
      return "delapan";
    case 9:
      return "sembilan";
    case 10:
      return "sepuluh";
    case 11:
      return "sebelas";
    case 12:
      return "duabelas";
    case 13:
      return "tigabelas";
    case 14:
      return "empatbelas";
    case 15:
      return "limabelas";
    case 16:
      return "enambelas";
    case 17:
      return "tujuhbelas";
    case 18:
      return "delapanbelas";
    case 19:
      return "sembilanbelas";
    case 20:
      return "duapuluh";
    default:
      return "";
  }
}

// ==========================
// 7. Cek kemenangan level
// ==========================

function checkWin() {
  const englishVisible = Array.from(document.querySelectorAll(".game." + getLevelName(currentLevel) + " .english")).some((el) => el.offsetParent !== null);

  const indonesiaVisible = Array.from(document.querySelectorAll(".game." + getLevelName(currentLevel) + " .indonesia")).some((el) => el.offsetParent !== null);

  if (!englishVisible && !indonesiaVisible) {
    setTimeout(() => {
      alert("🎉 Selamat anda berhasil menyelesaikan level " + currentLevel + "!");

      // naikkan level + simpan ke localStorage
      let nextLevel = currentLevel + 1;
      setLevel(nextLevel);

      if (currentLevel <= 20) {
        showLevel(currentLevel); // currentLevel sudah diupdate oleh setLevel()
        clearInterval(countdown);
        timeLeft = 2 * 60;
        startTimer();
      } else {
        // alert("🎉 Semua level selesai! Game clear!");
        window.location.href = "sertifikat/sertifikat.html";
        localStorage(clear);
        clearInterval(countdown);
      }
    }, 500);
  }
}

// ==========================
// 8. Drag & Drop + Touch Support
// ==========================

let selected = null;
let allItems = document.querySelectorAll(".english, .indonesia");

allItems.forEach((item) => {
  item.addEventListener("dragstart", function () {
    selected = this;
  });
});

allItems.forEach((target) => {
  target.addEventListener("dragover", function (e) {
    e.preventDefault();
    this.classList.add("border");
  });

  target.addEventListener("dragleave", function (e) {
    e.preventDefault();
    this.classList.remove("border");
  });

  target.addEventListener("drop", function (e) {
    e.preventDefault();

    if (!selected || selected === this) {
      this.classList.remove("border");
      return;
    }

    let isSelectedIndo = selected.classList.contains("indonesia");
    let isSelectedEng = selected.classList.contains("english");
    let isTargetIndo = this.classList.contains("indonesia");
    let isTargetEng = this.classList.contains("english");

    let match = false;

    if (isSelectedIndo && isTargetEng) {
      let indonesiaItem = selected.dataset.indonesia.toLowerCase();
      let englishItem = this.dataset.english.toLowerCase();
      match = indonesiaItem === englishItem;
    }

    if (isSelectedEng && isTargetIndo) {
      let englishItem = selected.dataset.english.toLowerCase();
      let indonesiaItem = this.dataset.indonesia.toLowerCase();
      match = englishItem === indonesiaItem;
    }

    if (match) {
      let pairKey = isSelectedEng ? selected.dataset.english + "-" + this.dataset.indonesia : selected.dataset.indonesia + "-" + this.dataset.english;

      if (!hasPairScored(currentLevel, pairKey)) {
        updateScore(100);
        markPair(currentLevel, pairKey);
      }

      this.style.display = "none";
      selected.style.display = "none";

      rightSound.play();

      setTimeout(() => {
        alertBetul.style.display = "block";
      }, 100);

      setTimeout(() => {
        alertBetul.style.display = "none";
        checkWin();
      }, 3000);
    } else {
      this.classList.add("shake");
      wrongSound.play();
      setTimeout(() => {
        alertSalah.style.display = "block";
      }, 500);

      setTimeout(() => {
        alertSalah.style.display = "none";
      }, 2000);
      this.addEventListener(
        "animationend",
        () => {
          this.classList.remove("shake");
        },
        { once: true }
      );

      updateScore(-50);
    }

    this.classList.remove("border");
    selected = null;
  });
});

// ==========================
// 9. TIMER
// ==========================
let timeLeft = 2 * 60;
let countdown;
const timerElement = document.querySelector(".timer");
const gameOver = document.querySelector(".game-over");
let gameEnded = false;

function startTimer() {
  countdown = setInterval(() => {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    if (seconds < 10) seconds = "0" + seconds;

    timerElement.innerHTML = `${minutes}:${seconds}`;

    if (timeLeft <= 0) {
      clearInterval(countdown);
      gameOver.style.display = "flex";

      allItems.forEach((item) => {
        item.setAttribute("draggable", false);
      });
      timeElement.classList.remove("blink");
      hitungMundur.pause();
    } else if (timeLeft <= 4) {
      allItems.forEach((item) => {
        item.setAttribute("draggable", false);
      });
    } else if (timeLeft <= 5) {
      timeElement.classList.add("blink");
      hitungMundur.play();
    } else {
      timeElement.classList.remove("blink");
    }

    timeLeft--;
  }, 1000);
}
startTimer();

// ==========================
// 10. Tombol Reset Game (Opsional)
// ==========================
const resetBtn = document.querySelector(".reset-game");
if (resetBtn) {
  resetBtn.addEventListener("click", () => {
    localStorage.setItem("userScore");
    localStorage.setItem("currentLevel");
    localStorage.setItem("scoredPairs");
    location.reload();
  });
}

// ==========================
// Inisialisasi saat halaman dimuat
// ==========================
function init() {
  // pastikan nilai dari localStorage valid (angka) dan dibatasi
  const maxLevel = 20;
  if (!currentLevel || isNaN(currentLevel) || currentLevel < 1) currentLevel = 1;
  if (currentLevel > maxLevel) currentLevel = maxLevel;

  // tampilkan level sesuai currentLevel yang kita baca dari localStorage
  showLevel(currentLevel);

  // reset kondisi elemen di level itu (tampilkan semua item pada level)
  resetLevel(currentLevel);

  // tampilkan skor tersimpan (jika sudah diambil sebelumnya)
  document.querySelector(".user-score").innerHTML = userScore;
}

init();
