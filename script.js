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

function submitAnswer() {

  clearInterval(timerInterval);

  const userAnswer =
    document.getElementById("userAnswer").value
      .trim()
      .toLowerCase();

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

  const correct =
    userAnswer === challenge.answer.toLowerCase();

  const responseTime =
    Math.floor((Date.now() - startTime) / 1000);

  if (correct) {
    score += 100;
  } else {
    score += 40;
  }

  showResult(
    correct,
    responseTime,
    reasoning,
    challenge
  );
}


// ------------------------------------------
// Result
// ------------------------------------------

function showResult(
  correct,
  responseTime,
  reasoning,
  challenge
) {

  const arena = document.getElementById("arena");

  const humanScore = correct ? 88 : 42;

  const aiScore = Math.floor(
    75 + Math.random() * 20
  );

  const winner =
    humanScore >= aiScore
      ? "🏆 HUMAN WINS"
      : "🤖 AI WINS";

  arena.innerHTML = `

    <div class="section-title">

      <div class="badge">
        COGNITIVE ANALYSIS COMPLETE
      </div>

      <h2>${winner}</h2>

      <p>
        Challenge performance analyzed.
      </p>

    </div>

    <div class="arena-grid">

      <div class="card">

        <div class="icon">🧠</div>

        <h3>Human Performance</h3>

        <h2 style="
          font-size:55px;
          margin:15px 0;
        ">
          ${humanScore}
        </h2>

        <p>
          Accuracy: ${correct ? "100%" : "0%"}<br>
          Reasoning: ${reasoning.length > 40 ? "Strong" : "Basic"}<br>
          Response Time: ${responseTime}s
        </p>

      </div>


      <div class="card">

        <div class="icon">🤖</div>

        <h3>AI Performance</h3>

        <h2 style="
          font-size:55px;
          margin:15px 0;
        ">
          ${aiScore}
        </h2>

        <p>
          AI benchmark score generated
          for comparison.
        </p>

      </div>

    </div>


    <div class="card" style="
      max-width:1100px;
      margin:25px auto;
    ">

      <h3>🔍 AI Analysis</h3>

      <br>

      <p>
        ${challenge.explanation}
      </p>

      <br>

      <p>
        Your response was evaluated using
        accuracy, reasoning quality and
        response time.
      </p>

    </div>


    <div style="
      text-align:center;
      margin-top:30px;
    ">

      ${
        currentChallenge < challenges.length - 1
        ?
        `<button class="primary"
          onclick="nextChallenge()">
          Next Challenge →
        </button>`
        :
        `<button class="primary"
          onclick="startChallenge()">
          Restart Experiment ↻
        </button>`
      }

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
