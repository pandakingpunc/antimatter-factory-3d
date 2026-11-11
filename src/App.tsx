import { useCallback, useEffect, useRef, useState } from 'react';
import { CATS, PARTS, type Cat, type T } from './data/parts';
import { createScene, type SceneAPI } from './scene/createScene';

const UI = {
  title: ['Antimadde Fabrikası', 'Antimatter Factory'],
  sub: ['CERN · AD / ELENA · 3B tur', 'CERN · AD / ELENA · 3D tour'],
  parts: ['Parçalar', 'Parts'],
  labels: ['Etiketler', 'Labels'],
  reset: ['Görünümü sıfırla', 'Reset view'],
  introTitle: ['Bir şişe hidrojenden antiatoma', 'From a bottle of hydrogen to an anti-atom'],
  introText: [
    'CERN’de antimaddenin nasıl üretildiğini adım adım gezin: protonlar hızlandırılır, hedefe çarptırılır; doğan antiprotonlar yavaşlatılır ve tuzaklanır. Bir parçaya tıklayın ya da turu başlatın.',
    'Walk through how antimatter is made at CERN, step by step: protons are accelerated and smashed into a target, and the antiprotons that emerge are slowed down and trapped. Click any part or start the tour.',
  ],
  note: [
    'Model şematiktir; ölçek ve yerleşim anlaşılır olması için sadeleştirildi.',
    'The model is schematic; scale and layout are simplified for clarity.',
  ],
  start: ['Tura başla', 'Start the tour'],
  hint: ['Sürükle: döndür · Tekerlek: yakınlaş · Sağ tık: kaydır', 'Drag: rotate · Scroll: zoom · Right-drag: pan'],
  hintTouch: ['Bir parmak: döndür · İki parmak: yakınlaş, kaydır', 'One finger: rotate · Two fingers: zoom, pan'],
  prev: ['Önceki', 'Previous'],
  next: ['Sonraki', 'Next'],
  finish: ['Turu bitir', 'Finish tour'],
  close: ['Kapat', 'Close'],
  fact: ['Biliyor muydunuz?', 'Did you know?'],
  specs: ['Temel değerler', 'Key figures'],
  lang: ['Dil', 'Language'],
  proton: ['Proton', 'Proton'],
  anti: ['Antiproton', 'Antiproton'],
  posi: ['Pozitron', 'Positron'],
  nogl: [
    'Tarayıcınız WebGL’i desteklemediği için 3B sahne gösterilemiyor. Parçaları yine de listeden okuyabilirsiniz.',
    'Your browser does not support WebGL, so the 3D scene cannot be shown. You can still read about each part from the list.',
  ],
} satisfies Record<string, T>;

const CAT_ORDER: Cat[] = ['proton', 'production', 'decel', 'exp', 'trap'];
const glass = 'border border-line bg-panel/90 backdrop-blur-md shadow-xl shadow-black/40';
const iconBtn =
  'grid h-10 min-w-10 place-items-center rounded-lg border border-line bg-panel/90 px-2.5 text-sm text-slate-200 backdrop-blur-md transition-colors hover:border-slate-500 hover:bg-[#162033]';

const Icon = ({ d }: { d: string }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
);

function PartList({ lang, sel, onPick }: { lang: number; sel: string | null; onPick: (id: string) => void }) {
  const active = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    active.current?.scrollIntoView({ block: 'nearest' });
  }, [sel]);
  return (
    <nav aria-label={UI.parts[lang]} className="scroll h-full overflow-y-auto p-2">
      {CAT_ORDER.map((c) => (
        <section key={c} className="mb-2">
          <h3 className="flex items-center gap-2 px-2 pb-1 pt-2 font-mono text-[11px] font-medium tracking-wide text-mute">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: CATS[c].color }} />
            {CATS[c].name[lang]}
          </h3>
          <ul>
            {PARTS.map((p, i) =>
              p.cat !== c ? null : (
                <li key={p.id}>
                  <button
                    ref={sel === p.id ? active : undefined}
                    type="button"
                    aria-current={sel === p.id}
                    onClick={() => onPick(p.id)}
                    className={`flex min-h-10 w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-sm transition-colors ${
                      sel === p.id ? 'bg-[#1a2740] text-white' : 'text-slate-300 hover:bg-[#141d2e]'
                    }`}
                  >
                    <span
                      className="grid h-6 w-6 shrink-0 place-items-center rounded-full font-mono text-[11px] font-bold"
                      style={sel === p.id ? { background: CATS[c].color, color: '#070a12' } : { border: `1px solid ${CATS[c].color}66`, color: CATS[c].color }}
                    >
                      {i + 1}
                    </span>
                    <span className="leading-tight">{p.name[lang]}</span>
                  </button>
                </li>
              ),
            )}
          </ul>
        </section>
      ))}
    </nav>
  );
}

export default function App() {
  const [lang, setLang] = useState<number>(() => (localStorage.getItem('lang') === 'en' ? 1 : 0));
  const [sel, setSel] = useState<string | null>(null);
  const [labels, setLabels] = useState(true);
  const [drawer, setDrawer] = useState(false);
  const [noGL, setNoGL] = useState(false);
  const host = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLElement>(null);
  const api = useRef<SceneAPI | null>(null);
  const touch = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

  useEffect(() => {
    try {
      const a = createScene(host.current!, (id) => setSel(id));
      api.current = a;
      return () => {
        a.dispose();
        api.current = null;
      };
    } catch {
      setNoGL(true);
    }
  }, []);

  useEffect(() => {
    api.current?.setLang(lang);
    document.documentElement.lang = lang ? 'en' : 'tr';
    document.title = lang ? 'Antimatter Factory — CERN 3D Tour' : 'Antimadde Fabrikası — CERN 3B Tur';
    localStorage.setItem('lang', lang ? 'en' : 'tr');
  }, [lang]);
  // Tell the scene which part of the viewport is free of panels, so it can centre itself there.
  const measure = useCallback(() => {
    const r = panel.current?.getBoundingClientRect();
    if (!r) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    if (w >= 1024) api.current?.setInsets(w >= 1280 ? 288 : 0, w - r.left + 8, 70, 60);
    else api.current?.setInsets(0, 0, 110, h - r.top);
  }, []);
  useEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [measure, sel, lang]);
  useEffect(() => api.current?.focus(sel), [sel]);
  useEffect(() => api.current?.setLabels(labels), [labels]);

  const idx = PARTS.findIndex((p) => p.id === sel);
  const part = idx >= 0 ? PARTS[idx] : null;
  const step = useCallback(
    (d: number) => {
      const n = idx + d;
      if (n >= PARTS.length) {
        setSel(null);
        api.current?.reset();
      } else if (n >= 0) setSel(PARTS[n].id);
    },
    [idx],
  );
  const pick = (id: string) => {
    setSel(id);
    setDrawer(false);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDrawer(false);
        setSel(null);
      } else if (idx >= 0 && e.key === 'ArrowRight') step(1);
      else if (idx >= 0 && e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [idx, step]);

  const cat = part ? CATS[part.cat] : null;

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-ink">
      <div ref={host} className="absolute inset-0 isolate" />
      {noGL && (
        <p className="absolute inset-0 grid place-items-center px-8 text-center text-mute">
          <span className="max-w-md">{UI.nogl[lang]}</span>
        </p>
      )}

      {/* Top bar */}
      <header className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-2 p-3 lg:p-4">
        <div className={`pointer-events-auto flex min-w-0 items-center gap-3 rounded-xl px-3 py-2 ${glass}`}>
          <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true" className="shrink-0">
            <circle cx="16" cy="16" r="11" fill="none" stroke="#ff4d9d" strokeWidth="2" />
            <circle cx="16" cy="16" r="4.5" fill="none" stroke="#4cc9f0" strokeWidth="2" />
            <circle cx="27" cy="16" r="2.6" fill="#ff4d9d" />
            <path d="M3 5h9" stroke="#e8eef8" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <div className="sr-only min-w-0 sm:not-sr-only">
            <h1 className="truncate text-[15px] font-semibold leading-tight text-white">{UI.title[lang]}</h1>
            <p className="hidden truncate font-mono text-[11px] text-mute sm:block">{UI.sub[lang]}</p>
          </div>
        </div>

        <div className="pointer-events-auto flex shrink-0 items-center gap-2">
          <div role="group" aria-label={UI.lang[lang]} className="flex h-10 rounded-lg border border-line bg-panel/90 p-1 backdrop-blur-md">
            {['TR', 'EN'].map((l, i) => (
              <button
                key={l}
                type="button"
                aria-pressed={lang === i}
                onClick={() => setLang(i)}
                className={`rounded-md px-3 font-mono text-xs font-bold transition-colors ${
                  lang === i ? 'bg-proton text-ink' : 'text-slate-300 hover:text-white'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
          <button
            type="button"
            aria-pressed={labels}
            title={UI.labels[lang]}
            aria-label={UI.labels[lang]}
            onClick={() => setLabels((v) => !v)}
            className={`${iconBtn} ${labels ? '!border-proton/60 !text-proton' : ''}`}
          >
            <Icon d="M4 5h11l5 7-5 7H4z M9 12h.01" />
          </button>
          <button type="button" title={UI.reset[lang]} aria-label={UI.reset[lang]} onClick={() => { setSel(null); api.current?.reset(); }} className={iconBtn}>
            <Icon d="M3 12a9 9 0 1 0 3-6.7 M3 4v5h5" />
          </button>
          <button type="button" aria-expanded={drawer} onClick={() => setDrawer((v) => !v)} className={`${iconBtn} xl:hidden`} aria-label={UI.parts[lang]}>
            <Icon d="M4 6h16 M4 12h16 M4 18h16" />
          </button>
        </div>
      </header>

      {/* Parts list: sidebar on desktop, drawer on mobile */}
      <aside
        className={`absolute bottom-4 left-3 top-[4.5rem] z-30 w-64 overflow-hidden rounded-xl lg:left-4 lg:top-20 xl:block ${glass} ${drawer ? 'block' : 'hidden'}`}
      >
        <PartList lang={lang} sel={sel} onPick={pick} />
      </aside>
      {drawer && <button type="button" aria-label={UI.close[lang]} className="absolute inset-0 z-20 bg-black/40 xl:hidden" onClick={() => setDrawer(false)} />}

      {/* Legend */}
      <div className="pointer-events-none absolute left-3 top-[4.5rem] z-10 flex flex-col gap-2 lg:bottom-4 lg:left-1/2 lg:top-auto lg:-translate-x-1/2 lg:items-center">
        <ul className={`flex items-center gap-3 rounded-full px-3 py-1.5 text-xs text-slate-300 ${glass}`}>
          {([['proton', '#4cc9f0'], ['anti', '#ff4d9d'], ['posi', '#b8f35a']] as const).map(([k, c]) => (
            <li key={k} className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ background: c, boxShadow: `0 0 8px ${c}` }} />
              {UI[k][lang]}
            </li>
          ))}
        </ul>
        <p className="hidden font-mono text-[11px] text-mute lg:block">{UI.hint[lang]}</p>
      </div>

      {/* Detail / intro panel */}
      <section
        key={part?.id ?? 'intro'}
        ref={panel}
        aria-live="polite"
        className={`rise absolute inset-x-0 bottom-0 z-10 flex max-h-[46dvh] flex-col rounded-t-2xl lg:inset-x-auto lg:bottom-auto lg:right-4 lg:top-20 lg:max-h-[calc(100dvh-6rem)] lg:w-[380px] lg:rounded-2xl ${glass}`}
      >
        {part && cat ? (
          <>
            <div className="scroll flex-1 overflow-y-auto p-5 pb-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs" style={{ borderColor: `${cat.color}55`, color: cat.color }}>
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: cat.color }} />
                  {cat.name[lang]}
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-mute">
                    {String(idx + 1).padStart(2, '0')} / {PARTS.length}
                  </span>
                  <button type="button" onClick={() => setSel(null)} aria-label={UI.close[lang]} className="grid h-9 w-9 place-items-center rounded-lg text-slate-300 hover:bg-[#1a2740] hover:text-white">
                    <Icon d="M6 6l12 12 M18 6L6 18" />
                  </button>
                </div>
              </div>
              <h2 className="text-balance text-2xl font-semibold leading-tight text-white">{part.name[lang]}</h2>
              <p className="mt-1 text-sm font-medium" style={{ color: cat.color }}>
                {part.short[lang]}
              </p>
              <p className="mt-3 text-pretty text-[15px] leading-relaxed text-slate-200">{part.desc[lang]}</p>

              <h3 className="mb-2 mt-5 font-mono text-[11px] font-medium tracking-wide text-mute">{UI.specs[lang]}</h3>
              <dl className="divide-y divide-line rounded-xl border border-line">
                {part.specs.map(([k, v]) => (
                  <div key={k[1]} className="flex items-baseline justify-between gap-4 px-3 py-2">
                    <dt className="text-[13px] text-mute">{k[lang]}</dt>
                    <dd className="text-right font-mono text-[13px] font-medium text-white">{v[lang]}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-4 rounded-xl bg-[#131c2d] p-3.5">
                <h3 className="mb-1 font-mono text-[11px] font-medium tracking-wide" style={{ color: cat.color }}>
                  {UI.fact[lang]}
                </h3>
                <p className="text-pretty text-sm leading-relaxed text-slate-200">{part.fact[lang]}</p>
              </div>
            </div>
            <div className="flex gap-2 border-t border-line p-3">
              <button
                type="button"
                disabled={idx === 0}
                onClick={() => step(-1)}
                className="flex h-11 flex-1 items-center justify-center gap-1.5 rounded-lg border border-line text-sm text-slate-200 transition-colors hover:bg-[#1a2740] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
              >
                <Icon d="M15 6l-6 6 6 6" />
                {UI.prev[lang]}
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                className="flex h-11 flex-1 items-center justify-center gap-1.5 rounded-lg bg-proton text-sm font-semibold text-ink transition-colors hover:bg-[#7ad8f5]"
              >
                {idx === PARTS.length - 1 ? UI.finish[lang] : UI.next[lang]}
                <Icon d="M9 6l6 6-6 6" />
              </button>
            </div>
          </>
        ) : (
          <div className="p-5">
            <p className="font-mono text-[11px] font-medium tracking-wide text-anti">{UI.sub[lang]}</p>
            <h2 className="mt-1.5 text-balance text-xl font-semibold leading-tight text-white lg:text-2xl">{UI.introTitle[lang]}</h2>
            <p className="mt-2 text-pretty text-sm leading-relaxed text-slate-200 lg:text-[15px]">{UI.introText[lang]}</p>
            <button
              type="button"
              onClick={() => setSel(PARTS[0].id)}
              className="mt-4 flex h-11 w-full items-center justify-center gap-1.5 rounded-lg bg-proton text-sm font-semibold text-ink transition-colors hover:bg-[#7ad8f5]"
            >
              {UI.start[lang]}
              <Icon d="M9 6l6 6-6 6" />
            </button>
            <p className="mt-3 text-xs leading-relaxed text-mute">
              {touch ? UI.hintTouch[lang] : UI.hint[lang]}
              <br />
              {UI.note[lang]}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
