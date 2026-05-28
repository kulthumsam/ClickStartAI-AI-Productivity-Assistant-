import { createFileRoute, Link } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AIDisclaimer } from "@/components/AIDisclaimer";
import { Mail, FileText, ListChecks, Search, MessageSquare, ArrowRight, Sparkles, MessageCircleHeart } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Dashboard,
  head: () => ({
    meta: [
      { title: "ClickStartAI — AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Automate workplace tasks with AI: write emails, summarize meetings, plan tasks, research topics, and chat with an AI assistant.",
      },
    ],
  }),
});

const tools = [
  {
    to: "/email",
    icon: Mail,
    title: "Smart Email Generator",
    desc: "Draft professional emails in seconds from a few bullet points.",
    color: "#FF6B6B",
    bg: "#FF6B6B20",
  },
  {
    to: "/meetings",
    icon: FileText,
    title: "Meeting Notes Summarizer",
    desc: "Turn raw notes or transcripts into structured summaries with action items.",
    color: "#4ECDC4",
    bg: "#4ECDC420",
  },
  {
    to: "/tasks",
    icon: ListChecks,
    title: "AI Task Planner",
    desc: "Break goals into prioritized, actionable plans with effort estimates.",
    color: "#FF9F1C",
    bg: "#FF9F1C20",
  },
  {
    to: "/research",
    icon: Search,
    title: "AI Research Assistant",
    desc: "Get balanced briefings on any topic with key points and next steps.",
    color: "#9B5DE5",
    bg: "#9B5DE520",
  },
  {
    to: "/chat",
    icon: MessageSquare,
    title: "AI Chatbot",
    desc: "Conversational assistant for writing, brainstorming, and quick answers.",
    color: "#00BBF9",
    bg: "#00BBF920",
  },
];

function Dashboard() {
  return (
    <DashboardLayout
      title="Dashboard"
      description="Your AI workplace productivity suite"
    >
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="rounded-2xl bg-gradient-to-br from-primary/5 via-background to-background p-6 md:p-10 border-4 border-[#c6e4af] border-solid">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4" /> Powered by AI
          </div>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">
            Get more done, in less time.
          </h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            ClickStartAI helps professionals automate repetitive workplace tasks — write better emails,
            summarize meetings, plan projects, and research faster.
          </p>
        </section>

        <section>
          <h3 className="mb-4 text-sm font-medium text-muted-foreground">AI Tools</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((t) => (
              <Link key={t.to} to={t.to} className="group">
                <Card className="h-full transition-all hover:border-primary/40 hover:shadow-lg hover:-translate-y-0.5">
                  <CardHeader>
                    <div
                      className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl"
                      style={{ backgroundColor: t.bg, color: t.color }}
                    >
                      <t.icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-base">{t.title}</CardTitle>
                    <CardDescription className="text-sm">{t.desc}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <span className="inline-flex items-center gap-1 text-xs font-medium" style={{ color: t.color }}>
                      Open tool{" "}
                      <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <AIDisclaimer />
      </div>
    </DashboardLayout>
  );
}
