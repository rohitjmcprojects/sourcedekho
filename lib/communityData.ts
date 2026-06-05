export type CommunitySubject = {
  id: number;
  title: string;
  lectures: number;
};

export type Community = {
  id: number;
  name: string;
  slug: string;
  description: string;
  members: number;
  progress: number;
  subjects: CommunitySubject[];
};

export const communities: Community[] = [
  {
    id: 1,
    name: "HCS 2026",
    slug: "hcs-2026",
    description:
      "Complete preparation community for Haryana Civil Services 2026.",
    members: 1240,
    progress: 62,
    subjects: [
      {
        id: 1,
        title: "History",
        lectures: 24,
      },
      {
        id: 2,
        title: "Polity",
        lectures: 18,
      },
      {
        id: 3,
        title: "Economics",
        lectures: 16,
      },
      {
        id: 4,
        title: "Geography",
        lectures: 20,
      },
    ],
  },
  {
    id: 2,
    name: "UPPCS 2026",
    slug: "uppcs-2026",
    description:
      "Daily classes, notes, MCQs, and PYQs for UPPCS aspirants.",
    members: 2140,
    progress: 48,
    subjects: [
      {
        id: 1,
        title: "Ancient History",
        lectures: 14,
      },
      {
        id: 2,
        title: "Modern History",
        lectures: 22,
      },
      {
        id: 3,
        title: "Science",
        lectures: 28,
      },
      {
        id: 4,
        title: "Current Affairs",
        lectures: 32,
      },
    ],
  },
  {
    id: 3,
    name: "RAS 2026",
    slug: "ras-2026",
    description:
      "Focused Rajasthan Administrative Services preparation.",
    members: 980,
    progress: 41,
    subjects: [
      {
        id: 1,
        title: "Rajasthan GK",
        lectures: 26,
      },
      {
        id: 2,
        title: "Polity",
        lectures: 18,
      },
      {
        id: 3,
        title: "Economics",
        lectures: 14,
      },
    ],
  },
  {
    id: 4,
    name: "UPSC 2027",
    slug: "upsc-2027",
    description:
      "Premium UPSC preparation ecosystem for 2027 aspirants.",
    members: 4520,
    progress: 35,
    subjects: [
      {
        id: 1,
        title: "GS",
        lectures: 40,
      },
      {
        id: 2,
        title: "Ethics",
        lectures: 16,
      },
      {
        id: 3,
        title: "Optional",
        lectures: 24,
      },
      {
        id: 4,
        title: "Essay",
        lectures: 12,
      },
    ],
  },
];

export function getCommunity(slug: string) {
  return communities.find(
    (community) => community.slug === slug
  );
}
