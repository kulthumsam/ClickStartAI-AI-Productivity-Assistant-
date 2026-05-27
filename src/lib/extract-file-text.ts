import * as pdfjsLib from "pdfjs-dist";
import PdfWorker from "pdfjs-dist/build/pdf.worker.mjs?worker";
import mammoth from "mammoth";

pdfjsLib.GlobalWorkerOptions.workerPort = new PdfWorker();

export async function extractTextFromFile(file: File): Promise<string> {
  const name = file.name.toLowerCase();

  if (name.endsWith(".pdf") || file.type === "application/pdf") {
    const buf = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text +=
        content.items
          .map((it) => ("str" in it ? (it as { str: string }).str : ""))
          .join(" ") + "\n\n";
    }
    return text.trim();
  }

  if (name.endsWith(".docx")) {
    const buf = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer: buf });
    return result.value.trim();
  }

  if (
    name.endsWith(".txt") ||
    name.endsWith(".md") ||
    file.type.startsWith("text/")
  ) {
    return (await file.text()).trim();
  }

  throw new Error(
    "Unsupported file type. Please upload a PDF, DOCX, TXT, or MD file.",
  );
}
