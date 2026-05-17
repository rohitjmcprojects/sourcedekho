"use client";

import { useState } from "react";

import {
  useUser,
  SignInButton,
} from "@clerk/nextjs";

export default function CourseEnrollButton({
  courseTitle,
}: {
  courseTitle: string;
}) {
  const { user } = useUser();

  const [open, setOpen] = useState(false);

  // =========================
  // NOT LOGGED IN
  // =========================
  if (!user) {
    return (
      <SignInButton mode="modal">
        <button
          className="
            px-8
            py-4
            rounded-2xl
            bg-black
            text-white
            font-semibold
            text-lg
            hover:opacity-90
            transition
          "
        >
          Login to Enroll
        </button>
      </SignInButton>
    );
  }

  // =========================
  // LOGGED IN
  // =========================
  return (
    <>
      {/* BUTTON */}
      <button
        onClick={() => setOpen(true)}
        className="
          px-8
          py-4
          rounded-2xl
          bg-black
          text-white
          font-semibold
          text-lg
          hover:opacity-90
          transition
        "
      >
        Enroll Now
      </button>

      {/* MODAL */}
      {open && (
        <div
          className="
            fixed
            inset-0
            bg-black/40
            z-[100]
            flex
            items-center
            justify-center
            p-5
          "
        >
          <div
            className="
              w-full
              max-w-2xl
              rounded-[32px]
              bg-white
              p-8
              relative
            "
          >

            {/* CLOSE */}
            <button
              onClick={() => setOpen(false)}
              className="
                absolute
                top-5
                right-5
                w-10
                h-10
                rounded-full
                border
                flex
                items-center
                justify-center
              "
            >
              ✕
            </button>

            {/* HEADER */}
            <div className="mb-8">

              <p className="text-sm font-medium text-gray-500 mb-3">
                ENROLLMENT
              </p>

              <h2 className="text-4xl font-black tracking-tight">
                {courseTitle}
              </h2>

            </div>

            {/* USER */}
            <div className="border rounded-3xl p-5 mb-6">

              <p className="text-sm text-gray-500 mb-2">
                Logged in as
              </p>

              <p className="font-semibold text-lg">
                {user.fullName}
              </p>

              <p className="text-gray-500">
                {user.primaryEmailAddress?.emailAddress}
              </p>

            </div>

            {/* FORM */}
            <div className="space-y-4">

              <input
                placeholder="Phone Number"
                className="
                  w-full
                  border
                  rounded-2xl
                  px-5
                  py-4
                  outline-none
                "
              />

              <textarea
                placeholder="Preparation Background"
                className="
                  w-full
                  border
                  rounded-2xl
                  px-5
                  py-4
                  outline-none
                  min-h-[120px]
                "
              />

            </div>

            {/* ACTION */}
            <button
              className="
                mt-8
                w-full
                py-4
                rounded-2xl
                bg-black
                text-white
                font-semibold
                text-lg
              "
            >
              Confirm Enrollment
            </button>

          </div>
        </div>
      )}
    </>
  );
}