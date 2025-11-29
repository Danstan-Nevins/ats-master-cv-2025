export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-10 text-center">
      <h1 className="text-5xl font-extrabold mb-6">ATS Master CV</h1>
      <p className="text-lg text-gray-600 mb-8 max-w-xl">
        Upload. Optimize. Get Noticed.  
        Turn your CV into an ATS-friendly, interview-ready document instantly.
      </p>

      <a
        href="/app"
        className="px-6 py-3 rounded-xl border shadow hover:shadow-lg transition font-semibold"
      >
        Open App
      </a>
    </main>
  );
}
