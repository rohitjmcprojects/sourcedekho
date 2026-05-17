"use client";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  GraduationCap,
  Settings,
} from "lucide-react";

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
  return (
    <aside className="w-64 min-h-screen border-r bg-white p-5 flex flex-col">
      {/* LOGO */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight">
          SourceDekho
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Competitive Exam Platform
        </p>
      </div>

      {/* MENU */}
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.title}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 transition"
            >
              <Icon size={20} />

              <span className="font-medium">
                {item.title}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}