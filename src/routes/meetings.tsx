import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AIOutput } from "@/components/AIOutput";
import { AIDisclaimer } from "@/components/AIDisclaimer";
import { streamAI } from "@/lib/ai-stream";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/meetings")({
  component: MeetingsPage,
  head: () => ({ meta: [{ title: "Meeting Notes Summarizer — WorkAI" }] }),
});

function MeetingsPage() {
  const [notes, setNotes] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!notes.trim()) {
      toast.error("Paste your meeting notes or transcript first.");
      return;
    }
    setOutput("");
    setLoading(true);
    await streamAI({
      mode: "meeting",
      input: `Summarize the following meeting notes:\n\n${notes}`,
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
      title="Meeting Notes Summarizer"
      description="Turn raw notes into a structured summary with action items"
    >
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Raw notes or transcript</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                rows={14}
                placeholder="Paste meeting notes, a transcript, or a list of bullet points here…"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
            <Button onClick={generate} disabled={loading} className="w-full">
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {loading ? "Summarizing…" : "Summarize"}
            </Button>
            <AIDisclaimer />
          </CardContent>
        </Card>

        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">Structured summary</h3>
          <AIOutput
            value={output}
            onChange={setOutput}
            loading={loading}
            placeholder="Summary with decisions and action items will appear here."
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
