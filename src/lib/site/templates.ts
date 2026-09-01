import { defaultSectionData } from "./catalog";
import type { Section, SectionType, Site, Theme } from "./types";

export type TemplateId = "blank" | "north" | "harbor" | "practice";

export type Template = {
  id: TemplateId;
  name: string;
  tagline: string;
  blurb: string;
  cover: string;
  theme: Theme;
  sections: { type: SectionType; data: Section["data"] }[];
};

function section(
  type: SectionType,
  data: Partial<Section["data"]>,
): Template["sections"][number] {
  return { type, data: { ...defaultSectionData(type), ...data } as Section["data"] };
}

export const TEMPLATES: Template[] = [
  {
    id: "blank",
    name: "Blank leaf",
    tagline: "A hero, then whatever you add",
    blurb: "Start empty. Eight section types wait in the studio.",
    cover: "/media/practice-hero.jpg",
    theme: {
      preset: "paper",
      font: "serif",
      density: "regular",
      header: "minimal",
      footerNote: "Made with Lumen",
    },
    sections: [
      section("hero", {
        eyebrow: "Untitled",
        heading: "Name this place.",
        subheading: "Add a line, then open the studio and grow the page.",
        layout: "centered",
        image: "/media/practice-hero.jpg",
        primaryLabel: "Add a section",
        primaryHref: "#",
        secondaryLabel: "",
        secondaryHref: "",
      }),
    ],
  },
  {
    id: "north",
    name: "North Atelier",
    tagline: "Rooms for slower living",
    blurb: "An architecture practice. All eight sections, fully dressed.",
    cover: "/media/north-hero.jpg",
    theme: {
      preset: "paper",
      font: "serif",
      density: "air",
      header: "split",
      footerNote: "North Atelier · Rooms, interiors, landscapes",
    },
    sections: [
      section("hero", {
        eyebrow: "Architecture",
        heading: "Rooms that hold the quiet.",
        subheading:
          "Houses, interiors, and gardens drawn slowly — for people who want to stay.",
        image: "/media/north-hero.jpg",
        layout: "split",
        primaryLabel: "Begin a project",
        primaryHref: "#invite",
        secondaryLabel: "The work",
        secondaryHref: "#gallery",
      }),
      section("story", {
        eyebrow: "Practice",
        heading: "A small studio in the north.",
        body: "We began with a single house on a windy ridge. Fifteen years later the brief is still the same: rooms that feel inevitable, built from lime, oak, linen, and daylight. We take few projects. We stay with them.",
        image: "/media/north-story.jpg",
        stats: [
          { value: "15", label: "Years" },
          { value: "28", label: "Houses" },
          { value: "6", label: "Hands" },
        ],
      }),
      section("offerings", {
        eyebrow: "Work",
        heading: "What we take on.",
        items: [
          {
            icon: "compass",
            title: "Houses",
            body: "New rooms on old land. Plans that follow weather and walk.",
          },
          {
            icon: "lamp",
            title: "Interiors",
            body: "Joinery, plaster, and the furniture that belongs to a wall.",
          },
          {
            icon: "leaf",
            title: "Gardens",
            body: "Gravel, orchard, and the edge between house and field.",
          },
          {
            icon: "feather",
            title: "Stewardship",
            body: "Care after the keys: seasonal notes, repairs, a long view.",
          },
        ],
      }),
      section("gallery", {
        eyebrow: "Still",
        heading: "Selected rooms.",
        images: [
          { src: "/media/gallery-stone.jpg", alt: "Limestone meeting oak" },
          { src: "/media/gallery-chair.jpg", alt: "A chair in plaster light" },
          { src: "/media/gallery-window.jpg", alt: "Olive garden in fog" },
          { src: "/media/gallery-branch.jpg", alt: "Hydrangea on limestone" },
        ],
      }),
      section("voices", {
        eyebrow: "Notes",
        heading: "From people who stayed.",
        items: [
          {
            quote:
              "They treated the brief as a conversation, not a delivery. The house feels older than it is.",
            name: "M. Ellis",
            role: "House, Norfolk",
          },
          {
            quote:
              "Every junction was considered. Nothing shouts. That is rarer than it sounds.",
            name: "R. Adeyemi",
            role: "Studio, Lisbon",
          },
          {
            quote:
              "We live slower here. That was the point, and they understood it immediately.",
            name: "C. Berg",
            role: "Cottage, Skåne",
          },
        ],
      }),
      section("people", {
        eyebrow: "Studio",
        heading: "Who is here.",
        items: [
          {
            name: "Ada North",
            role: "Principal",
            bio: "Trained in rooms, not renderings. Leads every brief.",
          },
          {
            name: "Jonah Hale",
            role: "Making",
            bio: "Materials, joinery, and the quiet of a good detail.",
          },
          {
            name: "Sera Quinn",
            role: "Gardens",
            bio: "Planting that belongs to the house, and to the weather.",
          },
        ],
      }),
      section("questions", {
        eyebrow: "FAQ",
        heading: "Before we start.",
        items: [
          {
            q: "How do we begin?",
            a: "A letter. Tell us about the site, the season, and what you want to keep. If it is a fit, we visit.",
          },
          {
            q: "Do you work only in the north?",
            a: "The studio is here. The work travels when the brief is right.",
          },
          {
            q: "How long does a house take?",
            a: "Longer than a catalogue. Most houses take two to four years from first drawing to first fire.",
          },
        ],
      }),
      section("invite", {
        heading: "Write from the site.",
        body: "If a ridge, a terrace, or a tired room is on your mind, send a note. We read everything, and we take few projects.",
        primaryLabel: "Open a letter",
        primaryHref: "mailto:studio@north.example",
        note: "Replies within a week, even when the answer is no.",
      }),
    ],
  },
  {
    id: "harbor",
    name: "Harbor Goods",
    tagline: "Objects for the table",
    blurb: "A small product house. Clay, linen, and a short page.",
    cover: "/media/harbor-hero.jpg",
    theme: {
      preset: "harbor",
      font: "sans",
      density: "regular",
      header: "centered",
      footerNote: "Harbor Goods · Tableware, linen, light",
    },
    sections: [
      section("hero", {
        eyebrow: "Tableware",
        heading: "Objects for the table.",
        subheading:
          "Stoneware, linen, and glass made in small runs — meant to be used every day.",
        image: "/media/harbor-hero.jpg",
        layout: "overlay",
        primaryLabel: "See the collection",
        primaryHref: "#gallery",
        secondaryLabel: "The making",
        secondaryHref: "#story",
      }),
      section("story", {
        eyebrow: "Studio",
        heading: "Thrown, fired, folded.",
        body: "Harbor began on a kitchen table. The bowls are still thrown by two pairs of hands. Linen is woven to our weight. Nothing is marked with a season; pieces stay until they wear in.",
        image: "/media/north-story.jpg",
        stats: [
          { value: "3", label: "Kilns" },
          { value: "12", label: "Forms" },
          { value: "2", label: "Makers" },
        ],
      }),
      section("offerings", {
        eyebrow: "Collection",
        heading: "On the table.",
        items: [
          {
            icon: "droplet",
            title: "Stoneware",
            body: "Bowls and plates in a quiet glaze that shows the clay.",
          },
          {
            icon: "feather",
            title: "Linen",
            body: "Napkins and cloths in undyed flax, heavy enough to last.",
          },
          {
            icon: "sun",
            title: "Glass",
            body: "A carafe and tumblers, slightly uneven, catching morning.",
          },
        ],
      }),
      section("gallery", {
        eyebrow: "Still",
        heading: "The current run.",
        images: [
          { src: "/media/harbor-hero.jpg", alt: "Bowls on oak" },
          { src: "/media/gallery-branch.jpg", alt: "Vessel on plinth" },
          { src: "/media/gallery-stone.jpg", alt: "Stone and grain" },
          { src: "/media/gallery-chair.jpg", alt: "Chair in a plaster room" },
        ],
      }),
      section("invite", {
        heading: "Order a place setting.",
        body: "We ship in small batches. Leave a note with how many seats you keep.",
        primaryLabel: "Request a set",
        primaryHref: "mailto:orders@harbor.example",
        note: "Next firing in six weeks.",
      }),
    ],
  },
  {
    id: "practice",
    name: "The Practice",
    tagline: "Counsel for makers",
    blurb: "A quiet advisory. Sage walls, serif type, few sections.",
    cover: "/media/practice-hero.jpg",
    theme: {
      preset: "sage",
      font: "serif",
      density: "air",
      header: "minimal",
      footerNote: "The Practice · Counsel for makers",
    },
    sections: [
      section("hero", {
        eyebrow: "Advisory",
        heading: "Counsel for makers.",
        subheading:
          "A small practice for studios who want clearer work, and fewer of the wrong kind.",
        image: "/media/practice-hero.jpg",
        layout: "centered",
        primaryLabel: "Book an hour",
        primaryHref: "#invite",
        secondaryLabel: "How we work",
        secondaryHref: "#story",
      }),
      section("story", {
        eyebrow: "Approach",
        heading: "Fewer clients. Longer letters.",
        body: "We sit with a studio for a season. The work is conversation, editing, and the occasional hard no. No decks. No retainers that never end.",
        image: "/media/practice-hero.jpg",
        stats: [
          { value: "8", label: "Studios" },
          { value: "1", label: "Season" },
          { value: "0", label: "Decks" },
        ],
      }),
      section("questions", {
        eyebrow: "FAQ",
        heading: "Is this a fit?",
        items: [
          {
            q: "Who is this for?",
            a: "Independent studios and small houses who already have work, and want it sharper.",
          },
          {
            q: "What does an hour look like?",
            a: "A prepared letter from you, then a conversation. Notes follow the same day.",
          },
        ],
      }),
      section("invite", {
        heading: "Write a letter first.",
        body: "Tell us what you make, what you will not, and what the next season should hold.",
        primaryLabel: "Send a letter",
        primaryHref: "mailto:hello@practice.example",
        note: "We reply even when we cannot take the work.",
      }),
    ],
  },
];

export function getTemplate(id: string): Template {
  return TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0]!;
}

export type BuiltSite = Pick<Site, "name" | "tagline" | "theme" | "sections">;

export function materializeTemplate(
  template: Template,
  name: string,
  tagline: string,
): BuiltSite {
  return {
    name,
    tagline: tagline || template.tagline,
    theme: { ...template.theme },
    sections: template.sections.map((s, i) => ({
      id: crypto.randomUUID(),
      type: s.type,
      position: i,
      visible: true,
      data: structuredClone(s.data),
    })),
  };
}
