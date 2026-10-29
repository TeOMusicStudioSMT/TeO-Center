/**
 * 📜 tresc.ts — CAŁA stała treść teo.center w jednym miejscu.
 *
 * 2026-10-29 Suweren: „wszystko wyewoluowało… proste”. Z Wixa zostaje tylko
 * „TU TA CHWILA” (to jest 0.00G resonance) — tapetę rysujemy sami (Pyl.tsx).
 * Żywa treść (Księga, kanał, darowizny Stripe) przychodzi z Katedry
 * (lib/katedraPubliczna.ts) — tutaj tylko to, co Suweren wpisuje ręką.
 */

export const MARKA = {
    nazwa: 'TeO.Center',
    podtytul: '0.00G',
    stopkaHaslo: "IT'S IAM STORY",
    prawa: `© 2023–${new Date().getFullYear()} TeO.Center`,
};

/** Słowo powitalne — to jedno przeszło z dawnej strony. */
export const POWITANIE = {
    glowne: 'TU TA CHWILA\nw której JA OBECNY',
    pod: 'Pozdrawiam Ciebie i widzę Samego Siebie',
    podpis: '~ TeO',
};

export const MENU = [
    { etykieta: 'Żywa Księga', kotwica: 'ksiega' },
    { etykieta: 'Kanał', kotwica: 'kanal' },
    { etykieta: 'Wystawa', kotwica: 'filmy' },
    { etykieta: 'Wsparcie', kotwica: 'wsparcie' },
    { etykieta: 'Przejście', kotwica: 'przejscie' },
];

/**
 * 💠 Portfele krypto do wsparcia. PUSTE = sekcja ich nie pokazuje.
 * Adres wpisuje Suweren, przepisany z portfela — nigdy z maila czy wiadomości.
 * `prywatny: true` tylko dla sieci, w której kwoty i nadawca nie są publiczne
 * (np. Monero). BTC/ETH/BNB są JAWNE: każdy widzi wpłatę i adres nadawcy.
 */
export interface Portfel { siec: string; adres: string; prywatny?: boolean; uwaga?: string }
export const PORTFELE: Portfel[] = [];

/** 🛍️ Sklepy Suwerena (Etsy, Shopify, Printify…). PUSTE = sekcja ich nie pokazuje. */
export interface Sklep { nazwa: string; url: string; opis?: string }
export const SKLEPY: Sklep[] = [];

/**
 * Mosty do reszty tego, co Suweren buduje — powód, dla którego strona
 * zeszła z Wixa: stała tam osobno, odcięta od Katedry.
 */
export const MOSTY = [
    { nazwa: 'Katedra OtakOS', url: 'https://otakos.wtf', opis: 'Suwerenny ekosystem AI. Kronika zmian, Słowo Suwerena, sieć Katedr.' },
    { nazwa: 'Graviton', url: 'https://graviton.pw', opis: 'Wymiar 0.00G — ekonomia GRV i brama.' },
];
