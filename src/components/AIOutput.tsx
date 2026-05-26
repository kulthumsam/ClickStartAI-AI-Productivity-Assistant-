import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Copy, Check, Eye, Pencil } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  value: string;
  onChange: (v: string) => void;
  loading?: boolean;
  placeholder?: string;
}

export function AIOutput({ value, onChange, loading, placeholder }: Props) {
  const [mode, setMode] = useState<"preview" | "edit">("preview");
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Card className="p-0 overflow-hidden">
      <div className="flex items-center justify-between border-b px-3 py-2">
        <div className="flex gap-1">
          <Button
            type="button"
            size="sm"
            variant={mode === "preview" ? "secondary" : "ghost"}
            onClick={() => setMode("preview")}
          >
            <Eye className="h-3.5 w-3.5" /> Preview
          </Button>
          <Button
            type="button"
            size="sm"
            variant={mode === "edit" ? "secondary" : "ghost"}
            onClick={() => setMode("edit")}
          >
            <Pencil className="h-3.5 w-3.5" /> Edit
          </Button>
        </div>
        <Button type="button" size="sm" variant="ghost" onClick={copy} disabled={!value}>
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
      <div className="min-h-[320px]">
        {mode === "edit" ? (
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="min-h-[320px] resize-y rounded-none border-0 focus-visible:ring-0 font-mono text-sm"
          />
        ) : (
          <div className="prose prose-sm dark:prose-invert max-w-none p-4">
            {value ? (
              <ReactMarkdown>{value}</ReactMarkdown>
            ) : (
              <p className="text-muted-foreground italic">
                {loading ? "Generating…" : placeholder ?? "Output will appear here."}
              </p>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
