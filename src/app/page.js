export default function AppPage() {
  return (
    <main className="min-h-screen p-10 flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-4">ATS Master CV — App</h2>

      <p className="text-gray-600 mb-8">
        Upload your CV (PDF, DOCX). Parsing UI coming soon.
      </p>

      <div className="w-full max-w-lg bg-white p-6 rounded-xl shadow space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Select CV file
        </label>
        <input
          type="file"
          className="block w-full border rounded p-2"
          accept=".pdf,.doc,.docx"
        />

        <button className="px-6 py-3 w-full rounded-xl bg-black text-white font-semibold hover:opacity-90 transition">
          Upload
        </button>
      </div>
    </main>
  );
}
