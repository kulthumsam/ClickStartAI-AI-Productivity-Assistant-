import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Star, Send } from "lucide-react";

export const Route = createFileRoute("/feedback")({
  component: FeedbackPage,
  head: () => ({
    meta: [
      { title: "Feedback — ClickStartAI" },
      { name: "description", content: "Share your feedback to help us improve ClickStartAI." },
    ],
  }),
});

const categories = [
  { value: "bug", label: "Bug report" },
  { value: "feature", label: "Feature request" },
  { value: "improvement", label: "Improvement idea" },
  { value: "praise", label: "Compliment" },
  { value: "other", label: "Other" },
];

function FeedbackPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("improvement");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) {
      toast.error("Please write your feedback before sending.");
      return;
    }
    if (rating === 0) {
      toast.error("Please give a star rating.");
      return;
    }
    if (message.length > 2000) {
      toast.error("Feedback is too long (2000 character max).");
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("feedback").insert({
      name: name.trim() || null,
      email: email.trim() || null,
      category,
      rating,
      message: message.trim(),
    });
    setSubmitting(false);

    if (error) {
      toast.error("Failed to send feedback. Please try again.");
      return;
    }
    toast.success("Thank you! Your feedback was sent.");
    setName("");
    setEmail("");
    setCategory("improvement");
    setRating(0);
    setMessage("");
  }

  return (
    <DashboardLayout title="Feedback" description="Help us make ClickStartAI better">
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Share your feedback</CardTitle>
            <CardDescription>
              Tell us what's working, what's not, or what you'd love to see next. Your input directly shapes the app.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Name (optional)</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} maxLength={100} placeholder="Jane Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email (optional)</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={255} placeholder="you@example.com" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Overall rating</Label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((n) => {
                    const filled = n <= (hoverRating || rating);
                    return (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setRating(n)}
                        onMouseEnter={() => setHoverRating(n)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="rounded p-1 transition-transform hover:scale-110"
                        aria-label={`${n} star${n > 1 ? "s" : ""}`}
                      >
                        <Star className={`h-7 w-7 ${filled ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Your feedback</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="What did you like, dislike, or wish was different?"
                  rows={6}
                  maxLength={2000}
                  required
                />
                <p className="text-right text-xs text-muted-foreground">{message.length}/2000</p>
              </div>

              <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
                <Send className="h-4 w-4" />
                {submitting ? "Sending..." : "Send feedback"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
