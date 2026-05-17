"use client";

import { useState } from "react";
import Link from "next/link";

import {
  LayoutDashboard,
  Users,
  BookOpen,
  GraduationCap,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import {
  UserButton,
  useUser,
  SignInButton,
} from "@clerk/nextjs";

const menuItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Communities",
    href: "/communities",
    icon: Users,
  },
  {
    title: "Courses",
    href: "/courses",
    icon: BookOpen,
  },
  {
    title: "My Learning",
    href: "/learning",
    icon: GraduationCap,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(true);

  const { user } = useUser();

  return (
    <div
      className={`
        fixed
        top-5
        left-5
        h-[calc(100vh-40px)]
        z-50
        flex
        flex-col
        overflow-hidden

        transition-all
        duration-500

        ${collapsed ? "w-24" : "w-72"}

        rounded-[32px]

        border
        border-white/[0.08]

        bg-[#0f172a]/80

        backdrop-blur-2xl

        shadow-[0_8px_50px_rgba(0,0,0,0.55)]

        before:absolute
        before:inset-0
        before:bg-gradient-to-b
        before:from-white/[0.06]
        before:to-transparent
        before:pointer-events-none
      `}
    >
      {/* AMBIENT GLOW */}
      <div
        className="
          absolute
          -top-24
          -left-24
          w-60
          h-60
          bg-blue-500/10
          blur-3xl
          rounded-full
          pointer-events-none
        "
      />

      {/* HEADER */}
      <div
        className="
          relative
          flex
          items-center
          justify-between
          px-5
          py-5

          border-b
          border-white/[0.08]
        "
      >
        {!collapsed && (
          <div>
            <h1
              className="
                text-[30px]
                font-bold
                tracking-tight
                text-white
              "
            >
              SourceDekho
            </h1>

            <p
              className="
                text-xs
                text-slate-400
                mt-1
              "
            >
              Competitive Exam Platform
            </p>
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="
            flex
            items-center
            justify-center

            w-11
            h-11

            rounded-2xl

            border
            border-white/[0.08]

            bg-white/[0.04]

            hover:bg-white/[0.08]

            transition-all
            duration-300

            text-white
          "
        >
          {collapsed ? (
            <ChevronRight size={18} />
          ) : (
            <ChevronLeft size={18} />
          )}
        </button>
      </div>

      {/* MENU */}
      <nav
        className="
          relative
          flex-1

          px-4
          py-5

          space-y-3

          overflow-y-auto
        "
      >
        {!collapsed && (
          <p
            className="
              px-4
              mb-2

              text-[11px]
              font-semibold

              tracking-[0.25em]

              text-slate-500

              uppercase
            "
          >
            Main
          </p>
        )}

        {menuItems.map((item, index) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.title}
              href={item.href}
              className={`
                group
                relative

                flex
                items-center
                gap-4

                px-4
                py-4

                rounded-2xl

                transition-all
                duration-300

                ${
                  index === 0
                    ? `
                      bg-gradient-to-r
                      from-blue-500/20
                      to-indigo-500/20

                      border
                      border-white/[0.08]

                      backdrop-blur-xl

                      shadow-[0_0_30px_rgba(59,130,246,0.12)]
                    `
                    : `
                      text-slate-300

                      hover:bg-white/[0.04]

                      hover:border
                      hover:border-white/[0.06]
                    `
                }
              `}
            >
              {/* HOVER LIGHT */}
              <div
                className="
                  absolute
                  inset-0

                  rounded-2xl

                  opacity-0
                  group-hover:opacity-100

                  transition
                  duration-300

                  bg-gradient-to-r
                  from-white/[0.03]
                  to-transparent
                "
              />

              <div
                className="
                  relative
                  min-w-[24px]

                  flex
                  justify-center

                  text-white
                "
              >
                <Icon
                  size={21}
                  strokeWidth={2.2}
                />
              </div>

              {!collapsed && (
                <span
                  className="
                    relative

                    text-[15px]
                    font-medium

                    text-slate-200
                  "
                >
                  {item.title}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* FOOTER */}
      <div
        className="
          relative

          p-4

          border-t
          border-white/[0.08]

          space-y-4
        "
      >
        {/* USER */}
        <div className="flex items-center justify-center">
          {user ? (
            <div
              className={`
                flex
                items-center

                ${
                  collapsed
                    ? "justify-center"
                    : "gap-3 w-full"
                }
              `}
            >
              <UserButton />

              {!collapsed && (
                <div className="flex flex-col overflow-hidden">
                  <p
                    className="
                      text-sm
                      font-semibold
                      text-white
                      truncate
                    "
                  >
                    {user.fullName || "User"}
                  </p>

                  <p
                    className="
                      text-xs
                      text-slate-400

                      truncate
                      max-w-[150px]
                    "
                  >
                    {
                      user.primaryEmailAddress
                        ?.emailAddress
                    }
                  </p>
                </div>
              )}
            </div>
          ) : (
            <SignInButton mode="modal">
              <button
                className={`
                  rounded-2xl

                  border
                  border-white/[0.08]

                  bg-white/[0.05]

                  text-white

                  hover:bg-white/[0.08]

                  transition-all
                  duration-300

                  ${
                    collapsed
                      ? "w-12 h-12 text-sm"
                      : "w-full px-4 py-3 font-medium"
                  }
                `}
              >
                {collapsed ? "→" : "Sign In"}
              </button>
            </SignInButton>
          )}
        </div>

        {/* FOOTER CARD */}
        {!collapsed ? (
          <div
            className="
              relative
              overflow-hidden

              rounded-3xl

              border
              border-white/[0.06]

              bg-white/[0.04]

              backdrop-blur-xl

              p-4
            "
          >
            {/* INNER GLOW */}
            <div
              className="
                absolute
                inset-0

                bg-gradient-to-br
                from-blue-500/10
                via-indigo-500/5
                to-transparent

                pointer-events-none
              "
            />

            <p
              className="
                relative

                text-sm
                font-semibold

                text-white
              "
            >
              SourceDekho
            </p>

            <p
              className="
                relative

                text-xs

                text-slate-400

                mt-1
              "
            >
              Modern learning dashboard
            </p>
          </div>
        ) : (
          <div className="flex justify-center">
            <div
              className="
                w-10
                h-10

                rounded-2xl

                border
                border-white/[0.08]

                bg-gradient-to-br
                from-blue-500/20
                to-indigo-500/20

                backdrop-blur-xl
              "
            />
          </div>
        )}
      </div>
    </div>
  );
}