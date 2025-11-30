"use client";

import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState<string>("");

  const handleUpload = async () => {
    if (!file) return alert("Please select a file");

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (data.error) {
      alert(data.error);
    } else {
      setText(data.text);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-10 text-center">
      <h1 className="text-5xl font-extrabold mb-6">ATS Master CV</h1>
      <p className="text-lg text-gray-600 mb-8 max-w-xl">
        Upload your CV (.pdf or .docx). Preview extracted text instantly.
      </p>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mb-4"
      />

      <button
        onClick={handleUpload}
        className="px-6 py-3 rounded-xl border shadow hover:shadow-lg transition font-semibold"
      >
        Upload & Parse
      </button>

      {text && (
        <div className="mt-6 p-4 border rounded-lg max-w-3xl text-left bg-gray-50">
          <h2 className="text-xl font-bold mb-2">Preview Extracted Text</h2>
          <pre className="whitespace-pre-wrap">{text}</pre>
        </div>
      )}
    </main>
  );
}
