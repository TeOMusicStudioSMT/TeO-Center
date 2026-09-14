/**
 * 🖼️ wystawa.ts — katalog tego, co Katedra pokazuje na teo.center.
 *
 * Dwa źródła, jedna prawda:
 *   · `public/wystawa.json` — statyczny, opublikowany z Katedry (przycisk
 *     „Publikuj wystawę"). Czyta go każdy gość. Filmy z YouTube, utwory Suno
 *     z ramki Suno, produkty jako obrazy z `public/media/wystawa/`.
 *   · `Most /api/wystawa` — ŻYWY, tylko na maszynie Suwerena. Wtedy filmy bez
 *     YouTube i utwory z dysku grają prosto z Katedry (`/wystawa/plik/:id`).
 *
 * Gość bez Mostu nie widzi pozycji, których nie da się odtworzyć u niego —
 * poza tytułem i plakatem z dopiskiem, że film czeka na kanał YouTube.
 */
const MOST = 'http://127.0.0.1:3001';

export interface Film { id: string; rodzaj: 'odcinek' | 'film'; projekt: string; tytul: string; opis: string; kiedy: string; sekundy?: number | null; muzyka?: boolean | null; plakat: string | null; youtube: string | null; strumien: string }
export interface Utwor { id: string; tytul: string; zrodlo: string; kiedy: string; strumien: string }
export interface Suno { id: string; url: string; tytul: string; opis: string; embed: string; dodano: string }
export interface Produkt { id: string; rodzaj: string; dzial: string; tytul: string; opis: string; kiedy: string | null; obraz: string | null }
export interface Katalog { opublikowano: string | null; filmy: Film[]; utwory: Utwor[]; suno: Suno[]; produkty: Produkt[]; zywy: boolean }

export async function katalogStatyczny(): Promise<Katalog | null> {
    try {
        const r = await fetch('./wystawa.json', { cache: 'no-cache' });
        if (!r.ok) return null;
        const d = await r.json();
        return { opublikowano: d.opublikowano ?? null, filmy: d.filmy ?? [], utwory: d.utwory ?? [], suno: d.suno ?? [], produkty: d.produkty ?? [], zywy: false };
    } catch { return null; }
}

/** Żywy katalog — tylko u gospodarza. Obrazy i strumienie idą przez Most. */
export async function katalogZywy(): Promise<Katalog | null> {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 4000);
    try {
        const r = await fetch(`${MOST}/api/wystawa`, { signal: ctrl.signal });
        if (!r.ok) return null;
        const d = await r.json();
        const strumien = (s: string) => `${MOST}${s}`;
        return {
            opublikowano: d.ostatniaPublikacja ?? null, zywy: true,
            filmy: (d.filmy ?? []).filter((f: { ukryty: boolean }) => !f.ukryty).map((f: Film & { youtube: { id: string } | null }) => ({ ...f, plakat: null, youtube: f.youtube?.id ?? null, strumien: strumien(f.strumien) })),
            utwory: (d.utwory ?? []).filter((u: { ukryty: boolean }) => !u.ukryty).map((u: Utwor) => ({ ...u, strumien: strumien(u.strumien) })),
            suno: d.suno ?? [],
            produkty: (d.produkty ?? []).filter((p: { ukryty: boolean }) => !p.ukryty).map((p: Produkt & { obraz: string | null; strumien?: string }) => ({ ...p, obraz: p.obraz ? strumien(`/wystawa/plik/${p.id}`) : null })),
        };
    } catch { return null; } finally { clearTimeout(t); }
}

export const czas = (s?: number | null) => (s ? `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}` : '');
export const data = (iso?: string | null) => (iso ? new Date(iso).toLocaleDateString('pl-PL') : '');
