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

export const Route = createFileRoute("/tasks")({
  component: TasksPage,
  head: () => ({ meta: [{ title: "AI Task Planner — WorkAI" }] }),
});

function TasksPage() {
  const [goal, setGoal] = useState("");
  const [deadline, setDeadline] = useState("");
  const [context, setContext] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!goal.trim()) {
      toast.error("Describe the goal you want to plan.");
      return;
    }
    setOutput("");
    setLoading(true);
    const prompt = `Goal: ${goal}
Deadline: ${deadline || "(no specific deadline)"}
Context: ${context || "(none provided)"}

Produce a prioritized, actionable plan.`;
    await streamAI({
      mode: "tasks",
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
      title="AI Task Planner"
      description="Break goals into actionable, prioritized plans"
    >
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Goal & context</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="goal">Goal</Label>
              <Input
                id="goal"
                placeholder="e.g. Launch internal newsletter by end of quarter"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="deadline">Deadline (optional)</Label>
              <Input
                id="deadline"
                placeholder="e.g. June 30"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="context">Context, constraints, resources</Label>
              <Textarea
                id="context"
                rows={6}
                placeholder="Team size, tools available, dependencies, anything relevant…"
                value={context}
                onChange={(e) => setContext(e.target.value)}
              />
            </div>
            <Button onClick={generate} disabled={loading} className="w-full">
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {loading ? "Planning…" : "Generate plan"}
            </Button>
            <AIDisclaimer />
          </CardContent>
        </Card>

        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">Prioritized plan</h3>
          <AIOutput
            value={output}
            onChange={setOutput}
            loading={loading}
            placeholder="Your prioritized task plan will appear here."
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
