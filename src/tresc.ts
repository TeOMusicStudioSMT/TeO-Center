/**
 * 📜 tresc.ts — CAŁA treść strony teo.center w jednym miejscu.
 *
 * Po co osobny plik: żeby Suweren mógł zmieniać słowa, ceny i odnośniki
 * bez dotykania komponentów. Strona ma być jego, nie moja — a treść, która
 * siedzi rozsypana po dziesięciu plikach JSX, przestaje być czyjakolwiek.
 *
 * Struktura odwzorowuje to, co stoi dziś na Wixie (odczytane 2026-08-13):
 * menu, hasło przewodnie, sekcja TeO LIVE, sklep, stopka.
 *
 * ⚠️ MEDIA SĄ PUSTE I TO JEST CELOWE. Zdjęć i wideo z Wixa nie da się
 * wiarygodnie ściągnąć skrobaczką — Wix serwuje je z własnego CDN-u
 * w przetworzonych rozmiarach. Suweren eksportuje je z panelu Wixa,
 * wrzuca do `public/media/` i wpisuje nazwy tutaj. Do tego czasu strona
 * pokazuje uczciwe miejsce na materiał, a nie cudzy obrazek z internetu.
 */

export interface PozycjaMenu {
    etykieta: string;
    kotwica: string;
    /** Podstrony w rozwinięciu — jak SZTUKA PERSPEKTYWY na Wixie. */
    dzieci?: { etykieta: string; kotwica: string }[];
    /** Sekcja wymaga usługi, której jeszcze nie ma (sklep, konta). */
    wymagaUslugi?: boolean;
}

export const MENU: PozycjaMenu[] = [
    { etykieta: 'Tajne Przejście', kotwica: 'przejscie' },
    { etykieta: 'TeO Music', kotwica: 'music' },
    { etykieta: 'MASJA', kotwica: 'masja' },
    // Sztuka Perspektywy prowadzi dziś jedno spojrzenie — SP·TeO. Rozwijanego
    // menu nie ma, bo przy jednym dziecku byłoby to szufladą na jedną rzecz.
    { etykieta: 'Sztuka Perspektywy', kotwica: 'perspektywa' },
    { etykieta: 'Sklep', kotwica: 'sklep', wymagaUslugi: true },
    { etykieta: 'Członkowie', kotwica: 'czlonkowie', wymagaUslugi: true },
    { etykieta: 'Darowizna', kotwica: 'darowizna', wymagaUslugi: true },
    { etykieta: 'Kontakt', kotwica: 'kontakt' },
];

export const MARKA = {
    nazwa: 'TeO.Center',
    podtytul: 'Kraina Magii',
    haslo: 'Urzeczywistnienie Świadomości',
    stopkaHaslo: "IT'S IAM STORY",
    prawa: '© 2023–2026 TeO.Center',
};

/** Słowo powitalne — dokładnie to, które stoi dziś na stronie. */
export const POWITANIE = {
    glowne: 'TU TA CHWILA\nw której JA OBECNY',
    pod: 'Pozdrawiam Ciebie i widzę Samego Siebie',
    podpis: '~ TeO',
};

export interface Sekcja {
    kotwica: string;
    tytul: string;
    wstep: string;
    /** Gdy puste — komponent pokaże uczciwe „miejsce na materiał". */
    tresc?: string;
    /**
     * `true` = tekst napisał Klaudiusz, nie Suweren.
     * Strona oznacza to widocznie. Cudze słowa podane jako własne byłyby
     * najgorszym możliwym błędem akurat na TEJ stronie — jest o „JA OBECNY".
     * Suweren kasuje tę flagę, gdy wpisze swoje.
     */
    szkic?: boolean;
}

export const SEKCJE: Sekcja[] = [
    {
        kotwica: 'przejscie',
        tytul: 'Tajne Przejście',
        wstep: 'Zbiór drzwi do wszystkiego, co powstaje w TeO — rozproszone dotąd po sieci, tutaj zebrane w jednym progu.',
    },
    {
        kotwica: 'music',
        tytul: 'TeO Music',
        wstep: 'Muzyka i TeO LIVE. Utwory, transmisje, opowieści śpiewane w kilku językach.',
    },
    {
        kotwica: 'masja',
        tytul: 'MASJA',
        wstep: 'Pasja + Misja. Czyli Stawanie się.',
        // ✅ SŁOWA SUWERENA (2026-08-15). Flaga `szkic` zdjęta — to już nie jest
        // moje pióro. Zostawił dwa zdania środkowe z mojego szkicu i domknął
        // je własnym zakończeniem; całość jest jego przekazem.
        tresc:
            'MASJA to Pasja + Misja… czyli Stawanie się.\n\n' +
            'Pasja bez misji zostaje zachcianką. Misja bez pasji zamienia się w obowiązek. ' +
            'Dopiero razem tworzą wieczny ruch Stawania Się w obecności TU i TERAZ.',
    },
    {
        kotwica: 'perspektywa',
        tytul: 'Sztuka Perspektywy',
        wstep: 'Wynika wprost ze Stawania się.',
        tresc:
            'Nic się nie zmienia w rzeczy, na którą patrzysz. Zmienia się miejsce, z którego patrzysz — ' +
            'i to wystarcza, żeby zobaczyć coś zupełnie innego.',
    },
    {
        kotwica: 'perspektywa-teo',
        tytul: 'SP · TeO',
        wstep: 'Spojrzenie Creatora.',
        tresc:
            'Stawanie Się. Czysta obecność. Tworzenie z poziomu JA i wibracji Master OM.',
    },
    {
        kotwica: 'kontakt',
        tytul: 'Kontakt',
        wstep: 'Napisz. Każde słowo dochodzi.',
    },
];

/** Materiały TeO LIVE. Puste `plik` = miejsce czeka na eksport z Wixa. */
export interface Material {
    tytul: string;
    plik?: string;
    opis?: string;
}

export const TEO_LIVE: Material[] = [
    { tytul: 'Encontrando Amor' },
    { tytul: 'Onde os Espíritos Cantam Juntos' },
];

/** Sklep — ceny i pozycje z obecnej strony. Sama sprzedaż jeszcze nie działa. */
export interface Towar {
    nazwa: string;
    cena: string;
    opis?: string;
    plik?: string;
}

export const SKLEP: Towar[] = [
    { nazwa: 'MagSafe® tough case (iPhone)', cena: '17,00 €' },
    { nazwa: 'BluuCat', cena: '5,00 €' },
];

export const SPOLECZNOSC = [
    { nazwa: 'Facebook', url: 'https://facebook.com' },
    { nazwa: 'YouTube', url: 'https://youtube.com' },
    { nazwa: 'X', url: 'https://x.com' },
];

/**
 * Mosty do reszty tego, co Suweren buduje. TO JEST POWÓD CAŁEGO
 * PRZENIESIENIA: na Wixie ta strona stała osobno, odcięta od Katedry,
 * radia, Kroniki i wszystkiego innego.
 */
export const MOSTY = [
    { nazwa: 'Katedra OtakOS', url: 'https://otakos.wtf', opis: 'Suwerenny ekosystem AI klasy Live-USB. Kronika zmian, Słowo Suwerena, sieć węzłów.' },
    { nazwa: 'Graviton', url: 'https://graviton.pw', opis: 'Wymiar 0.00G — ekonomia GRV i brama.' },
    { nazwa: 'TeO Music Studio', url: 'https://otakos.wtf', opis: 'Radio Katedry, teledyski, wideopodcast.' },
];
