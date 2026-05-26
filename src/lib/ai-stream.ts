type Msg = { role: "user" | "assistant" | "system"; content: string };

const ENDPOINT = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-assist`;

export async function streamAI({
  mode,
  messages,
  input,
  onDelta,
  onDone,
  onError,
  signal,
}: {
  mode: "email" | "meeting" | "tasks" | "research" | "chat";
  messages?: Msg[];
  input?: string;
  onDelta: (chunk: string) => void;
  onDone: () => void;
  onError?: (err: Error) => void;
  signal?: AbortSignal;
}) {
  try {
    const resp = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ mode, messages, input }),
      signal,
    });

    if (!resp.ok || !resp.body) {
      let msg = "Request failed";
      try {
        const j = await resp.json();
        msg = j.error || msg;
      } catch {
        // ignore
      }
      throw new Error(msg);
    }

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let buf = "";
    let done = false;

    while (!done) {
      const { done: d, value } = await reader.read();
      if (d) break;
      buf += decoder.decode(value, { stream: true });
      let nl: number;
      while ((nl = buf.indexOf("\n")) !== -1) {
        let line = buf.slice(0, nl);
        buf = buf.slice(nl + 1);
        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (!line || line.startsWith(":")) continue;
        if (!line.startsWith("data: ")) continue;
        const data = line.slice(6).trim();
        if (data === "[DONE]") {
          done = true;
          break;
        }
        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) onDelta(content);
        } catch {
          buf = line + "\n" + buf;
          break;
        }
      }
    }
    onDone();
  } catch (e) {
    onError?.(e instanceof Error ? e : new Error(String(e)));
  }
}
