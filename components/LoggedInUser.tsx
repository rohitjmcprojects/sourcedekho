"use client";

import { useUser } from "@clerk/nextjs";

export default function LoggedInUser() {

  const { user } =
    useUser();

  if (!user) return null;

  return (
    <div
      className="
        mb-10

        rounded-[32px]

        border
        border-white/[0.08]

        bg-white/[0.04]

        backdrop-blur-2xl

        p-6
      "
    >

      <p
        className="
          text-sm
          text-slate-400

          mb-3
        "
      >
        Logged in as
      </p>

      <h2
        className="
          text-3xl
          font-black

          text-white
        "
      >
        {user.fullName}
      </h2>

      <p
        className="
          mt-2

          text-slate-300
        "
      >
        {
          user
            .primaryEmailAddress
            ?.emailAddress
        }
      </p>

      {/* DETAILS */}
      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-3
          gap-4

          mt-6
        "
      >

        {/* USER ID */}
        <div
          className="
            rounded-2xl

            border
            border-white/[0.08]

            bg-white/[0.04]

            p-4
          "
        >

          <p className="text-xs text-slate-400 mb-2">
            Clerk User ID
          </p>

          <p className="text-white break-all text-sm">
            {user.id}
          </p>

        </div>

        {/* CITY */}
        <div
          className="
            rounded-2xl

            border
            border-white/[0.08]

            bg-white/[0.04]

            p-4
          "
        >

          <p className="text-xs text-slate-400 mb-2">
            City
          </p>

          <p className="text-white">
            {
              (user.publicMetadata
                ?.city as string) || "-"
            }
          </p>

        </div>

        {/* PHONE */}
        <div
          className="
            rounded-2xl

            border
            border-white/[0.08]

            bg-white/[0.04]

            p-4
          "
        >

          <p className="text-xs text-slate-400 mb-2">
            Phone
          </p>

          <p className="text-white">
            {
              (user.publicMetadata
                ?.phone as string) || "-"
            }
          </p>

        </div>

      </div>

    </div>
  );
}