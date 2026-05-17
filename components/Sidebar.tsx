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
        bg-white/90
        backdrop-blur-xl
        border
        shadow-xl
        rounded-3xl
        z-50
        transition-all
        duration-300
        flex
        flex-col
        ${collapsed ? "w-24" : "w-72"}
      `}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between p-5 border-b">
        {!collapsed && (
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              SourceDekho
            </h1>

            <p className="text-xs text-gray-500 mt-1">
              Competitive Exam Platform
            </p>
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-10 h-10 rounded-full border flex items-center justify-center hover:bg-gray-100 transition"
        >
          {collapsed ? (
            <ChevronRight size={18} />
          ) : (
            <ChevronLeft size={18} />
          )}
        </button>
      </div>

      {/* MENU */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.title}
              href={item.href}
              className="flex items-center gap-4 px-4 py-4 rounded-2xl hover:bg-gray-100 transition"
            >
              <div className="min-w-[24px] flex justify-center">
                <Icon size={22} />
              </div>

              {!collapsed && (
                <span className="font-medium text-[15px]">
                  {item.title}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* AUTH + FOOTER */}
      <div className="p-4 border-t space-y-4">
        {/* AUTH */}
            {/* AUTH */}
<div className="flex items-center justify-center">
  {user ? (
    <div className="flex items-center gap-3">
      <UserButton />

      {!collapsed && (
        <div className="flex flex-col overflow-hidden">
          <p className="text-sm font-semibold truncate">
            {user.fullName || "User"}
          </p>

          <p className="text-xs text-gray-500 truncate max-w-[140px]">
            {user.primaryEmailAddress?.emailAddress}
          </p>
        </div>
      )}
    </div>
  ) : (
    <SignInButton mode="modal">
      <button
        className={`
          rounded-2xl
          bg-black
          text-white
          transition
          hover:opacity-90
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



        {/* FOOTER */}
        {!collapsed ? (
          <div className="rounded-2xl bg-gray-100 p-4">
            <p className="text-sm font-semibold">
              SourceDekho
            </p>

            <p className="text-xs text-gray-500 mt-1">
              Modern learning dashboard
            </p>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-10 h-10 rounded-full bg-black" />
          </div>
        )}
      </div>
    </div>
  );
}