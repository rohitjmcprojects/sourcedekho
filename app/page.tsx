import Sidebar from "@/components/Sidebar";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <main className="ml-[310px] p-5">
        <div className="min-h-[calc(100vh-40px)] bg-white rounded-[32px] border shadow-sm p-10">
          <h1 className="text-5xl font-bold tracking-tight mb-4">
            SourceDekho
          </h1>

          <p className="text-lg text-gray-500">
            Blank landing workspace.
          </p>
        </div>
      </main>
    </div>
  );
}