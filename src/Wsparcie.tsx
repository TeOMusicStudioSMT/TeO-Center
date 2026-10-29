/**
 * 💛 Wsparcie — jedyne prawdziwe drogi, którymi można wesprzeć TeO.
 *
 * Suweren 2026-10-29: dawne darowizny (PayPal) zostały przejęte, a ktoś zbiera
 * pieniądze w jego imieniu. Dlatego ta sekcja mówi wprost: tylko to, co stoi
 * TUTAJ, jest jego. Stripe przychodzi z Katedry (link płatności Suwerena),
 * portfele i sklepy wpisuje on sam w tresc.ts. Nic nie jest wymyślone.
 */
import { useState } from 'react';
import { PORTFELE, SKLEPY } from './tresc';
import type { Wizytowka } from './lib/katedraPubliczna';

function Adres({ adres }: { adres: string }) {
    const [skopiowane, setSkopiowane] = useState(false);
    return (
        <button onClick={() => { void navigator.clipboard?.writeText(adres).then(() => { setSkopiowane(true); setTimeout(() => setSkopiowane(false), 1800); }); }}
            className="mt-2 w-full break-all rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-left font-mono text-[11px] text-slate-200 hover:border-cyan-300/40">
            {adres} <span className="ml-1 text-cyan-300">{skopiowane ? '✓ skopiowano' : '📋'}</span>
        </button>
    );
}

export default function Wsparcie({ w }: { w: { dane: Wizytowka | null; gotowe: boolean } }) {
    const dar = w.dane?.sklep?.darowizny;
    const nicNie = !dar && PORTFELE.length === 0 && SKLEPY.length === 0;

    return (
        <section id="wsparcie" className="mx-auto max-w-4xl scroll-mt-20 px-5 py-16">
            <h2 className="text-2xl font-black tracking-tight text-white">Wsparcie</h2>
            <div className="mt-4 rounded-xl border border-rose-400/30 bg-rose-500/[0.06] p-4 text-[12px] leading-relaxed text-rose-100/90">
                <b>Uwaga na oszustów.</b> Jedyne drogi wsparcia TeO są na tej stronie. Każda inna prośba
                o pieniądze w moim imieniu — mailem, wiadomością, przez PayPal czy „organizację” — to nie ja.
            </div>

            {nicNie && (
                <p className="mt-6 text-sm leading-relaxed text-slate-400">
                    Nowe drogi wsparcia właśnie powstają. Do tego czasu najlepszym wsparciem jest obecność.
                </p>
            )}

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {dar && (
                    <a href={dar.link} target="_blank" rel="noreferrer"
                        className="rounded-2xl border border-amber-300/30 bg-amber-400/[0.06] p-5 transition hover:bg-amber-400/[0.12]">
                        <div className="text-sm font-bold text-amber-100">💛 Darowizna kartą</div>
                        <p className="mt-1.5 text-[11px] leading-relaxed text-slate-300">
                            Bezpieczna płatność przez Stripe — sam wybierasz kwotę.
                        </p>
                    </a>
                )}
                {PORTFELE.map(p => (
                    <div key={p.siec + p.adres} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                        <div className="text-sm font-bold text-slate-100">💠 {p.siec}</div>
                        <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
                            {p.prywatny
                                ? 'Prywatna sieć — kwota i nadawca nie są publicznie widoczne.'
                                : 'Jawna sieć — wpłata i adres nadawcy są widoczne publicznie w łańcuchu.'}
                            {p.uwaga && <> {p.uwaga}</>}
                        </p>
                        <Adres adres={p.adres} />
                    </div>
                ))}
                {SKLEPY.map(s => (
                    <a key={s.url} href={s.url} target="_blank" rel="noreferrer"
                        className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-fuchsia-400/40">
                        <div className="text-sm font-bold text-fuchsia-200">🛍️ {s.nazwa} ↗</div>
                        {s.opis && <p className="mt-1.5 text-[11px] leading-relaxed text-slate-400">{s.opis}</p>}
                    </a>
                ))}
            </div>
        </section>
    );
}
