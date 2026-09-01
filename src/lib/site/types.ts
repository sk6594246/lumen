export const SECTION_TYPES = [
  "hero",
  "story",
  "offerings",
  "gallery",
  "voices",
  "people",
  "questions",
  "invite",
] as const;

export type SectionType = (typeof SECTION_TYPES)[number];

export const THEME_PRESETS = [
  "paper",
  "night",
  "sage",
  "harbor",
  "blush",
] as const;
export type ThemePreset = (typeof THEME_PRESETS)[number];

export type Theme = {
  preset: ThemePreset;
  font: "serif" | "sans";
  density: "air" | "regular" | "compact";
  header: "minimal" | "split" | "centered";
  footerNote: string;
};

export type HeroData = {
  eyebrow: string;
  heading: string;
  subheading: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
  image: string;
  layout: "split" | "overlay" | "centered";
};

export type StoryData = {
  eyebrow: string;
  heading: string;
  body: string;
  image: string;
  stats: { label: string; value: string }[];
};

export type OfferingsData = {
  eyebrow: string;
  heading: string;
  items: { icon: string; title: string; body: string }[];
};

export type GalleryData = {
  eyebrow: string;
  heading: string;
  images: { src: string; alt: string }[];
};

export type VoicesData = {
  eyebrow: string;
  heading: string;
  items: { quote: string; name: string; role: string }[];
};

export type PeopleData = {
  eyebrow: string;
  heading: string;
  items: { name: string; role: string; bio: string }[];
};

export type QuestionsData = {
  eyebrow: string;
  heading: string;
  items: { q: string; a: string }[];
};

export type InviteData = {
  heading: string;
  body: string;
  primaryLabel: string;
  primaryHref: string;
  note: string;
};

export type SectionDataMap = {
  hero: HeroData;
  story: StoryData;
  offerings: OfferingsData;
  gallery: GalleryData;
  voices: VoicesData;
  people: PeopleData;
  questions: QuestionsData;
  invite: InviteData;
};

export type Section = {
  id: string;
  type: SectionType;
  position: number;
  visible: boolean;
  data: SectionDataMap[SectionType];
};

export type Site = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  theme: Theme;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  sections: Section[];
};

export type SiteCard = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  theme: Theme;
  cover: string | null;
  sectionCount: number;
};

export const MEDIA_LIBRARY = [
  { src: "/media/north-hero.jpg", alt: "Sunlit plaster living room" },
  { src: "/media/north-story.jpg", alt: "Atelier work table" },
  { src: "/media/harbor-hero.jpg", alt: "Stoneware on oak" },
  { src: "/media/practice-hero.jpg", alt: "Reading room" },
  { src: "/media/gallery-stone.jpg", alt: "Limestone and oak joint" },
  { src: "/media/gallery-chair.jpg", alt: "Sculptural wooden chair" },
  { src: "/media/gallery-window.jpg", alt: "Window onto a misty garden" },
  { src: "/media/gallery-branch.jpg", alt: "Hydrangea in stoneware" },
] as const;

export const DEFAULT_THEME: Theme = {
  preset: "paper",
  font: "serif",
  density: "regular",
  header: "split",
  footerNote: "Made with Lumen",
};

export function isSectionType(value: string): value is SectionType {
  return (SECTION_TYPES as readonly string[]).includes(value);
}
