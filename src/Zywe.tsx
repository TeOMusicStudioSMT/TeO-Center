/**
 * 📖 Żywe sekcje teo.center — Żywa Księga i kanał, prosto z Katedry Suwerena.
 *
 * Treść pisze Suweren w Katedrze (Księga: jego Iskra + słowo Kronikarza +
 * obraz Palety; kanał: jego filmy). Strona niczego nie przechowuje — czyta
 * publiczne drzwi Katedry. Katedra śpi = sekcja mówi to wprost.
 */
import { useEffect, useState } from 'react';
import { ksiega, plikKsiegi, wizytowka, type WpisKsiegi, type Wizytowka } from './lib/katedraPubliczna';

type Stan<T> = { dane: T | null; gotowe: boolean };

export function useWizytowka(): Stan<Wizytowka> {
    const [s, setS] = useState<Stan<Wizytowka>>({ dane: null, gotowe: false });
    useEffect(() => { void wizytowka().then(dane => setS({ dane, gotowe: true })); }, []);
    return s;
}

const data = (iso: string) => new Date(iso).toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' });

function Spi({ co }: { co: string }) {
    return (
        <p className="rounded-xl border border-white/10 bg-white/[0.02] p-5 text-center text-xs leading-relaxed text-slate-400">
            Katedra Suwerena teraz śpi — {co} wróci, gdy się obudzi.
        </p>
    );
}

function Wpis({ w }: { w: WpisKsiegi }) {
    const en = w.przeklad?.en;
    const [poAngielsku, setPoAngielsku] = useState(false);
    const tekst = poAngielsku && en ? en.tekst : w.tekst;
    const slowo = poAngielsku && en?.slowo ? en.slowo : w.slowo?.tekst;
    const obraz = plikKsiegi(w.zdjecie?.url) ?? plikKsiegi(w.ilustracja?.url);
    const ilustracja = w.zdjecie ? plikKsiegi(w.ilustracja?.url) : null;
    const film = plikKsiegi(w.nagranie?.url);

    return (
        <article className="overflow-hidden rounded-2xl border border-amber-200/15 bg-gradient-to-b from-amber-100/[0.05] to-white/[0.02]">
            {film
                ? <video src={film} controls playsInline poster={obraz ?? undefined} className="aspect-video w-full bg-black object-cover" />
                : obraz && <img src={obraz} alt="" loading="lazy" className="max-h-[28rem] w-full object-cover" />}
            <div className="p-6">
                <div className="flex items-center justify-between gap-3">
                    <time className="text-[10px] uppercase tracking-[0.25em] text-amber-200/70">{data(w.kiedy)}</time>
                    {en && (
                        <button onClick={() => setPoAngielsku(p => !p)}
                            className="rounded-full border border-white/15 px-2.5 py-0.5 text-[10px] text-slate-300 hover:border-amber-200/40">
                            {poAngielsku ? 'PL ⇄ oryginał' : 'EN ⇄ translation'}
                        </button>
                    )}
                </div>
                <p className="mt-3 whitespace-pre-line font-serif text-[15px] leading-relaxed text-slate-100">{tekst}</p>
                <p className="mt-2 text-xs tracking-[0.3em] text-fuchsia-300/80">~ TeO</p>
                {slowo && (
                    <blockquote className="mt-5 border-l-2 border-amber-200/30 pl-4 text-sm italic leading-relaxed text-slate-300">
                        {slowo}
                        <footer className="mt-1 text-[10px] not-italic tracking-widest text-slate-500">— Kronikarz stada</footer>
                    </blockquote>
                )}
                {ilustracja && <img src={ilustracja} alt="" loading="lazy" className="mt-5 w-full rounded-xl" />}
                {w.ilustracja?.styl && <p className="mt-2 text-[10px] text-slate-500">ilustracja AI · {w.ilustracja.styl}</p>}
            </div>
        </article>
    );
}

export function ZywaKsiega() {
    const [s, setS] = useState<Stan<WpisKsiegi[]>>({ dane: null, gotowe: false });
    const [ile, setIle] = useState(3);
    useEffect(() => { void ksiega().then(dane => setS({ dane, gotowe: true })); }, []);

    return (
        <section id="ksiega" className="mx-auto max-w-3xl scroll-mt-20 px-5 py-16">
            <h2 className="text-2xl font-black tracking-tight text-white">Żywa Księga</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
                Słowa Suwerena, zapisane w chwili, w której przyszły. Stado Katedry dokłada swoje słowo i obraz.
            </p>
            <div className="mt-8 space-y-8">
                {!s.gotowe && <p className="text-xs text-slate-500">otwieram Księgę…</p>}
                {s.gotowe && s.dane === null && <Spi co="Księga" />}
                {s.dane?.length === 0 && <p className="text-xs text-slate-500">Księga czeka na pierwszy wpis dla świata.</p>}
                {s.dane?.slice(0, ile).map(w => <Wpis key={w.id} w={w} />)}
                {s.dane && s.dane.length > ile && (
                    <button onClick={() => setIle(i => i + 3)}
                        className="mx-auto block rounded-full border border-white/15 px-5 py-2 text-[10px] uppercase tracking-[0.25em] text-slate-300 hover:border-amber-200/40">
                        Dalej w Księdze
                    </button>
                )}
            </div>
        </section>
    );
}

export function Kanal({ w }: { w: Stan<Wizytowka> }) {
    const kanal = w.dane?.kanal;
    const filmy = (kanal?.filmy ?? []).slice(0, 6);
    const [gra, setGra] = useState<string | null>(null);

    return (
        <section id="kanal" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-16">
            <h2 className="text-2xl font-black tracking-tight text-white">Na kanale</h2>
            {kanal && (
                <a href={kanal.adres} target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm text-cyan-300 hover:text-cyan-200">
                    {kanal.nazwa} ↗
                </a>
            )}
            <div className="mt-8">
                {!w.gotowe && <p className="text-xs text-slate-500">łączę z kanałem…</p>}
                {w.gotowe && !kanal && <Spi co="lista filmów" />}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filmy.map(f => (
                        <article key={f.id} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
                            <div className="relative aspect-video bg-black">
                                {gra === f.id
                                    ? <iframe src={`https://www.youtube-nocookie.com/embed/${f.id}?autoplay=1`} title={f.tytul}
                                        allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen className="absolute inset-0 h-full w-full" />
                                    : <button onClick={() => setGra(f.id)} className="group absolute inset-0" aria-label={`Odtwórz: ${f.tytul}`}>
                                        <img src={`https://i.ytimg.com/vi/${f.id}/hqdefault.jpg`} alt="" loading="lazy" className="h-full w-full object-cover opacity-80 transition group-hover:opacity-100" />
                                        <span className="absolute inset-0 flex items-center justify-center text-4xl text-white/90 drop-shadow">▶</span>
                                      </button>}
                            </div>
                            <div className="p-4 text-xs leading-snug text-slate-200">{f.tytul}</div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
