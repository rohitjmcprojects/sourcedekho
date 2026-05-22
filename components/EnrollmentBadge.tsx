"use client";

import {
  useEffect,
  useState,
} from "react";

import { useUser } from "@clerk/nextjs";

export default function EnrollmentBadge({
  courseId,
}: {
  courseId: number;
}) {

  const { user } =
    useUser();

  const [enrolled, setEnrolled] =
    useState(false);

  useEffect(() => {

    async function checkEnrollment() {

      if (!user) return;

      try {

        const res = await fetch(
          `/api/check-enrollment?courseId=${courseId}&clerkUserId=${user.id}`
        );

        const data =
          await res.json();

        setEnrolled(
          data.enrolled
        );

      } catch (err) {

        console.log(err);

      }

    }

    checkEnrollment();

  }, [courseId, user]);

  return (
    <div
      className={`
        px-2.5
        py-1

        rounded-xl

        text-[10px]
        font-bold

        border

        backdrop-blur-xl

        ${
          enrolled
            ? `
              bg-emerald-500/20
              border-emerald-400/30
              text-emerald-300
            `
            : `
              bg-amber-500/20
              border-amber-400/30
              text-amber-200
            `
        }
      `}
    >
      {enrolled
        ? "ENROLLED"
        : "NOT ENROLLED"}
    </div>
  );
}