/**
 * 🌌 teo.center — strona Suwerena poza Wixem.
 *
 * 2026-10-29 Suweren: „wszystko wyewoluowało… proste”. Zostaje „TU TA CHWILA”
 * (0.00G resonance) na własnej tapecie, a treść przychodzi z Katedry:
 * Żywa Księga, kanał, darowizny. Do tego Wystawa i przejście do reszty.
 *
 * Zasada: każda sekcja mówi prawdę o swoim stanie — Katedra śpi, portfela
 * jeszcze nie ma = widać to, zamiast wypełniacza.
 */
import { useState } from 'react';
import { MENU, MARKA, POWITANIE, MOSTY } from './tresc';
import Pyl from './Pyl';
import Wystawa from './Wystawa';
import Wsparcie from './Wsparcie';
import { ZywaKsiega, Kanal, useWizytowka } from './Zywe';

function Naglowek() {
    const [otwarte, setOtwarte] = useState(false);
    return (
        <header className="sticky top-0 z-50 border-b border-white/[0.07] bg-[#05040c]/70 backdrop-blur-xl">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
                <a href="#gora">
                    <div className="text-sm font-black tracking-[0.28em] text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-300 via-violet-200 to-cyan-300">
                        {MARKA.nazwa.toUpperCase()}
                    </div>
                    <div className="text-[8px] tracking-[0.35em] text-slate-500 uppercase">{MARKA.podtytul}</div>
                </a>
                <nav className="hidden items-center gap-1 md:flex">
                    {MENU.map(p => (
                        <a key={p.kotwica} href={`#${p.kotwica}`}
                            className="rounded-lg px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-slate-400 transition hover:bg-white/5 hover:text-fuchsia-200">
                            {p.etykieta}
                        </a>
                    ))}
                </nav>
                <button onClick={() => setOtwarte(o => !o)} aria-label="Menu"
                    className="rounded-lg border border-white/10 px-3 py-1.5 text-[10px] text-slate-300 md:hidden">
                    {otwarte ? '✕' : '☰'}
                </button>
            </div>
            {otwarte && (
                <nav className="border-t border-white/[0.07] px-5 py-2 md:hidden">
                    {MENU.map(p => (
                        <a key={p.kotwica} href={`#${p.kotwica}`} onClick={() => setOtwarte(false)}
                            className="block py-2 text-[11px] uppercase tracking-widest text-slate-400">{p.etykieta}</a>
                    ))}
                </nav>
            )}
        </header>
    );
}

function Powitanie() {
    return (
        <section id="gora" className="flex min-h-[86vh] items-center justify-center px-5 text-center">
            <div>
                <h1 className="whitespace-pre-line text-4xl font-black leading-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-violet-100 to-fuchsia-300 sm:text-6xl md:text-7xl">
                    {POWITANIE.glowne}
                </h1>
                <p className="mx-auto mt-6 max-w-lg text-sm leading-relaxed text-slate-300/90">{POWITANIE.pod}</p>
                <p className="mt-2 text-xs tracking-[0.3em] text-fuchsia-300/80">{POWITANIE.podpis}</p>
                <a href="#ksiega"
                    className="mt-10 inline-block rounded-full border border-fuchsia-400/40 bg-fuchsia-500/10 px-7 py-3 text-[10px] font-bold uppercase tracking-[0.25em] text-fuchsia-200 transition hover:bg-fuchsia-500/20">
                    Wejdź
                </a>
            </div>
        </section>
    );
}

function Przejscie() {
    return (
        <section id="przejscie" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-16">
            <h2 className="text-2xl font-black tracking-tight text-white">Przejście</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {MOSTY.map(m => (
                    <a key={m.nazwa} href={m.url} target="_blank" rel="noreferrer"
                        className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-fuchsia-400/40 hover:bg-fuchsia-500/[0.06]">
                        <div className="text-sm font-bold text-fuchsia-200">{m.nazwa} ↗</div>
                        <p className="mt-1.5 text-[11px] leading-relaxed text-slate-400">{m.opis}</p>
                    </a>
                ))}
            </div>
        </section>
    );
}

export default function App() {
    const wiz = useWizytowka();
    const kanal = wiz.dane?.kanal;
    return (
        <div className="min-h-screen font-sans text-slate-200 antialiased">
            <Pyl />
            <Naglowek />
            <main>
                <Powitanie />
                <ZywaKsiega />
                <Kanal w={wiz} />
                <Wystawa />
                <Wsparcie w={wiz} />
                <Przejscie />
            </main>
            <footer className="mt-10 border-t border-white/[0.07] px-5 py-10 text-center">
                <div className="text-sm font-black tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-300 to-cyan-300">
                    {MARKA.stopkaHaslo}
                </div>
                {kanal && (
                    <a href={kanal.adres} target="_blank" rel="noreferrer" className="mt-4 inline-block text-[10px] uppercase tracking-widest text-slate-500 hover:text-fuchsia-300">
                        YouTube · {kanal.nazwa}
                    </a>
                )}
                <div className="mt-5 text-[9px] text-slate-600">{MARKA.prawa}</div>
            </footer>
        </div>
    );
}
