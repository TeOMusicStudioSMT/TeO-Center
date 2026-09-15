/**
 * 🖼️ Wystawa — produkcje filmowe Katedry, utwory (Suno + Katedra), produkty
 * i brama do otakos.wtf.
 *
 * Suweren (2026-09-14): „na teo.center mają być prezentowane najnowsze produkcje
 * filmowe Katedry; serwerem może być mój komputer albo kanał YT; utwory z Suno
 * — link share odpala utwór na mojej stronie albo cała ramka Suno; prezentacja
 * wszelkich innych produktów Katedry; odnośnik graficzny do otakos.wtf."
 *
 * Co gra u kogo (bez udawania):
 *   · film z YouTube        → u każdego (ramka youtube-nocookie)
 *   · film tylko z dysku    → u gospodarza z Katedry; u gościa plakat + „czeka na YouTube"
 *   · utwór Suno            → u każdego (ramka Suno z linku share)
 *   · utwór z dysku Katedry → tylko u gospodarza
 */
import { useEffect, useState } from 'react';
import { katalogStatyczny, katalogZywy, czas, data, type Katalog, type Film, type Suno } from './lib/wystawa';

function KartaFilmu({ f, zywy }: { f: Film; zywy: boolean }) {
    const [gra, setGra] = useState(false);
    const mozeGrac = !!f.youtube || zywy;
    return (
        <article className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
            <div className="relative aspect-video bg-black">
                {gra && f.youtube && (
                    <iframe src={`https://www.youtube-nocookie.com/embed/${f.youtube}?autoplay=1`} title={f.tytul} allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="absolute inset-0 h-full w-full" />
                )}
                {gra && !f.youtube && zywy && (
                    <video src={f.strumien} controls autoPlay className="absolute inset-0 h-full w-full" />
                )}
                {!gra && (
                    <button onClick={() => mozeGrac && setGra(true)} className="group absolute inset-0 flex items-center justify-center" title={mozeGrac ? 'Odtwórz' : 'Ten film czeka na kanał YouTube — gra tylko na maszynie z Katedrą'}>
                        {f.plakat
                            ? <img src={f.plakat.startsWith('/') ? `.${f.plakat}` : f.plakat} alt="" className="absolute inset-0 h-full w-full object-cover opacity-80 transition group-hover:opacity-100" />
                            : <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-900/40 to-slate-900" />}
                        <span className={`relative flex h-14 w-14 items-center justify-center rounded-full border text-2xl ${mozeGrac ? 'border-fuchsia-300/70 bg-black/50 text-fuchsia-100' : 'border-slate-600 bg-black/60 text-slate-500'}`}>▶</span>
                        {!mozeGrac && <span className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-0.5 text-[9px] text-slate-300">czeka na YouTube</span>}
                        {f.youtube && <span className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-0.5 text-[9px] text-red-300">YouTube</span>}
                        {!f.youtube && zywy && <span className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-0.5 text-[9px] text-emerald-300">z Katedry</span>}
                    </button>
                )}
            </div>
            <div className="p-4">
                <div className="text-[9px] uppercase tracking-[0.25em] text-fuchsia-300/70">{f.projekt}{f.muzyka ? ' · z muzyką' : ''}{f.sekundy ? ` · ${czas(f.sekundy)}` : ''}</div>
                <div className="mt-1 text-sm font-bold text-slate-100">{f.tytul}</div>
                {f.opis && <p className="mt-1 line-clamp-3 text-[11px] leading-relaxed text-slate-400">{f.opis}</p>}
                <div className="mt-2 text-[10px] text-slate-600">{data(f.kiedy)}</div>
            </div>
        </article>
    );
}

/**
 * Playlista Suno: Suno nie ma ramki dla playlist, więc most ściąga listę utworów
 * z publicznego API Suno, a tu jest JEDEN odtwarzacz (ramka wybranego utworu)
 * + lista z okładkami. Klik = zmiana utworu w ramce. Autoodtwarzanie kolejnego
 * nie jest możliwe z zewnątrz ramki Suno — mówimy to wprost.
 */
function Playlista({ s }: { s: Suno }) {
    const utwory = s.utwory ?? [];
    const [i, setI] = useState(0);
    const u = utwory[i] ?? utwory[0];
    const razem = utwory.reduce((a, x) => a + (x.sekundy ?? 0), 0);
    return (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
            <div className="grid gap-0 md:grid-cols-[1fr_340px]">
                <div className="p-4">
                    <div className="flex items-center gap-3">
                        {s.okladka && <img src={s.okladka} alt="" className="h-14 w-14 rounded-lg object-cover" />}
                        <div>
                            <div className="text-[9px] uppercase tracking-[0.25em] text-fuchsia-300/70">playlista Suno{s.autor ? ` · ${s.autor}` : ''}</div>
                            <div className="text-lg font-bold text-slate-100">{s.tytul}</div>
                            <div className="text-[10px] text-slate-500">{utwory.length} utworów{razem ? ` · ${czas(razem)}` : ''}</div>
                        </div>
                    </div>
                    {s.opis && <p className="mt-2 text-[11px] text-slate-400">{s.opis}</p>}
                    <iframe key={u?.id} src={u?.embed} title={u?.tytul || s.id} allow="autoplay; encrypted-media" className="mt-3 h-[240px] w-full rounded-xl border-0 bg-black" />
                    <a href={s.url} target="_blank" rel="noreferrer" className="mt-2 inline-block text-[10px] text-slate-500 hover:text-fuchsia-200">otwórz playlistę w Suno →</a>
                </div>
                <ol className="max-h-[420px] divide-y divide-white/5 overflow-y-auto border-t border-white/10 md:border-l md:border-t-0">
                    {utwory.map((x, n) => (
                        <li key={x.id}>
                            <button onClick={() => setI(n)} className={`flex w-full items-center gap-3 px-3 py-2 text-left transition hover:bg-white/[0.05] ${n === i ? 'bg-fuchsia-500/10' : ''}`}>
                                <span className="w-5 text-right text-[10px] text-slate-600">{n + 1}</span>
                                {x.okladka ? <img src={x.okladka} alt="" loading="lazy" className="h-9 w-9 rounded object-cover" /> : <span className="h-9 w-9 rounded bg-slate-800" />}
                                <span className={`flex-1 truncate text-[12px] ${n === i ? 'text-fuchsia-100' : 'text-slate-200'}`}>{x.tytul}</span>
                                <span className="text-[10px] text-slate-600">{czas(x.sekundy)}</span>
                            </button>
                        </li>
                    ))}
                </ol>
            </div>
        </div>
    );
}

export default function Wystawa() {
    const [k, setK] = useState<Katalog | null>(null);
    const [zrodlo, setZrodlo] = useState<'statyczny' | 'zywy' | 'brak'>('brak');

    useEffect(() => {
        (async () => {
            const s = await katalogStatyczny();
            if (s) { setK(s); setZrodlo('statyczny'); }
            // Gospodarz: Most żyje → żywy katalog nadpisuje statyczny (plakaty zostają ze statycznego, gdy pasują).
            const z = await katalogZywy();
            if (z) {
                const plakaty = new Map((s?.filmy ?? []).map((f) => [f.id, f.plakat]));
                setK({ ...z, filmy: z.filmy.map((f) => ({ ...f, plakat: plakaty.get(f.id) ?? null })), produkty: z.produkty.map((p) => ({ ...p, obraz: p.obraz ?? (s?.produkty.find((x) => x.id === p.id)?.obraz ?? null) })) });
                setZrodlo('zywy');
            }
        })();
    }, []);

    const filmy = k?.filmy ?? [];
    const suno = k?.suno ?? [];
    const utwory = k?.utwory ?? [];
    const produkty = k?.produkty ?? [];
    const zywy = zrodlo === 'zywy';

    return (
        <>
            {/* ── Brama do otakos.wtf ── */}
            <section id="katedra" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-10">
                <a href="https://otakos.wtf" target="_blank" rel="noreferrer" className="group relative block overflow-hidden rounded-3xl border border-fuchsia-400/30 bg-gradient-to-r from-[#12081f] via-[#1a0b2e] to-[#06101c] p-6 transition hover:border-fuchsia-300/60 sm:p-8">
                    <div className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full bg-fuchsia-500/20 blur-3xl transition group-hover:bg-fuchsia-400/30" />
                    <div className="flex items-center gap-5">
                        <img src="./media/otakos.svg" alt="Katedra OtakOS" className="h-16 w-16 shrink-0 sm:h-20 sm:w-20" />
                        <div>
                            <div className="text-[10px] uppercase tracking-[0.3em] text-fuchsia-300/80">Katedra · silnik wszystkiego poniżej</div>
                            <div className="mt-1 text-2xl font-black tracking-tight text-white sm:text-3xl">otakos.wtf</div>
                            <p className="mt-1 max-w-xl text-[12px] leading-relaxed text-slate-400">Suwerenny, lokalny ekosystem AI klasy Live-USB — tam powstaje to, co tu oglądasz. Kronika, Słowo Suwerena, sieć węzłów, studia.</p>
                        </div>
                        <span className="ml-auto hidden text-3xl text-fuchsia-200 transition group-hover:translate-x-1 sm:block">→</span>
                    </div>
                </a>
            </section>

            {/* ── Produkcje filmowe ── */}
            <section id="filmy" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-16">
                <div className="flex flex-wrap items-baseline gap-3">
                    <h2 className="text-2xl font-black tracking-tight text-white">Produkcje filmowe Katedry</h2>
                    <span className="text-[10px] text-slate-500">{zrodlo === 'zywy' ? '● na żywo z Katedry' : k?.opublikowano ? `opublikowano ${data(k.opublikowano)}` : ''}</span>
                </div>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">Odcinki i filmy zrealizowane w TeO Story Studio — od opowieści, przez kadry, ruch i montaż, po muzykę. Najnowsze na górze.</p>
                {!filmy.length && <p className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-[11px] text-slate-500">Wystawa jeszcze nieopublikowana — w Katedrze: Dashboard → „Wystawa teo.center" → Publikuj.</p>}
                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filmy.map((f) => <KartaFilmu key={f.id} f={f} zywy={zywy} />)}
                </div>
            </section>

            {/* ── Suno: playlisty (lista utworów + jeden odtwarzacz) i pojedyncze utwory ── */}
            {suno.length > 0 && (
                <section id="suno" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-16">
                    <h2 className="text-2xl font-black tracking-tight text-white">Utwory · Suno</h2>
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">Każdy gra tutaj, z ramki Suno — bez wychodzenia ze strony.</p>
                    <div className="mt-8 space-y-6">
                        {suno.filter((s) => s.typ === 'playlista' && s.utwory?.length).map((s) => <Playlista key={s.id} s={s} />)}
                    </div>
                    {suno.some((s) => s.typ !== 'playlista') && (
                        <div className="mt-8 grid gap-4 sm:grid-cols-2">
                            {suno.filter((s) => s.typ !== 'playlista').map((s) => (
                                <div key={s.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                                    {(s.tytul || s.opis) && <div className="mb-2"><div className="text-sm font-bold text-slate-100">{s.tytul}</div>{s.opis && <p className="text-[11px] text-slate-400">{s.opis}</p>}</div>}
                                    <iframe src={s.embed ?? `https://suno.com/embed/${s.id}`} title={s.tytul || s.id} loading="lazy" allow="autoplay; encrypted-media" className="h-[240px] w-full rounded-xl border-0 bg-black" />
                                    <a href={s.url} target="_blank" rel="noreferrer" className="mt-2 inline-block text-[10px] text-slate-500 hover:text-fuchsia-200">otwórz w Suno →</a>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            )}

            {/* ── Utwory z Katedry (tylko gospodarz) ── */}
            {zywy && utwory.length > 0 && (
                <section id="utwory" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-12">
                    <h2 className="text-xl font-black tracking-tight text-white">Utwory z Katedry <span className="ml-2 text-[10px] font-normal text-emerald-300">● tylko u gospodarza</span></h2>
                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                        {utwory.map((u) => (
                            <div key={u.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                                <div className="truncate text-[12px] font-bold text-slate-100">{u.tytul} <span className="text-[9px] font-normal text-slate-500">· {u.zrodlo}</span></div>
                                <audio src={u.strumien} controls preload="none" className="mt-2 w-full" />
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* ── Produkty ── */}
            {produkty.length > 0 && (
                <section id="produkty" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-16">
                    <h2 className="text-2xl font-black tracking-tight text-white">Produkty Katedry</h2>
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">Kreacje z TeO Fashion Studio, projekty układów i printy z TeO Lab — to, co powstało po drodze.</p>
                    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {produkty.map((p) => (
                            <div key={p.id} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
                                {p.obraz ? <img src={p.obraz.startsWith('/') ? `.${p.obraz}` : p.obraz} alt={p.tytul} loading="lazy" className="aspect-[4/3] w-full object-cover" /> : <div className="flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-slate-900 to-black text-3xl">{p.rodzaj === 'print' ? '🧬' : p.rodzaj === 'chip' ? '🔬' : '👗'}</div>}
                                <div className="p-3">
                                    <div className="text-[9px] uppercase tracking-[0.2em] text-cyan-300/70">{p.dzial}</div>
                                    <div className="mt-0.5 truncate text-[12px] font-bold text-slate-100" title={p.tytul}>{p.tytul}</div>
                                    {p.opis && <p className="mt-1 line-clamp-2 text-[10px] leading-relaxed text-slate-500">{p.opis}</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </>
    );
}
