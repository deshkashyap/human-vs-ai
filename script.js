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

      <h2>🏆 Cognitive Intelligence Result</h2>

      <h3>Winner: ${winner}</h3>

      <div class="score-container">

        <div>
          <h3>🧠 Human</h3>
          <div class="score">${humanScore}/100</div>
        </div>

        <div>
          <h3>🤖 AI</h3>
          <div class="score">${aiScore}/100</div>
        </div>

      </div>

      <hr>

      <h3>📊 Cognitive Analysis</h3>

      <p><strong>Accuracy:</strong> ${accuracy}/100</p>

      <p><strong>Reasoning:</strong> ${reasoningScore}/100</p>

      <p><strong>Creativity:</strong> ${creativity}/100</p>

      <h3>🤖 AI Evaluation</h3>

      <p>${analysis}</p>

      <br>

      <button onclick="nextChallenge()">
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
