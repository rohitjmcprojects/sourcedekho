import Sidebar from "@/components/Sidebar";

export default function HomePage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN AREA */}
      <main className="flex-1 p-10">
        <div className="border rounded-3xl bg-white min-h-[85vh] p-10 shadow-sm">
          <h1 className="text-5xl font-bold mb-4">
            SourceDekho
          </h1>

          <p className="text-gray-600 text-lg">
            Blank landing workspace.
          </p>
        </div>
      </main>
    </div>
  );
}