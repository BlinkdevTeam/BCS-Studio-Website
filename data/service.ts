// data/works.ts
export type ServiceCategory = "portraits" | "studio" | "event";

export interface ServiceAddon {
  id: string;
  label: string;
  price: number;
}

export interface Service {
  id: number;
  title: string;
  slug: string;
  desc: string;
  price: number;
  category: ServiceCategory;
  image: string;
  inclusions: string[];
  addons: ServiceAddon[];
}


export const SERVICES: Service[] = [
  {
    id: 1,
    slug: "studio-solo",
    title: "Solo",
    desc: "Individual portrait sessions that capture your unique personality with professional lighting and artistic direction.",
    price: 150,
    category: "portraits",
    image: "/assets/portraits/8R 0.jpg",
    inclusions: [
      "1-hour studio session",
      "Professional lighting setup",
      "5 edited digital photos",
    ],
    addons: [
      { id: "addon-1", label: "Extra 1-hour session", price: 200 },
      { id: "addon-2", label: "Printed photo package", price: 500 },
      { id: "addon-3", label: "Makeup & styling", price: 300 },
    ],
  },
  {
    id: 2,
    slug: "studio-grad",
    title: "Graduation",
    desc: "Celebrate your milestone with a professional graduation photoshoot.",
    price: 150,
    category: "portraits",
    image: "/assets/blinkworks/bcs_ad_10_things.mp4",
    inclusions: [
      "Graduation-themed setup",
      "Free cap & toga use",
      "8 edited digital photos",
    ],
    addons: [
      { id: "addon-1", label: "Extra 1-hour session", price: 200 },
      { id: "addon-2", label: "Printed photo package", price: 500 },
      { id: "addon-3", label: "Makeup & styling", price: 300 },
    ],
  },
  {
    id: 3,
    slug: "studio-couple",
    title: "Couple",
    desc: "Capture meaningful moments together in a cozy studio environment.",
    price: 750,
    category: "portraits",
    image: "/assets/portraits/8R 0.jpg",
    inclusions: [
      "1-hour couple session",
      "2 outfit changes",
      "10 edited digital photos",
    ],
    addons: [
      { id: "addon-1", label: "Extra 1-hour session", price: 200 },
      { id: "addon-2", label: "Printed photo package", price: 500 },
      { id: "addon-3", label: "Makeup & styling", price: 300 },
    ],
  },
  {
    id: 4,
    slug: "studio-group",
    title: "Group",
    desc: "Perfect for friends, families, or small teams.",
    price: 150,
    category: "portraits",
    image: "/assets/portraits/8R 0.jpg",
    inclusions: [
      "Group studio setup",
      "Up to 6 people",
      "8 edited digital photos",
    ],
    addons: [],
  },
  {
    id: 5,
    slug: "rental-regular",
    title: "Regular",
    desc: "A flexible studio rental option for creators and photographers.",
    price: 150,
    category: "studio",
    image: "/assets/portraits/8R 0.jpg",
    inclusions: [
      "1-hour studio access",
      "Basic lighting equipment",
      "Air-conditioned space",
    ],
    addons: [],
  },
  {
    id: 6,
    slug: "rental-green",
    title: "Green Screen",
    desc: "Ideal for video shoots, ads, and creative productions.",
    price: 150,
    category: "studio",
    image: "/assets/portraits/8R 0.jpg",
    inclusions: [
      "Green screen backdrop",
      "Studio lighting included",
      "Video-friendly space",
    ],
    addons: [],
  },
];
