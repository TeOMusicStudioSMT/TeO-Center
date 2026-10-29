/**
 * ✨ Pył — własna tapeta teo.center (zamiast obrazu z biblioteki Wixa, który
 * wolno było używać tylko na Wixie). Kosmiczny pył: gwiazdy w trzech warstwach
 * głębi płyną powoli, kilka mgławic oddycha w tle.
 *
 * Lekko: jedno płótno, ~260 punktów, bez bibliotek. Przy „ogranicz ruch”
 * w systemie rysuje się raz i stoi. Karta w tle = przeglądarka sama wstrzymuje
 * requestAnimationFrame.
 */
import { useEffect, useRef } from 'react';

interface Gwiazda { x: number; y: number; r: number; v: number; faza: number; barwa: string }

const BARWY = ['255,255,255', '216,180,254', '165,243,252', '253,224,171'];

export default function Pyl() {
    const ref = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const plotno = ref.current;
        const ctx = plotno?.getContext('2d');
        if (!plotno || !ctx) return;
        const spokoj = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        let w = 0, h = 0, klatka = 0;
        let gwiazdy: Gwiazda[] = [];

        const rozstaw = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            w = window.innerWidth; h = window.innerHeight;
            plotno.width = w * dpr; plotno.height = h * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            const ile = Math.round(Math.min(320, (w * h) / 5200));
            gwiazdy = Array.from({ length: ile }, () => {
                const warstwa = Math.random();
                return {
                    x: Math.random() * w, y: Math.random() * h,
                    r: 0.3 + warstwa * 1.3,
                    v: 0.02 + warstwa * 0.12,
                    faza: Math.random() * Math.PI * 2,
                    barwa: BARWY[Math.floor(Math.random() * BARWY.length)],
                };
            });
        };

        const mglawica = (x: number, y: number, r: number, kolor: string, t: number) => {
            const g = ctx.createRadialGradient(x, y, 0, x, y, r * (1 + 0.06 * Math.sin(t)));
            g.addColorStop(0, `rgba(${kolor},0.16)`);
            g.addColorStop(1, `rgba(${kolor},0)`);
            ctx.fillStyle = g;
            ctx.fillRect(0, 0, w, h);
        };

        const rysuj = (ms: number) => {
            const t = ms / 1000;
            ctx.fillStyle = '#05040c';
            ctx.fillRect(0, 0, w, h);
            mglawica(w * 0.5, -h * 0.1, Math.max(w, h) * 0.7, '147,51,234', t * 0.2);
            mglawica(w * 0.12, h * 0.92, Math.max(w, h) * 0.5, '34,211,238', t * 0.17 + 1);
            mglawica(w * 0.88, h * 0.55, Math.max(w, h) * 0.4, '236,72,153', t * 0.13 + 2);
            for (const s of gwiazdy) {
                if (!spokoj) {
                    s.y -= s.v; s.x += s.v * 0.25;
                    if (s.y < -2) { s.y = h + 2; s.x = Math.random() * w; }
                    if (s.x > w + 2) s.x = -2;
                }
                const blask = 0.45 + 0.55 * Math.abs(Math.sin(t * 0.8 + s.faza));
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${s.barwa},${(spokoj ? 0.8 : blask).toFixed(3)})`;
                ctx.fill();
            }
            if (!spokoj) klatka = requestAnimationFrame(rysuj);
        };

        rozstaw();
        klatka = requestAnimationFrame(rysuj);
        const naZmiane = () => { rozstaw(); if (spokoj) rysuj(0); };
        window.addEventListener('resize', naZmiane);
        return () => { cancelAnimationFrame(klatka); window.removeEventListener('resize', naZmiane); };
    }, []);

    return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 -z-10 h-full w-full" />;
}
