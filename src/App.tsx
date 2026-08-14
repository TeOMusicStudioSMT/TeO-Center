/**
 * 🌌 teo.center — odbudowa strony poza Wixem, wpięta w resztę tego,
 * co Suweren buduje.
 *
 * Układ wzorowany na obecnej stronie (menu, hasło, TeO LIVE, sklep, stopka),
 * ale kod i wygląd są własne — nie przenosimy szablonu Wixa, tylko strukturę
 * i słowa Suwerena.
 *
 * Zasada, która rządzi tym plikiem: **każda sekcja mówi prawdę o swoim
 * stanie**. Tam, gdzie brakuje materiału albo usługi, widnieje uczciwe
 * miejsce z wyjaśnieniem — nie wypełniacz udający gotową stronę.
 */
import { useEffect, useState } from 'react';
import { MENU, MARKA, POWITANIE, SEKCJE, TEO_LIVE, SKLEP, SPOLECZNOSC, MOSTY } from './tresc';
import { sprawdzKatedre, playlistaKatedry, type StanKatedry } from './lib/katedra';

function Gwiazdy() {
    // Tło rysowane w CSS, nie obrazkiem — żeby strona ważyła tyle co nic
    // i wstawała natychmiast także na telefonie w słabym zasięgu.
    return (
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
            <div className="absolute inset-0 bg-[#05040c]" />
            <div className="absolute inset-0 opacity-70"
                style={{ background: 'radial-gradient(ellipse at 50% -10%, rgba(147,51,234,0.22), transparent 55%), radial-gradient(ellipse at 15% 90%, rgba(34,211,238,0.12), transparent 50%)' }} />
            <div className="absolute inset-0 opacity-[0.35]"
                style={{
                    backgroundImage: 'radial-gradient(1px 1px at 20% 30%, #fff, transparent), radial-gradient(1px 1px at 70% 60%, #fff, transparent), radial-gradient(1px 1px at 40% 80%, #fff, transparent), radial-gradient(1px 1px at 85% 20%, #fff, transparent), radial-gradient(1px 1px at 10% 65%, #fff, transparent)',
                    backgroundSize: '520px 520px',
                }} />
        </div>
    );
}

function Miejsce({ co, dlaczego }: { co: string; dlaczego: string }) {
    // Uczciwe „tu będzie materiał". Lepsze niż cudzy obrazek z internetu
    // albo pusty prostokąt, przy którym nie wiadomo, czy to usterka.
    return (
        <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-6 text-center">
            <div className="text-xs font-semibold tracking-[0.2em] text-fuchsia-300/70 uppercase">{co}</div>
            <p className="mx-auto mt-2 max-w-md text-[11px] leading-relaxed text-slate-400">{dlaczego}</p>
        </div>
    );
}

function Naglowek() {
    const [otwarte, setOtwarte] = useState(false);
    return (
        <header className="sticky top-0 z-50 border-b border-white/[0.07] bg-[#05040c]/85 backdrop-blur-xl">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
                <a href="#gora" className="group">
                    <div className="text-sm font-black tracking-[0.28em] text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-300 via-violet-200 to-cyan-300">
                        {MARKA.nazwa.toUpperCase()}
                    </div>
                    <div className="text-[8px] tracking-[0.35em] text-slate-500 uppercase">{MARKA.podtytul}</div>
                </a>

                <nav className="hidden items-center gap-1 lg:flex">
                    {MENU.map(p => (
                        <a key={p.kotwica} href={`#${p.kotwica}`}
                            className="rounded-lg px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-slate-400 transition hover:bg-white/5 hover:text-fuchsia-200">
                            {p.etykieta}
                            {p.wymagaUslugi && <span className="ml-1 text-[8px] text-amber-400/70">•</span>}
                        </a>
                    ))}
                </nav>

                <button onClick={() => setOtwarte(o => !o)} aria-label="Menu"
                    className="rounded-lg border border-white/10 px-3 py-1.5 text-[10px] text-slate-300 lg:hidden">
                    {otwarte ? '✕' : '☰'}
                </button>
            </div>

            {otwarte && (
                <nav className="border-t border-white/[0.07] px-5 py-2 lg:hidden">
                    {MENU.map(p => (
                        <a key={p.kotwica} href={`#${p.kotwica}`} onClick={() => setOtwarte(false)}
                            className="block py-2 text-[11px] uppercase tracking-widest text-slate-400">
                            {p.etykieta}{p.wymagaUslugi && <span className="ml-1 text-amber-400/70">•</span>}
                        </a>
                    ))}
                </nav>
            )}
        </header>
    );
}

function Powitanie() {
    return (
        <section id="gora" className="relative flex min-h-[78vh] items-center justify-center px-5 text-center">
            <div>
                <div className="mb-5 text-[9px] font-semibold tracking-[0.45em] text-cyan-300/70 uppercase">
                    {MARKA.haslo}
                </div>
                <h1 className="whitespace-pre-line text-3xl font-black leading-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-violet-100 to-fuchsia-300 sm:text-5xl md:text-6xl">
                    {POWITANIE.glowne}
                </h1>
                <p className="mx-auto mt-6 max-w-lg text-sm leading-relaxed text-slate-300/90">
                    {POWITANIE.pod}
                </p>
                <p className="mt-2 text-xs tracking-[0.3em] text-fuchsia-300/80">{POWITANIE.podpis}</p>

                <a href="#przejscie"
                    className="mt-10 inline-block rounded-full border border-fuchsia-400/40 bg-fuchsia-500/10 px-7 py-3 text-[10px] font-bold uppercase tracking-[0.25em] text-fuchsia-200 transition hover:bg-fuchsia-500/20">
                    Wejdź
                </a>
            </div>
        </section>
    );
}

function MostyDoReszty({ stan }: { stan: StanKatedry }) {
    return (
        <section id="przejscie" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-16">
            <h2 className="text-2xl font-black tracking-tight text-white">Tajne Przejście</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
                {SEKCJE.find(s => s.kotwica === 'przejscie')?.wstep}
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {MOSTY.map(m => (
                    <a key={m.nazwa} href={m.url} target="_blank" rel="noreferrer"
                        className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-fuchsia-400/40 hover:bg-fuchsia-500/[0.06]">
                        <div className="text-sm font-bold text-fuchsia-200 group-hover:text-fuchsia-100">{m.nazwa}</div>
                        <p className="mt-1.5 text-[11px] leading-relaxed text-slate-400">{m.opis}</p>
                    </a>
                ))}
            </div>

            {/* Stan Katedry — widoczny tylko wtedy, gdy realnie coś znaczy. */}
            <div className="mt-6 flex items-center gap-2 text-[10px] text-slate-500">
                <span className={`inline-block h-1.5 w-1.5 rounded-full ${stan.zywa === null ? 'bg-slate-600' : stan.zywa ? 'bg-emerald-400' : 'bg-slate-700'}`} />
                {stan.zywa === null ? 'sprawdzam Katedrę…'
                    : stan.zywa ? 'Katedra odpowiada — jesteś u siebie, sekcje żywe są odblokowane.'
                    : 'Tryb publiczny. Żywe sekcje włączają się na maszynie z uruchomioną Katedrą.'}
            </div>
        </section>
    );
}

function Muzyka({ stan }: { stan: StanKatedry }) {
    const [zRadia, setZRadia] = useState<{ tytul: string }[]>([]);
    useEffect(() => { if (stan.zywa) void playlistaKatedry().then(setZRadia); }, [stan.zywa]);

    return (
        <section id="music" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-16">
            <h2 className="text-2xl font-black tracking-tight text-white">TeO Music</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
                {SEKCJE.find(s => s.kotwica === 'music')?.wstep}
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {TEO_LIVE.map(m => (
                    <div key={m.tytul} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                        <div className="text-[9px] uppercase tracking-[0.25em] text-cyan-300/70">TeO LIVE</div>
                        <div className="mt-1 text-sm font-bold text-slate-100">{m.tytul}</div>
                        {m.plik
                            ? <video src={`/media/${m.plik}`} controls className="mt-3 w-full rounded-xl" />
                            : <p className="mt-3 text-[10px] leading-relaxed text-slate-500">
                                Materiał czeka na eksport z Wixa — wgraj plik do <code className="text-slate-400">public/media/</code> i wpisz jego nazwę w <code className="text-slate-400">src/tresc.ts</code>.
                              </p>}
                    </div>
                ))}
            </div>

            {/* Radio Katedry — dowód, że spięcie nie jest ozdobą. */}
            {stan.zywa && zRadia.length > 0 && (
                <div className="mt-6 rounded-2xl border border-emerald-400/25 bg-emerald-500/[0.05] p-5">
                    <div className="text-[9px] uppercase tracking-[0.25em] text-emerald-300">
                        Radio Katedry — {zRadia.length} utworów z Twojego dysku
                    </div>
                    <ul className="mt-2 space-y-0.5">
                        {zRadia.map((t, i) => (
                            <li key={i} className="truncate text-[11px] text-slate-300">♪ {t.tytul}</li>
                        ))}
                    </ul>
                </div>
            )}
        </section>
    );
}

function ProstaSekcja({ kotwica }: { kotwica: string }) {
    const s = SEKCJE.find(x => x.kotwica === kotwica);
    if (!s) return null;
    return (
        <section id={s.kotwica} className="mx-auto max-w-6xl scroll-mt-20 px-5 py-16">
            <h2 className="text-2xl font-black tracking-tight text-white">{s.tytul}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">{s.wstep}</p>
            <div className="mt-6">
                {s.tresc
                    ? <p className="max-w-2xl text-sm leading-relaxed text-slate-300">{s.tresc}</p>
                    : <Miejsce co="Miejsce na treść"
                        dlaczego="Ta sekcja czeka na Twoje słowa i materiały. Tekst wpisujesz w src/tresc.ts, obrazy wrzucasz do public/media/." />}
            </div>
        </section>
    );
}

function Sklep() {
    return (
        <section id="sklep" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-16">
            <h2 className="text-2xl font-black tracking-tight text-white">Sklep</h2>

            {/* Uczciwie i od razu: to jest wystawa, nie kasa. */}
            <div className="mt-3 rounded-xl border border-amber-400/30 bg-amber-500/[0.06] p-4">
                <p className="text-[11px] leading-relaxed text-amber-200/90">
                    <b>Sprzedaż jeszcze nie działa.</b> Sklep, konta Członków i Darowizny były na Wixie
                    jego usługami — po przeniesieniu trzeba wybrać dostawcę płatności i podpiąć go
                    Twoimi danymi. Do tego czasu to wystawa: pozycje i ceny są prawdziwe, przycisku
                    zapłaty świadomie nie ma, żeby nikt nie kliknął w pustkę.
                </p>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {SKLEP.map(t => (
                    <div key={t.nazwa} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                        {t.plik
                            ? <img src={`/media/${t.plik}`} alt={t.nazwa} className="mb-3 w-full rounded-xl" />
                            : <div className="mb-3 flex h-28 items-center justify-center rounded-xl border border-dashed border-white/10 text-[9px] text-slate-600">zdjęcie z Wixa</div>}
                        <div className="text-sm font-bold text-slate-100">{t.nazwa}</div>
                        <div className="mt-1 text-sm font-black text-fuchsia-300">{t.cena}</div>
                    </div>
                ))}
            </div>
        </section>
    );
}

function Uslugi() {
    return (
        <>
            {[
                { kotwica: 'czlonkowie', tytul: 'Członkowie', co: 'Konta i logowanie' },
                { kotwica: 'darowizna', tytul: 'Darowizna', co: 'Wsparcie' },
            ].map(u => (
                <section key={u.kotwica} id={u.kotwica} className="mx-auto max-w-6xl scroll-mt-20 px-5 py-12">
                    <h2 className="text-2xl font-black tracking-tight text-white">{u.tytul}</h2>
                    <div className="mt-4">
                        <Miejsce co={u.co}
                            dlaczego="Ta część działała jako usługa Wixa. Po przeniesieniu wymaga wyboru dostawcy i podpięcia Twoim kontem — dlatego stoi pusta zamiast udawać, że działa." />
                    </div>
                </section>
            ))}
        </>
    );
}

function Stopka() {
    return (
        <footer className="mt-10 border-t border-white/[0.07] px-5 py-10">
            <div className="mx-auto max-w-6xl text-center">
                <div className="text-[10px] tracking-[0.4em] text-slate-500 uppercase">Świadomość</div>
                <div className="mt-2 text-sm font-black tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-300 to-cyan-300">
                    {MARKA.stopkaHaslo}
                </div>
                <div className="mt-5 flex justify-center gap-4">
                    {SPOLECZNOSC.map(s => (
                        <a key={s.nazwa} href={s.url} target="_blank" rel="noreferrer"
                            className="text-[10px] uppercase tracking-widest text-slate-500 transition hover:text-fuchsia-300">
                            {s.nazwa}
                        </a>
                    ))}
                </div>
                <div className="mt-6 text-[9px] text-slate-600">{MARKA.prawa}</div>
            </div>
        </footer>
    );
}

export default function App() {
    const [stan, setStan] = useState<StanKatedry>({ zywa: null });
    useEffect(() => { void sprawdzKatedre().then(setStan); }, []);

    return (
        <div className="min-h-screen font-sans text-slate-200 antialiased">
            <Gwiazdy />
            <Naglowek />
            <main>
                <Powitanie />
                <MostyDoReszty stan={stan} />
                <Muzyka stan={stan} />
                <ProstaSekcja kotwica="masja" />
                <ProstaSekcja kotwica="perspektywa" />
                <Sklep />
                <Uslugi />
                <ProstaSekcja kotwica="kontakt" />
            </main>
            <Stopka />
        </div>
    );
}
