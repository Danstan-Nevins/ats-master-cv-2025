import { NextResponse } from "next/server";
import * as mammoth from "mammoth";
import { getDocument } from "pdfjs-dist";

export const runtime = "nodejs";

async function extractPdfText(buffer: Buffer) {
  const loadingTask = getDocument({ data: buffer });
  const pdf = await loadingTask.promise;
  let text = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map((item: any) => item.str).join(" ");
    text += pageText + "\n";
  }

  return text;
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    let text = "";

    if (file.name.endsWith(".pdf")) {
      text = await extractPdfText(buffer);
    } else if (file.name.endsWith(".docx")) {
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    } else {
      return NextResponse.json({ error: "Unsupported file type" });
    }

    return NextResponse.json({ text });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to parse file", details: String(err) },
      { status: 500 }
    );
  }
}
