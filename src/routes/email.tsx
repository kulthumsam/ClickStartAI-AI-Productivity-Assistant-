import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AIOutput } from "@/components/AIOutput";
import { AIDisclaimer } from "@/components/AIDisclaimer";
import { streamAI } from "@/lib/ai-stream";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/email")({
  component: EmailPage,
  head: () => ({ meta: [{ title: "Smart Email Generator — WorkAI" }] }),
});

function EmailPage() {
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [tone, setTone] = useState("Professional");
  const [points, setPoints] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!points.trim()) {
      toast.error("Please describe what the email should say.");
      return;
    }
    setOutput("");
    setLoading(true);
    const prompt = `Write an email with the following details.
Recipient: ${recipient || "(unspecified)"}
Subject hint: ${subject || "(let the model choose)"}
Tone: ${tone}
Key points / context:
${points}`;

    await streamAI({
      mode: "email",
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
      title="Smart Email Generator"
      description="Draft professional emails from a few bullet points"
    >
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Email details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="recipient">Recipient</Label>
                <Input
                  id="recipient"
                  placeholder="e.g. Sarah, my manager"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="tone">Tone</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger id="tone">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      "Professional",
                      "Friendly",
                      "Formal",
                      "Persuasive",
                      "Apologetic",
                      "Concise",
                    ].map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="subject">Subject (optional)</Label>
              <Input
                id="subject"
                placeholder="e.g. Project status update"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="points">Key points</Label>
              <Textarea
                id="points"
                rows={8}
                placeholder="What should the email cover? Add bullet points, context, or a rough draft."
                value={points}
                onChange={(e) => setPoints(e.target.value)}
              />
            </div>
            <Button onClick={generate} disabled={loading} className="w-full">
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {loading ? "Generating…" : "Generate email"}
            </Button>
            <AIDisclaimer />
          </CardContent>
        </Card>

        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">Generated email</h3>
          <AIOutput
            value={output}
            onChange={setOutput}
            loading={loading}
            placeholder="Your draft will appear here. You can preview or edit before copying."
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
