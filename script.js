export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Only POST requests are allowed."
    });
  }

  try {
    const { question, humanAnswer, reasoning } = req.body || {};

    if (!question || !humanAnswer || !reasoning) {
      return res.status(400).json({
        error: "Question, answer and reasoning are required."
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "GEMINI_API_KEY is not configured."
      });
    }

    const prompt = `
You are the AI evaluator for a Human vs AI cognitive challenge.

Evaluate the human response objectively.

QUESTION:
${question}

HUMAN ANSWER:
${humanAnswer}

HUMAN REASONING:
${reasoning}

Return ONLY valid JSON:

{
  "aiAnswer": "your answer",
  "humanScore": 0,
  "aiScore": 0,
  "accuracy": 0,
  "reasoning": 0,
  "creativity": 0,
  "analysis": "short explanation",
  "winner": "HUMAN or AI or DRAW"
}

Scoring:
- accuracy: 0-100
- reasoning: 0-100
- creativity: 0-100
- humanScore: 0-100
- aiScore: 0-100

Be fair. Do not automatically favor AI.
`;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            responseMimeType: "application/json"
          }
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini error:", data);

      return res.status(response.status).json({
        error: "Gemini request failed."
      });
    }

    const output =
      data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    let result;

    try {
      result = JSON.parse(output);
    } catch {
      result = {
        analysis: output,
        humanScore: 0,
        aiScore: 0,
        accuracy: 0,
        reasoning: 0,
        creativity: 0,
        winner: "UNKNOWN"
      };
    }

    return res.status(200).json(result);

  } catch (error) {
    console.error("Server error:", error);

    return res.status(500).json({
      error: "Server error."
    });
  }
}
