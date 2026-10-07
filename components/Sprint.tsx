"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { D, State, defState, STORAGE_KEY, curDay, started, nice, today, doneCount, streak, solvedMine, totalTarget, pad2 } from "@/lib/util";
import { Today, Journey, PatternsView, Questions } from "./Views";

export type Timer = { end: number; total: number; label: string } | null;
export type Api = {
  S: State;
  update: (fn: (s: State) => void) => void;
  replace: (s: State) => void;
  rev: number;
  view: number;
  setView: (n: number) => void;
  setTab: (t: string) => void;
  timer: Timer;
  left: number;
  startTimer: (mins: number, label: string) => void;
  stopTimer: () => void;
};

const TABS: [string, string][] = [["today", "Today"], ["journey", "30 days"], ["patterns", "Patterns"], ["questions", "Questions"]];

function beep() {
  try {
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    const a = new AC();
    [0, 0.25, 0.5].forEach((t) => {
      const o = a.createOscillator(), g = a.createGain();
      o.frequency.value = 660; g.gain.value = 0.12;
      o.connect(g); g.connect(a.destination);
      o.start(a.currentTime + t); o.stop(a.currentTime + t + 0.15);
    });
  } catch {}
}

export default function Sprint() {
  const [S, setS] = useState<State>(defState());
  const [ready, setReady] = useState(false);
  const [tab, setTabState] = useState("today");
  const [view, setView] = useState(1);
  const [rev, setRev] = useState(0);
  const [timer, setTimer] = useState<Timer>(null);
  const [left, setLeft] = useState(0);
  const saveT = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const sRef = useRef(S);
  sRef.current = S;

  useEffect(() => {
    let loaded = defState();
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) loaded = { ...defState(), ...JSON.parse(raw) };
      const t = localStorage.getItem(STORAGE_KEY + "-tab");
      if (t) setTabState(t);
    } catch {}
    setS(loaded);
    setView(curDay(loaded));
    setReady(true);
  }, []);

  const persist = useCallback((next: State) => {
    clearTimeout(saveT.current);
    saveT.current = setTimeout(() => {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
    }, 300);
  }, []);

  const update = useCallback((fn: (s: State) => void) => {
    const next: State = JSON.parse(JSON.stringify(sRef.current));
    fn(next);
    next.updatedAt = Date.now();
    sRef.current = next;
    setS(next);
    persist(next);
  }, [persist]);

  const replace = useCallback((s: State) => {
    const next = { ...defState(), ...s, updatedAt: Date.now() };
    sRef.current = next; setS(next); persist(next); setView(curDay(next)); setRev((r) => r + 1);
  }, [persist]);

  const setTab = (t: string) => {
    setTabState(t);
    try { localStorage.setItem(STORAGE_KEY + "-tab", t); } catch {}
    window.scrollTo(0, 0);
  };

  const startTimer = (mins: number, label: string) => setTimer({ end: Date.now() + mins * 60000, total: mins * 60, label });
  const stopTimer = () => setTimer(null);

  useEffect(() => {
    if (!timer) return;
    const tick = () => {
      const l = Math.max(0, Math.round((timer.end - Date.now()) / 1000));
      setLeft(l);
      if (l <= 0) {
        const c = curDay(sRef.current);
        update((s) => {
          const d = (s.days[c] = s.days[c] || {});
          d.mins = (d.mins || 0) + Math.round(timer.total / 60);
          if (timer.total >= 1200) d.pomos = (d.pomos || 0) + 1;
        });
        beep();
        setTimer(null);
      }
    };
    tick();
    const id = setInterval(tick, 500);
    return () => clearInterval(id);
  }, [timer, update]);

  const api: Api = { S, update, replace, rev, view, setView, setTab, timer, left, startTimer, stopTimer };
  const c = curDay(S);
  const done = doneCount(S);
  const r = 22, circ = 2 * Math.PI * r, f = done / 30;
  const mm = pad2(Math.floor(left / 60)) + ":" + pad2(left % 60);

  return (
    <>
      <div className="top">
        <div className="top-in">
          <svg className="ring" viewBox="0 0 54 54" aria-hidden="true">
            <circle className="bg" cx="27" cy="27" r={r} fill="none" strokeWidth="6" />
            <circle className="fg" cx="27" cy="27" r={r} fill="none" strokeWidth="6" strokeLinecap="round" strokeDasharray={`${circ * f} ${circ}`} transform="rotate(-90 27 27)" />
            <text x="27" y="32" textAnchor="middle">{done}</text>
          </svg>
          <div className="brand">
            <div className="kick">{ready ? (started(S) ? `Day ${c} of 30 · ${nice(today())}` : `Starts ${nice(S.start)}`) : " "}</div>
            <h1>Interview Sprint</h1>
          </div>
          <div className="stats">
            <div className="stat"><b>{streak(S)}</b><span>day streak</span></div>
            <div className="stat"><b>{solvedMine(S)}/{totalTarget()}</b><span>solved alone</span></div>
          </div>
          <button className={"pill" + (timer ? " on" : "")} onClick={() => setTab("today")} aria-label="Timer running">{timer ? "Timer " + mm : ""}</button>
        </div>
        <nav className="tabs" role="tablist" aria-label="Sections">
          {TABS.map(([k, l]) => (
            <button key={k} className="tab" role="tab" aria-selected={tab === k} onClick={() => setTab(k)}>{l}</button>
          ))}
        </nav>
      </div>
      <main className="wrap">
        {!ready ? <div className="loading">Loading your sprint…</div> : tab === "today" ? <Today api={api} /> : tab === "journey" ? <Journey api={api} /> : tab === "patterns" ? <PatternsView api={api} /> : <Questions api={api} />}
        <div className="sync mono">Saved in this browser. Use Backup on the 30 days tab to move it to another device.</div>
      </main>
    </>
  );
}
