export default function ExamCoursesLoading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="rounded-3xl border border-white/[0.08] bg-[#071713]/95 p-8 text-center shadow-[0_20px_80px_rgba(0,0,0,0.6)] backdrop-blur-xl">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/[0.12] bg-white/[0.05]">
            <div className="h-10 w-10 rounded-full border-4 border-transparent border-t-blue-400 animate-spin" />
          </div>
          <div>
            <p className="text-lg font-semibold text-white">Please wait...</p>
           </div>
        </div>
      </div>
    </div>
  );
}
