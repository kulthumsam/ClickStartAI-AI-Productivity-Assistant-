import mammoth from "mammoth";

async function extractPdf(file: File): Promise<string> {
  const pdfjsLib = await import("pdfjs-dist");
  const PdfWorker = (await import("pdfjs-dist/build/pdf.worker.mjs?worker"))
    .default;
  if (!pdfjsLib.GlobalWorkerOptions.workerPort) {
    pdfjsLib.GlobalWorkerOptions.workerPort = new PdfWorker();
  }
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

export async function extractTextFromFile(file: File): Promise<string> {
  const name = file.name.toLowerCase();

  if (name.endsWith(".pdf") || file.type === "application/pdf") {
    return extractPdf(file);
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
