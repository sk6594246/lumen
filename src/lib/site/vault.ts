const STORAGE_KEY = "lumen.vault";

export type Vault = {
  keys: Record<string, string>;
};

function empty(): Vault {
  return { keys: {} };
}

export function readVault(): Vault {
  if (typeof window === "undefined") return empty();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return empty();
    const parsed = JSON.parse(raw) as Vault;
    if (!parsed || typeof parsed.keys !== "object" || parsed.keys === null) {
      return empty();
    }
    return { keys: parsed.keys };
  } catch {
    return empty();
  }
}

export function writeVault(vault: Vault) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(vault));
}

export function rememberKey(slug: string, key: string) {
  const vault = readVault();
  vault.keys[slug] = key;
  writeVault(vault);
}

export function forgetKey(slug: string) {
  const vault = readVault();
  delete vault.keys[slug];
  writeVault(vault);
}

export function keyFor(slug: string): string | null {
  return readVault().keys[slug] ?? null;
}
