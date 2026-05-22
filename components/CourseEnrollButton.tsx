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
    if (!user) return;

    const initialForm = {
      fullName:
        user.fullName ||
        `${user.firstName || ""} ${user.lastName || ""}`,
      email:
        user.primaryEmailAddress
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
    };

    setForm(initialForm);

    const fetchSavedProfile = async () => {
      try {
        const res = await fetch(
          `/api/get-profile?clerkUserId=${user.id}`
        );
        const data = await res.json();

        if (!data?.profile) return;

        setForm((prev) => ({
          fullName:
            prev.fullName || data.profile.full_name || "",
          email:
            prev.email || data.profile.email || "",
          phone:
            prev.phone || data.profile.phone || "",
          city:
            prev.city || data.profile.city || "",
          address:
            prev.address || data.profile.address || "",
          transactionNo: prev.transactionNo,
          background:
            prev.background || data.profile.background || "",
        }));
      } catch (error) {
        console.log(error);
      }
    };

    fetchSavedProfile();
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

        {/* LOGIN */}
        {!user ? (

          <SignInButton mode="modal">

            <button
              className="
                px-6
                py-3

                rounded-2xl

                border
                border-white/[0.08]

                bg-gradient-to-br
                from-blue-500/20
                to-indigo-500/20

                backdrop-blur-xl

                text-white

                font-semibold
                text-sm

                transition-all
                duration-300

                hover:border-white/[0.15]
                hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]
                hover:-translate-y-1
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
                px-6
                py-3

                rounded-2xl

                border
                border-white/[0.08]

                bg-gradient-to-br
                from-blue-500/20
                to-indigo-500/20

                backdrop-blur-xl

                text-white

                font-semibold
                text-sm

                transition-all
                duration-300

                hover:border-white/[0.15]
                hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]
                hover:-translate-y-1
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
                  <div className="relative z-10 p-6 sm:p-8 max-h-[80vh] overflow-y-auto">

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

                    {/* FORM */}
                    <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-8">

                      {/* LEFT: PERSONAL DETAILS */}
                      <div className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <input
                            value={form.fullName}
                            onChange={(e) =>
                              setForm({
                                ...form,
                                fullName: e.target.value,
                              })
                            }
                            placeholder="Full Name"
                            className="h-10 text-sm rounded-2xl border border-white/[0.08] bg-white/[0.05] px-4 text-white outline-none placeholder-slate-500"
                          />

                          <input
                            value={form.email}
                            onChange={(e) =>
                              setForm({
                                ...form,
                                email: e.target.value,
                              })
                            }
                            placeholder="Email Address"
                            className="h-10 text-sm rounded-2xl border border-white/[0.08] bg-white/[0.05] px-4 text-white outline-none placeholder-slate-500"
                          />

                          <input
                            value={form.phone}
                            onChange={(e) =>
                              setForm({
                                ...form,
                                phone: e.target.value,
                              })
                            }
                            placeholder="Phone Number"
                            className="h-10 text-sm rounded-2xl border border-white/[0.08] bg-white/[0.05] px-4 text-white outline-none placeholder-slate-500"
                          />

                          <input
                            value={form.city}
                            onChange={(e) =>
                              setForm({
                                ...form,
                                city: e.target.value,
                              })
                            }
                            placeholder="City"
                            className="h-10 text-sm rounded-2xl border border-white/[0.08] bg-white/[0.05] px-4 text-white outline-none placeholder-slate-500"
                          />
                        </div>

                        <textarea
                          value={form.address}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              address: e.target.value,
                            })
                          }
                          placeholder="Enter full address"
                          className="w-full text-sm rounded-2xl border border-white/[0.08] bg-white/[0.05] px-4 py-3 text-white outline-none min-h-[96px] placeholder-slate-500"
                        />

                        {/* Preparation background moved below address with reduced height */}
                        <div>
                          <textarea
                            value={form.background}
                            onChange={(e) =>
                              setForm({
                                ...form,
                                background: e.target.value,
                              })
                            }
                            placeholder="Tell about your preparation"
                            className="w-full text-sm rounded-2xl border border-white/[0.08] bg-white/[0.05] px-4 py-3 text-white outline-none min-h-[120px] placeholder-slate-500"
                          />
                        </div>
                      </div>

                      {/* RIGHT: PAYMENT CODE + TRANSACTION */}
                      <div className="space-y-5">
                        <div className="rounded-3xl border border-white/[0.08] bg-white/[0.04] p-5">
                          <p className="text-white font-semibold mb-4 text-sm">Scan QR & Pay</p>
                          <img
                            src="/qr.png"
                            alt="QR"
                            className="w-full rounded-2xl border border-white/[0.08]"
                          />
                          <p className="text-slate-400 text-xs mt-3">Complete payment before enrollment.</p>
                        </div>

                        <div className="rounded-3xl border border-white/[0.08] bg-white/[0.04] p-5">
                          <input
                            value={form.transactionNo}
                            onChange={(e) =>
                              setForm({
                                ...form,
                                transactionNo: e.target.value,
                              })
                            }
                            placeholder="Transaction Number"
                            className="w-full h-10 text-sm rounded-2xl border border-white/[0.08] bg-white/[0.05] px-4 text-white outline-none placeholder-slate-500"
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
