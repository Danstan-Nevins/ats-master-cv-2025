import { NextResponse } from "next/server";

export const runtime = "nodejs";

// --- Helper functions for extraction --- //

const extractEmail = (text: string) => {
  const match = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  return match ? match[0] : null;
};

const extractPhone = (text: string) => {
  const match = text.match(/(\+?\d{1,4}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3}[-.\s]?\d{3,4}/);
  return match ? match[0] : null;
};

const extractName = (text: string) => {
  const firstLine = text.split("\n")[0].trim();
  if (firstLine.includes("@") || /\d/.test(firstLine)) return null;
  return firstLine.length <= 40 ? firstLine : null;
};

const extractSkills = (text: string) => {
  const skillsKeywords = [
    "Python", "JavaScript", "TypeScript", "React", "Next.js", "Node.js",
    "Excel", "Communication", "Leadership", "SQL", "Marketing",
    "Project Management", "Sales", "Customer Service"
  ];

  return skillsKeywords.filter(skill =>
    text.toLowerCase().includes(skill.toLowerCase())
  );
};

const extractExperience = (text: string) => {
  const expRegex = /(201\d|202\d)[^\.]{10,200}/g;
  const matches = text.match(expRegex);
  return matches || [];
};

const extractEducation = (text: string) => {
  const eduRegex = /(Bachelor|Master|Degree|Diploma|Certificate)[^\.]{10,200}/gi;
  const matches = text.match(eduRegex);
  return matches || [];
};

// --- Main API handler --- //

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    const extracted = {
      name: extractName(text),
      email: extractEmail(text),
      phone: extractPhone(text),
      skills: extractSkills(text),
      experience: extractExperience(text),
      education: extractEducation(text),
      raw: text,
    };

    return NextResponse.json(extracted);
  } catch (err) {
    console.error("Parse error:", err);
    return NextResponse.json(
      { error: "Failed to parse document", details: String(err) },
      { status: 500 }
    );
  }
}
