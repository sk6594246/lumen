import type {
  InviteData,
  OfferingsData,
  PeopleData,
  QuestionsData,
  SectionType,
  GalleryData,
  HeroData,
  SectionDataMap,
  StoryData,
  VoicesData,
} from "./types";

export const SECTION_META: Record<
  SectionType,
  { label: string; hint: string }
> = {
  hero: { label: "Hero", hint: "Opening statement and image" },
  story: { label: "Story", hint: "Narrative with a figure or two" },
  offerings: { label: "Offerings", hint: "What you make or do" },
  gallery: { label: "Gallery", hint: "A grid of stills" },
  voices: { label: "Voices", hint: "Quotes from others" },
  people: { label: "People", hint: "The hands behind the work" },
  questions: { label: "Questions", hint: "A short FAQ" },
  invite: { label: "Invite", hint: "Closing call to act" },
};

export const OFFERING_ICONS = [
  "compass",
  "pen",
  "ruler",
  "leaf",
  "lamp",
  "box",
  "sun",
  "droplet",
  "mountain",
  "clock",
  "book",
  "feather",
] as const;

export function defaultSectionData(type: SectionType): SectionDataMap[SectionType] {
  switch (type) {
    case "hero":
      return {
        eyebrow: "New page",
        heading: "A clear opening line.",
        subheading:
          "Say what this place is for in one breath. The rest of the page can wait.",
        primaryLabel: "Begin",
        primaryHref: "#invite",
        secondaryLabel: "Read on",
        secondaryHref: "#story",
        image: "/media/practice-hero.jpg",
        layout: "split",
      } satisfies HeroData;
    case "story":
      return {
        eyebrow: "About",
        heading: "A short history of the work.",
        body: "Write the story as you would tell it across a table. Keep it specific: a place, a material, a reason you started.",
        image: "/media/north-story.jpg",
        stats: [
          { value: "12", label: "Years" },
          { value: "40", label: "Rooms" },
          { value: "1", label: "Studio" },
        ],
      } satisfies StoryData;
    case "offerings":
      return {
        eyebrow: "Work",
        heading: "What we take on.",
        items: [
          {
            icon: "compass",
            title: "Direction",
            body: "A first conversation about place, brief, and pace.",
          },
          {
            icon: "ruler",
            title: "Making",
            body: "Drawings, samples, and the slow work of getting it right.",
          },
          {
            icon: "leaf",
            title: "Care",
            body: "What happens after the room is lived in.",
          },
        ],
      } satisfies OfferingsData;
    case "gallery":
      return {
        eyebrow: "Still",
        heading: "Selected rooms.",
        images: [
          { src: "/media/gallery-stone.jpg", alt: "Stone and oak" },
          { src: "/media/gallery-chair.jpg", alt: "Chair in plaster light" },
          { src: "/media/gallery-window.jpg", alt: "Garden through steel" },
          { src: "/media/gallery-branch.jpg", alt: "Branch in vessel" },
        ],
      } satisfies GalleryData;
    case "voices":
      return {
        eyebrow: "Notes",
        heading: "From people who stayed.",
        items: [
          {
            quote:
              "They treated the brief as a conversation, not a delivery.",
            name: "M. Ellis",
            role: "House, Norfolk",
          },
          {
            quote: "The rooms feel older than they are, in the best way.",
            name: "R. Adeyemi",
            role: "Studio, Lisbon",
          },
        ],
      } satisfies VoicesData;
    case "people":
      return {
        eyebrow: "Studio",
        heading: "Who is here.",
        items: [
          {
            name: "Ada North",
            role: "Principal",
            bio: "Trained in rooms, not renderings.",
          },
          {
            name: "Jonah Hale",
            role: "Making",
            bio: "Materials, joinery, and the quiet of a good detail.",
          },
        ],
      } satisfies PeopleData;
    case "questions":
      return {
        eyebrow: "FAQ",
        heading: "Before we start.",
        items: [
          {
            q: "How do we begin?",
            a: "A letter or a call. We ask about the site, the season, and what you want to keep.",
          },
          {
            q: "Where do you work?",
            a: "Wherever the work is. The studio is small on purpose.",
          },
        ],
      } satisfies QuestionsData;
    case "invite":
      return {
        heading: "Write to us.",
        body: "If a room, a table, or a season is on your mind, send a note. We read everything.",
        primaryLabel: "Open a letter",
        primaryHref: "mailto:hello@example.com",
        note: "Replies within a few days.",
      } satisfies InviteData;
  }
}
