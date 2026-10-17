export default function DashboardContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="
        max-w-[1800px]
        mx-auto

        h-[calc(100vh-64px)]

        flex
        flex-col
        gap-5
      "
    >
      {children}
    </div>
  );
}