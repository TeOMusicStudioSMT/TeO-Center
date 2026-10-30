/**
 * 🌍 katedraPubliczna.ts — to, co Katedra Suwerena sama pokazuje światu.
 *
 * W odróżnieniu od `katedra.ts` (Most na 127.0.0.1, tylko gospodarz) to czyta
 * PUBLICZNE drzwi Katedry przez jej stały tunel: wizytówkę i Żywą Księgę.
 * Widzi to każdy gość. Straż Mostu wpuszcza teo.center tylko do odczytu.
 *
 * Gdy Katedra śpi (komputer wyłączony), drzwi milczą — strona mówi to wprost,
 * zamiast pokazywać stare kopie udające żywe.
 */

export const ADRES_KATEDRY = 'https://katedra.otakos.wtf';

export interface FilmKanalu { id: string; tytul: string; kiedy: string }
export interface Wizytowka {
    nick: string;
    motto?: string;
    kanal?: { id: string; nazwa: string; adres: string; filmy?: FilmKanalu[] };
    sklep?: { darowizny?: { link: string; waluta?: string; sugerowana?: number; tryb?: string } };
}

export interface WpisKsiegi {
    id: string;
    kiedy: string;
    tekst: string;
    slowo?: { kto: string; tekst: string } | null;
    przeklad?: { en?: { tekst: string; slowo?: string } } | null;
    ilustracja?: { styl?: string; url: string } | null;
    zdjecie?: { url: string } | null;
    nagranie?: { url: string } | null;
}

async function czytaj<T>(sciezka: string): Promise<T | null> {
    try {
        const r = await fetch(`${ADRES_KATEDRY}${sciezka}`, { signal: AbortSignal.timeout(8000) });
        if (!r.ok) return null;
        return (await r.json()) as T;
    } catch { return null; }
}

export const wizytowka = () => czytaj<Wizytowka>('/api/wizytowka');

export async function ksiega(): Promise<WpisKsiegi[] | null> {
    const d = await czytaj<{ wpisy?: WpisKsiegi[] }>('/wizytowka/ksiega');
    return d ? (Array.isArray(d.wpisy) ? d.wpisy : []) : null;
}

/** Pliki Księgi przychodzą jako ścieżki — tylko te z jej katalogu idą do <img>/<video>. */
export function plikKsiegi(url?: string | null): string | null {
    if (!url || !/^\/wizytowka\/ksiega\/k-\d{8}-[0-9a-f]{6}\/(zdjecie\.jpg|ilustracja\.png|nagranie\.mp4)(\?v=[\w%.:-]*)?$/.test(url)) return null;
    return `${ADRES_KATEDRY}${url}`;
}

/**
 * 🌍 Zgłoś wejście do licznika Katedry (kraj podaje Cloudflare, IP nie jest zapisywane).
 * Gospodarza nie liczymy: gdy na tej maszynie odpowiada jego most (127.0.0.1), to Suweren.
 */
export async function zglosWejscie(): Promise<void> {
    try {
        const r = await fetch('http://127.0.0.1:3001/api/wizytowka', { signal: AbortSignal.timeout(800) });
        if (r.ok) return;
    } catch { /* gość — mostu u niego nie ma */ }
    try {
        await fetch(`${ADRES_KATEDRY}/wizytowka/wejscie`, {
            method: 'POST', keepalive: true,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ strona: location.hostname, sciezka: location.pathname, skad: document.referrer || null }),
        });
    } catch { /* Katedra śpi — liczy wtedy Web Analytics Cloudflare */ }
}
