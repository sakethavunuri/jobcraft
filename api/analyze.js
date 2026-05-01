export const config = { runtime: "edge" };

// Rate limiting - per IP, 20 requests per hour
const rateMap = new Map();
const LIMIT = 20;
const WINDOW = 60 * 60 * 1000;

function checkRate(ip) {
  const now = Date.now();
  const e = rateMap.get(ip) || { count: 0, start: now };
  if (now - e.start > WINDOW) { rateMap.set(ip, { count: 1, start: now }); return true; }
  if (e.count >= LIMIT) return false;
  e.count++;
  rateMap.set(ip, e);
  return true;
}

const PROMPTS = {
  ats: `You are an expert ATS (Applicant Tracking System) analyzer.
Analyze the resume PDF against the job description provided.
Return ONLY a valid JSON object, no markdown, no backticks:
{
  "ats_score": <integer 0-100>,
  "summary": "<2 precise sentences about the match quality>",
  "breakdown": {
    "keyword_match": <0-100>,
    "experience_relevance": <0-100>,
    "skills_alignment": <0-100>,
    "formatting_quality": <0-100>,
    "education_fit": <0-100>,
    "overall_impact": <0-100>
  }
}`,

  keywords: `You are an expert resume keyword analyzer.
Analyze the resume PDF against the job description.
Return ONLY a valid JSON object, no markdown, no backticks:
{
  "matched": ["keyword1", "keyword2"],
  "missing": ["keyword1", "keyword2"],
  "additions": [
    {
      "keyword": "exact keyword",
      "suggestion": "natural full sentence to add to resume using this keyword",
      "section": "Experience or Skills or Summary"
    }
  ]
}
Provide 6-10 matched keywords, 6-10 missing keywords, and 6-10 additions with natural-sounding complete sentences.`,

  rewriter: `You are an expert resume writer.
Rewrite every bullet point from the resume to be ATS-optimized with strong action verbs, quantified impact, and keywords from the job description.
Return ONLY a valid JSON object, no markdown, no backticks:
{
  "sections": [
    {
      "section": "Section Name",
      "bullets": [
        {
          "original": "original bullet text",
          "rewritten": "improved bullet with action verb and metrics"
        }
      ]
    }
  ]
}
Include all major sections. Make every bullet stronger with metrics where possible.`,

  cover: `You are an expert cover letter writer.
Write a compelling, professional, tailored cover letter for this job using specific experiences from the resume and keywords from the job description.
Write 3-4 focused paragraphs. Make it sound human and genuine, not templated.
Return ONLY the plain text cover letter. No JSON, no markdown.`,

  interview: `You are an expert interview coach.
Generate 10 likely interview questions for this specific role based on the resume and job description.
Return ONLY a valid JSON array, no markdown, no backticks:
[
  {
    "question": "interview question text",
    "type": "behavioral or technical or situational",
    "answer": "detailed 3-5 sentence model answer using STAR method where applicable"
  }
]
Mix behavioral, technical, and situational questions. Make answers specific to the candidate's background.`
};

export default async function handler(req) {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!checkRate(ip)) {
    return new Response(
      JSON.stringify({ error: "You've used a lot of analyses today. Please try again in an hour." }),
      { status: 429, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
    );
  }

  let body;
  try { body = await req.json(); }
  catch { return new Response(JSON.stringify({ error: "Invalid request" }), { status: 400 }); }

  const { tool, resumeB64, jobDescription } = body;

  if (!["ats", "keywords", "rewriter", "cover", "interview"].includes(tool)) {
    return new Response(JSON.stringify({ error: "Invalid tool" }), { status: 400 });
  }
  if (!resumeB64 || !jobDescription) {
    return new Response(JSON.stringify({ error: "Missing resume or job description" }), { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "Service not configured. Please add GEMINI_API_KEY to Vercel environment variables." }), { status: 500 });
  }

  try {
    const prompt = `JOB DESCRIPTION:\n${jobDescription}\n\n${PROMPTS[tool]}`;

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [
              {
                inline_data: {
                  mime_type: "application/pdf",
                  data: resumeB64
                }
              },
              { text: prompt }
            ]
          }],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: tool === "rewriter" ? 3000 : tool === "interview" ? 2500 : 1500,
          }
        })
      }
    );

    const data = await geminiRes.json();

    if (data.error) {
      throw new Error(data.error.message || "Gemini API error");
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error("No response from AI. Please try again.");

    return new Response(JSON.stringify({ result: text.trim() }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });

  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message || "Analysis failed. Please try again." }),
      { status: 500, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
    );
  }
}
