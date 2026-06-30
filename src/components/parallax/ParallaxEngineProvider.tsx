"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { HERO_STICKY_VH } from "@/lib/scroll/rhythmSpec";
import { clamp } from "@/lib/parallax/interpolate";
import {
  computeSnapshot,
  gatesEqual,
  DEFAULT_GATES,
  type ParallaxGates,
  type ParallaxSnapshot,
} from "@/lib/parallax/parallaxSnapshot";

/** About track leads its progress by ~0.46vh so the rising cube meets the ball
 *  exactly when the bounce should fire (matches the old `aboutLead`). */
const ABOUT_LEAD_RATIO = 0.46;

type FrameCb = (snapshot: ParallaxSnapshot) => void;

type EngineApi = {
  snapshotRef: RefObject<ParallaxSnapshot>;
  register: (cb: FrameCb) => () => void;
};

const INITIAL_SNAPSHOT = computeSnapshot({
  hero: 0,
  project: 0,
  about: 0,
  footer: 0,
});

// Fallback so the parallax hooks are safe outside a provider (the reduced-motion
// static layout renders the same sections with no engine). Subscribers never
// fire, so values stay at the progress-0 snapshot , matching the static layout.
const FALLBACK_ENGINE: EngineApi = {
  snapshotRef: { current: INITIAL_SNAPSHOT },
  register: () => () => {},
};

const EngineContext = createContext<EngineApi>(FALLBACK_ENGINE);
const GatesContext = createContext<ParallaxGates>(DEFAULT_GATES);

type Refs = {
  heroTrackRef: RefObject<HTMLElement | null>;
  projectTrackRef: RefObject<HTMLElement | null>;
  aboutTrackRef: RefObject<HTMLElement | null>;
  footerTrackRef: RefObject<HTMLElement | null>;
};

type ParallaxEngineProviderProps = Refs & { children: ReactNode };

function readProgress(
  track: HTMLElement | null,
  leadPx: number,
  vh: number,
): number {
  if (!track) return 0;
  const rect = track.getBoundingClientRect();
  const scrollable = track.offsetHeight - vh;
  if (scrollable <= 0) return 0;
  const scrolled = clamp(leadPx - rect.top, 0, scrollable);
  return scrolled / scrollable;
}

/** Continuous hero values are pushed to CSS custom properties so the hero DOM
 *  animates without ever re-rendering React. */
function writeHeroVars(snapshot: ParallaxSnapshot): void {
  const root = document.documentElement.style;
  const { hero } = snapshot;
  root.setProperty("--hero-split", hero.splitOpacity.toFixed(4));
  root.setProperty("--hero-title-y", hero.titleYOffset.toFixed(2));
  root.setProperty("--hero-title-scale", hero.titleScale.toFixed(4));
  root.setProperty("--hero-rowgap", hero.rowGapEm.toFixed(4));
}

export function ParallaxEngineProvider({
  heroTrackRef,
  projectTrackRef,
  aboutTrackRef,
  footerTrackRef,
  children,
}: ParallaxEngineProviderProps) {
  const snapshotRef = useRef<ParallaxSnapshot>(INITIAL_SNAPSHOT);
  const subscribersRef = useRef<Set<FrameCb>>(new Set());
  const [gates, setGates] = useState<ParallaxGates>(INITIAL_SNAPSHOT.gates);
  const gatesRef = useRef<ParallaxGates>(INITIAL_SNAPSHOT.gates);

  const api = useMemo<EngineApi>(
    () => ({
      snapshotRef,
      register: (cb) => {
        subscribersRef.current.add(cb);
        // Push the current snapshot immediately so late subscribers sync up.
        cb(snapshotRef.current);
        return () => {
          subscribersRef.current.delete(cb);
        };
      },
    }),
    [],
  );

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      const heroStickyPx = (vh * HERO_STICKY_VH) / 100;

      const snapshot = computeSnapshot({
        hero: readProgress(heroTrackRef.current, 0, heroStickyPx),
        project: readProgress(projectTrackRef.current, 0, vh),
        about: readProgress(aboutTrackRef.current, vh * ABOUT_LEAD_RATIO, vh),
        footer: readProgress(footerTrackRef.current, 0, vh),
      });

      snapshotRef.current = snapshot;
      writeHeroVars(snapshot);

      for (const cb of subscribersRef.current) cb(snapshot);

      if (!gatesEqual(snapshot.gates, gatesRef.current)) {
        gatesRef.current = snapshot.gates;
        setGates(snapshot.gates);
      }
    };

    const schedule = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [heroTrackRef, projectTrackRef, aboutTrackRef, footerTrackRef]);

  return (
    <EngineContext.Provider value={api}>
      <GatesContext.Provider value={gates}>{children}</GatesContext.Provider>
    </EngineContext.Provider>
  );
}

function useEngine(): EngineApi {
  return useContext(EngineContext);
}

/** Mount/visibility gates. Re-renders the caller only when a gate flips. */
export function useParallaxGates(): ParallaxGates {
  return useContext(GatesContext);
}

/** Imperative per-frame callback , for components that write the DOM directly
 *  (e.g. the project track transform) without re-rendering. */
export function useParallaxFrame(cb: FrameCb): void {
  const engine = useEngine();
  const cbRef = useRef(cb);
  cbRef.current = cb;

  useEffect(() => {
    return engine.register((snapshot) => cbRef.current(snapshot));
  }, [engine]);
}

/** Read the latest snapshot imperatively (inside event handlers / callbacks). */
export function useParallaxSnapshotRef(): RefObject<ParallaxSnapshot> {
  return useEngine().snapshotRef;
}

/** Subscribe to a derived slice of the snapshot. Re-renders the calling
 *  component only when the selected value changes , so a section churns only
 *  while its own progress is moving, never on a sibling's scroll. */
export function useParallaxValue<T>(
  selector: (snapshot: ParallaxSnapshot) => T,
  isEqual: (a: T, b: T) => boolean = Object.is,
): T {
  const engine = useEngine();
  const selectorRef = useRef(selector);
  selectorRef.current = selector;
  const isEqualRef = useRef(isEqual);
  isEqualRef.current = isEqual;

  const [value, setValue] = useState<T>(() =>
    selector(engine.snapshotRef.current),
  );
  const valueRef = useRef(value);
  valueRef.current = value;

  useEffect(() => {
    return engine.register((snapshot) => {
      const next = selectorRef.current(snapshot);
      if (!isEqualRef.current(valueRef.current, next)) {
        valueRef.current = next;
        setValue(next);
      }
    });
  }, [engine]);

  return value;
}
