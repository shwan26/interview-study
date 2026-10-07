"use client";
import { useRef } from "react";
import type { Api } from "./Sprint";
import { D, FlatProb, Prob, allProbs, addDays, curDay, defState, doneCount, link, nice, pad2, redoQueue, solvedMine, started, today, totalTarget } from "@/lib/util";
import { HUE, KIND, PATS, RES, SVG } from "@/lib/patterns";

function ResLinks({ k, ghost }: { k: string; ghost?: boolean }) {
  return (
    <>
      {(RES[k] || []).map(([s, l, u]) => (
        <a key={u + l} className={"btn sm" + (ghost ? " ghost" : "")} href={u} target="_blank" rel="noopener noreferrer">{s}: {l}</a>
      ))}
    </>
  );
}

function ProbCard({ api, p }: { api: Api; p: FlatProb }) {
  const { S, update } = api;
  const s = S.probs[p.key] || {};
  const st = s.st || "";
  const redos = (s.redo || []).length;
  const setSt = (v: "help" | "solved") => update((x) => {
    const e = (x.probs[p.key] = x.probs[p.key] || {});
    if (e.st === v) e.st = ""; else { e.st = v; e.on = today(); }
  });
  return (
    <article className="prob" data-st={st}>
      <div className="row" style={{ justifyContent: "space-between" }}>
        <span className={"diff " + p.d}>{p.d === "E" ? "EASY" : "MEDIUM"}</span>
        <span className="chip">{redos} redo{redos === 1 ? "" : "s"}</span>
      </div>
      <h4>{p.t}</h4>
      <div className="row">
        <a className="btn sm" href={link(p)} target="_blank" rel="noopener noreferrer">Open on LeetCode</a>
        {p.pm && <span className="hint">Premium. Free on neetcode.io</span>}
      </div>
      <div className="steps">
        <button className="btn sm" aria-pressed={st === "help"} onClick={() => setSt("help")}>Needed help</button>
        <button className="btn sm" aria-pressed={st === "solved"} onClick={() => setSt("solved")}>Solved alone</button>
        {st && <button className="btn sm ghost" onClick={() => update((x) => { const e = x.probs[p.key]; (e.redo = e.redo || []).push(today()); })}>Redid it today</button>}
      </div>
      <label className="lab" htmlFor={"n-" + p.key}>Trigger, idea, mistake</label>
      <textarea id={"n-" + p.key} key={api.rev + p.key} defaultValue={s.note || ""} placeholder="What clue says use this pattern? Time and space? Where did you get stuck?"
        onChange={(e) => update((x) => { (x.probs[p.key] = x.probs[p.key] || {}).note = e.target.value; })} />
    </article>
  );
}

export function Today({ api }: { api: Api }) {
  const { S, update, view: n, setView, timer, left, startTimer, stopTimer } = api;
  const d = D.days[n - 1];
  const st = S.days[n] || {};
  const date = addDays(S.start, n - 1);
  const c = curDay(S);
  const isToday = n === c && started(S);
  const q = redoQueue(S);
  const mm = pad2(Math.floor(left / 60)) + ":" + pad2(left % 60);
  const justOpen = "Just open the first task. 10 minutes only.";
  const probs: FlatProb[] = d.pr.map((p, i) => ({ ...p, key: "d" + n + "p" + i, day: n, kind: d.kind }));
  return (
    <div className="grid">
      <div className="col">
        <section className="hero">
          <div className="kick">Day {n} · Week {d.wk} · {nice(date)}{isToday ? " · today" : ""}</div>
          <h2>{d.itf}</h2>
          <div className="meta">
            <span className="chip"><i style={{ ["--h" as any]: HUE[d.kind] }} />{KIND[d.kind]}</span>
            <span className="chip">{d.hrs}h planned</span>
            <span className="chip">{d.pr.length ? d.pr.length + " problems" : "no new problems"}</span>
            {!!st.mins && <span className="chip">{st.mins} min focused</span>}
            {!!st.pomos && <span className="chip">{st.pomos} focus blocks</span>}
          </div>
          <div className="row">
            <button className="btn go" onClick={() => startTimer(10, justOpen)}>Start 10 minutes</button>
            <button className="btn" onClick={() => startTimer(25, "Focus block")}>Focus 25</button>
            <button className="btn ok" aria-pressed={!!st.done} onClick={() => update((x) => { const e = (x.days[n] = x.days[n] || {}); e.done = !e.done; })}>{st.done ? "Day complete" : "Mark day complete"}</button>
          </div>
          <div className="row" style={{ marginTop: 14 }}>
            <button className="btn sm ghost" disabled={n === 1} onClick={() => setView(Math.max(1, n - 1))}>Previous day</button>
            <button className="btn sm ghost" disabled={n === 30} onClick={() => setView(Math.min(30, n + 1))}>Next day</button>
            {n !== c && <button className="btn sm ghost" onClick={() => setView(c)}>Back to today</button>}
          </div>
        </section>

        {RES[d.kind] && (
          <div className="card">
            <span className="lab">{d.kind === "mock" ? "Timed practice" : "Watch it, then practice"}</span>
            <p className="hint">{d.kind === "mock" ? "Open a timed set and run it with a 90 minute timer." : "Step through the animation first, then read the short lesson, then code it yourself."}</p>
            <div className="row"><ResLinks k={d.kind} /></div>
          </div>
        )}

        <div className="two">
          <div className="card"><span className="lab">Build</span><h3>{d.bf}</h3><p>{d.bt}</p></div>
          <div className="card"><span className="lab">Interview</span><h3>{d.itf}</h3><p>{d.itt}</p></div>
        </div>

        {!!probs.length && (<>
          <h3 style={{ marginTop: 4 }}>Problems</h3>
          <div className="two">{probs.map((p) => <ProbCard key={p.key} api={api} p={p} />)}</div>
        </>)}

        <div className="card">
          <span className="lab">Proof it is done</span>
          <p><span className="mk">{d.dl}</span></p>
          <p className="hint">Revives: {d.rv}</p>
          <div className="row" style={{ marginTop: 8 }}>
            <label htmlFor="hrs">Actual hours</label>
            <input id="hrs" type="number" min={0} max={16} step={0.5} key={api.rev + "h" + n} defaultValue={st.hrs ?? ""}
              onChange={(e) => update((x) => { (x.days[n] = x.days[n] || {}).hrs = e.target.value === "" ? "" : Number(e.target.value); })} />
          </div>
        </div>

        <div className="card">
          <label className="lab" htmlFor="dn">Day notes</label>
          <textarea id="dn" key={api.rev + "n" + n} defaultValue={st.note || ""} placeholder="What clicked? What do you need to redo?"
            onChange={(e) => update((x) => { (x.days[n] = x.days[n] || {}).note = e.target.value; })} />
        </div>
      </div>

      <aside className="col">
        <div className="card timer">
          <span className="lab">Focus timer</span>
          <div className="big">{timer ? mm : "00:00"}</div>
          <div className="bar"><i style={{ width: timer ? 100 - (100 * left) / timer.total + "%" : "0%" }} /></div>
          <p className="hint">{timer ? timer.label : "Pick a block and press start"}</p>
          <div className="row">
            <button className="btn sm" onClick={() => startTimer(10, justOpen)}>10</button>
            <button className="btn sm" onClick={() => startTimer(25, "Focus block")}>25</button>
            <button className="btn sm" onClick={() => startTimer(50, "Deep block")}>50</button>
            {timer && <button className="btn sm ghost" onClick={stopTimer}>Stop</button>}
          </div>
        </div>
        <div className="card">
          <h3>Redo today</h3>
          {q.length ? q.slice(0, 6).map((p) => (
            <div className="redo" key={p.key}>
              <div>
                <a href={link(p)} target="_blank" rel="noopener noreferrer">{p.t}</a>
                <div className="hint">Day {p.day} · redo {p.k + 1} of 3</div>
              </div>
              <button className="btn sm" onClick={() => update((x) => { const e = x.probs[p.key]; (e.redo = e.redo || []).push(today()); })}>Done</button>
            </div>
          )) : <p className="hint">Nothing due. Solve a problem and it comes back here after 2, 7 and 14 days.</p>}
        </div>
      </aside>
    </div>
  );
}

export function Journey({ api }: { api: Api }) {
  const { S, update, replace, view, setView, setTab } = api;
  const c = curDay(S);
  const weeks: [number, number][] = [[1, 7], [8, 14], [15, 21], [22, 30]];
  const sub = ["Foundations", "Backend + core DSA", "Frontend, OOP, DP", "DevOps, design, apply"];
  const hrs = D.days.reduce((a, d) => a + (Number(S.days[d.n]?.hrs) || 0), 0);
  const pom = D.days.reduce((a, d) => a + (S.days[d.n]?.pomos || 0), 0);
  const redos = allProbs().reduce((a, p) => a + (S.probs[p.key]?.redo || []).length, 0);
  const fileRef = useRef<HTMLInputElement>(null);

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(S, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = "interview-sprint-backup.json"; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };
  const importJson = async (f?: File) => {
    if (!f) return;
    try { const j = JSON.parse(await f.text()); if (j && typeof j === "object" && j.days && j.probs) replace({ ...defState(), ...j }); } catch {}
  };

  return (
    <>
      <div className="kpis">
        <div className="kpi"><b>{doneCount(S)}/30</b><span>days complete</span></div>
        <div className="kpi"><b>{solvedMine(S)}/{totalTarget()}</b><span>solved alone</span></div>
        <div className="kpi"><b>{redos}</b><span>redos done</span></div>
        <div className="kpi"><b>{hrs}h</b><span>hours logged</span></div>
        <div className="kpi"><b>{pom}</b><span>focus blocks</span></div>
      </div>
      <div className="weeks">
        {weeks.map(([a, b], i) => (
          <div className="wk" key={i}>
            <div><h3>Week {i + 1}</h3><div className="hint">{sub[i]}</div></div>
            <div className="tiles">
              {Array.from({ length: b - a + 1 }, (_, j) => a + j).map((n) => {
                const d = D.days[n - 1], s = S.days[n] || {};
                const cls = [s.done ? "done" : "", n === c && started(S) ? "today" : "", !s.done && n < c && started(S) ? "missed" : "", n === view ? "sel" : ""].join(" ");
                return <button key={n} className={"tile " + cls} onClick={() => { setView(n); setTab("today"); }}><b>{n}</b><span>{KIND[d.kind]}</span></button>;
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="card" style={{ marginTop: 20 }}>
        <label className="lab" htmlFor="st">Plan start date (all dates shift)</label>
        <input id="st" type="date" value={S.start} onChange={(e) => { if (e.target.value) update((x) => { x.start = e.target.value; }); }} />
      </div>
      <div className="card" style={{ marginTop: 16 }}>
        <span className="lab">Backup</span>
        <p className="hint">Your progress lives in this browser. Download a backup before clearing browser data or to open it on another device.</p>
        <div className="row">
          <button className="btn sm" onClick={exportJson}>Download backup</button>
          <button className="btn sm" onClick={() => fileRef.current?.click()}>Restore from file</button>
          <input ref={fileRef} type="file" accept="application/json" hidden onChange={(e) => { importJson(e.target.files?.[0]); e.target.value = ""; }} />
        </div>
      </div>
    </>
  );
}

export function PatternsView({ api }: { api: Api }) {
  const { S, update } = api;
  return (
    <div className="pats">
      {PATS.map((p) => {
        const items = allProbs().filter((x) => x.kind === p.id);
        const ps = S.pats[p.id] || {};
        return (
          <article className="card pat" key={p.id} style={{ ["--h" as any]: p.h }}>
            <span className="chip"><i />Day {p.days}</span>
            <h3 style={{ marginTop: 8 }}>{p.name}</h3>
            <div dangerouslySetInnerHTML={{ __html: SVG[p.id]() }} />
            <div className="starter"><span className="lab">Starter hint</span>{p.hint}</div>
            <span className="lab">Watch and practice</span>
            <div className="row" style={{ marginBottom: 10 }}><ResLinks k={p.id} ghost /></div>
            <div className="dots">
              {items.map((x) => <a key={x.key} className={"dot " + (S.probs[x.key]?.st || "")} href={link(x)} target="_blank" rel="noopener noreferrer">{x.t}</a>)}
            </div>
            <label className="lab" htmlFor={"pt-" + p.id}>My trigger: what clue says use this?</label>
            <textarea id={"pt-" + p.id} key={api.rev + "t" + p.id} defaultValue={ps.trigger || ""}
              onChange={(e) => update((x) => { (x.pats[p.id] = x.pats[p.id] || {}).trigger = e.target.value; })} />
            <label className="lab" htmlFor={"pc-" + p.id} style={{ marginTop: 10 }}>My template code</label>
            <textarea className="code" id={"pc-" + p.id} key={api.rev + "c" + p.id} defaultValue={ps.code || ""} spellCheck={false}
              onChange={(e) => update((x) => { (x.pats[p.id] = x.pats[p.id] || {}).code = e.target.value; })} />
          </article>
        );
      })}
    </div>
  );
}

export function Questions({ api }: { api: Api }) {
  const { S, update, setView, setTab } = api;
  const cats = [...new Set(D.chk.map((q) => q.cat))];
  const yes = D.chk.filter((q) => S.chk[q.i]).length;
  return (
    <>
      <div className="hero" style={{ marginTop: 20 }}>
        <div className="kick">Say each one out loud in under 2 minutes</div>
        <h2>{yes} of {D.chk.length} confident</h2>
        <div className="bar" style={{ margin: "12px 0 0" }}><i style={{ width: (100 * yes) / D.chk.length + "%", background: "var(--teal)" }} /></div>
      </div>
      <div className="qs">
        {cats.map((c) => (
          <div className="card" key={c}>
            <h3>{c}</h3>
            {D.chk.filter((q) => q.cat === c).map((q) => (
              <div className="q" key={q.i}>
                <button aria-pressed={!!S.chk[q.i]} aria-label="Confident" onClick={() => update((x) => { x.chk[q.i] = !x.chk[q.i]; })}>{S.chk[q.i] ? "✓" : ""}</button>
                <p>{q.q}</p>
                <button className="chip" style={{ width: "auto", height: "auto", background: "transparent", color: "inherit", border: "1.5px solid var(--line)", cursor: "pointer", font: "500 12px var(--f-mono)" }} onClick={() => { setView(q.day); setTab("today"); }}>Day {q.day}</button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
