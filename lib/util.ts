import raw from "./data.json";

export type Prob = { t: string; s: string; d: "E" | "M"; pm: boolean };
export type Day = { n: number; wk: number; bf: string; bt: string; itf: string; itt: string; dl: string; rv: string; hrs: number; tg: number; kind: string; pr: Prob[] };
export type Chk = { i: number; cat: string; q: string; day: number };
export type DayState = { done?: boolean; hrs?: number | ""; note?: string; mins?: number; pomos?: number };
export type ProbState = { st?: "" | "help" | "solved"; on?: string; redo?: string[]; note?: string };
export type State = {
  start: string;
  days: Record<number, DayState>;
  probs: Record<string, ProbState>;
  pats: Record<string, { trigger?: string; code?: string }>;
  chk: Record<number, boolean>;
  updatedAt: number;
};

export const D = raw as unknown as { days: Day[]; chk: Chk[] };
export const REDO_OK = [2, 7, 14];
export const REDO_HELP = [1, 3, 7];
export const STORAGE_KEY = "interview-sprint-state-v1";

export const defState = (): State => ({ start: "2026-10-02", days: {}, probs: {}, pats: {}, chk: {}, updatedAt: 0 });

const pad = (n: number) => String(n).padStart(2, "0");
export const fmt = (d: Date) => d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
export const today = () => fmt(new Date());
export const parse = (s: string) => { const [a, b, c] = s.split("-").map(Number); return new Date(a, b - 1, c); };
export const addDays = (s: string, n: number) => { const d = parse(s); d.setDate(d.getDate() + n); return fmt(d); };
export const dayIdx = (a: string, b: string) => Math.round((parse(b).getTime() - parse(a).getTime()) / 864e5) + 1;
export const nice = (s: string) => parse(s).toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" });
export const link = (p: Prob) => "https://leetcode.com/problems/" + p.s + "/";
export const pad2 = pad;

export const curDay = (S: State) => Math.max(1, Math.min(30, dayIdx(S.start, today())));
export const started = (S: State) => dayIdx(S.start, today()) >= 1;

export type FlatProb = Prob & { key: string; day: number; kind: string };
export const allProbs = (): FlatProb[] => D.days.flatMap((d) => d.pr.map((p, i) => ({ ...p, key: "d" + d.n + "p" + i, day: d.n, kind: d.kind })));
export const solvedMine = (S: State) => allProbs().filter((p) => S.probs[p.key]?.st === "solved").length;
export const totalTarget = () => D.days.reduce((a, d) => a + d.pr.length, 0);
export const doneCount = (S: State) => D.days.filter((d) => S.days[d.n]?.done).length;

export function streak(S: State) {
  let c = curDay(S), n = 0;
  if (!S.days[c]?.done) c--;
  while (c >= 1 && S.days[c]?.done) { n++; c--; }
  return n;
}

export function redoQueue(S: State) {
  const t = today();
  const out: (FlatProb & { due: string; k: number })[] = [];
  allProbs().forEach((p) => {
    const s = S.probs[p.key];
    if (!s || !s.on || (s.st !== "solved" && s.st !== "help")) return;
    const k = (s.redo || []).length;
    if (k >= 3) return;
    const due = addDays(s.on, (s.st === "help" ? REDO_HELP : REDO_OK)[k]);
    if (due <= t) out.push({ ...p, due, k });
  });
  return out.sort((a, b) => (a.due < b.due ? -1 : 1));
}
