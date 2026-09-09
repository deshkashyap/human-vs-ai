// ==========================================
// HUMAN vs AI — Cognitive Challenge Engine
// ==========================================

const challenges = [
  {
    category: "Logic",
    question:
      "A farmer has 17 sheep. All but 9 run away. How many sheep are left?",
    answer: "9",
    explanation:
      "The phrase 'all but 9' means 9 sheep remain."
  },
  {
    category: "Pattern",
    question:
      "What comes next? 2, 6, 12, 20, 30, ?",
    answer: "42",
    explanation:
      "The differences are 4, 6, 8, 10, so the next difference is 12. Therefore 30 + 12 = 42."
  },
  {
    category: "Reasoning",
    question:
      "If all BLOPS are RINGS and some RINGS are BLUE, can we conclude that some BLOPS are BLUE?",
    answer: "no",
    explanation:
      "We know BLOPS are RINGS, but we do not know whether those BLOPS belong to the BLUE group."
  }
];

let currentChallenge = 0;
let startTime = 0;
let score = 0;


// ------------------------------------------
// Start Challenge
// ------------------------------------------

function startChallenge() {
  currentChallenge = 0;
  score = 0;
  showChallenge();
}


// ------------------------------------------
// Display Challenge
// ------------------------------------------

function showChallenge() {

  const challenge = challenges[currentChallenge];

  const arena = document.getElementById("arena");

  arena.innerHTML = `
    <div class="section-title">
      <div class="badge">🧠 CHALLENGE ${currentChallenge + 1}/${challenges.length}</div>

      <h2>${challenge.category}</h2>

      <p>
        Think carefully. Your reasoning matters.
      </p>
    </div>

    <div class="card" style="
      max-width:850px;
      margin:auto;
      text-align:center;
    ">

      <div class="icon">🧩</div>

      <h3 style="font-size:25px;margin-bottom:25px;">
        ${challenge.question}
      </h3>

      <input
        id="userAnswer"
        type="text"
        placeholder="Enter your answer..."
        style="
          width:100%;
          max-width:600px;
          padding:16px;
          border-radius:12px;
          border:1px solid rgba(255,255,255,.15);
          background:#080c20;
          color:white;
          outline:none;
          font-size:16px;
        "
      >

      <br><br>

      <textarea
        id="reasoning"
        placeholder="Explain your reasoning..."
        style="
          width:100%;
          max-width:600px;
          min-height:120px;
          padding:16px;
          border-radius:12px;
          border:1px solid rgba(255,255,255,.15);
          background:#080c20;
          color:white;
          outline:none;
          font-size:16px;
          resize:vertical;
        "
      ></textarea>

      <br><br>

      <button class="primary" onclick="submitAnswer()">
        Submit Challenge →
      </button>

      <p id="timer"
        style="
          margin-top:20px;
          color:#8e95b1;
        ">
        ⏱️ Time: 0s
      </p>

    </div>
  `;

  startTime = Date.now();

  startTimer();
}


// ------------------------------------------
// Timer
// ------------------------------------------

let timerInterval;

function startTimer() {

  clearInterval(timerInterval);

  timerInterval = setInterval(() => {

    const seconds =
      Math.floor((Date.now() - startTime) / 1000);

    const timer = document.getElementById("timer");

    if (timer) {
      timer.textContent = `⏱️ Time: ${seconds}s`;
    }

  }, 1000);
}


// ------------------------------------------
// Submit Answer
// ------------------------------------------

async function submitAnswer() {

  clearInterval(timerInterval);

  const userAnswer =
    document.getElementById("userAnswer").value.trim();

  const reasoning =
    document.getElementById("reasoning").value.trim();

  if (!userAnswer) {
    alert("Please enter your answer.");
    return;
  }

  if (!reasoning) {
    alert("Please explain your reasoning.");
    return;
  }

  const challenge = challenges[currentChallenge];

  const resultArea = document.getElementById("result");

  if (resultArea) {
    resultArea.innerHTML = `
      <div class="result-box">
        <h2>🤖 AI is analyzing...</h2>
        <p>Comparing human reasoning with AI intelligence.</p>
      </div>
    `;
  }

  try {

    const response = await fetch(
      "https://human-vs-ai-flame.vercel.app/api/evaluate",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          question: challenge.question,
          humanAnswer: userAnswer,
          reasoning: reasoning
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "AI evaluation failed");
    }

    console.log("AI Evaluation:", data);

    showResult(
      data.humanScore,
      data.aiScore,
      data.accuracy,
      data.reasoning,
      data.creativity,
      data.analysis,
      data.winner
    );

  } catch (error) {

    console.error(error);

    if (resultArea) {
      resultArea.innerHTML = `
        <div class="result-box">
          <h2>⚠️ AI Evaluation Failed</h2>
          <p>${error.message}</p>
          <p>Please try again.</p>
        </div>
      `;
    }
  }
}

// ------------------------------------------
// Result
// ------------------------------------------

function showResult(
  humanScore,
  aiScore,
  accuracy,
  reasoningScore,
  creativity,
  analysis,
  winner
) {

  const arena = document.getElementById("arena");

  arena.innerHTML = `
    <div class="result-box">

      <h1>🏆 Cognitive Intelligence Report</h1>

      <h2>${winner === "HUMAN" ? "🧠 HUMAN WINS" :
            winner === "AI" ? "🤖 AI WINS" :
            "⚔️ DRAW"}</h2>

      <p>Challenge performance analyzed by AI.</p>

      <div class="score-container">

        <div class="score-card">
          <div class="icon">🧠</div>
          <h2>Human Performance</h2>
          <div class="big-score">${humanScore}</div>

          <p>Accuracy: ${accuracy}%</p>
          <p>Reasoning: ${reasoningScore}/100</p>
          <p>Creativity: ${creativity}/100</p>
        </div>

        <div class="score-card">
          <div class="icon">🤖</div>
          <h2>AI Performance</h2>
          <div class="big-score">${aiScore}</div>

          <p>AI cognitive benchmark</p>
          <p>Accuracy comparison</p>
          <p>Reasoning comparison</p>
        </div>

      </div>

      <div class="analysis-card">

        <h2>🧠 AI Cognitive Analysis</h2>

        <p>${analysis}</p>

      </div>

      <div class="winner-card">

        <h2>⚡ Final Verdict</h2>

        <p>
          Human Score: <strong>${humanScore}</strong>
          &nbsp; vs &nbsp;
          AI Score: <strong>${aiScore}</strong>
        </p>

        <h2>${winner}</h2>

      </div>

      <br>

      <button class="primary" onclick="nextChallenge()">
        Next Challenge →
      </button>

    </div>
  `;
}
// ------------------------------------------
// Next Challenge
// ------------------------------------------

function nextChallenge() {

  currentChallenge++;

  showChallenge();
}
