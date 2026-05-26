import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const SYSTEM_PROMPTS: Record<string, string> = {
  email: `You are a professional email-writing assistant for workplace use.
Write clear, concise, professional emails. Respect the requested tone (formal, friendly, persuasive, apologetic, etc.).
Return ONLY the email itself with:
Subject: <subject line>

<body>

Sign off with a placeholder like "[Your Name]" unless the user provided one.`,

  meeting: `You are a meeting-notes summarizer.
Given raw notes or a transcript, produce a clean structured summary in Markdown with these sections:
## Summary
A 2-3 sentence overview.
## Key Decisions
- bullet list
## Action Items
- [ ] Owner — task — due date (if mentioned)
## Open Questions
- bullet list
Be faithful to the source. Do not invent attendees, decisions, or dates.`,

  tasks: `You are an AI task planner. Given a goal or project description, break it into a prioritized, actionable plan.
Return Markdown structured as:
## Goal
One sentence restating the goal.
## Plan
A numbered list of tasks. For each task include: title, short description, priority (High/Medium/Low), and estimated effort (e.g. 30m, 2h, 1d).
## Suggested Order
A short paragraph on sequencing and dependencies.
Be realistic and concrete.`,

  research: `You are an AI research assistant for working professionals.
Given a topic or question, produce a structured briefing in Markdown:
## Overview
2-4 sentence neutral summary.
## Key Points
- 4-7 bullets covering the most important facts, perspectives, and context.
## Considerations & Tradeoffs
- bullets
## Suggested Next Steps
- bullets for further research or action
Be balanced. If you are uncertain or the topic is fast-moving, say so. Do not fabricate citations.`,

  chat: `You are a helpful, friendly AI productivity assistant embedded in a workplace tool.
Help users with writing, planning, summarizing, brainstorming, and answering questions.
Be concise by default; expand when asked. Use Markdown formatting for structure when useful.
If you don't know something, say so honestly.`,
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { mode, messages, input } = await req.json();
    const systemPrompt = SYSTEM_PROMPTS[mode] ?? SYSTEM_PROMPTS.chat;

    const chatMessages =
      Array.isArray(messages) && messages.length > 0
        ? messages
        : [{ role: "user", content: String(input ?? "") }];

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "system", content: systemPrompt }, ...chatMessages],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded, please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits in your workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("ai-assist error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
