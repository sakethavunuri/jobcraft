import { useState, useRef, useCallback, useEffect } from "react";

/* ─── STYLES ─────────────────────────────────────────────────────────── */
const G = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=IBM+Plex+Sans:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');

*{box-sizing:border-box;margin:0;padding:0}
:root{
  --ink:#111010;--ink2:#3d3d3d;--ink3:#6b6b6b;
  --bg:#f7f6f2;--white:#ffffff;
  --card:#ffffff;--border:#e2e0d8;--border2:#ccc9be;
  --fire:#d94f0a;--fire2:#f06030;--fire-bg:rgba(217,79,10,0.07);
  --blue:#1d4ed8;--blue-bg:rgba(29,78,216,0.07);
  --green:#16a34a;--green-bg:rgba(22,163,74,0.07);
  --amber:#b45309;--amber-bg:rgba(180,83,9,0.07);
  --radius:14px;
}
html{scroll-behavior:smooth}
body{background:var(--bg);color:var(--ink);font-family:'IBM Plex Sans',sans-serif;min-height:100vh}

/* ── LAYOUT ── */
.shell{display:flex;min-height:100vh}

.sidebar{
  width:260px;flex-shrink:0;
  background:var(--ink);
  display:flex;flex-direction:column;
  position:sticky;top:0;height:100vh;
  overflow:hidden;
}
.sb-logo{
  padding:1.75rem 1.5rem 1.25rem;
  border-bottom:1px solid rgba(255,255,255,0.07);
}
.sb-logo h1{
  font-family:'Playfair Display',serif;
  font-size:1.5rem;font-weight:900;
  color:#fff;letter-spacing:-0.02em;line-height:1;
}
.sb-logo .tagline{
  font-size:0.68rem;letter-spacing:0.12em;text-transform:uppercase;
  color:rgba(255,255,255,0.35);margin-top:0.4rem;
  font-family:'IBM Plex Mono',monospace;
}
.sb-logo .free-badge{
  display:inline-block;
  background:var(--fire);color:#fff;
  font-size:0.6rem;letter-spacing:0.1em;text-transform:uppercase;
  font-family:'IBM Plex Mono',monospace;
  padding:0.15rem 0.5rem;border-radius:4px;margin-top:0.5rem;
}

.sb-nav{flex:1;padding:1rem 0;overflow-y:auto}
.sb-section{
  font-size:0.6rem;letter-spacing:0.14em;text-transform:uppercase;
  color:rgba(255,255,255,0.25);font-family:'IBM Plex Mono',monospace;
  padding:0.75rem 1.5rem 0.4rem;
}
.sb-item{
  display:flex;align-items:center;gap:0.75rem;
  padding:0.65rem 1.5rem;cursor:pointer;
  transition:all 0.15s;border-left:3px solid transparent;
  font-size:0.85rem;color:rgba(255,255,255,0.55);font-weight:400;
}
.sb-item:hover{background:rgba(255,255,255,0.05);color:rgba(255,255,255,0.85)}
.sb-item.active{
  background:rgba(217,79,10,0.15);
  border-left-color:var(--fire);
  color:#fff;font-weight:500;
}
.sb-item .sb-icon{font-size:0.95rem;width:20px;text-align:center;flex-shrink:0}
.sb-item .sb-badge{
  margin-left:auto;font-size:0.6rem;
  background:var(--fire);color:#fff;
  padding:0.1rem 0.45rem;border-radius:99px;
  font-family:'IBM Plex Mono',monospace;
}
.sb-item .sb-check{margin-left:auto;color:var(--fire);font-size:0.8rem}

.sb-footer{padding:1rem 1.5rem;border-top:1px solid rgba(255,255,255,0.07)}
.key-status{
  display:flex;align-items:center;gap:0.6rem;
  font-size:0.72rem;color:rgba(255,255,255,0.35);
  font-family:'IBM Plex Mono',monospace;
}
.key-dot{width:6px;height:6px;border-radius:50%;background:#22c55e;flex-shrink:0}
.key-dot.off{background:#f87171}
.key-clear{
  margin-left:auto;background:none;border:none;
  color:rgba(255,255,255,0.25);cursor:pointer;font-size:0.7rem;
  font-family:'IBM Plex Mono',monospace;
  transition:color 0.15s;padding:0.1rem;
}
.key-clear:hover{color:#f87171}

.main{flex:1;overflow-y:auto;padding:2.5rem 2rem 4rem;max-width:900px}

/* ── SETUP SCREENS ── */
.setup-wrap{
  min-height:100vh;display:flex;align-items:center;justify-content:center;
  background:var(--bg);padding:2rem;
}
.setup-card{
  background:var(--white);border:1px solid var(--border);
  border-radius:20px;padding:2.5rem;width:100%;max-width:520px;
  box-shadow:0 4px 40px rgba(0,0,0,0.06);
}
.setup-eyebrow{
  font-size:0.65rem;letter-spacing:0.15em;text-transform:uppercase;
  color:var(--fire);font-family:'IBM Plex Mono',monospace;margin-bottom:0.75rem;
}
.setup-title{
  font-family:'Playfair Display',serif;
  font-size:2rem;font-weight:900;line-height:1.15;
  color:var(--ink);margin-bottom:0.5rem;
}
.setup-sub{color:var(--ink3);font-size:0.88rem;line-height:1.55;margin-bottom:1.75rem}
.notice{
  display:flex;gap:0.6rem;align-items:flex-start;
  background:var(--blue-bg);border:1px solid rgba(29,78,216,0.15);
  border-radius:10px;padding:0.85rem 1rem;
  font-size:0.78rem;color:var(--ink2);line-height:1.5;margin-bottom:1.25rem;
}
.notice-icon{flex-shrink:0;font-size:1rem;margin-top:-1px}
.field-label{
  font-size:0.72rem;font-weight:600;letter-spacing:0.06em;
  text-transform:uppercase;color:var(--ink3);margin-bottom:0.5rem;
  font-family:'IBM Plex Mono',monospace;
}
.text-input{
  width:100%;background:var(--bg);border:1px solid var(--border2);
  border-radius:10px;color:var(--ink);font-family:'IBM Plex Mono',monospace;
  font-size:0.82rem;padding:0.8rem 1rem;outline:none;
  transition:border-color 0.2s;
}
.text-input:focus{border-color:var(--fire)}
.text-input::placeholder{color:var(--ink3);font-family:'IBM Plex Sans',sans-serif}
.btn-fire{
  width:100%;background:var(--fire);color:#fff;border:none;
  border-radius:10px;padding:0.9rem;margin-top:1rem;
  font-family:'IBM Plex Sans',sans-serif;font-weight:600;font-size:0.95rem;
  cursor:pointer;transition:all 0.2s;
}
.btn-fire:hover:not(:disabled){background:var(--fire2);transform:translateY(-1px);box-shadow:0 6px 20px rgba(217,79,10,0.3)}
.btn-fire:disabled{opacity:0.35;cursor:not-allowed}
.link-hint{text-align:center;font-size:0.75rem;color:var(--ink3);margin-top:0.75rem}
.link-hint a{color:var(--fire);text-decoration:none}
.link-hint a:hover{text-decoration:underline}

/* ── PAGE HEADER ── */
.page-header{margin-bottom:2rem}
.page-eyebrow{
  font-size:0.65rem;letter-spacing:0.14em;text-transform:uppercase;
  color:var(--fire);font-family:'IBM Plex Mono',monospace;margin-bottom:0.5rem;
}
.page-title{
  font-family:'Playfair Display',serif;
  font-size:2.2rem;font-weight:900;color:var(--ink);
  letter-spacing:-0.02em;line-height:1.15;
}
.page-sub{color:var(--ink3);font-size:0.88rem;margin-top:0.4rem;line-height:1.5}

/* ── CARDS ── */
.card{
  background:var(--card);border:1px solid var(--border);
  border-radius:var(--radius);padding:1.5rem;margin-bottom:1.25rem;
}
.card-header{
  display:flex;align-items:center;justify-content:space-between;
  margin-bottom:1.25rem;
}
.card-title{
  font-weight:600;font-size:0.9rem;color:var(--ink);
  display:flex;align-items:center;gap:0.5rem;
}
.card-title .ct-icon{font-size:1rem}

/* ── DROP ZONE ── */
.dropzone{
  border:2px dashed var(--border2);border-radius:10px;
  padding:2rem 1.5rem;text-align:center;cursor:pointer;
  transition:all 0.2s;background:var(--bg);position:relative;
}
.dropzone:hover,.dropzone.dov{border-color:var(--fire);background:var(--fire-bg)}
.dropzone input{position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;height:100%}
.dz-icon{font-size:2rem;display:block;margin-bottom:0.6rem}
.dz-text{font-size:0.85rem;color:var(--ink3)}
.dz-text strong{color:var(--fire)}
.dz-hint{font-size:0.72rem;color:var(--ink3);margin-top:0.25rem}
.file-pill{
  display:flex;align-items:center;gap:0.6rem;
  background:var(--green-bg);border:1px solid rgba(22,163,74,0.2);
  border-radius:8px;padding:0.6rem 0.9rem;margin-top:0.75rem;
}
.file-pill .fp-name{
  font-family:'IBM Plex Mono',monospace;font-size:0.78rem;
  color:var(--green);flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
.file-pill .fp-rm{
  background:none;border:none;color:var(--ink3);cursor:pointer;
  font-size:0.85rem;transition:color 0.15s;padding:0.1rem 0.3rem;border-radius:4px;
}
.file-pill .fp-rm:hover{color:#dc2626}

textarea.jd-input{
  width:100%;background:var(--bg);border:1px solid var(--border2);
  border-radius:10px;color:var(--ink);font-family:'IBM Plex Sans',sans-serif;
  font-size:0.85rem;line-height:1.65;padding:0.85rem 1rem;
  resize:vertical;outline:none;transition:border-color 0.2s;min-height:150px;
}
textarea.jd-input:focus{border-color:var(--fire)}
textarea.jd-input::placeholder{color:var(--ink3)}

/* ── TOOL BUTTONS ── */
.tool-btn{
  display:inline-flex;align-items:center;gap:0.5rem;
  background:var(--ink);color:#fff;border:none;border-radius:8px;
  padding:0.65rem 1.25rem;font-family:'IBM Plex Sans',sans-serif;
  font-weight:600;font-size:0.82rem;cursor:pointer;transition:all 0.15s;
}
.tool-btn:hover:not(:disabled){background:#2a2a2a;transform:translateY(-1px)}
.tool-btn:disabled{opacity:0.35;cursor:not-allowed}
.tool-btn.fire{background:var(--fire)}
.tool-btn.fire:hover:not(:disabled){background:var(--fire2)}

.run-all-btn{
  width:100%;background:linear-gradient(135deg,#d94f0a,#b83d08);
  color:#fff;border:none;border-radius:12px;padding:1.1rem;
  font-family:'Playfair Display',serif;font-weight:700;font-size:1.1rem;
  cursor:pointer;transition:all 0.2s;
  display:flex;align-items:center;justify-content:center;gap:0.6rem;
  box-shadow:0 4px 20px rgba(217,79,10,0.25);margin-bottom:1.5rem;
  letter-spacing:-0.01em;
}
.run-all-btn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 8px 30px rgba(217,79,10,0.35)}
.run-all-btn:disabled{opacity:0.4;cursor:not-allowed}

/* ── LOADING ── */
.spinner{
  width:20px;height:20px;border:2.5px solid rgba(255,255,255,0.3);
  border-top-color:#fff;border-radius:50%;
  animation:spin 0.7s linear infinite;display:inline-block;
}
.spinner.dark{border:2.5px solid rgba(0,0,0,0.1);border-top-color:var(--ink)}
@keyframes spin{to{transform:rotate(360deg)}}

.loading-panel{
  display:flex;flex-direction:column;align-items:center;gap:0.75rem;
  padding:2.5rem;text-align:center;
}
.loading-panel p{font-size:0.82rem;color:var(--ink3);font-family:'IBM Plex Mono',monospace}

/* ── ATS SCORE ── */
.score-hero{
  display:flex;align-items:center;gap:2rem;
  background:var(--ink);border-radius:var(--radius);
  padding:2rem;margin-bottom:1.25rem;color:#fff;
  position:relative;overflow:hidden;
}
.score-hero::after{
  content:'';position:absolute;right:-40px;top:-60px;
  width:200px;height:200px;border-radius:50%;
  background:radial-gradient(circle,rgba(217,79,10,0.3),transparent 70%);
  pointer-events:none;
}
.score-ring-wrap{flex-shrink:0;position:relative;width:110px;height:110px}
.score-ring-wrap svg{transform:rotate(-90deg)}
.ring-bg2{fill:none;stroke:rgba(255,255,255,0.1);stroke-width:9}
.ring-fg{fill:none;stroke-width:9;stroke-linecap:round}
.ring-center{
  position:absolute;inset:0;display:flex;flex-direction:column;
  align-items:center;justify-content:center;
}
.ring-num{font-family:'Playfair Display',serif;font-size:2rem;font-weight:900;line-height:1}
.ring-den{font-size:0.65rem;color:rgba(255,255,255,0.4);font-family:'IBM Plex Mono',monospace}
.score-info{flex:1}
.score-tier{
  display:inline-flex;align-items:center;gap:0.35rem;
  font-size:0.7rem;font-family:'IBM Plex Mono',monospace;letter-spacing:0.06em;
  padding:0.25rem 0.7rem;border-radius:99px;margin-bottom:0.6rem;
}
.tier-s{background:rgba(22,163,74,0.2);color:#4ade80}
.tier-g{background:rgba(59,130,246,0.2);color:#93c5fd}
.tier-f{background:rgba(251,146,60,0.2);color:#fdba74}
.tier-p{background:rgba(248,113,113,0.2);color:#fca5a5}
.score-info h2{font-family:'Playfair Display',serif;font-size:1.5rem;font-weight:700;margin-bottom:0.35rem}
.score-info p{font-size:0.83rem;color:rgba(255,255,255,0.6);line-height:1.55}

.breakdown-row{display:grid;grid-template-columns:repeat(3,1fr);gap:0.75rem;margin-bottom:1.25rem}
@media(max-width:600px){.breakdown-row{grid-template-columns:1fr 1fr}}
.bk-cell{
  background:var(--card);border:1px solid var(--border);
  border-radius:10px;padding:0.85rem;text-align:center;
}
.bk-val{font-family:'Playfair Display',serif;font-size:1.5rem;font-weight:700}
.bk-lbl{font-size:0.68rem;color:var(--ink3);margin-top:0.2rem;line-height:1.3}
.bk-bar{height:3px;background:var(--border);border-radius:99px;margin-top:0.5rem;overflow:hidden}
.bk-bar-fill{height:100%;border-radius:99px;transition:width 0.8s ease}

/* ── KEYWORDS ── */
.kw-grid{display:grid;grid-template-columns:1fr 1fr;gap:1.25rem;margin-bottom:1.25rem}
@media(max-width:580px){.kw-grid{grid-template-columns:1fr}}
.kw-panel{background:var(--card);border:1px solid var(--border);border-radius:var(--radius);padding:1.25rem}
.kw-panel-title{font-weight:600;font-size:0.82rem;margin-bottom:0.85rem;display:flex;align-items:center;gap:0.4rem}
.tag-cloud{display:flex;flex-wrap:wrap;gap:0.4rem}
.tag{font-family:'IBM Plex Mono',monospace;font-size:0.7rem;padding:0.25rem 0.65rem;border-radius:6px;cursor:default}
.tag-green{background:var(--green-bg);color:var(--green);border:1px solid rgba(22,163,74,0.2)}
.tag-red{background:rgba(220,38,38,0.07);color:#dc2626;border:1px solid rgba(220,38,38,0.15)}
.tag-amber{background:var(--amber-bg);color:var(--amber);border:1px solid rgba(180,83,9,0.2)}

/* gap suggestions */
.gap-list{display:flex;flex-direction:column;gap:0.75rem}
.gap-item{
  background:var(--card);border:1px solid var(--border);
  border-radius:10px;padding:1rem 1.1rem;
}
.gap-kw{
  font-family:'IBM Plex Mono',monospace;font-size:0.78rem;font-weight:500;
  color:var(--fire);margin-bottom:0.4rem;display:flex;align-items:center;gap:0.4rem;
}
.gap-suggestion{font-size:0.82rem;color:var(--ink2);line-height:1.55}
.gap-section{font-size:0.7rem;color:var(--ink3);margin-top:0.3rem;font-family:'IBM Plex Mono',monospace}

/* ── REWRITER ── */
.section-tabs{display:flex;gap:0.4rem;flex-wrap:wrap;margin-bottom:1.25rem}
.sec-tab{
  background:var(--bg);border:1px solid var(--border2);border-radius:8px;
  padding:0.4rem 0.9rem;font-size:0.78rem;cursor:pointer;transition:all 0.15s;color:var(--ink2);
}
.sec-tab.active,.sec-tab:hover{background:var(--ink);color:#fff;border-color:var(--ink)}

.rewrite-block{
  background:var(--card);border:1px solid var(--border);
  border-radius:10px;overflow:hidden;margin-bottom:0.75rem;
}
.rw-header{
  background:var(--bg);border-bottom:1px solid var(--border);
  padding:0.65rem 1rem;display:flex;align-items:center;justify-content:space-between;
}
.rw-label{font-size:0.7rem;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;color:var(--ink3);font-family:'IBM Plex Mono',monospace}
.rw-cols{display:grid;grid-template-columns:1fr 1fr;gap:0}
@media(max-width:580px){.rw-cols{grid-template-columns:1fr}}
.rw-col{padding:0.85rem 1rem;font-size:0.82rem;line-height:1.6;color:var(--ink2)}
.rw-col.new{border-left:1px solid var(--border);background:rgba(22,163,74,0.03);color:var(--ink)}
.rw-col-head{font-size:0.65rem;font-family:'IBM Plex Mono',monospace;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:0.5rem;color:var(--ink3)}
.rw-col.new .rw-col-head{color:var(--green)}

/* ── COVER LETTER ── */
.cl-output{
  background:var(--white);border:1px solid var(--border);border-radius:10px;
  padding:1.75rem;font-size:0.88rem;line-height:1.75;color:var(--ink2);
  white-space:pre-wrap;font-family:'IBM Plex Sans',sans-serif;
}
.copy-btn{
  display:inline-flex;align-items:center;gap:0.4rem;
  background:none;border:1px solid var(--border2);border-radius:7px;
  padding:0.4rem 0.9rem;font-size:0.75rem;color:var(--ink3);cursor:pointer;
  transition:all 0.15s;font-family:'IBM Plex Sans',sans-serif;
}
.copy-btn:hover{border-color:var(--ink);color:var(--ink)}

/* ── INTERVIEW PREP ── */
.iq-list{display:flex;flex-direction:column;gap:0.75rem}
.iq-item{background:var(--card);border:1px solid var(--border);border-radius:10px;overflow:hidden}
.iq-q{
  padding:0.9rem 1.1rem;font-weight:500;font-size:0.85rem;color:var(--ink);
  display:flex;align-items:flex-start;gap:0.75rem;cursor:pointer;
  transition:background 0.15s;
}
.iq-q:hover{background:var(--bg)}
.iq-q-num{
  flex-shrink:0;width:22px;height:22px;border-radius:6px;
  background:var(--fire-bg);color:var(--fire);
  display:flex;align-items:center;justify-content:center;
  font-size:0.65rem;font-family:'IBM Plex Mono',monospace;font-weight:600;
  margin-top:1px;
}
.iq-a{
  padding:0 1.1rem 0.9rem 3.1rem;font-size:0.82rem;color:var(--ink2);
  line-height:1.65;border-top:1px solid var(--border);
  background:rgba(245,244,240,0.5);
}
.iq-type{
  margin-left:auto;font-size:0.65rem;font-family:'IBM Plex Mono',monospace;
  padding:0.15rem 0.5rem;border-radius:4px;flex-shrink:0;
}
.iq-beh{background:var(--blue-bg);color:var(--blue)}
.iq-tech{background:var(--amber-bg);color:var(--amber)}
.iq-sit{background:var(--green-bg);color:var(--green)}

/* ── ERROR ── */
.err{
  background:rgba(220,38,38,0.06);border:1px solid rgba(220,38,38,0.2);
  border-radius:10px;padding:0.85rem 1rem;color:#dc2626;
  font-size:0.82rem;margin-bottom:1rem;
}

/* ── SETUP STEP INDICATOR ── */
.steps-row{display:flex;align-items:center;gap:0.5rem;margin-bottom:2rem}
.step-dot{
  width:28px;height:28px;border-radius:50%;
  display:flex;align-items:center;justify-content:center;
  font-size:0.7rem;font-weight:600;font-family:'IBM Plex Mono',monospace;
  flex-shrink:0;
}
.step-dot.done{background:var(--green);color:#fff}
.step-dot.active{background:var(--fire);color:#fff}
.step-dot.pending{background:var(--border);color:var(--ink3)}
.step-line{flex:1;height:1px;background:var(--border)}

/* ── OVERVIEW CARDS ── */
.overview-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:1rem;margin-bottom:1.5rem}
@media(max-width:580px){.overview-grid{grid-template-columns:1fr}}
.ov-card{
  background:var(--card);border:1px solid var(--border);
  border-radius:12px;padding:1.2rem;cursor:pointer;
  transition:all 0.15s;position:relative;overflow:hidden;
}
.ov-card:hover{border-color:var(--fire);transform:translateY(-2px);box-shadow:0 6px 20px rgba(0,0,0,0.07)}
.ov-card.done::after{
  content:'✓';position:absolute;top:0.75rem;right:0.75rem;
  width:20px;height:20px;border-radius:50%;background:var(--green);
  color:#fff;font-size:0.65rem;display:flex;align-items:center;justify-content:center;
  font-weight:700;
}
.ov-icon{font-size:1.5rem;margin-bottom:0.5rem}
.ov-title{font-weight:600;font-size:0.85rem;color:var(--ink);margin-bottom:0.2rem}
.ov-desc{font-size:0.75rem;color:var(--ink3);line-height:1.45}

/* mobile sidebar */
@media(max-width:700px){
  .shell{flex-direction:column}
  .sidebar{width:100%;height:auto;position:relative;flex-direction:row;flex-wrap:wrap;padding:0.5rem}
  .sb-logo{padding:0.75rem 1rem;border:none}
  .sb-logo h1{font-size:1.1rem}
  .sb-logo .tagline,.sb-logo .free-badge{display:none}
  .sb-nav{display:flex;flex:1;flex-direction:row;padding:0;overflow-x:auto}
  .sb-section{display:none}
  .sb-item{padding:0.5rem 0.75rem;border-left:none;border-bottom:3px solid transparent;font-size:0.75rem;flex-shrink:0}
  .sb-item.active{border-bottom-color:var(--fire);border-left-color:transparent}
  .sb-footer{display:none}
  .main{padding:1.25rem 1rem 3rem}
}
`;

/* ─── HELPERS ──────────────────────────────────────────────────────────── */
const CLAUDE = "claude-opus-4-5";
const callClaude = async (apiKey, messages, maxTokens = 1400) => {
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({ model: CLAUDE, max_tokens: maxTokens, messages }),
  });
  const d = await r.json();
  if (d.error) throw new Error(d.error.message);
  return d.content.map(b => b.text || "").join("").trim();
};

const parseJSON = (txt) => {
  const clean = txt.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
};

const scoreColor = s => s >= 80 ? "#16a34a" : s >= 65 ? "#1d4ed8" : s >= 45 ? "#b45309" : "#dc2626";
const tierOf = s => s >= 80 ? { l: "Strong Match", c: "tier-s", i: "✦" }
  : s >= 65 ? { l: "Good Match", c: "tier-g", i: "◈" }
  : s >= 45 ? { l: "Fair Match", c: "tier-f", i: "◇" }
  : { l: "Needs Work", c: "tier-p", i: "○" };

/* ─── COMPONENTS ───────────────────────────────────────────────────────── */
function ScoreRing({ score }) {
  const r = 45, c = 2 * Math.PI * r;
  const off = c - (score / 100) * c;
  const col = scoreColor(score);
  return (
    <div className="score-ring-wrap">
      <svg width="110" height="110" viewBox="0 0 110 110">
        <circle className="ring-bg2" cx="55" cy="55" r={r} />
        <circle className="ring-fg" cx="55" cy="55" r={r}
          stroke={col} strokeDasharray={c} strokeDashoffset={off} />
      </svg>
      <div className="ring-center">
        <span className="ring-num" style={{ color: col }}>{score}</span>
        <span className="ring-den">/100</span>
      </div>
    </div>
  );
}

function Spinner({ dark }) {
  return <span className={`spinner${dark ? " dark" : ""}`} />;
}

function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return <button className="copy-btn" onClick={copy}>{copied ? "✓ Copied" : "⎘ Copy"}</button>;
}

/* ─── TOOL PANELS ──────────────────────────────────────────────────────── */
function ATSPanel({ data, loading, error, onRun, canRun }) {
  if (!data && !loading && !error) return (
    <div>
      <div className="page-header">
        <div className="page-eyebrow">Tool 01</div>
        <div className="page-title">ATS Score</div>
        <div className="page-sub">See exactly how an ATS system scores your resume against this job.</div>
      </div>
      {error && <div className="err">⚠ {error}</div>}
      <button className="tool-btn fire" onClick={onRun} disabled={!canRun || loading}>
        {loading ? <Spinner /> : "⚡"} Analyze Now
      </button>
    </div>
  );
  if (loading) return <div className="loading-panel"><Spinner dark /><p>Calculating ATS score...</p></div>;
  if (error) return <><div className="err">⚠ {error}</div><button className="tool-btn" onClick={onRun}>Retry</button></>;

  const tier = tierOf(data.ats_score);
  return (
    <div>
      <div className="page-header">
        <div className="page-eyebrow">Tool 01</div>
        <div className="page-title">ATS Score</div>
      </div>
      <div className="score-hero">
        <ScoreRing score={data.ats_score} />
        <div className="score-info">
          <div className={`score-tier ${tier.c}`}>{tier.i} {tier.l}</div>
          <h2>Score: {data.ats_score} / 100</h2>
          <p>{data.summary}</p>
        </div>
      </div>
      <div className="breakdown-row">
        {Object.entries(data.breakdown || {}).map(([k, v]) => (
          <div className="bk-cell" key={k}>
            <div className="bk-val" style={{ color: scoreColor(v) }}>{v}</div>
            <div className="bk-lbl">{k.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}</div>
            <div className="bk-bar"><div className="bk-bar-fill" style={{ width: `${v}%`, background: scoreColor(v) }} /></div>
          </div>
        ))}
      </div>
      <button className="tool-btn" style={{ marginTop: "0.5rem" }} onClick={onRun}>↺ Re-analyze</button>
    </div>
  );
}

function KeywordPanel({ data, loading, error, onRun, canRun }) {
  if (!data && !loading && !error) return (
    <div>
      <div className="page-header">
        <div className="page-eyebrow">Tool 02</div>
        <div className="page-title">Keyword Gap</div>
        <div className="page-sub">Find missing keywords and get exact suggestions on where and how to add them naturally.</div>
      </div>
      {error && <div className="err">⚠ {error}</div>}
      <button className="tool-btn fire" onClick={onRun} disabled={!canRun || loading}>
        {loading ? <Spinner /> : "🔍"} Find Gaps
      </button>
    </div>
  );
  if (loading) return <div className="loading-panel"><Spinner dark /><p>Finding keyword gaps...</p></div>;
  if (error) return <><div className="err">⚠ {error}</div><button className="tool-btn" onClick={onRun}>Retry</button></>;

  return (
    <div>
      <div className="page-header">
        <div className="page-eyebrow">Tool 02</div>
        <div className="page-title">Keyword Gap</div>
      </div>
      <div className="kw-grid">
        <div className="kw-panel">
          <div className="kw-panel-title">✅ You Already Have</div>
          <div className="tag-cloud">
            {(data.matched || []).map(k => <span className="tag tag-green" key={k}>{k}</span>)}
          </div>
        </div>
        <div className="kw-panel">
          <div className="kw-panel-title">❌ You're Missing</div>
          <div className="tag-cloud">
            {(data.missing || []).map(k => <span className="tag tag-red" key={k}>{k}</span>)}
          </div>
        </div>
      </div>
      {data.additions && data.additions.length > 0 && (
        <>
          <div style={{ fontWeight: 600, fontSize: "0.88rem", marginBottom: "0.75rem", color: "var(--ink)" }}>
            💡 How to Add Missing Keywords
          </div>
          <div className="gap-list">
            {data.additions.map((a, i) => (
              <div className="gap-item" key={i}>
                <div className="gap-kw">+ {a.keyword}</div>
                <div className="gap-suggestion">"{a.suggestion}"</div>
                <div className="gap-section">→ Add to: {a.section}</div>
              </div>
            ))}
          </div>
        </>
      )}
      <button className="tool-btn" style={{ marginTop: "1rem" }} onClick={onRun}>↺ Refresh</button>
    </div>
  );
}

function RewriterPanel({ data, loading, error, onRun, canRun }) {
  const [open, setOpen] = useState({});
  if (!data && !loading && !error) return (
    <div>
      <div className="page-header">
        <div className="page-eyebrow">Tool 03</div>
        <div className="page-title">Resume Enhancer</div>
        <div className="page-sub">Get ATS-optimized rewrites for every bullet point on your resume.</div>
      </div>
      {error && <div className="err">⚠ {error}</div>}
      <button className="tool-btn fire" onClick={onRun} disabled={!canRun || loading}>
        {loading ? <Spinner /> : "✏️"} Enhance Resume
      </button>
    </div>
  );
  if (loading) return <div className="loading-panel"><Spinner dark /><p>Rewriting your resume...</p></div>;
  if (error) return <><div className="err">⚠ {error}</div><button className="tool-btn" onClick={onRun}>Retry</button></>;

  return (
    <div>
      <div className="page-header">
        <div className="page-eyebrow">Tool 03</div>
        <div className="page-title">Resume Enhancer</div>
      </div>
      {(data.sections || []).map((sec, si) => (
        <div key={si} style={{ marginBottom: "1.25rem" }}>
          <div style={{ fontWeight: 600, fontSize: "0.85rem", marginBottom: "0.6rem", color: "var(--ink)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "0.7rem", background: "var(--fire-bg)", color: "var(--fire)", padding: "0.15rem 0.5rem", borderRadius: "4px" }}>{sec.section}</span>
          </div>
          {(sec.bullets || []).map((b, bi) => (
            <div className="rewrite-block" key={bi}>
              <div className="rw-header">
                <span className="rw-label">Bullet {bi + 1}</span>
                <CopyBtn text={b.rewritten} />
              </div>
              <div className="rw-cols">
                <div className="rw-col">
                  <div className="rw-col-head">Original</div>
                  {b.original}
                </div>
                <div className="rw-col new">
                  <div className="rw-col-head">✦ Enhanced</div>
                  {b.rewritten}
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
      <button className="tool-btn" onClick={onRun}>↺ Re-enhance</button>
    </div>
  );
}

function CoverLetterPanel({ data, loading, error, onRun, canRun }) {
  if (!data && !loading && !error) return (
    <div>
      <div className="page-header">
        <div className="page-eyebrow">Tool 04</div>
        <div className="page-title">Cover Letter</div>
        <div className="page-sub">Get a personalized, keyword-rich cover letter tailored to this exact job description.</div>
      </div>
      {error && <div className="err">⚠ {error}</div>}
      <button className="tool-btn fire" onClick={onRun} disabled={!canRun || loading}>
        {loading ? <Spinner /> : "📝"} Generate Letter
      </button>
    </div>
  );
  if (loading) return <div className="loading-panel"><Spinner dark /><p>Crafting your cover letter...</p></div>;
  if (error) return <><div className="err">⚠ {error}</div><button className="tool-btn" onClick={onRun}>Retry</button></>;

  return (
    <div>
      <div className="page-header">
        <div className="page-eyebrow">Tool 04</div>
        <div className="page-title">Cover Letter</div>
      </div>
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", flexWrap: "wrap" }}>
        <CopyBtn text={data} />
        <button className="tool-btn" onClick={onRun}>↺ Regenerate</button>
      </div>
      <div className="cl-output">{data}</div>
    </div>
  );
}

function InterviewPanel({ data, loading, error, onRun, canRun }) {
  const [open, setOpen] = useState(null);
  if (!data && !loading && !error) return (
    <div>
      <div className="page-header">
        <div className="page-eyebrow">Tool 05</div>
        <div className="page-title">Interview Prep</div>
        <div className="page-sub">Get predicted interview questions based on the JD + model answers tailored to your resume.</div>
      </div>
      {error && <div className="err">⚠ {error}</div>}
      <button className="tool-btn fire" onClick={onRun} disabled={!canRun || loading}>
        {loading ? <Spinner /> : "🎯"} Predict Questions
      </button>
    </div>
  );
  if (loading) return <div className="loading-panel"><Spinner dark /><p>Predicting interview questions...</p></div>;
  if (error) return <><div className="err">⚠ {error}</div><button className="tool-btn" onClick={onRun}>Retry</button></>;

  const typeClass = t => t === "behavioral" ? "iq-beh" : t === "technical" ? "iq-tech" : "iq-sit";

  return (
    <div>
      <div className="page-header">
        <div className="page-eyebrow">Tool 05</div>
        <div className="page-title">Interview Prep</div>
        <div className="page-sub">Click any question to see a model answer.</div>
      </div>
      <div className="iq-list">
        {(data || []).map((q, i) => (
          <div className="iq-item" key={i}>
            <div className="iq-q" onClick={() => setOpen(open === i ? null : i)}>
              <span className="iq-q-num">{i + 1}</span>
              <span style={{ flex: 1 }}>{q.question}</span>
              <span className={`iq-type ${typeClass(q.type)}`}>{q.type}</span>
              <span style={{ marginLeft: "0.5rem", color: "var(--ink3)", fontSize: "0.8rem" }}>{open === i ? "▲" : "▼"}</span>
            </div>
            {open === i && <div className="iq-a"><strong>Model Answer:</strong><br /><br />{q.answer}</div>}
          </div>
        ))}
      </div>
      <button className="tool-btn" style={{ marginTop: "1rem" }} onClick={onRun}>↺ Refresh</button>
    </div>
  );
}

/* ─── SETUP SCREENS ─────────────────────────────────────────────────────── */
function KeySetup({ onDone }) {
  const [val, setVal] = useState("");
  return (
    <div className="setup-wrap">
      <div className="setup-card">
        <div className="setup-eyebrow">Step 1 of 3 — API Key</div>
        <div className="setup-title">Let's get you hired.</div>
        <div className="setup-sub">
          JobCraft is 100% free. You just need your own Anthropic API key — it calls Claude directly from your browser. No server, no data stored, no subscription.
        </div>
        <div className="notice">
          <span className="notice-icon">🔒</span>
          Your key stays in browser session memory only. It is never sent anywhere except directly to Anthropic's API. Closes when you shut the tab.
        </div>
        <div className="field-label">Anthropic API Key</div>
        <input className="text-input" type="password" placeholder="sk-ant-api03-..."
          value={val} onChange={e => setVal(e.target.value)}
          onKeyDown={e => e.key === "Enter" && val.startsWith("sk-ant-") && onDone(val.trim())} />
        <button className="btn-fire" disabled={!val.startsWith("sk-ant-")} onClick={() => onDone(val.trim())}>
          Continue →
        </button>
        <div className="link-hint">
          No key yet? <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noreferrer">Get one free at console.anthropic.com</a>
        </div>
      </div>
    </div>
  );
}

function WorkspaceSetup({ onDone }) {
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeB64, setResumeB64] = useState(null);
  const [jd, setJd] = useState("");
  const [drag, setDrag] = useState(false);
  const ref = useRef();

  const handleFile = useCallback(f => {
    if (!f || f.type !== "application/pdf") return;
    setResumeFile(f);
    const reader = new FileReader();
    reader.onload = e => setResumeB64(e.target.result.split(",")[1]);
    reader.readAsDataURL(f);
  }, []);

  return (
    <div className="setup-wrap">
      <div className="setup-card" style={{ maxWidth: 580 }}>
        <div className="setup-eyebrow">Step 2 of 3 — Your Materials</div>
        <div className="setup-title">Upload resume &amp; job description</div>
        <div className="setup-sub">These will be used across all 5 tools. You can update them later.</div>

        <div className="field-label" style={{ marginBottom: "0.5rem" }}>Resume (PDF)</div>
        <div className={`dropzone${drag ? " dov" : ""}`}
          onClick={() => ref.current?.click()}
          onDragOver={e => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={e => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]); }}>
          <input ref={ref} type="file" accept=".pdf"
            onChange={e => handleFile(e.target.files[0])}
            onClick={e => e.stopPropagation()} />
          <span className="dz-icon">📄</span>
          <div className="dz-text"><strong>Click to upload</strong> or drag & drop</div>
          <div className="dz-hint">PDF only</div>
        </div>
        {resumeFile && (
          <div className="file-pill">
            <span style={{ fontSize: "1rem" }}>✅</span>
            <span className="fp-name">{resumeFile.name}</span>
            <button className="fp-rm" onClick={() => { setResumeFile(null); setResumeB64(null); }}>✕</button>
          </div>
        )}

        <div className="field-label" style={{ marginTop: "1.25rem", marginBottom: "0.5rem" }}>Job Description</div>
        <textarea className="jd-input" rows={6}
          placeholder="Paste the full job description here — requirements, responsibilities, skills..."
          value={jd} onChange={e => setJd(e.target.value)} />

        <button className="btn-fire" disabled={!resumeB64 || !jd.trim()}
          onClick={() => onDone(resumeB64, resumeFile.name, jd)}>
          Open Dashboard →
        </button>
      </div>
    </div>
  );
}

/* ─── OVERVIEW PANEL ────────────────────────────────────────────────────── */
const TOOLS = [
  { id: "ats", icon: "📊", title: "ATS Score", desc: "Full breakdown score vs this job" },
  { id: "keywords", icon: "🔍", title: "Keyword Gap", desc: "Find & add missing keywords" },
  { id: "rewriter", icon: "✏️", title: "Resume Enhancer", desc: "Rewrite bullets to match JD" },
  { id: "cover", icon: "📝", title: "Cover Letter", desc: "Tailored letter in one click" },
  { id: "interview", icon: "🎯", title: "Interview Prep", desc: "Predicted questions + answers" },
];

function Overview({ results, onNav, onRunAll, running }) {
  return (
    <div>
      <div className="page-header">
        <div className="page-eyebrow">Dashboard</div>
        <div className="page-title">Your Job Application Suite</div>
        <div className="page-sub">5 AI tools, completely free. Click any tool or run them all at once.</div>
      </div>
      <button className="run-all-btn" onClick={onRunAll} disabled={running}>
        {running ? <><Spinner /> Running all tools...</> : "⚡ Run All 5 Tools At Once"}
      </button>
      <div className="overview-grid">
        {TOOLS.map(t => (
          <div className={`ov-card${results[t.id] ? " done" : ""}`} key={t.id} onClick={() => onNav(t.id)}>
            <div className="ov-icon">{t.icon}</div>
            <div className="ov-title">{t.title}</div>
            <div className="ov-desc">{t.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── PROMPTS ───────────────────────────────────────────────────────────── */
const makeMsg = (b64, jd, promptText) => [{
  role: "user",
  content: [
    { type: "document", source: { type: "base64", media_type: "application/pdf", data: b64 } },
    { type: "text", text: `JOB DESCRIPTION:\n${jd}\n\n${promptText}` }
  ]
}];

const P_ATS = `Analyze the resume against the job description. Return ONLY valid JSON:
{"ats_score":<0-100>,"summary":"<2 sentences>","breakdown":{"keyword_match":<0-100>,"experience_relevance":<0-100>,"skills_alignment":<0-100>,"formatting_quality":<0-100>,"education_fit":<0-100>,"overall_impact":<0-100>}}`;

const P_KW = `Find keyword gaps. Return ONLY valid JSON:
{"matched":["kw1","kw2",...],"missing":["kw1","kw2",...],"additions":[{"keyword":"kw","suggestion":"exact phrase to add to resume","section":"Experience/Skills/Summary"},...]}.
Give 6-10 matched, 6-10 missing, 6-10 additions with natural-sounding phrases.`;

const P_RW = `Rewrite every bullet point to be ATS-optimized and quantified for this job. Return ONLY valid JSON:
{"sections":[{"section":"Section Name","bullets":[{"original":"...","rewritten":"..."},...]},...]}.
Include all major sections from the resume. Make bullets stronger with action verbs and metrics.`;

const P_CL = `Write a tailored, professional cover letter for this job based on the resume. 3-4 paragraphs. Use specific skills and experiences from the resume. Include relevant keywords from the JD naturally. Return ONLY the plain text cover letter, no JSON.`;

const P_IQ = `Generate 10 likely interview questions for this role based on the resume and JD. Return ONLY valid JSON:
[{"question":"...","type":"behavioral|technical|situational","answer":"<detailed model answer 3-5 sentences using STAR method where applicable>"},...]
Mix behavioral, technical, and situational questions.`;

/* ─── MAIN APP ──────────────────────────────────────────────────────────── */
export default function App() {
  const [apiKey, setApiKey] = useState(() => sessionStorage.getItem("jc_key") || "");
  const [keySet, setKeySet] = useState(() => !!sessionStorage.getItem("jc_key"));
  const [wsSet, setWsSet] = useState(false);
  const [resumeB64, setResumeB64] = useState(null);
  const [resumeName, setResumeName] = useState("");
  const [jd, setJd] = useState("");
  const [tab, setTab] = useState("overview");

  const [results, setResults] = useState({});
  const [loading, setLoading] = useState({});
  const [errors, setErrors] = useState({});
  const [runningAll, setRunningAll] = useState(false);

  const setK = (id, v) => setResults(r => ({ ...r, [id]: v }));
  const setL = (id, v) => setLoading(l => ({ ...l, [id]: v }));
  const setE = (id, v) => setErrors(e => ({ ...e, [id]: v }));

  const run = async (id, prompt, maxTok, parseIt = true) => {
    if (!resumeB64 || !jd || !apiKey) return;
    setL(id, true); setE(id, null);
    try {
      const txt = await callClaude(apiKey, makeMsg(resumeB64, jd, prompt), maxTok);
      setK(id, parseIt ? parseJSON(txt) : txt);
    } catch (e) { setE(id, e.message); }
    finally { setL(id, false); }
  };

  const runAll = async () => {
    setRunningAll(true);
    await Promise.all([
      run("ats", P_ATS, 800),
      run("keywords", P_KW, 1000),
      run("rewriter", P_RW, 2000),
      run("cover", P_CL, 1000, false),
      run("interview", P_IQ, 1800),
    ]);
    setRunningAll(false);
  };

  if (!keySet) return (
    <><style>{G}</style>
      <KeySetup onDone={k => { sessionStorage.setItem("jc_key", k); setApiKey(k); setKeySet(true); }} />
    </>
  );

  if (!wsSet) return (
    <><style>{G}</style>
      <WorkspaceSetup onDone={(b64, name, jdText) => {
        setResumeB64(b64); setResumeName(name); setJd(jdText); setWsSet(true);
      }} />
    </>
  );

  const canRun = !!resumeB64 && !!jd;
  const NAV = [
    { id: "overview", icon: "◈", label: "Overview" },
    { id: "ats", icon: "📊", label: "ATS Score", done: !!results.ats },
    { id: "keywords", icon: "🔍", label: "Keyword Gap", done: !!results.keywords },
    { id: "rewriter", icon: "✏️", label: "Enhancer", done: !!results.rewriter },
    { id: "cover", icon: "📝", label: "Cover Letter", done: !!results.cover },
    { id: "interview", icon: "🎯", label: "Interview Prep", done: !!results.interview },
  ];

  return (
    <>
      <style>{G}</style>
      <div className="shell">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sb-logo">
            <h1>JobCraft</h1>
            <div className="tagline">Free Job Application Suite</div>
            <div className="free-badge">100% Free</div>
          </div>
          <nav className="sb-nav">
            <div className="sb-section">Navigation</div>
            {NAV.map(n => (
              <div key={n.id} className={`sb-item${tab === n.id ? " active" : ""}`} onClick={() => setTab(n.id)}>
                <span className="sb-icon">{n.icon}</span>
                {n.label}
                {n.done && <span className="sb-check">✓</span>}
              </div>
            ))}
          </nav>
          <div className="sb-footer">
            <div className="key-status">
              <span className="key-dot" />
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
                {resumeName || "Resume loaded"}
              </span>
              <button className="key-clear" onClick={() => { sessionStorage.removeItem("jc_key"); setKeySet(false); setWsSet(false); setResults({}); }}>Reset</button>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="main">
          {tab === "overview" && (
            <Overview results={results} onNav={setTab} onRunAll={runAll} running={runningAll} />
          )}
          {tab === "ats" && (
            <ATSPanel data={results.ats} loading={loading.ats} error={errors.ats}
              onRun={() => run("ats", P_ATS, 800)} canRun={canRun} />
          )}
          {tab === "keywords" && (
            <KeywordPanel data={results.keywords} loading={loading.keywords} error={errors.keywords}
              onRun={() => run("keywords", P_KW, 1000)} canRun={canRun} />
          )}
          {tab === "rewriter" && (
            <RewriterPanel data={results.rewriter} loading={loading.rewriter} error={errors.rewriter}
              onRun={() => run("rewriter", P_RW, 2000)} canRun={canRun} />
          )}
          {tab === "cover" && (
            <CoverLetterPanel data={results.cover} loading={loading.cover} error={errors.cover}
              onRun={() => run("cover", P_CL, 1000, false)} canRun={canRun} />
          )}
          {tab === "interview" && (
            <InterviewPanel data={results.interview} loading={loading.interview} error={errors.interview}
              onRun={() => run("interview", P_IQ, 1800)} canRun={canRun} />
          )}
        </main>
      </div>
    </>
  );
}
