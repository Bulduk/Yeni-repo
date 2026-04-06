export interface AIAnalysisResult {
  edgeScore: number;
  direction: "BUY_YES" | "BUY_NO" | "HOLD";
  confidence: number;
  fairPrice: number;
  signals: string[];
}

export interface OpenClawInput {
  marketId: string;
  question: string;
  currentPrice: number;
  yesVolume: number;
  noVolume: number;
  volume: number;
  liquidity: number;
  priceHistory: number[];
  recentTrades: any[];
  timeLeft: number;
}

const OPENCLAW_API_URL = process.env.OPENCLAW_API_URL || 'http://localhost:8080/v1/chat/completions';

export async function analyzeWithOpenClaw(data: OpenClawInput): Promise<AIAnalysisResult> {
  const fallback: AIAnalysisResult = {
    edgeScore: 50,
    direction: "HOLD",
    confidence: 50,
    fairPrice: data.currentPrice,
    signals: []
  };

  const prompt = `
You are a high-performance prediction market signal engine.
Analyze the following market data and return ONLY a JSON object. No explanations. No markdown formatting. No text.

Market Data:
${JSON.stringify(data)}

Required JSON Output Format:
{
  "edgeScore": number (0-100),
  "direction": "BUY_YES" | "BUY_NO" | "HOLD",
  "confidence": number (0-100),
  "fairPrice": number (0-100),
  "signals": string[] (e.g., ["MISPRICING", "MOMENTUM"])
}
`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2000); // 2s timeout

  try {
    const response = await fetch(OPENCLAW_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENCLAW_API_KEY || 'dummy'}`
      },
      body: JSON.stringify({
        model: "openclaw-predictive",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.1,
        response_format: { type: "json_object" }
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error(`OpenClaw API error: ${response.statusText}`);
      return fallback;
    }

    const result = await response.json();
    const content = result.choices?.[0]?.message?.content;
    
    if (!content) return fallback;

    const parsed = JSON.parse(content);

    // Validate and normalize
    return {
      edgeScore: typeof parsed.edgeScore === 'number' ? parsed.edgeScore : 50,
      direction: ["BUY_YES", "BUY_NO", "HOLD"].includes(parsed.direction) ? parsed.direction : "HOLD",
      confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 50,
      fairPrice: typeof parsed.fairPrice === 'number' ? parsed.fairPrice : data.currentPrice,
      signals: Array.isArray(parsed.signals) ? parsed.signals : []
    };

  } catch (error) {
    clearTimeout(timeoutId);
    console.error("OpenClaw analysis failed or timed out:", error);
    return fallback;
  }
}
