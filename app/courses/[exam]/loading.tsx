export default function ExamCoursesLoading() {
  return (
    <div
      className="
        fixed
        inset-0
        z-50

        flex
        items-center
        justify-center

        bg-[#F8F6F2]/80

        backdrop-blur-sm
      "
    >
      <div
        className="
          rounded-[32px]

          border
          border-[#D8CFC2]

          bg-[#F7F3ED]

          px-12
          py-10

          shadow-[0_10px_40px_rgba(0,0,0,0.08)]
        "
      >
        <div
          className="
            flex
            flex-col
            items-center

            gap-5
          "
        >
          {/* SPINNER */}
          <div
            className="
              h-12
              w-12

              rounded-full

              border-[3px]
              border-[#D8CFC2]

              border-t-[#1F3D5A]

              animate-spin
            "
          />

          {/* TEXT */}
          <div className="text-center">
            <p
              className="
                text-lg

                font-semibold

                text-[#16212F]
              "
            >
              Loading Course
            </p>

            <p
              className="
                mt-1

                text-sm

                text-[#6A6A6A]
              "
            >
              Preparing your learning experience...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}