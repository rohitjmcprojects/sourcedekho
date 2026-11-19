import Link from "next/link";
import { notFound } from "next/navigation";
import { sql } from "@/lib/db";
import { MessageCircleQuestion } from "lucide-react";

type VirtualLibraryRow = {
  id: number;
  title: string;
  description: string | null;
  slug: string;
};

type SlotListRow = {
  id: number;
  name: string;
  start_time: string;
  end_time: string;
  display_order: number;
};

type SlotDetailRow = SlotListRow & {
  description: string | null;
  capacity: number | null;
  features: string[] | null;
};

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ slot?: string }>;
};

const ENROLLMENT_FORM_URL = "PASTE_GOOGLE_FORM_URL_HERE";
const QUERY_FORM_URL = "https://forms.gle/sDUN5mVf21nvoeHFA";

function formatTime(value: string) {
  const [hourText, minuteText = "00"] = String(value).split(":");
  const hour = Number(hourText);
  if (!Number.isFinite(hour)) return String(value);

  const suffix = hour >= 12 ? "PM" : "AM";
  return `${hour % 12 || 12}:${minuteText} ${suffix}`;
}

function getDuration(start: string, end: string) {
  const toMinutes = (time: string) => {
    const [hours, minutes = "0"] = String(time).split(":");
    return Number(hours) * 60 + Number(minutes);
  };

  const minutes = toMinutes(end) - toMinutes(start);
  if (!Number.isFinite(minutes) || minutes <= 0) return null;

  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  if (hours && remainder) return `${hours}h ${remainder}m`;
  if (hours) return `${hours} hours`;
  return `${remainder} minutes`;
}

export default async function VirtualLibraryPage({
  params,
  searchParams,
}: PageProps) {
  const { slug } = await params;
  const query = searchParams ? await searchParams : {};
  const requestedSlotId = query.slot ? Number(query.slot) : null;

  if (!slug || typeof slug !== "string") notFound();

  let library: VirtualLibraryRow | null = null;
  let slots: SlotListRow[] = [];
  let selectedSlot: SlotDetailRow | null = null;
  let totalSeats = 0;
  let totalFeatureCount = 0;

  try {
    const libraryRows = await sql<VirtualLibraryRow[]>`
      SELECT id, title, description, slug
      FROM "VirtualLibrary"
      WHERE slug = ${slug} AND is_active = TRUE
      LIMIT 1
    `;
    library = libraryRows[0] ?? null;

    if (library) {
      // Load only the fields needed to display the slot list.
      slots = await sql<SlotListRow[]>`
        SELECT
          id,
          name,
          start_time::text AS start_time,
          end_time::text AS end_time,
          display_order
        FROM "VirtualLibrarySlots"
        WHERE virtual_library_id = ${library.id}
          AND is_active = TRUE
        ORDER BY display_order ASC, start_time ASC
      `;

      const statsRows = await sql<{ total_seats: number | null; feature_count: number | null }[]>`
        SELECT
          COALESCE(SUM(capacity), 0)::integer AS total_seats,
          COUNT(DISTINCT feature)::integer AS feature_count
        FROM "VirtualLibrarySlots" vls
        LEFT JOIN LATERAL UNNEST(vls.features) AS feature ON TRUE
        WHERE vls.virtual_library_id = ${library.id}
          AND vls.is_active = TRUE
      `;
      totalSeats = statsRows[0]?.total_seats ?? 0;
      totalFeatureCount = statsRows[0]?.feature_count ?? 0;

      // Fetch full details from PostgreSQL only after a slot is selected.
      if (
        requestedSlotId !== null &&
        Number.isInteger(requestedSlotId) &&
        slots.some((slot) => slot.id === requestedSlotId)
      ) {
        const detailRows = await sql<SlotDetailRow[]>`
          SELECT
            id,
            name,
            start_time::text AS start_time,
            end_time::text AS end_time,
            description,
            capacity,
            features,
            display_order
          FROM "VirtualLibrarySlots"
          WHERE id = ${requestedSlotId}
            AND virtual_library_id = ${library.id}
            AND is_active = TRUE
          LIMIT 1
        `;
        selectedSlot = detailRows[0] ?? null;
      }
    }
  } catch (error) {
    console.error("Failed to load virtual library:", error);
  }

  if (!library) notFound();

  const totalStudyHours = slots.reduce((total, slot) => {
    const duration = getDuration(slot.start_time, slot.end_time);
    if (!duration) return total;
    const [hours, minutes] = duration.match(/\d+/g)?.map(Number) ?? [0, 0];
    return total + hours + (minutes ?? 0) / 60;
  }, 0);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#f8f6f2_0%,_#f2efe9_32%,_#eef0f3_100%)] px-0 py-0 text-slate-900">
      <div className="w-full px-4 py-6 md:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em]">
              <li>
                <Link href="/" className="text-slate-500 underline-offset-4 transition hover:text-teal-700 hover:underline">
                  Dashboard
                </Link>
              </li>
              <li aria-hidden="true" className="text-slate-400">/</li>
              <li aria-current="page" className="text-slate-700">Virtual Reading Hall</li>
            </ol>
          </nav>

          <div className="flex flex-wrap items-center justify-end gap-3">
            <span className="inline-flex h-10 items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-600 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Shared study space
            </span>
            <a
              href={QUERY_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
            >
              <MessageCircleQuestion className="h-4 w-4" />
              Raise a Query
            </a>
          </div>
        </div>

        <section className="mb-6">
        
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            {library.title}
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
            {library.description ||
              "Choose a study schedule, find your focus time and prepare alongside a community of aspirants."}
          </p>
        </section>

       

        {slots.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 p-10 text-center text-sm text-slate-600">
            Study slots will be announced soon. Please check back shortly.
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
            <aside className="rounded-[24px] border border-slate-300 bg-white/35 p-4 shadow-inner shadow-slate-200/50">
              <div className="mb-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Study Slots</p>
              </div>

              <div className="space-y-2">
                {slots.map((slot) => {
                  const isSelected = selectedSlot?.id === slot.id;
                  return (
                    <Link
                      key={slot.id}
                      href={`/virtual-library/${library.slug}?slot=${slot.id}`}
                      scroll={false}
                      aria-current={isSelected ? "page" : undefined}
                      className={[
                        "group flex items-center justify-between gap-3 rounded-xl border px-3 py-3 transition",
                        isSelected
                          ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                          : "border-slate-200 bg-white/80 text-slate-800 shadow-sm hover:border-teal-300 hover:bg-teal-50",
                      ].join(" ")}
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold">{slot.name}</span>
                        <span className={`mt-1 block text-xs ${isSelected ? "text-slate-300" : "text-slate-500"}`}>
                          {formatTime(slot.start_time)} – {formatTime(slot.end_time)}
                        </span>
                      </span>
                      <span className={`text-lg transition group-hover:translate-x-0.5 ${isSelected ? "text-white" : "text-slate-400 group-hover:text-teal-700"}`} aria-hidden="true">
                        ›
                      </span>
                    </Link>
                  );
                })}
              </div>
            </aside>

            <section className="min-w-0">
              {!selectedSlot ? (
                <div className="flex min-h-56 items-center justify-center rounded-[24px] border border-dashed border-slate-300 bg-white/60 p-8 text-center">
                  <div>
                    <h2 className="text-lg font-bold text-slate-800">Choose a study slot to enroll.</h2>
                    
                  </div>
                </div>
              ) : (
                <div className="rounded-[24px] border border-slate-200 bg-white/65 p-5 shadow-sm sm:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      
                      <h2 className="mt-1 text-xl font-bold text-slate-900">{selectedSlot.name}</h2>
                    </div>
                    <span className="rounded-full bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-800">
                      {formatTime(selectedSlot.start_time)} – {formatTime(selectedSlot.end_time)}
                    </span>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-slate-600">
                    {selectedSlot.description ||
                      "A dedicated shared study session to help you stay focused and consistent."}
                  </p>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">Timing</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">
                        {formatTime(selectedSlot.start_time)} – {formatTime(selectedSlot.end_time)}
                      </p>
                      {getDuration(selectedSlot.start_time, selectedSlot.end_time) && (
                        <p className="mt-1 text-xs text-slate-500">
                          {getDuration(selectedSlot.start_time, selectedSlot.end_time)} session
                        </p>
                      )}
                    </div>
                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">Capacity</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">
                        {selectedSlot.capacity ? `${selectedSlot.capacity} seats` : "To be announced"}
                      </p>
                    </div>
                  </div>

                  {selectedSlot.features && selectedSlot.features.length > 0 && (
                    <div className="mt-5">
                     
                      <div className="mt-2 flex flex-wrap gap-2">
                        {selectedSlot.features.map((feature) => (
                          <span key={feature} className="rounded-full border border-teal-100 bg-teal-50 px-3 py-1.5 text-[11px] font-medium text-teal-900">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <a
                    href={ENROLLMENT_FORM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700"
                  >
                    Enroll for this slot <span aria-hidden="true">↗</span>
                  </a>
                </div>
              )}
            </section>
          </div>
        )}

        <p className="mt-7 text-center text-xs text-slate-500">
          Your goals are personal. Your preparation doesn&apos;t have to be lonely.
        </p>
      </div>
    </main>
  );
}
