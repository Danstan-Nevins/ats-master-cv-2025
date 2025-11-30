"use client";

import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [parsed, setParsed] = useState<any>(null);

  const handleUpload = async () => {
    if (!file) return alert("Please select a file first!");

    setLoading(true);
    setParsed(null);

    try {
      const form = new FormData();
      form.append("file", file);

      // Upload & extract text
      const uploadRes = await fetch("/api/upload", { method: "POST", body: form });
      const { text } = await uploadRes.json();

      // Parse extracted text
      const parseRes = await fetch("/api/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const parsedData = await parseRes.json();
      setParsed(parsedData);
    } catch (err) {
      console.error(err);
      alert("Upload/parse failed");
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen flex flex-col items-center p-10">
      <h1 className="text-5xl font-bold mb-6">ATS Master CV</h1>
      <p className="text-gray-600 text-lg mb-6 max-w-xl text-center">
        Upload your CV (.pdf or .docx) to extract Name, Email, Phone, Skills, Experience & Education.
      </p>

      <input
        type="file"
        accept=".pdf,.docx"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mb-4 border p-3 rounded w-full max-w-md"
      />

      <button
        onClick={handleUpload}
        disabled={loading}
        className="px-6 py-3 bg-black text-white rounded-lg shadow hover:bg-gray-800 mb-6"
      >
        {loading ? "Processing..." : "Upload & Preview"}
      </button>

      {parsed && (
        <div className="w-full max-w-2xl bg-gray-50 p-6 rounded-xl shadow">
          <h2 className="text-2xl font-bold mb-4">Preview Extracted Information</h2>
          <p><strong>Name:</strong> {parsed.name || "—"}</p>
          <p><strong>Email:</strong> {parsed.email || "—"}</p>
          <p><strong>Phone:</strong> {parsed.phone || "—"}</p>
          <p><strong>Skills:</strong> {parsed.skills?.length ? parsed.skills.join(", ") : "—"}</p>
          <p><strong>Experience:</strong> {parsed.experience?.length ? parsed.experience.join("; ") : "—"}</p>
          <p><strong>Education:</strong> {parsed.education?.length ? parsed.education.join("; ") : "—"}</p>
        </div>
      )}
    </main>
  );
}
