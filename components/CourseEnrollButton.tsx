"use client";

import { useEffect, useState } from "react";

import {
  useUser,
  SignInButton,
} from "@clerk/nextjs";

export default function CourseEnrollButton({
  course,
}: {
  course: any;
}) {

  const { user } = useUser();

  const [open, setOpen] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [form, setForm] =
    useState({
      fullName: "",
      email: "",
      phone: "",
      city: "",
      address: "",
      transactionNo: "",
      background: "",
    });

  // ====================================
  // AUTO FILL
  // ====================================

  useEffect(() => {

    if (user) {

      setForm({
        fullName:
          user.fullName ||
          `${user.firstName || ""} ${user.lastName || ""}`,

        email:
          user
            .primaryEmailAddress
            ?.emailAddress || "",

        phone:
          (user.publicMetadata
            ?.phone as string) || "",

        city:
          (user.publicMetadata
            ?.city as string) || "",

        address:
          (user.publicMetadata
            ?.address as string) || "",

        transactionNo: "",

        background:
          (user.publicMetadata
            ?.background as string) || "",
      });

    }

  }, [user]);

  // ====================================
  // ENROLL
  // ====================================

  async function handleEnroll() {

    try {

      if (!user) {

        alert(
          "Please login first"
        );

        return;
      }

      setLoading(true);

      const res = await fetch(
        "/api/enroll-course",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({

            clerkUserId:
              user.id,

            courseId:
              course.id,

            ...form,
          }),
        }
      );

      const data =
        await res.json();

      if (!res.ok) {

        alert(
          data.error ||
            "Something went wrong"
        );

        return;
      }

      alert(
        "Enrollment successful"
      );

      setOpen(false);

    } catch (err) {

      console.log(err);

      alert(
        "Something went wrong"
      );

    } finally {

      setLoading(false);

    }

  }

  return (
    <>

      {/* ACTIONS */}
      <div className="flex gap-4 flex-wrap">

        {/* DASHBOARD */}
        <a
          href={`/courses/${course.exam_name.toLowerCase()}/${course.id}/dashboard`}
          className="
            px-8
            py-4

            rounded-2xl

            border

            font-semibold
            text-lg

            bg-gray-100

            hover:bg-indigo-500/30

            transition
          "
        >
          Lecture Dashboard
        </a>

        {/* LOGIN */}
        {!user ? (

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

        ) : (

          <>

            {/* ENROLL */}
            <button
              onClick={() =>
                setOpen(true)
              }
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

                  z-[100]

                  bg-black/70

                  backdrop-blur-md

                  flex
                  items-center
                  justify-center

                  p-4
                "
              >

                {/* BOX */}
                <div
                  className="
                    relative

                    w-full
                    max-w-4xl

                    max-h-[95vh]
                    overflow-y-auto

                    rounded-[36px]

                    border
                    border-white/[0.08]

                    bg-[#071713]

                    shadow-[0_20px_80px_rgba(0,0,0,0.6)]
                  "
                >

                  {/* BG */}
                  <div
                    className="
                      absolute
                      inset-0
                    "
                    style={{
                      backgroundImage: `
                        linear-gradient(
                          rgba(7,18,16,0.92),
                          rgba(7,18,16,0.96)
                        ),
                        url('/bgimg.png')
                      `,
                      backgroundSize:
                        "cover",
                      backgroundPosition:
                        "center",
                    }}
                  />

                  {/* CONTENT */}
                  <div className="relative z-10 p-8 sm:p-10">

                    {/* CLOSE */}
                    <button
                      onClick={() =>
                        setOpen(false)
                      }
                      className="
                        absolute
                        top-5
                        right-5

                        w-11
                        h-11

                        rounded-2xl

                        bg-white/[0.06]

                        text-white
                        text-xl

                        hover:bg-white/[0.12]

                        transition
                      "
                    >
                      ✕
                    </button>

                    {/* HEADER */}
                    <div className="mb-8">

                      <p
                        className="
                          text-sm
                          font-medium
                          text-slate-400
                          mb-3
                        "
                      >
                        ENROLLMENT
                      </p>

                      <h2
                        className="
                          text-4xl
                          font-black
                          tracking-tight
                          text-white
                        "
                      >
                        {course.title}
                      </h2>

                    </div>

                    {/* USER */}
                    <div
                      className="
                        rounded-3xl

                        border
                        border-white/[0.08]

                        bg-white/[0.04]

                        p-6
                        mb-7
                      "
                    >

                      <p className="text-sm text-slate-400 mb-2">
                        Logged in as
                      </p>

                      <p className="font-semibold text-xl text-white">
                        {user.fullName}
                      </p>

                      <p className="text-slate-400 mt-1">
                        {
                          user
                            .primaryEmailAddress
                            ?.emailAddress
                        }
                      </p>

                    </div>

                    {/* FORM */}
                    <div
                      className="
                        grid
                        grid-cols-1
                        sm:grid-cols-2
                        gap-5
                      "
                    >

                      {/* FULL NAME */}
                      <div>

                        <label className="text-sm text-slate-300 block mb-2">
                          Full Name
                        </label>

                        <input
                          value={
                            form.fullName
                          }
                          onChange={(e) =>
                            setForm({
                              ...form,
                              fullName:
                                e.target
                                  .value,
                            })
                          }
                          placeholder="Full Name"
                          className="
                            w-full
                            h-14

                            rounded-2xl

                            border
                            border-white/[0.08]

                            bg-white/[0.05]

                            px-5

                            text-white

                            outline-none
                          "
                        />

                      </div>

                      {/* EMAIL */}
                      <div>

                        <label className="text-sm text-slate-300 block mb-2">
                          Email
                        </label>

                        <input
                          value={
                            form.email
                          }
                          onChange={(e) =>
                            setForm({
                              ...form,
                              email:
                                e.target
                                  .value,
                            })
                          }
                          placeholder="Email"
                          className="
                            w-full
                            h-14

                            rounded-2xl

                            border
                            border-white/[0.08]

                            bg-white/[0.05]

                            px-5

                            text-white

                            outline-none
                          "
                        />

                      </div>

                      {/* PHONE */}
                      <div>

                        <label className="text-sm text-slate-300 block mb-2">
                          Phone Number
                        </label>

                        <input
                          value={
                            form.phone
                          }
                          onChange={(e) =>
                            setForm({
                              ...form,
                              phone:
                                e.target
                                  .value,
                            })
                          }
                          placeholder="Phone Number"
                          className="
                            w-full
                            h-14

                            rounded-2xl

                            border
                            border-white/[0.08]

                            bg-white/[0.05]

                            px-5

                            text-white

                            outline-none
                          "
                        />

                      </div>

                      {/* CITY */}
                      <div>

                        <label className="text-sm text-slate-300 block mb-2">
                          City
                        </label>

                        <input
                          value={
                            form.city
                          }
                          onChange={(e) =>
                            setForm({
                              ...form,
                              city:
                                e.target
                                  .value,
                            })
                          }
                          placeholder="City"
                          className="
                            w-full
                            h-14

                            rounded-2xl

                            border
                            border-white/[0.08]

                            bg-white/[0.05]

                            px-5

                            text-white

                            outline-none
                          "
                        />

                      </div>

                    </div>

                    {/* ADDRESS */}
                    <div className="mt-5">

                      <label className="text-sm text-slate-300 block mb-2">
                        Address
                      </label>

                      <textarea
                        value={
                          form.address
                        }
                        onChange={(e) =>
                          setForm({
                            ...form,
                            address:
                              e.target
                                .value,
                          })
                        }
                        placeholder="Enter full address"
                        className="
                          w-full

                          rounded-2xl

                          border
                          border-white/[0.08]

                          bg-white/[0.05]

                          px-5
                          py-4

                          text-white

                          outline-none

                          min-h-[110px]
                        "
                      />

                    </div>

                    {/* QR + RIGHT */}
                    <div
                      className="
                        mt-6

                        grid
                        grid-cols-1
                        md:grid-cols-2
                        gap-6
                      "
                    >

                      {/* QR */}
                      <div
                        className="
                          rounded-3xl

                          border
                          border-white/[0.08]

                          bg-white/[0.04]

                          p-5
                        "
                      >

                        <p className="text-white font-semibold mb-4">
                          Scan QR & Pay
                        </p>

                        <img
                          src="/qr.jpeg"
                          alt="QR"
                          className="
                            w-full
                            max-w-[260px]

                            rounded-2xl

                            border
                            border-white/[0.08]
                          "
                        />

                        <p className="text-slate-400 text-sm mt-4">
                          Complete payment
                          before enrollment.
                        </p>

                      </div>

                      {/* RIGHT */}
                      <div>

                        {/* TRANSACTION */}
                        <div>

                          <label className="text-sm text-slate-300 block mb-2">
                            Transaction Number
                          </label>

                          <input
                            value={
                              form.transactionNo
                            }
                            onChange={(e) =>
                              setForm({
                                ...form,
                                transactionNo:
                                  e.target
                                    .value,
                              })
                            }
                            placeholder="Enter transaction no."
                            className="
                              w-full
                              h-14

                              rounded-2xl

                              border
                              border-white/[0.08]

                              bg-white/[0.05]

                              px-5

                              text-white

                              outline-none
                            "
                          />

                        </div>

                        {/* BACKGROUND */}
                        <div className="mt-5">

                          <label className="text-sm text-slate-300 block mb-2">
                            Preparation Background
                          </label>

                          <textarea
                            value={
                              form.background
                            }
                            onChange={(e) =>
                              setForm({
                                ...form,
                                background:
                                  e.target
                                    .value,
                              })
                            }
                            placeholder="Tell about your preparation"
                            className="
                              w-full

                              rounded-2xl

                              border
                              border-white/[0.08]

                              bg-white/[0.05]

                              px-5
                              py-4

                              text-white

                              outline-none

                              min-h-[140px]
                            "
                          />

                        </div>

                      </div>

                    </div>

                    {/* BUTTON */}
                    <button
                      onClick={
                        handleEnroll
                      }
                      disabled={loading}
                      className="
                        mt-8

                        w-full
                        h-14

                        rounded-2xl

                        bg-gradient-to-r
                        from-blue-500
                        to-indigo-600

                        text-white
                        font-bold
                        text-lg

                        hover:scale-[1.01]

                        transition-all
                      "
                    >
                      {loading
                        ? "Processing..."
                        : "Update Profile & Enroll"}
                    </button>

                  </div>

                </div>

              </div>

            )}

          </>

        )}

      </div>

    </>
  );
}
