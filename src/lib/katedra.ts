/**
 * 🌉 katedra.ts — spięcie strony z Katedrą.
 *
 * ⚠️ RZECZ, KTÓREJ NIE WOLNO PRZEOCZYĆ: Most (127.0.0.1:3001) żyje TYLKO
 * na maszynie Suwerena. Gość odwiedzający teo.center z internetu nigdy go
 * nie zobaczy — i tak ma być.
 *
 * Dlatego strona jest w pełni sprawna BEZ Mostu, a połączenie z Katedrą
 * jest wzbogaceniem dla gospodarza, nie warunkiem działania. Gdyby było
 * odwrotnie, publiczna strona świeciłaby gościom martwymi sekcjami.
 *
 * Publiczne spięcie (widoczne dla każdego) to odnośniki w `MOSTY`.
 * Lokalne spięcie (tylko dla Suwerena) to żywe dane z Mostu.
 */

const MOST = 'http://127.0.0.1:3001';

export interface StanKatedry {
    /** null = jeszcze sprawdzamy. */
    zywa: boolean | null;
    /** Ile utworów widzi radio Katedry — dowód, że to nie atrapa. */
    utworow?: number;
    powod?: string;
}

/**
 * Puknij do Mostu. Krótki czas oczekiwania jest zamierzony: gość z sieci
 * nie może czekać dwóch sekund na coś, czego u niego nigdy nie będzie.
 */
export async function sprawdzKatedre(): Promise<StanKatedry> {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 1200);
    try {
        const r = await fetch(`${MOST}/api/studio/pokoje`, { signal: ctrl.signal });
        if (!r.ok) return { zywa: false, powod: `Most odpowiedział HTTP ${r.status}` };
        return { zywa: true };
    } catch {
        // To NIE jest błąd. U gościa Mostu po prostu nie ma.
        return { zywa: false, powod: 'Most nieobecny — strona działa w trybie publicznym.' };
    } finally { clearTimeout(t); }
}

/** Playlista z Radia Katedry — tylko gdy Most stoi. */
export async function playlistaKatedry(): Promise<{ tytul: string; plik?: string }[]> {
    try {
        const r = await fetch(`${MOST}/api/bridge/execute`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'GET_LOCAL_PLAYLIST' }),
        });
        if (!r.ok) return [];
        const d = await r.json();
        const lista = Array.isArray(d?.tracks) ? d.tracks : Array.isArray(d?.playlist) ? d.playlist : [];
        return lista.slice(0, 12).map((t: any) => ({
            tytul: t.title || t.filename || 'bez tytułu',
            plik: t.filename,
        }));
    } catch { return []; }
}
