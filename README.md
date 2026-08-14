# TeO.Center

> **TU TA CHWILA w której JA OBECNY**
> Pozdrawiam Ciebie i widzę Samego Siebie ~ TeO

Strona **teo.center** — *Urzeczywistnienie Świadomości*, Kraina Magii.
Odbudowana poza Wixem, żeby przestała stać osobno od reszty tego, co powstaje w TeO.

## Dlaczego przeniesiona

Na Wixie strona była odcięta od Katedry OtakOS, radia, Kroniki i wszystkiego innego.
Tutaj wchodzi w ten sam ekosystem: ten sam stos co `otakos.wtf`, wspólne przejście
do pozostałych wymiarów, a na maszynie gospodarza — żywe dane z Mostu.

## Uruchomienie

```bash
npm install
npm run dev     # http://localhost:3100
npm run build   # dist/
```

## Gdzie jest treść

**Cała** treść siedzi w [`src/tresc.ts`](src/tresc.ts) — menu, hasła, sekcje, sklep, odnośniki.
Zmieniasz słowa bez dotykania komponentów.

Sekcja z flagą `szkic: true` wyświetla widoczną notkę, że tekst napisał towarzysz,
a nie Suweren. Zdejmujesz flagę, gdy wpiszesz swoje.

## Spięcie z Katedrą — i jego granica

Most (`127.0.0.1:3001`) żyje **tylko na maszynie Suwerena**. Gość z internetu go nie zobaczy
i tak ma być: strona jest w pełni sprawna bez Mostu, a połączenie jest wzbogaceniem
dla gospodarza, nie warunkiem działania.

- **Publicznie** — kafle w „Tajnym Przejściu" prowadzą do Katedry i Gravitona.
- **Lokalnie** — przy żywym Moście sekcja TeO Music zaciąga realne utwory z dysku.

## Czego strona świadomie nie udaje

- **Media** — zdjęć i wideo z Wixa nie da się wiarygodnie pobrać (własny CDN, przetworzone
  rozmiary). Każde miejsce mówi, że czeka na eksport, zamiast pokazywać cudzy obrazek.
- **Sklep, Członkowie, Darowizna** — to były usługi Wixa. Ceny są prawdziwe, ale przycisku
  zapłaty **nie ma**, żeby nikt nie kliknął w pustkę. Wymaga wyboru dostawcy płatności.

---

© 2023–2026 TeO.Center · *IT'S IAM STORY*
