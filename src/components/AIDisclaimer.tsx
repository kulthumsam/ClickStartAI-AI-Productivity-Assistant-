import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

export function AIDisclaimer() {
  return (
    <Alert className="border-dashed">
      <Info className="h-4 w-4" />
      <AlertDescription className="text-xs">
        AI-generated content may contain errors or biased information. Always review and edit
        outputs before using them in professional communications or decisions. Do not share
        confidential information you wouldn't enter into a public AI service.
      </AlertDescription>
    </Alert>
  );
}
