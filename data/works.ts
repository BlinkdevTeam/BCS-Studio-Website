// data/works.ts
export type WorkCategory =
  | "event"
  | "portraits"
  | "studio"
  | "graduation";

export interface Work {
  id: number;
  title: string;
  category: WorkCategory;
  image: string;
}

export const WORKS: Work[] = [
  {
    id: 1,
    title: "Corporate Event",
    category: "event",
    image: "/assets/portraits/8R 0.jpg",
  },
  {
    id: 2,
    title: "Studio Portrait",
    category: "portraits",
    image: "/assets/blinkworks/bcs_ad_10_things.mp4",
  },
  {
    id: 3,
    title: "Creative Studio Rental",
    category: "studio",
    image: "/assets/portraits/8R 0.jpg",
  },
  {
    id: 4,
    title: "Graduation Shoot",
    category: "graduation",
    image: "/assets/portraits/8R 0.jpg",
  },
  {
    id: 5,
    title: "Wedding Coverage",
    category: "event",
    image: "/assets/blinkworks/bcs_ad_10_things.mp4",
  },
];
