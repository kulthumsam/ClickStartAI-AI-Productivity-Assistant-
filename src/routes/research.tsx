import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AIOutput } from "@/components/AIOutput";
import { AIDisclaimer } from "@/components/AIDisclaimer";
import { streamAI } from "@/lib/ai-stream";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/research")({
  component: ResearchPage,
  head: () => ({ meta: [{ title: "AI Research Assistant — WorkAI" }] }),
});

function ResearchPage() {
  const [topic, setTopic] = useState("");
  const [angle, setAngle] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!topic.trim()) {
      toast.error("Enter a topic or question to research.");
      return;
    }
    setOutput("");
    setLoading(true);
    const prompt = `Topic: ${topic}
Specific angle / questions: ${angle || "(general overview)"}

Produce a structured research briefing.`;
    await streamAI({
      mode: "research",
      input: prompt,
      onDelta: (c) => setOutput((p) => p + c),
      onDone: () => setLoading(false),
      onError: (e) => {
        toast.error(e.message);
        setLoading(false);
      },
    });
  };

  return (
    <DashboardLayout
      title="AI Research Assistant"
      description="Get a balanced briefing on any topic"
    >
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Research request</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="topic">Topic or question</Label>
              <Input
                id="topic"
                placeholder="e.g. Pros and cons of a 4-day work week"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="angle">Angle or specific questions (optional)</Label>
              <Textarea
                id="angle"
                rows={6}
                placeholder="Anything specific you want covered?"
                value={angle}
                onChange={(e) => setAngle(e.target.value)}
              />
            </div>
            <Button onClick={generate} disabled={loading} className="w-full">
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {loading ? "Researching…" : "Generate briefing"}
            </Button>
            <AIDisclaimer />
          </CardContent>
        </Card>

        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">Briefing</h3>
          <AIOutput
            value={output}
            onChange={setOutput}
            loading={loading}
            placeholder="Your research briefing will appear here."
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
