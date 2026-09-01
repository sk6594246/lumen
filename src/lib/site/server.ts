import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { defaultSectionData } from "./catalog";
import {
  getTemplate,
  materializeTemplate,
  type TemplateId,
} from "./templates";
import {
  DEFAULT_THEME,
  isSectionType,
  type Section,
  type SectionType,
  type Site,
  type SiteCard,
  type Theme,
} from "./types";

type SiteRow = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  admin_key: string;
  theme: unknown;
  published: boolean;
  created_at: string;
  updated_at: string;
};

type SectionRow = {
  id: string;
  site_id: string;
  type: string;
  position: number;
  visible: boolean;
  data: unknown;
};

function asObject<T>(value: unknown, fallback: T): T {
  if (value == null) return fallback;
  if (typeof value === "string") {
    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  }
  if (typeof value === "object") return value as T;
  return fallback;
}

function asIso(value: unknown): string {
  if (typeof value === "string") return value;
  if (value instanceof Date) return value.toISOString();
  return new Date().toISOString();
}

function parseTheme(value: unknown): Theme {
  const raw = asObject<Partial<Theme>>(value, {});
  return {
    preset: raw.preset ?? DEFAULT_THEME.preset,
    font: raw.font ?? DEFAULT_THEME.font,
    density: raw.density ?? DEFAULT_THEME.density,
    header: raw.header ?? DEFAULT_THEME.header,
    footerNote: raw.footerNote ?? DEFAULT_THEME.footerNote,
  };
}

function parseSection(row: SectionRow): Section | null {
  if (!isSectionType(row.type)) return null;
  return {
    id: row.id,
    type: row.type,
    position: Number(row.position),
    visible: Boolean(row.visible),
    data: asObject(row.data, defaultSectionData(row.type)),
  };
}

function toPublicSite(row: SiteRow, sections: Section[]): Site {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    tagline: row.tagline,
    theme: parseTheme(row.theme),
    published: Boolean(row.published),
    createdAt: asIso(row.created_at),
    updatedAt: asIso(row.updated_at),
    sections: sections.sort((a, b) => a.position - b.position),
  };
}

function normalizeSlug(value: string) {
  const slug = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 32);
  if (slug.length < 2) throw new Error("Choose a longer address.");
  return slug;
}

function generateKey() {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 16);
}

const DEMO_SITES: { slug: string; key: string; template: TemplateId }[] = [
  { slug: "north", key: "north-atelier", template: "north" },
  { slug: "harbor", key: "harbor-goods", template: "harbor" },
];

async function insertBuilt(
  siteId: string,
  slug: string,
  name: string,
  tagline: string,
  adminKey: string,
  theme: Theme,
  sections: Section[],
) {
  const sql = await getSql();
  await sql.query(
    `insert into sites (id, slug, name, tagline, admin_key, theme, published)
     values ($1, $2, $3, $4, $5, $6::jsonb, true)`,
    [siteId, slug, name, tagline, adminKey, JSON.stringify(theme)],
  );
  for (const section of sections) {
    await sql.query(
      `insert into sections (id, site_id, type, position, visible, data)
       values ($1, $2, $3, $4, $5, $6::jsonb)`,
      [
        section.id,
        siteId,
        section.type,
        section.position,
        section.visible,
        JSON.stringify(section.data),
      ],
    );
  }
}

async function ensureSeed() {
  const sql = await getSql();
  const existing = await sql<{ slug: string }>`select slug from sites`;
  const have = new Set(existing.map((r) => r.slug));
  for (const demo of DEMO_SITES) {
    if (have.has(demo.slug)) continue;
    const template = getTemplate(demo.template);
    const built = materializeTemplate(template, template.name, template.tagline);
    await insertBuilt(
      crypto.randomUUID(),
      demo.slug,
      built.name,
      built.tagline,
      demo.key,
      built.theme,
      built.sections,
    );
  }
}

async function loadSections(siteId: string): Promise<Section[]> {
  const sql = await getSql();
  const rows = await sql<SectionRow>`
    select id, site_id, type, position, visible, data
    from sections
    where site_id = ${siteId}
    order by position asc
  `;
  return rows
    .map(parseSection)
    .filter((s): s is Section => s !== null);
}

async function loadSiteBySlug(slug: string): Promise<{ row: SiteRow; site: Site } | null> {
  const sql = await getSql();
  const rows = await sql<SiteRow>`
    select id, slug, name, tagline, admin_key, theme, published, created_at, updated_at
    from sites
    where slug = ${slug}
    limit 1
  `;
  const row = rows[0];
  if (!row) return null;
  const sections = await loadSections(row.id);
  return { row, site: toPublicSite(row, sections) };
}

async function requireAdmin(slug: string, key: string) {
  const loaded = await loadSiteBySlug(slug);
  if (!loaded) throw new Error("This microsite does not exist.");
  if (loaded.row.admin_key !== key) throw new Error("That studio key does not match.");
  return loaded;
}

function coverFrom(site: Site): string | null {
  for (const section of site.sections) {
    if (!section.visible) continue;
    if (section.type === "hero") {
      const image = (section.data as { image?: string }).image;
      if (image) return image;
    }
    if (section.type === "gallery") {
      const first = (section.data as { images?: { src: string }[] }).images?.[0]?.src;
      if (first) return first;
    }
  }
  return null;
}

export const listPublishedSites = createServerFn({ method: "GET" }).handler(
  async (): Promise<SiteCard[]> => {
    await ensureSeed();
    const sql = await getSql();
    const rows = await sql<SiteRow>`
      select id, slug, name, tagline, admin_key, theme, published, created_at, updated_at
      from sites
      where published = true
      order by created_at desc
      limit 24
    `;
    const cards: SiteCard[] = [];
    for (const row of rows) {
      const sections = await loadSections(row.id);
      const site = toPublicSite(row, sections);
      cards.push({
        id: site.id,
        slug: site.slug,
        name: site.name,
        tagline: site.tagline,
        theme: site.theme,
        cover: coverFrom(site),
        sectionCount: site.sections.filter((s) => s.visible).length,
      });
    }
    return cards;
  },
);

export const getPublicSite = createServerFn({ method: "GET" })
  .validator((data: { slug: string }) => data)
  .handler(async ({ data }): Promise<Site | null> => {
    await ensureSeed();
    const loaded = await loadSiteBySlug(normalizeSlug(data.slug));
    if (!loaded || !loaded.site.published) return null;
    return loaded.site;
  });

export const getAdminSite = createServerFn({ method: "POST" })
  .validator((data: { slug: string; key: string }) => data)
  .handler(async ({ data }): Promise<Site> => {
    await ensureSeed();
    const loaded = await requireAdmin(data.slug, data.key);
    return loaded.site;
  });

export const listVaultSites = createServerFn({ method: "POST" })
  .validator((data: { entries: { slug: string; key: string }[] }) => data)
  .handler(async ({ data }): Promise<SiteCard[]> => {
    await ensureSeed();
    const cards: SiteCard[] = [];
    for (const entry of data.entries.slice(0, 40)) {
      try {
        const loaded = await loadSiteBySlug(normalizeSlug(entry.slug));
        if (!loaded || loaded.row.admin_key !== entry.key) continue;
        cards.push({
          id: loaded.site.id,
          slug: loaded.site.slug,
          name: loaded.site.name,
          tagline: loaded.site.tagline,
          theme: loaded.site.theme,
          cover: coverFrom(loaded.site),
          sectionCount: loaded.site.sections.length,
        });
      } catch {
        /* skip bad slug */
      }
    }
    return cards;
  });

export const createSite = createServerFn({ method: "POST" })
  .validator(
    (data: {
      name: string;
      slug: string;
      template: TemplateId;
      fromSlug?: string;
    }) => data,
  )
  .handler(async ({ data }): Promise<{ site: Site; adminKey: string }> => {
    await ensureSeed();
    const name = data.name.trim().slice(0, 80);
    if (name.length < 2) throw new Error("Give the microsite a name.");
    const slug = normalizeSlug(data.slug);
    const sql = await getSql();
    const clash = await sql<{ id: string }>`select id from sites where slug = ${slug}`;
    if (clash.length) throw new Error("That address is already taken.");

    let built = materializeTemplate(getTemplate(data.template), name, "");
    if (data.fromSlug) {
      const source = await loadSiteBySlug(normalizeSlug(data.fromSlug));
      if (source?.site.published) {
        built = {
          name,
          tagline: source.site.tagline,
          theme: structuredClone(source.site.theme),
          sections: source.site.sections.map((s, i) => ({
            ...structuredClone(s),
            id: crypto.randomUUID(),
            position: i,
          })),
        };
      }
    }

    const adminKey = generateKey();
    const id = crypto.randomUUID();
    await insertBuilt(id, slug, built.name, built.tagline, adminKey, built.theme, built.sections);
    const loaded = await loadSiteBySlug(slug);
    if (!loaded) throw new Error("Could not open the new microsite.");
    return { site: loaded.site, adminKey };
  });

export const cloneSite = createServerFn({ method: "POST" })
  .validator(
    (data: { sourceSlug: string; key: string; name: string; slug: string }) => data,
  )
  .handler(async ({ data }): Promise<{ site: Site; adminKey: string }> => {
    await ensureSeed();
    const source = await requireAdmin(data.sourceSlug, data.key);
    const name = data.name.trim().slice(0, 80);
    if (name.length < 2) throw new Error("Give the microsite a name.");
    const slug = normalizeSlug(data.slug);
    const sql = await getSql();
    const clash = await sql<{ id: string }>`select id from sites where slug = ${slug}`;
    if (clash.length) throw new Error("That address is already taken.");

    const adminKey = generateKey();
    const sections = source.site.sections.map((s, i) => ({
      ...structuredClone(s),
      id: crypto.randomUUID(),
      position: i,
    }));
    await insertBuilt(
      crypto.randomUUID(),
      slug,
      name,
      source.site.tagline,
      adminKey,
      structuredClone(source.site.theme),
      sections,
    );
    const loaded = await loadSiteBySlug(slug);
    if (!loaded) throw new Error("Could not open the new microsite.");
    return { site: loaded.site, adminKey };
  });

export const updateSiteMeta = createServerFn({ method: "POST" })
  .validator(
    (data: {
      slug: string;
      key: string;
      name?: string;
      tagline?: string;
      theme?: Theme;
      published?: boolean;
    }) => data,
  )
  .handler(async ({ data }): Promise<Site> => {
    const loaded = await requireAdmin(data.slug, data.key);
    const sql = await getSql();
    const name = data.name?.trim().slice(0, 80) || loaded.site.name;
    const tagline =
      data.tagline !== undefined ? data.tagline.slice(0, 160) : loaded.site.tagline;
    const theme = data.theme ?? loaded.site.theme;
    const published = data.published ?? loaded.site.published;
    await sql.query(
      `update sites
       set name = $1, tagline = $2, theme = $3::jsonb, published = $4, updated_at = now()
       where id = $5`,
      [name, tagline, JSON.stringify(theme), published, loaded.row.id],
    );
    const next = await loadSiteBySlug(data.slug);
    if (!next) throw new Error("Site missing after save.");
    return next.site;
  });

export const addSection = createServerFn({ method: "POST" })
  .validator((data: { slug: string; key: string; type: SectionType }) => data)
  .handler(async ({ data }): Promise<Site> => {
    if (!isSectionType(data.type)) throw new Error("Unknown section.");
    const loaded = await requireAdmin(data.slug, data.key);
    if (loaded.site.sections.length >= 16) {
      throw new Error("Sixteen sections is enough for one page.");
    }
    const sql = await getSql();
    const position = loaded.site.sections.reduce((m, s) => Math.max(m, s.position), -1) + 1;
    await sql.query(
      `insert into sections (id, site_id, type, position, visible, data)
       values ($1, $2, $3, $4, true, $5::jsonb)`,
      [
        crypto.randomUUID(),
        loaded.row.id,
        data.type,
        position,
        JSON.stringify(defaultSectionData(data.type)),
      ],
    );
    await sql.query(`update sites set updated_at = now() where id = $1`, [loaded.row.id]);
    const next = await loadSiteBySlug(data.slug);
    if (!next) throw new Error("Site missing after save.");
    return next.site;
  });

export const updateSection = createServerFn({ method: "POST" })
  .validator(
    (data: {
      slug: string;
      key: string;
      sectionId: string;
      visible?: boolean;
      payload?: unknown;
    }) => data,
  )
  .handler(async ({ data }): Promise<Site> => {
    const loaded = await requireAdmin(data.slug, data.key);
    const current = loaded.site.sections.find((s) => s.id === data.sectionId);
    if (!current) throw new Error("Section not found.");
    const sql = await getSql();
    const visible = data.visible ?? current.visible;
    const payload = data.payload !== undefined ? data.payload : current.data;
    await sql.query(
      `update sections set visible = $1, data = $2::jsonb where id = $3 and site_id = $4`,
      [visible, JSON.stringify(payload), current.id, loaded.row.id],
    );
    await sql.query(`update sites set updated_at = now() where id = $1`, [loaded.row.id]);
    const next = await loadSiteBySlug(data.slug);
    if (!next) throw new Error("Site missing after save.");
    return next.site;
  });

export const deleteSection = createServerFn({ method: "POST" })
  .validator((data: { slug: string; key: string; sectionId: string }) => data)
  .handler(async ({ data }): Promise<Site> => {
    const loaded = await requireAdmin(data.slug, data.key);
    const sql = await getSql();
    await sql.query(`delete from sections where id = $1 and site_id = $2`, [
      data.sectionId,
      loaded.row.id,
    ]);
    const remaining = loaded.site.sections.filter((s) => s.id !== data.sectionId);
    for (let i = 0; i < remaining.length; i += 1) {
      await sql.query(`update sections set position = $1 where id = $2`, [
        i,
        remaining[i]!.id,
      ]);
    }
    await sql.query(`update sites set updated_at = now() where id = $1`, [loaded.row.id]);
    const next = await loadSiteBySlug(data.slug);
    if (!next) throw new Error("Site missing after save.");
    return next.site;
  });

export const reorderSections = createServerFn({ method: "POST" })
  .validator((data: { slug: string; key: string; orderedIds: string[] }) => data)
  .handler(async ({ data }): Promise<Site> => {
    const loaded = await requireAdmin(data.slug, data.key);
    const sql = await getSql();
    const allowed = new Set(loaded.site.sections.map((s) => s.id));
    const ids = data.orderedIds.filter((id) => allowed.has(id));
    for (let i = 0; i < ids.length; i += 1) {
      await sql.query(`update sections set position = $1 where id = $2 and site_id = $3`, [
        i,
        ids[i],
        loaded.row.id,
      ]);
    }
    await sql.query(`update sites set updated_at = now() where id = $1`, [loaded.row.id]);
    const next = await loadSiteBySlug(data.slug);
    if (!next) throw new Error("Site missing after save.");
    return next.site;
  });

export const deleteSite = createServerFn({ method: "POST" })
  .validator((data: { slug: string; key: string }) => data)
  .handler(async ({ data }): Promise<{ ok: true }> => {
    const loaded = await requireAdmin(data.slug, data.key);
    if (DEMO_SITES.some((d) => d.slug === loaded.site.slug)) {
      throw new Error("Demo microsites stay so others can study them.");
    }
    const sql = await getSql();
    await sql.query(`delete from sections where site_id = $1`, [loaded.row.id]);
    await sql.query(`delete from sites where id = $1`, [loaded.row.id]);
    return { ok: true };
  });
