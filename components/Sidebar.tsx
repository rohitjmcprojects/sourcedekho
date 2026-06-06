"use client";

import { useState } from "react";
import Link from "next/link";

import {
  LayoutDashboard,
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
    title: "Home",
    href: "/",
    icon: LayoutDashboard,
  },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] =
    useState(true);

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

        ${
          collapsed
            ? "w-24"
            : "w-72"
        }

        rounded-[32px]

        border
        border-[#D8CFC2]

        bg-[#EFE8DE]/95

        backdrop-blur-xl

        shadow-[0_10px_40px_rgba(0,0,0,0.08)]
      `}
    >

      {/* HEADER */}
      <div
        className="
          flex
          items-center
          justify-between

          px-5
          py-5

          border-b
          border-[#D8CFC2]
        "
      >
        {!collapsed && (
          <div>
            <h1
              className="
                text-[28px]

                font-bold

                tracking-tight

                text-[#16212F]
              "
            >
              SourceDekho
            </h1>

            <p
              className="
                mt-1

                text-xs

                text-[#6A6A6A]
              "
            >
              Civil Services Preparation
            </p>
          </div>
        )}

        <button
          onClick={() =>
            setCollapsed(
              !collapsed
            )
          }
          className="
            flex
            items-center
            justify-center

            h-11
            w-11

            rounded-2xl

            border
            border-[#D8CFC2]

            bg-[#F7F3ED]

            text-[#16212F]

            transition-all

            hover:bg-white
          "
        >
          {collapsed ? (
            <ChevronRight
              size={18}
            />
          ) : (
            <ChevronLeft
              size={18}
            />
          )}
        </button>
      </div>

            {/* NAVIGATION */}
      <nav
        className="
          flex-1

          px-4
          py-5

          overflow-y-auto
        "
      >
        {!collapsed && (
          <p
            className="
              mb-4

              px-3

              text-[11px]
              font-semibold

              tracking-[0.18em]

              uppercase

              text-[#6A6A6A]
            "
          >
            Navigation
          </p>
        )}

        <div className="space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.title}
                href={item.href}
                className={`
                  group

                  flex
                  items-center

                  ${
                    collapsed
                      ? "justify-center"
                      : "gap-4"
                  }

                  rounded-2xl

                  px-4
                  py-4

                  transition-all
                  duration-200

                  ${
                    index === 0
                      ? `
                        bg-[#E8DED2]

                        border
                        border-[#D8CFC2]

                        shadow-sm
                      `
                      : `
                        hover:bg-[#F7F3ED]
                      `
                  }
                `}
              >
                {/* ICON */}
                <div
                  className="
                    flex
                    items-center
                    justify-center

                    min-w-[24px]

                    text-[#1F3D5A]
                  "
                >
                  <Icon
                    size={20}
                    strokeWidth={2.2}
                  />
                </div>

                {/* LABEL */}
                {!collapsed && (
                  <span
                    className="
                      text-[15px]

                      font-medium

                      text-[#16212F]
                    "
                  >
                    {item.title}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

            {/* FOOTER */}
      <div
        className="
          p-4

          border-t
          border-[#D8CFC2]
        "
      >
        {/* USER */}
        <div
          className="
            flex
            items-center
            justify-center
          "
        >
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
                <div
                  className="
                    flex
                    flex-col

                    overflow-hidden
                  "
                >
                  <p
                    className="
                      truncate

                      text-sm
                      font-semibold

                      text-[#16212F]
                    "
                  >
                    {user.fullName ||
                      "User"}
                  </p>

                  <p
                    className="
                      truncate

                      text-xs

                      text-[#6A6A6A]

                      max-w-[160px]
                    "
                  >
                    {
                      user
                        .primaryEmailAddress
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
                  border-[#D8CFC2]

                  bg-[#F7F3ED]

                  text-[#16212F]

                  transition-all

                  hover:bg-white

                  ${
                    collapsed
                      ? `
                        h-12
                        w-12
                      `
                      : `
                        w-full
                        py-3
                        px-4

                        font-medium
                      `
                  }
                `}
              >
                {collapsed
                  ? "→"
                  : "Sign In"}
              </button>
            </SignInButton>
          )}
        </div>

        {/* BRAND CARD */}
        {!collapsed ? (
          <div
            className="
              mt-4

              rounded-[24px]

              border
              border-[#D8CFC2]

              bg-[#F7F3ED]

              p-4
            "
          >
            <p
              className="
                text-sm

                font-semibold

                text-[#16212F]
              "
            >
              SourceDekho
            </p>

            <p
              className="
                mt-1

                text-xs

                leading-5

                text-[#6A6A6A]
              "
            >
              Premium preparation
              platform for UPSC,
              HCS, UPPCS and
              other Civil Services
              examinations.
            </p>
          </div>
        ) : (
          <div
            className="
              mt-4

              flex
              justify-center
            "
          >
            <div
              className="
                h-10
                w-10

                rounded-2xl

                border
                border-[#D8CFC2]

                bg-[#F7F3ED]
              "
            />
          </div>
        )}
      </div>
    </div>
  );
}