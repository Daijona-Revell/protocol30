// HARD PUZZLES + HINTS + CHECKMARK TAGS
const puzzles = [
  {
    id: 1,
    title: "System Boot Cipher",
    text: "A corrupted boot log shows: 5, 8, 13, 21, 34, ?. Enter the missing number.",
    answer: "55",
    hint: "It’s a famous sequence where each number is the sum of the previous two.",
    tag: false,
  },
  {
    id: 2,
    title: "Encrypted Directive",
    text: "Decode the directive: 12-5-22-5-12 (A=1). Enter the resulting word.",
    answer: "level",
    hint: "Convert numbers to letters.",
    tag: true,
  },
  {
    id: 3,
    title: "Neural Pattern Sync",
    text: "The system displays: A1, C3, F6, J10, O15, ?. Enter the next alphanumeric pair.",
    answer: "U21",
    hint: "Letters jump by increasing intervals. Numbers follow a pattern too.",
    tag: false,
  },
  {
    id: 4,
    title: "Temporal Drift Test",
    text: "A security sweep runs every 90 minutes starting at 14:30. During a lockdown, the system flags the 6th sweep as critical. At what time does the 6th sweep occur? (Format xx:xx)",
    answer: "22:00",
    hint: "Each sweep is 90 minutes apart. Track each jump carefully.",
    tag: false,
  },
  {
    id: 5,
    title: "Milestone Riddle",
    text: "I mark a turning point, a decade times three. A celebrated number—what could I be?",
    answer: "30",
    hint: "Think in decades, not single years.",
    tag: true,
  },
  {
    id: 6,
    title: "Anomaly Detection",
    text: "In a security audit, the system flags one term as inconsistent with the others: ENCRYPT, SECURE, OBFUSCATE, EXPOSE. Which term does NOT belong?",
    answer: "expose",
    hint: "Three actions protect information. One does the opposite.",
    tag: false,
  },
  {
    id: 7,
    title: "Glitch Fragment",
    text: "2, 6, 12, 20, 30, ?. Enter the next number.",
    answer: "42",
    hint: "Differences increase by 2 each time.",
    tag: false,
  },
  {
    id: 8,
    title: "Memory Reconstruction",
    text: "E N U O L K C D",
    answer: "unlocked",
    hint: "Rearrange the letters.",
    tag: true,
  },
  {
    id: 9,
    title: "Identity Verification",
    text: "Enter the sum of the digits in this system ID: 3-0-0-1-9.",
    answer: "13",
    hint: "Add them together.",
    tag: false,
  },
  {
    id: 10,
    title: "Final Calibration",
    text: "(3 × 10) + (2 × 6) + (1 × 0)",
    answer: "42",
    hint: "Multiply then add.",
    tag: false,
  },
];

let currentPuzzleIndex = 0;

// ⭐ NEW: Stores user answers so they persist when going back
let savedAnswers = {};

// ⭐ NEW: Track incorrect attempts on access screen
let accessAttempts = 0;

// ===============================
// INSTRUCTIONS MODAL LOGIC
// ===============================
const infoBtn = document.getElementById("infoBtn");
const instructionsModal = document.getElementById("instructionsModal");
const closeInstructions = document.getElementById("closeInstructions");

if (infoBtn) {
  infoBtn.onclick = () => {
    instructionsModal.classList.remove("hidden");
  };
}

if (closeInstructions) {
  closeInstructions.onclick = () => {
    instructionsModal.classList.add("hidden");
  };
}

// SCREEN NAVIGATION
function goToScreen(id) {
  document
    .querySelectorAll(".screen")
    .forEach((s) => s.classList.remove("active"));
  const screen = document.getElementById(id);
  screen.classList.add("active");

  // ⭐ Hide info button on Welcome + Reveal
  const infoBtn = document.getElementById("infoBtn");
  if (id === "screen-awaken" || id === "screen-reveal") {
    if (infoBtn) infoBtn.style.display = "none";
  } else {
    if (infoBtn) infoBtn.style.display = "inline-block";
  }

  if (id === "screen-assessment") {
    loadPuzzle();
  }

  if (id === "screen-reveal") {
    requestAnimationFrame(() => {
      screen.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // ⭐ Show Back button on access screen + restart animation
  if (id === "screen-lockdown") {
    const btn = document.getElementById("accessBackBtn");
    btn.style.display = "inline-block";

    // restart animation
    btn.style.animation = "none";
    void btn.offsetWidth;
    btn.style.animation = "accessBackIn 0.6s ease forwards 0.4s";
  }
}

// LOAD PUZZLE (with restored answers)
function loadPuzzle() {
  const puzzle = puzzles[currentPuzzleIndex];

  document.getElementById(
    "puzzleTitle"
  ).textContent = `Puzzle ${puzzle.id}: ${puzzle.title}`;

  document.getElementById("puzzleText").textContent = puzzle.text;

  // Restore saved answer
  document.getElementById("puzzleAnswerInput").value =
    savedAnswers[currentPuzzleIndex] || "";

  document.getElementById("puzzleError").textContent = "";
  document.getElementById("hintText").textContent = "";
  document.getElementById("puzzleTag").textContent = puzzle.tag ? "✔️" : "";

  document.getElementById(
    "puzzleProgress"
  ).textContent = `Progress: ${puzzle.id} / ${puzzles.length}`;

  // ⭐ Hide Back button on Puzzle 1
  const backBtn = document.querySelector(".back-btn");
  if (currentPuzzleIndex === 0) {
    backBtn.style.display = "none";
  } else {
    backBtn.style.display = "inline-block";
  }
}

// SUBMIT ANSWER (with saving)
function submitPuzzleAnswer() {
  const puzzle = puzzles[currentPuzzleIndex];
  const input = document.getElementById("puzzleAnswerInput").value.trim();
  const error = document.getElementById("puzzleError");

  // ⭐ Save answer before checking
  savedAnswers[currentPuzzleIndex] = input;

  if (input.toLowerCase() === puzzle.answer.toLowerCase()) {
    error.textContent = "";
    currentPuzzleIndex++;

    if (currentPuzzleIndex < puzzles.length) {
      loadPuzzle();
    } else {
      goToScreen("screen-lockdown");
    }
  } else {
    error.textContent = "ACCESS DENIED: Incorrect puzzle answer.";
  }
}

// ⭐ BACK BUTTON
function goBack() {
  if (currentPuzzleIndex > 0) {
    currentPuzzleIndex--;
    loadPuzzle();
  }
}

// HINT
function showHint() {
  const puzzle = puzzles[currentPuzzleIndex];
  document.getElementById("hintText").textContent = puzzle.hint;
}

// ⭐ NEW: ACCESS SCREEN BACK BUTTON
function accessGoBack() {
  currentPuzzleIndex = puzzles.length - 1; // return to last puzzle
  goToScreen("screen-assessment");
}

// FINAL ACCESS KEY (with progressive hints)
function validateKey() {
  const input = document
    .getElementById("accessKeyInput")
    .value.trim()
    .toLowerCase();
  const error = document.getElementById("errorMsg");

  if (input === "level30unlocked") {
    error.textContent = "";
    goToScreen("screen-reveal");
  } else {
    accessAttempts++;

    // Base error
    error.textContent = "ACCESS DENIED: Invalid authorization key.";

    // ⭐ Trigger error shake animation
    error.classList.remove("shake");
    void error.offsetWidth;
    error.classList.add("shake");

    // ⭐ Hint 1 after first wrong attempt
    if (accessAttempts === 1) {
      const h1 = document.getElementById("accessHint1");
      h1.textContent =
        "Hint: Access code is not case sensitive and does not include spaces.";

      // restart animation
      h1.style.animation = "none";
      void h1.offsetWidth;
      h1.style.animation = "hintReveal 0.6s ease forwards";
    }

    // ⭐ Hint 2 after second wrong attempt
    if (accessAttempts === 2) {
      const h2 = document.getElementById("accessHint2");
      h2.textContent = "Hint: Notice the green check marks.";

      // restart animation
      h2.style.animation = "none";
      void h2.offsetWidth;
      h2.style.animation = "hintReveal 0.6s ease forwards";
    }
  }
}
