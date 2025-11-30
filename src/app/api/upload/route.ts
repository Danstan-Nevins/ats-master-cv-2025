import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const pdfParse = await import("pdf-parse"); // dynamic import
    const mammoth = await import("mammoth");    // dynamic import

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let text = "";

    if (file.name.endsWith(".pdf")) {
      const data = await pdfParse.default(buffer); // use .default for CJS
      text = data.text;
    } else if (file.name.endsWith(".docx")) {
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    } else if (file.name.endsWith(".doc")) {
      return NextResponse.json({ error: ".doc not supported, convert to .docx" });
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
