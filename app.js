
const questions = [
  {
    question: "What does HTML stand for?",
    options: [
      "Hyper Trainer Marking Language",
      "Hyper Text Markup Language",
      "High Text Marking Language",
      "Hyperlinks and Text Markup Language"
    ],
    answerIndex: 1
  },
  {
    question: "Which language runs in a web browser?",
    options: ["C", "Java", "Python", "JavaScript"],
    answerIndex: 3
  },
  {
    question: "What does CSS stand for?",
    options: [
      "Colorful Style Syntax",
      "Computer Style Sheets",
      "Cascading Style Sheets",
      "Creative Style System"
    ],
    answerIndex: 2
  },
  {
    question: "Which of these is NOT a JavaScript data type?",
    options: ["Number", "String", "Boolean", "Character"],
    answerIndex: 3
  },
  {
    question: "Which method adds an element to the end of an array in JS?",
    options: ["push()", "unshift()", "pop()", "shift()"],
    answerIndex: 0
  }
];

// 2) State
let currentIndex = 0;
let score = 0;

// 3) DOM Elements
const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const feedbackEl = document.getElementById("feedback");
const nextBtn = document.getElementById("nextBtn");
const restartBtn = document.getElementById("restartBtn");
const progressText = document.getElementById("progressText");
const progressFill = document.getElementById("progressFill");
const quizCard = document.getElementById("quizCard");

// 4) Initialization
init();

function init() {
  currentIndex = 0;
  score = 0;
  nextBtn.disabled = true;
  restartBtn.classList.add("hidden");
  renderQuestion();
  updateProgress();
  nextBtn.addEventListener("click", handleNext);
  restartBtn.addEventListener("click", handleRestart);
}

// 5) Render current question + options
function renderQuestion() {
  const q = questions[currentIndex];
  questionEl.textContent = q.question;
  optionsEl.innerHTML = "";
  feedbackEl.textContent = "";
  feedbackEl.className = "feedback";
  nextBtn.disabled = true;

  q.options.forEach((opt, idx) => {
    const btn = document.createElement("button");
    btn.className = "btn option-btn";
    btn.textContent = opt;
    btn.setAttribute("data-idx", idx);
    btn.addEventListener("click", () => handleAnswer(idx, btn));
    optionsEl.appendChild(btn);
  });
}

// 6) Handle answer selection -> give instant feedback
function handleAnswer(selectedIdx, selectedBtn) {
  const correctIdx = questions[currentIndex].answerIndex;

  // Disable all buttons after first selection
  const allBtns = optionsEl.querySelectorAll(".option-btn");
  allBtns.forEach(b => b.disabled = true);

  if (selectedIdx === correctIdx) {
    selectedBtn.classList.add("correct");
    feedbackEl.textContent = "✅ Correct!";
    feedbackEl.classList.add("ok");
    score++;
  } else {
    selectedBtn.classList.add("wrong");
    feedbackEl.textContent = "❌ Wrong!";
    feedbackEl.classList.add("err");
    // highlight the correct one
    const correctBtn = [...allBtns].find(b => Number(b.dataset.idx) === correctIdx);
    if (correctBtn) correctBtn.classList.add("correct");
  }

  nextBtn.disabled = false; // allow moving forward
}

// 7) Next question or show results
function handleNext() {
  currentIndex++;
  if (currentIndex < questions.length) {
    renderQuestion();
    updateProgress();
  } else {
    showResults();
  }
}

// 8) Progress bar + text
function updateProgress() {
  const total = questions.length;
  const current = currentIndex + 1;
  progressText.textContent = `Question ${current} of ${total}`;
  const pct = (currentIndex / total) * 100;
  progressFill.style.width = `${pct}%`;
}

// 9) Show results screen
function showResults() {
  const total = questions.length;
  const summary = document.createElement("div");
  summary.innerHTML = `
    <h2>Quiz Finished 🎉</h2>
    <p>Your score: <strong>${score}</strong> / ${total}</p>
    <p>${score === total ? "Excellent! 🏆" : score >= Math.ceil(total/2) ? "Good job! 👍" : "Keep practicing! 💪"}</p>
  `;

  // Replace question + options with summary
  questionEl.textContent = "Results";
  optionsEl.innerHTML = "";
  feedbackEl.textContent = "";
  quizCard.insertBefore(summary, feedbackEl);

  nextBtn.classList.add("hidden");
  restartBtn.classList.remove("hidden");

  // Fill progress bar to 100% at the end
  progressFill.style.width = "100%";
  progressText.textContent = `Completed • ${score}/${total}`;
}

// 10) Restart quiz
function handleRestart() {
  // reset UI
  const summary = quizCard.querySelector("div");
  if (summary) summary.remove();
  nextBtn.classList.remove("hidden");
  init();
}
