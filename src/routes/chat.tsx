import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AIDisclaimer } from "@/components/AIDisclaimer";
import { streamAI } from "@/lib/ai-stream";
import { Send, Loader2, Sparkles, User } from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

export const Route = createFileRoute("/chat")({
  component: ChatPage,
  head: () => ({ meta: [{ title: "AI Chat — WorkAI" }] }),
});

type Msg = { role: "user" | "assistant"; content: string };

function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    const userMsg: Msg = { role: "user", content: text };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setLoading(true);

    let acc = "";
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    await streamAI({
      mode: "chat",
      messages: nextMessages,
      onDelta: (c) => {
        acc += c;
        setMessages((prev) => {
          const out = [...prev];
          out[out.length - 1] = { role: "assistant", content: acc };
          return out;
        });
      },
      onDone: () => setLoading(false),
      onError: (e) => {
        toast.error(e.message);
        setMessages((prev) => prev.slice(0, -1));
        setLoading(false);
      },
    });
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <DashboardLayout title="AI Chat" description="Conversational AI assistant">
      <div className="mx-auto flex h-[calc(100vh-7rem)] max-w-4xl flex-col gap-4">
        <Card className="flex-1 overflow-hidden p-0">
          <div ref={scrollRef} className="h-full overflow-y-auto p-4 md:p-6">
            {messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF6B6B20] text-[#FF6B6B]">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium">How can I help today?</h3>
                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                  Ask anything — drafting, planning, brainstorming, or quick questions.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {messages.map((m, i) => (
                  <div key={i} className="flex gap-3">
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                        m.role === "user"
                          ? "bg-[#FF9F1C20] text-[#FF9F1C]"
                          : "bg-[#FF6B6B20] text-[#FF6B6B]"
                      }`}
                    >
                      {m.role === "user" ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <Sparkles className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="mb-1 text-xs font-medium text-muted-foreground">
                        {m.role === "user" ? "You" : "Assistant"}
                      </p>
                      <div className="prose prose-sm dark:prose-invert max-w-none break-words">
                        {m.content ? (
                          <ReactMarkdown>{m.content}</ReactMarkdown>
                        ) : (
                          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        <div className="space-y-2">
          <div className="relative">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Message the assistant… (Enter to send, Shift+Enter for newline)"
              rows={2}
              className="resize-none pr-14"
            />
            <Button
              onClick={send}
              disabled={loading || !input.trim()}
              size="icon"
              className="absolute bottom-2 right-2 h-9 w-9"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          <AIDisclaimer />
        </div>
      </div>
    </DashboardLayout>
  );
}
