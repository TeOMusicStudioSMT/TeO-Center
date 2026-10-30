/**
 * 🖼️ Galeria obrazów olejnych TeO (Suweren 2026-10-30) — szkic od Gemini (Canvas), wpięty i poprawiony przez Klaudiusza.
 * Dane: public/galeria/galeria.json + pliki w public/galeria/. Bez danych demo i bez udawanych płócien:
 * pusta lista = „Galeria wkrótce”, brakujące zdjęcie = napis, nie podróbka.
 */
import React, { useState, useEffect, useCallback, useRef } from 'react';

export interface Obraz {
  id: string;
  tytul: string;
  plik: string;
  rok?: number | string | null;
  technika?: string | null;
  wymiary?: string | null;
  opis?: string | null;
  pion?: boolean;
}

interface GaleriaData {
  obrazy?: Obraz[];
}

export default function Galeria() {
  const [obrazy, setObrazy] = useState<Obraz[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

  // Obsługa gestu przesunięcia palcem (swipe) w Lightboxie
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  // Pobieranie ./galeria/galeria.json
  useEffect(() => {
    let isMounted = true;

    async function loadGaleria() {
      try {
        const response = await fetch('./galeria/galeria.json', {
          headers: { Accept: 'application/json' },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data: GaleriaData = await response.json();
        if (isMounted) {
          if (data && Array.isArray(data.obrazy)) {
            setObrazy(data.obrazy.filter((o) => o && o.id && o.plik && o.tytul));
          } else {
            setObrazy([]);
          }
        }
      } catch {
        if (isMounted) setObrazy([]);   // brak pliku = „Galeria wkrótce”, nigdy obrazy na niby
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadGaleria();
    return () => {
      isMounted = false;
    };
  }, []);

  // Nawigacja w Lightboxie
  const closeLightbox = useCallback(() => {
    setActiveIndex(null);
  }, []);

  const showPrev = useCallback(() => {
    setActiveIndex((prev) => {
      if (prev === null || obrazy.length === 0) return null;
      return (prev - 1 + obrazy.length) % obrazy.length;
    });
  }, [obrazy.length]);

  const showNext = useCallback(() => {
    setActiveIndex((prev) => {
      if (prev === null || obrazy.length === 0) return null;
      return (prev + 1) % obrazy.length;
    });
  }, [obrazy.length]);

  // Blokada przewijania strony pod spodem i obsługa klawiatury (←, →, Esc)
  useEffect(() => {
    if (activeIndex === null) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Ustawienie focusu na przycisk zamknięcia po otwarciu
    const timer = window.setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 30);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        showPrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        showNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeIndex, closeLightbox, showPrev, showNext]);

  // Obsługa gestów dotykowych na telefonie
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;

    // Rozpoznanie poziomego przesunięcia palcem (minimum 45 px)
    if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0) {
        showPrev();
      } else {
        showNext();
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
  };

  const getImageUrl = (obraz: Obraz) => `./galeria/${encodeURIComponent(obraz.plik)}`;

  const handleImageError = (id: string) => {
    setBrokenImages((prev) => ({ ...prev, [id]: true }));
  };

  const formatMetryczka = (obraz: Obraz): string[] => {
    const parts: string[] = [];
    if (obraz.technika && String(obraz.technika).trim() !== '') {
      parts.push(String(obraz.technika).trim());
    }
    if (obraz.wymiary && String(obraz.wymiary).trim() !== '') {
      parts.push(String(obraz.wymiary).trim());
    }
    if (obraz.rok !== undefined && obraz.rok !== null && String(obraz.rok).trim() !== '') {
      parts.push(String(obraz.rok).trim());
    }
    return parts;
  };

  const activeObraz = activeIndex !== null ? obrazy[activeIndex] : null;

  return (
    <section
      id="galeria"
      aria-labelledby="galeria-naglowek"
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 bg-transparent text-slate-200 overflow-x-hidden"
    >
      {/* Nagłówek sekcji i jedno zdanie wstępu */}
      <header className="max-w-2xl mx-auto text-center mb-10 sm:mb-14">
        <h2
          id="galeria-naglowek"
          className="text-3xl sm:text-4xl md:text-5xl font-light tracking-wider text-slate-200"
        >
          Galeria
        </h2>
        <div
          aria-hidden="true"
          className="w-20 h-px mx-auto my-4 bg-gradient-to-r from-transparent via-fuchsia-300/60 to-transparent"
        />
        <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
          Obrazy olejne na płótnie — zapis chwil, przestrzeni i światła przeniesiony w materię farby.
        </p>

      </header>

      {/* Stan ładowania */}
      {loading ? (
        <div
          role="status"
          aria-live="polite"
          className="py-16 text-center text-slate-400 text-sm tracking-widest uppercase animate-pulse"
        >
          Odsłanianie płócien…
        </div>
      ) : obrazy.length === 0 ? (
        /* Stan pustej listy */
        <div className="max-w-xl mx-auto my-8 px-6 py-14 rounded-2xl border border-violet-200/15 bg-white/[0.02] backdrop-blur-xs text-center shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
          <div
            aria-hidden="true"
            className="w-10 h-10 mx-auto mb-4 rounded-full border border-amber-200/30 flex items-center justify-center text-amber-200"
          >
            ✦
          </div>
          <p className="text-base sm:text-lg text-slate-200 font-light tracking-wide">
            Galeria wkrótce — obrazy właśnie są fotografowane.
          </p>
        </div>
      ) : (
        /* Układ "ściana galerii" (masonry przez CSS columns, bez przycinania płótna) */
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 sm:gap-8 space-y-6 sm:space-y-8">
          {obrazy.map((obraz, idx) => {
            const metryczka = formatMetryczka(obraz);
            const hasOpis = Boolean(obraz.opis && obraz.opis.trim() !== '');

            return (
              <figure
                key={obraz.id || `${obraz.plik}-${idx}`}
                className="break-inside-avoid group relative rounded-lg p-2.5 sm:p-3.5 bg-white/[0.02] border border-violet-200/15 hover:border-fuchsia-300/40 shadow-[0_14px_34px_-6px_rgba(0,0,0,0.85),0_0_1px_1px_rgba(221,214,254,0.08)] hover:shadow-[0_22px_45px_-8px_rgba(0,0,0,0.95),0_0_25px_-4px_rgba(240,171,252,0.18)] transition-all duration-300 ease-out hover:-translate-y-1"
              >
                <button
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  aria-label={`Powiększ obraz: ${obraz.tytul}`}
                  className="block w-full text-left rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300 cursor-pointer"
                >
                  {/* Wewnętrzna delikatna rama płótna */}
                  <div className="relative overflow-hidden rounded-xs bg-black/40 ring-1 ring-inset ring-amber-200/15">
                    {brokenImages[obraz.id] ? (
                      <div className="flex aspect-[4/3] items-center justify-center px-4 text-center text-xs text-slate-500">zdjęcie obrazu jeszcze nie dotarło</div>
                    ) : <img
                      src={getImageUrl(obraz)}
                      alt={obraz.tytul}
                      loading="lazy"
                      onError={() => handleImageError(obraz.id)}
                      className="w-full h-auto block object-contain transition-transform duration-500 ease-out group-hover:scale-[1.015]"
                    />}
                  </div>

                  {/* Podpis pod obrazem na ścianie */}
                  <figcaption className="pt-3.5 px-1">
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="text-base sm:text-lg font-normal text-slate-200 group-hover:text-fuchsia-300 transition-colors">
                        {obraz.tytul}
                      </h3>
                      {obraz.rok !== undefined &&
                        obraz.rok !== null &&
                        String(obraz.rok).trim() !== '' && (
                          <span className="text-xs text-amber-200/80 shrink-0 font-mono">
                            {obraz.rok}
                          </span>
                        )}
                    </div>

                    {(obraz.technika || obraz.wymiary) && (
                      <p className="mt-0.5 text-xs text-slate-400">
                        {[obraz.technika, obraz.wymiary]
                          .filter((v) => v && String(v).trim() !== '')
                          .join(' • ')}
                      </p>
                    )}

                    {hasOpis && (
                      <p className="mt-2 text-xs sm:text-sm text-slate-400/90 line-clamp-2 leading-relaxed">
                        {obraz.opis}
                      </p>
                    )}

                    {/* Ukryta dla wzroku pełna metryczka dla czytników ekranu */}
                    {metryczka.length > 0 && (
                      <span className="sr-only"> ({metryczka.join(', ')})</span>
                    )}
                  </figcaption>
                </button>
              </figure>
            );
          })}
        </div>
      )}

      {/* LIGHTBOX NA CAŁY EKRAN */}
      {activeObraz !== null && activeIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Podgląd obrazu: ${activeObraz.tytul}`}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onClick={closeLightbox}
          className="fixed inset-0 z-50 flex flex-col justify-between bg-[#05040c]/95 backdrop-blur-md p-3 sm:p-6 select-none overflow-y-auto"
        >
          {/* Górny pasek: licznik oraz przycisk zamknięcia */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-6xl mx-auto flex items-center justify-between gap-4 z-10"
          >
            <div
              aria-live="polite"
              className="text-xs sm:text-sm font-mono tracking-widest text-cyan-300 px-3 py-1.5 rounded-full border border-violet-200/15 bg-white/[0.03]"
            >
              {activeIndex + 1} / {obrazy.length}
            </div>

            <button
              ref={closeButtonRef}
              type="button"
              onClick={closeLightbox}
              aria-label="Zamknij podgląd obrazu (Esc)"
              className="inline-flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-violet-200/20 bg-white/[0.04] text-slate-200 hover:text-fuchsia-300 hover:border-fuchsia-300/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300 transition-colors cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Środkowa część: płótno na cały ekran (object-contain) + strzałki nawigacyjne */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative flex-1 w-full max-w-6xl mx-auto my-2 sm:my-4 flex items-center justify-center min-h-0"
          >
            {obrazy.length > 1 && (
              <button
                type="button"
                onClick={showPrev}
                aria-label="Poprzedni obraz"
                className="absolute left-1 sm:left-3 z-20 inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-violet-200/20 bg-[#05040c]/80 text-slate-200 hover:text-cyan-300 hover:border-cyan-300/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300 transition-colors cursor-pointer shadow-lg"
              >
                <span aria-hidden="true" className="text-lg sm:text-xl leading-none">
                  ←
                </span>
              </button>
            )}

            <img
              src={getImageUrl(activeObraz)}
              alt={activeObraz.tytul}
              onError={() => handleImageError(activeObraz.id)}
              className="max-h-[68vh] sm:max-h-[74vh] max-w-full w-auto h-auto object-contain rounded-xs shadow-[0_25px_70px_rgba(0,0,0,0.95)] ring-1 ring-amber-200/20"
            />

            {obrazy.length > 1 && (
              <button
                type="button"
                onClick={showNext}
                aria-label="Następny obraz"
                className="absolute right-1 sm:right-3 z-20 inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-violet-200/20 bg-[#05040c]/80 text-slate-200 hover:text-cyan-300 hover:border-cyan-300/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300 transition-colors cursor-pointer shadow-lg"
              >
                <span aria-hidden="true" className="text-lg sm:text-xl leading-none">
                  →
                </span>
              </button>
            )}
          </div>

          {/* Dolna część: tytuł, metryczka i opis pod spodem */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-3xl mx-auto text-center px-2 pt-2 pb-1 z-10"
          >
            <h3 className="text-lg sm:text-2xl font-light text-slate-200 tracking-wide">
              {activeObraz.tytul}
            </h3>

            {formatMetryczka(activeObraz).length > 0 && (
              <p className="mt-1 text-xs sm:text-sm text-amber-200/90 font-mono">
                {formatMetryczka(activeObraz).join(' • ')}
              </p>
            )}

            {activeObraz.opis && activeObraz.opis.trim() !== '' && (
              <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
                {activeObraz.opis}
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}