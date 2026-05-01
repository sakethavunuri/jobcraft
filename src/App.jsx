import { useState, useRef, useCallback } from "react";

/* ══════════════════════════════════════════════
   PREMIUM STYLES — same world-class dark UI
══════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,700;12..96,800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Fira+Code:wght@400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#06080f;--bg2:#090c15;--surface:#0d1120;--surface2:#111627;
  --border:rgba(255,255,255,0.07);--border2:rgba(255,255,255,0.12);
  --text:#e8edf5;--text2:#8892a4;--text3:#4e5a6e;
  --cyan:#00d4aa;--cyan2:#00f0c0;--cyan-dim:rgba(0,212,170,0.12);
  --rose:#ff5f7e;--rose-dim:rgba(255,95,126,0.1);
  --blue:#4f8ef7;--blue-dim:rgba(79,142,247,0.1);
  --green:#3dd68c;--green-dim:rgba(61,214,140,0.1);
  --amber:#ffa040;--amber-dim:rgba(255,160,64,0.1);
  --r:16px;--r2:12px;
}
html{scroll-behavior:smooth}
body{background:var(--bg);color:var(--text);font-family:'Plus Jakarta Sans',sans-serif;min-height:100vh;-webkit-font-smoothing:antialiased;overflow-x:hidden}
body::before{content:'';position:fixed;inset:0;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");pointer-events:none;z-index:9999;opacity:0.35}

/* SHELL */
.shell{display:flex;min-height:100vh}

/* SIDEBAR */
.sidebar{width:265px;flex-shrink:0;background:var(--bg2);border-right:1px solid var(--border);display:flex;flex-direction:column;position:sticky;top:0;height:100vh;overflow:hidden}
.sb-glow{position:absolute;top:-80px;left:-80px;width:280px;height:280px;background:radial-gradient(circle,rgba(0,212,170,0.05),transparent 70%);pointer-events:none}
.sb-top{padding:1.75rem 1.5rem 1.35rem;border-bottom:1px solid var(--border);position:relative}
.sb-brand{display:flex;align-items:center;gap:0.6rem;margin-bottom:0.35rem}
.sb-ico{width:34px;height:34px;background:linear-gradient(135deg,#00d4aa,#00b894);border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:1rem;box-shadow:0 0 20px rgba(0,212,170,0.35);flex-shrink:0}
.sb-name{font-family:'Bricolage Grotesque',sans-serif;font-size:1.25rem;font-weight:800;letter-spacing:-0.03em}
.sb-tagline{font-size:0.7rem;color:var(--text3);margin-top:0.1rem}
.sb-free{display:inline-flex;align-items:center;gap:0.35rem;background:var(--cyan-dim);border:1px solid rgba(0,212,170,0.2);color:var(--cyan);font-family:'Fira Code',monospace;font-size:0.6rem;letter-spacing:0.08em;padding:0.2rem 0.6rem;border-radius:99px;margin-top:0.5rem}
.sb-free::before{content:'';width:5px;height:5px;border-radius:50%;background:var(--cyan);animation:pulse 2s infinite}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}

.sb-nav{flex:1;padding:1.1rem 0.7rem;overflow-y:auto}
.sb-sec{font-family:'Fira Code',monospace;font-size:0.58rem;letter-spacing:0.15em;text-transform:uppercase;color:var(--text3);padding:0.6rem 0.65rem 0.3rem}
.ni{display:flex;align-items:center;gap:0.65rem;padding:0.58rem 0.7rem;border-radius:10px;cursor:pointer;transition:all 0.15s;border:1px solid transparent;margin-bottom:0.12rem}
.ni:hover{background:rgba(255,255,255,0.03)}
.ni.active{background:var(--cyan-dim);border-color:rgba(0,212,170,0.2)}
.ni.active .ni-lbl{color:var(--cyan);font-weight:600}
.ni-icon{width:28px;height:28px;border-radius:7px;background:rgba(255,255,255,0.04);display:flex;align-items:center;justify-content:center;font-size:0.85rem;flex-shrink:0}
.ni.active .ni-icon{background:rgba(0,212,170,0.12)}
.ni-lbl{font-size:0.83rem;font-weight:500;color:var(--text2);flex:1}
.ni-check{width:18px;height:18px;border-radius:50%;background:var(--green);color:var(--bg);display:flex;align-items:center;justify-content:center;font-size:0.58rem;font-weight:700}
.ni-badge{font-family:'Fira Code',monospace;font-size:0.58rem;background:var(--cyan);color:var(--bg);padding:0.1rem 0.45rem;border-radius:99px;font-weight:700}

.sb-foot{padding:1rem 1.25rem;border-top:1px solid var(--border)}
.sb-file{display:flex;align-items:center;gap:0.55rem;background:var(--surface);border:1px solid var(--border);border-radius:9px;padding:0.55rem 0.75rem}
.sf-dot{width:6px;height:6px;border-radius:50%;background:var(--green);box-shadow:0 0 6px var(--green);animation:pulse 2s infinite;flex-shrink:0}
.sf-name{font-family:'Fira Code',monospace;font-size:0.65rem;color:var(--text3);flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.sf-change{background:none;border:none;color:var(--text3);font-family:'Fira Code',monospace;font-size:0.62rem;cursor:pointer;padding:0.1rem 0.3rem;border-radius:4px;transition:color 0.15s}
.sf-change:hover{color:var(--cyan)}

/* MAIN */
.main{flex:1;overflow-y:auto;position:relative}
.main-bg{position:fixed;top:0;right:0;width:65%;height:100%;background:radial-gradient(ellipse 60% 50% at 80% 20%,rgba(0,212,170,0.04),transparent 60%),radial-gradient(ellipse 50% 40% at 20% 80%,rgba(79,142,247,0.04),transparent 60%);pointer-events:none;z-index:0}
.main-inner{position:relative;z-index:1;padding:2.5rem 2.5rem 5rem;max-width:880px}

/* UPLOAD SCREEN */
.upload-screen{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:2rem;position:relative;overflow:hidden}
.ub-bg{position:absolute;inset:0;background:radial-gradient(ellipse 80% 60% at 50% -5%,rgba(0,212,170,0.08),transparent 60%),radial-gradient(ellipse 60% 50% at -10% 70%,rgba(79,142,247,0.05),transparent 60%);pointer-events:none}
.ub-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,0.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.018) 1px,transparent 1px);background-size:55px 55px;mask-image:radial-gradient(ellipse 80% 80% at 50% 50%,black 30%,transparent 100%);pointer-events:none}
.ub-card{background:var(--surface);border:1px solid var(--border2);border-radius:24px;padding:2.75rem;width:100%;max-width:560px;position:relative;box-shadow:0 40px 100px rgba(0,0,0,0.6);animation:fadeUp 0.5s ease}
.ub-card::before{content:'';position:absolute;top:-1px;left:10%;right:10%;height:1px;background:linear-gradient(90deg,transparent,var(--cyan),transparent)}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}

.hero-badge{display:inline-flex;align-items:center;gap:0.4rem;background:var(--cyan-dim);border:1px solid rgba(0,212,170,0.2);color:var(--cyan);font-family:'Fira Code',monospace;font-size:0.62rem;letter-spacing:0.1em;padding:0.25rem 0.75rem;border-radius:99px;margin-bottom:1rem}
.hero-badge::before{content:'';width:5px;height:5px;border-radius:50%;background:var(--cyan);animation:pulse 2s infinite}
.hero-title{font-family:'Bricolage Grotesque',sans-serif;font-size:2.1rem;font-weight:800;letter-spacing:-0.03em;line-height:1.12;background:linear-gradient(135deg,var(--text) 0%,rgba(232,237,245,0.65) 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-bottom:0.5rem}
.hero-sub{font-size:0.88rem;color:var(--text2);line-height:1.65;margin-bottom:1.5rem}

.free-strip{display:flex;gap:0.5rem;flex-wrap:wrap;margin-bottom:1.5rem}
.strip-tag{display:inline-flex;align-items:center;gap:0.3rem;font-size:0.72rem;color:var(--text2);background:var(--surface2);border:1px solid var(--border);padding:0.25rem 0.65rem;border-radius:7px}

.field-lbl{font-family:'Fira Code',monospace;font-size:0.62rem;letter-spacing:0.1em;text-transform:uppercase;color:var(--text3);margin-bottom:0.5rem;display:block}

.dropzone{border:2px dashed var(--border2);border-radius:14px;padding:2rem 1.5rem;text-align:center;cursor:pointer;position:relative;transition:all 0.2s;background:var(--surface2);overflow:hidden}
.dropzone::before{content:'';position:absolute;inset:0;background:radial-gradient(circle at 50% 50%,var(--cyan-dim),transparent 70%);opacity:0;transition:opacity 0.2s}
.dropzone:hover::before,.dropzone.over::before{opacity:1}
.dropzone:hover,.dropzone.over{border-color:var(--cyan)}
.dropzone input{position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;height:100%}
.dz-em{font-size:2.2rem;display:block;margin-bottom:0.6rem}
.dz-main{font-size:0.86rem;color:var(--text2)}
.dz-main strong{color:var(--cyan)}
.dz-hint{font-size:0.7rem;color:var(--text3);margin-top:0.25rem;font-family:'Fira Code',monospace}

.file-ok{display:flex;align-items:center;gap:0.7rem;background:var(--green-dim);border:1px solid rgba(61,214,140,0.2);border-radius:10px;padding:0.65rem 0.9rem;margin-top:0.75rem}
.fo-name{font-family:'Fira Code',monospace;font-size:0.78rem;color:var(--green);flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.fo-rm{background:none;border:none;color:var(--text3);cursor:pointer;font-size:0.85rem;padding:0.2rem 0.35rem;border-radius:4px;transition:color 0.15s}
.fo-rm:hover{color:var(--rose)}

textarea.jd{width:100%;background:var(--surface2);border:1px solid var(--border2);border-radius:12px;color:var(--text);font-family:'Plus Jakarta Sans',sans-serif;font-size:0.84rem;line-height:1.7;padding:0.9rem 1rem;resize:vertical;outline:none;transition:all 0.2s;min-height:130px}
textarea.jd:focus{border-color:var(--cyan);box-shadow:0 0 0 3px var(--cyan-dim)}
textarea.jd::placeholder{color:var(--text3)}

.btn-launch{width:100%;background:linear-gradient(135deg,#00d4aa,#00b894);color:var(--bg);border:none;border-radius:12px;padding:1rem;font-family:'Bricolage Grotesque',sans-serif;font-weight:700;font-size:1rem;cursor:pointer;transition:all 0.2s;margin-top:1rem;display:flex;align-items:center;justify-content:center;gap:0.5rem;letter-spacing:-0.01em}
.btn-launch:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 8px 28px rgba(0,212,170,0.4)}
.btn-launch:disabled{opacity:0.35;cursor:not-allowed;transform:none}

/* PAGE HEADER */
.ph{margin-bottom:2rem;animation:fadeUp 0.4s ease}
.ph-ey{font-family:'Fira Code',monospace;font-size:0.6rem;letter-spacing:0.18em;text-transform:uppercase;color:var(--cyan);margin-bottom:0.45rem;display:flex;align-items:center;gap:0.45rem}
.ph-ey::before{content:'';width:16px;height:1px;background:var(--cyan)}
.ph-title{font-family:'Bricolage Grotesque',sans-serif;font-size:2.3rem;font-weight:800;letter-spacing:-0.03em;line-height:1.1;background:linear-gradient(135deg,var(--text) 0%,rgba(232,237,245,0.6) 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.ph-sub{font-size:0.86rem;color:var(--text2);margin-top:0.45rem;line-height:1.6}

/* GLASS CARD */
.gc{background:var(--surface);border:1px solid var(--border);border-radius:var(--r);padding:1.5rem;margin-bottom:1.2rem;position:relative;overflow:hidden;animation:fadeUp 0.4s ease}
.gc::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,0.015),transparent 50%);pointer-events:none}

/* RUN ALL */
.run-all{width:100%;background:linear-gradient(135deg,rgba(0,212,170,0.1),rgba(79,142,247,0.07));border:1px solid rgba(0,212,170,0.22);border-radius:14px;padding:1.2rem 1.4rem;display:flex;align-items:center;justify-content:space-between;cursor:pointer;transition:all 0.2s;margin-bottom:1.4rem;position:relative;overflow:hidden}
.run-all::before{content:'';position:absolute;top:-1px;left:5%;right:5%;height:1px;background:linear-gradient(90deg,transparent,rgba(0,212,170,0.5),transparent)}
.run-all:hover:not(:disabled){background:linear-gradient(135deg,rgba(0,212,170,0.17),rgba(79,142,247,0.11));border-color:rgba(0,212,170,0.38);transform:translateY(-1px);box-shadow:0 8px 36px rgba(0,212,170,0.1)}
.run-all:disabled{opacity:0.4;cursor:not-allowed}
.ra-lbl{font-family:'Bricolage Grotesque',sans-serif;font-size:1rem;font-weight:700;letter-spacing:-0.02em;color:var(--text);margin-bottom:0.18rem}
.ra-sub{font-size:0.76rem;color:var(--text2)}
.ra-ico{width:42px;height:42px;background:var(--cyan);border-radius:11px;display:flex;align-items:center;justify-content:center;font-size:1.1rem;flex-shrink:0;box-shadow:0 4px 14px rgba(0,212,170,0.4);transition:all 0.2s}
.run-all:hover:not(:disabled) .ra-ico{box-shadow:0 6px 22px rgba(0,212,170,0.55);transform:scale(1.04)}

/* TOOL TILES */
.tg{display:grid;grid-template-columns:1fr 1fr;gap:0.8rem}
@media(max-width:620px){.tg{grid-template-columns:1fr}}
.tt{background:var(--surface);border:1px solid var(--border);border-radius:var(--r2);padding:1.2rem;cursor:pointer;transition:all 0.2s;position:relative;overflow:hidden}
.tt::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:var(--ta,var(--cyan));opacity:0;transition:opacity 0.2s}
.tt:hover{border-color:var(--border2);transform:translateY(-2px);box-shadow:0 8px 28px rgba(0,0,0,0.3)}
.tt:hover::before{opacity:1}
.tt.done{border-color:rgba(61,214,140,0.2);background:linear-gradient(135deg,var(--surface),rgba(61,214,140,0.02))}
.tt-h{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:0.7rem}
.tt-i{width:38px;height:38px;border-radius:9px;background:rgba(255,255,255,0.04);display:flex;align-items:center;justify-content:center;font-size:1rem}
.tt-chk{width:20px;height:20px;border-radius:50%;background:var(--green);color:var(--bg);display:flex;align-items:center;justify-content:center;font-size:0.62rem;font-weight:700}
.tt-name{font-family:'Bricolage Grotesque',sans-serif;font-size:0.92rem;font-weight:700;letter-spacing:-0.02em;margin-bottom:0.22rem}
.tt-desc{font-size:0.73rem;color:var(--text3);line-height:1.4}

/* BUTTONS */
.ab{display:inline-flex;align-items:center;gap:0.5rem;border:none;border-radius:10px;padding:0.62rem 1.2rem;font-family:'Plus Jakarta Sans',sans-serif;font-weight:600;font-size:0.8rem;cursor:pointer;transition:all 0.15s}
.ab.p{background:var(--cyan);color:var(--bg)}
.ab.p:hover:not(:disabled){background:var(--cyan2);transform:translateY(-1px);box-shadow:0 6px 18px rgba(0,212,170,0.35)}
.ab.g{background:var(--surface2);color:var(--text2);border:1px solid var(--border2)}
.ab.g:hover:not(:disabled){border-color:var(--cyan);color:var(--cyan)}
.ab:disabled{opacity:0.35;cursor:not-allowed}

/* SPINNER */
.sp{width:16px;height:16px;border:2px solid rgba(255,255,255,0.2);border-top-color:currentColor;border-radius:50%;animation:spin 0.7s linear infinite;display:inline-block}
@keyframes spin{to{transform:rotate(360deg)}}
.sp.dark{border:2px solid rgba(0,0,0,0.1);border-top-color:var(--bg)}
.ls{display:flex;flex-direction:column;align-items:center;gap:1rem;padding:3rem;text-align:center}
.lr{width:48px;height:48px;border:3px solid var(--border);border-top-color:var(--cyan);border-radius:50%;animation:spin 0.9s linear infinite}
.ls p{font-family:'Fira Code',monospace;font-size:0.78rem;color:var(--text3);letter-spacing:0.05em}

/* SCORE */
.sh{background:linear-gradient(135deg,var(--surface2),var(--surface));border:1px solid var(--border2);border-radius:20px;padding:1.85rem;display:flex;align-items:center;gap:1.85rem;margin-bottom:1.2rem;position:relative;overflow:hidden}
.sh::before{content:'';position:absolute;top:-1px;left:8%;right:8%;height:1px;background:linear-gradient(90deg,transparent,var(--cyan),transparent)}
.sh-bg{position:absolute;top:-60px;right:-60px;width:220px;height:220px;background:radial-gradient(circle,var(--rc,rgba(0,212,170,0.07)),transparent 70%);pointer-events:none}
.rw{flex-shrink:0;position:relative;width:115px;height:115px}
.rw svg{transform:rotate(-90deg)}
.rt2{fill:none;stroke:rgba(255,255,255,0.06);stroke-width:10}
.rf2{fill:none;stroke-width:10;stroke-linecap:round;transition:stroke-dashoffset 1.2s cubic-bezier(0.34,1.56,0.64,1)}
.rc2{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center}
.rn{font-family:'Bricolage Grotesque',sans-serif;font-size:2.1rem;font-weight:800;line-height:1;letter-spacing:-0.04em}
.rd{font-family:'Fira Code',monospace;font-size:0.58rem;color:var(--text3)}
.sm h2{font-family:'Bricolage Grotesque',sans-serif;font-size:1.5rem;font-weight:700;letter-spacing:-0.03em;margin-bottom:0.35rem}
.sm p{font-size:0.83rem;color:var(--text2);line-height:1.6}
.s-tier{display:inline-flex;align-items:center;gap:0.35rem;font-family:'Fira Code',monospace;font-size:0.67rem;letter-spacing:0.08em;padding:0.28rem 0.7rem;border-radius:99px;margin-bottom:0.55rem}
.ts2{background:rgba(61,214,140,0.12);color:var(--green);border:1px solid rgba(61,214,140,0.2)}
.tg2{background:var(--blue-dim);color:var(--blue);border:1px solid rgba(79,142,247,0.2)}
.tf{background:var(--amber-dim);color:var(--amber);border:1px solid rgba(255,160,64,0.2)}
.tp{background:var(--rose-dim);color:var(--rose);border:1px solid rgba(255,95,126,0.2)}

.bkd{display:grid;grid-template-columns:repeat(3,1fr);gap:0.7rem;margin-bottom:1.2rem}
@media(max-width:520px){.bkd{grid-template-columns:1fr 1fr}}
.bk{background:var(--surface);border:1px solid var(--border);border-radius:11px;padding:0.9rem;text-align:center}
.bk-v{font-family:'Bricolage Grotesque',sans-serif;font-size:1.5rem;font-weight:800;line-height:1;letter-spacing:-0.03em}
.bk-l{font-size:0.66rem;color:var(--text3);margin-top:0.25rem;line-height:1.3}
.bk-bar{height:3px;background:rgba(255,255,255,0.05);border-radius:99px;margin-top:0.55rem;overflow:hidden}
.bk-bf{height:100%;border-radius:99px}

/* KEYWORDS */
.kwr{display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.2rem}
@media(max-width:560px){.kwr{grid-template-columns:1fr}}
.kb{background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:1.2rem}
.kb-t{font-weight:700;font-size:0.8rem;margin-bottom:0.8rem;display:flex;align-items:center;gap:0.4rem}
.tags{display:flex;flex-wrap:wrap;gap:0.38rem}
.tag{font-family:'Fira Code',monospace;font-size:0.68rem;padding:0.23rem 0.6rem;border-radius:7px}
.tgg{background:var(--green-dim);color:var(--green);border:1px solid rgba(61,214,140,0.2)}
.tgr{background:var(--rose-dim);color:var(--rose);border:1px solid rgba(255,95,126,0.15)}

.gap-title{font-weight:700;font-size:0.85rem;margin-bottom:0.7rem;display:flex;align-items:center;gap:0.5rem}
.gap-list{display:flex;flex-direction:column;gap:0.65rem}
.gap-c{background:var(--surface);border:1px solid var(--border);border-left:3px solid var(--cyan);border-radius:10px;padding:0.85rem 1rem}
.gap-kw{font-family:'Fira Code',monospace;font-size:0.73rem;color:var(--cyan);margin-bottom:0.32rem}
.gap-txt{font-size:0.8rem;color:var(--text2);line-height:1.55;font-style:italic}
.gap-where{font-size:0.67rem;color:var(--text3);margin-top:0.28rem;font-family:'Fira Code',monospace}

/* REWRITER */
.rw-blk{background:var(--surface);border:1px solid var(--border);border-radius:12px;overflow:hidden;margin-bottom:0.7rem}
.rw-h{background:var(--surface2);border-bottom:1px solid var(--border);padding:0.58rem 1rem;display:flex;align-items:center;justify-content:space-between}
.rw-hl{font-family:'Fira Code',monospace;font-size:0.62rem;letter-spacing:0.1em;text-transform:uppercase;color:var(--text3)}
.rw-cols{display:grid;grid-template-columns:1fr 1fr}
@media(max-width:500px){.rw-cols{grid-template-columns:1fr}}
.rw-col{padding:0.88rem 1rem;font-size:0.81rem;line-height:1.65;color:var(--text2)}
.rw-col.en{border-left:1px solid var(--border);background:rgba(0,212,170,0.02);color:var(--text)}
.rw-lbl{font-size:0.6rem;font-family:'Fira Code',monospace;font-weight:500;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:0.45rem;color:var(--text3)}
.rw-col.en .rw-lbl{color:var(--cyan)}
.sec-badge{display:inline-flex;font-family:'Fira Code',monospace;font-size:0.67rem;background:var(--cyan-dim);color:var(--cyan);border:1px solid rgba(0,212,170,0.2);padding:0.2rem 0.6rem;border-radius:6px;margin-bottom:0.65rem}

/* COVER LETTER */
.cl{background:var(--surface2);border:1px solid var(--border2);border-radius:14px;padding:1.85rem;font-size:0.87rem;line-height:1.85;color:var(--text2);white-space:pre-wrap}

/* INTERVIEW */
.iq{background:var(--surface);border:1px solid var(--border);border-radius:12px;overflow:hidden;margin-bottom:0.62rem}
.iq-q{padding:0.95rem 1.1rem;display:flex;align-items:flex-start;gap:0.8rem;cursor:pointer;transition:background 0.15s}
.iq-q:hover{background:rgba(255,255,255,0.02)}
.iq-n{flex-shrink:0;width:24px;height:24px;border-radius:7px;background:var(--cyan-dim);color:var(--cyan);display:flex;align-items:center;justify-content:center;font-family:'Fira Code',monospace;font-size:0.63rem;font-weight:600;margin-top:1px}
.iq-t{flex:1;font-size:0.84rem;font-weight:500;color:var(--text);line-height:1.5}
.iq-tb{flex-shrink:0;font-family:'Fira Code',monospace;font-size:0.6rem;padding:0.18rem 0.52rem;border-radius:6px}
.iq-beh{background:var(--blue-dim);color:var(--blue)}
.iq-tech{background:var(--amber-dim);color:var(--amber)}
.iq-sit{background:var(--green-dim);color:var(--green)}
.iq-chev{color:var(--text3);font-size:0.72rem;flex-shrink:0;margin-top:2px;transition:transform 0.2s}
.iq-chev.o{transform:rotate(180deg)}
.iq-ans{border-top:1px solid var(--border);padding:0.95rem 1.1rem 0.95rem 3.05rem;font-size:0.81rem;color:var(--text2);line-height:1.7;background:rgba(0,212,170,0.02)}

/* COPY BTN */
.cpb{display:inline-flex;align-items:center;gap:0.38rem;background:none;border:1px solid var(--border2);border-radius:7px;color:var(--text3);font-size:0.7rem;font-family:'Fira Code',monospace;padding:0.32rem 0.7rem;cursor:pointer;transition:all 0.15s}
.cpb:hover{border-color:var(--cyan);color:var(--cyan)}

/* ERROR */
.err{background:var(--rose-dim);border:1px solid rgba(255,95,126,0.2);border-radius:10px;padding:0.82rem 1rem;font-size:0.81rem;color:var(--rose);margin-bottom:1rem;line-height:1.55}

/* SCROLLBAR */
::-webkit-scrollbar{width:5px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.08);border-radius:99px}
::-webkit-scrollbar-thumb:hover{background:rgba(255,255,255,0.14)}

/* MOBILE */
@media(max-width:700px){
  .shell{flex-direction:column}
  .sidebar{width:100%;height:auto;position:relative;border-right:none;border-bottom:1px solid var(--border);flex-direction:row;align-items:center}
  .sb-top{padding:0.8rem 1rem;border-bottom:none;flex-shrink:0}
  .sb-name{font-size:1rem}
  .sb-tagline,.sb-free{display:none}
  .sb-nav{display:flex;flex-direction:row;padding:0;overflow-x:auto;flex:1}
  .sb-sec{display:none}
  .ni{padding:0.6rem 0.7rem;border-radius:0;border:none;border-bottom:2px solid transparent;margin-bottom:0;flex-shrink:0}
  .ni.active{background:none;border-bottom-color:var(--cyan)}
  .ni-icon{display:none}
  .ni-lbl{font-size:0.73rem}
  .sb-foot{display:none}
  .main-inner{padding:1.25rem 1rem 4rem}
  .ph-title{font-size:1.75rem}
  .sh{flex-direction:column;gap:1.25rem}
}
`;

/* ─── HELPERS ─────────────────────────────── */
const callAPI = async (tool, resumeB64, jobDescription) => {
  const res = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tool, resumeB64, jobDescription }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data.result;
};

const parseJ = t => JSON.parse(t.replace(/```json|```/g, "").trim());
const sc = s => s >= 80 ? "#3dd68c" : s >= 65 ? "#4f8ef7" : s >= 45 ? "#ffa040" : "#ff5f7e";
const tier = s => s >= 80 ? { l: "Strong Match", c: "ts2", e: "✦" }
  : s >= 65 ? { l: "Good Match", c: "tg2", e: "◈" }
  : s >= 45 ? { l: "Fair Match", c: "tf", e: "◇" }
  : { l: "Needs Work", c: "tp", e: "○" };

/* ─── MICRO ───────────────────────────────── */
function CopyBtn({ text }) {
  const [c, setC] = useState(false);
  return (
    <button className="cpb" onClick={() => { navigator.clipboard.writeText(text); setC(true); setTimeout(() => setC(false), 2000); }}>
      {c ? "✓ Copied!" : "⎘ Copy"}
    </button>
  );
}

function Ring({ score }) {
  const R = 50, C = 2 * Math.PI * R, off = C - (score / 100) * C;
  const col = sc(score);
  return (
    <div className="rw">
      <svg width="115" height="115" viewBox="0 0 115 115">
        <circle className="rt2" cx="57.5" cy="57.5" r={R} />
        <circle className="rf2" cx="57.5" cy="57.5" r={R} stroke={col} strokeDasharray={C} strokeDashoffset={off} />
      </svg>
      <div className="rc2">
        <span className="rn" style={{ color: col }}>{score}</span>
        <span className="rd">/100</span>
      </div>
    </div>
  );
}

/* ─── PANELS ──────────────────────────────── */
function ATSPanel({ data, loading, error, onRun, canRun }) {
  if (loading) return <div className="ls"><div className="lr" /><p>Calculating ATS score...</p></div>;
  if (!data) return (
    <div style={{ animation: "fadeUp 0.4s ease" }}>
      <div className="ph"><div className="ph-ey">Tool 01</div><div className="ph-title">ATS Score</div><div className="ph-sub">Full breakdown of how an ATS ranks your resume against this exact job.</div></div>
      {error && <div className="err">⚠ {error}</div>}
      <button className="ab p" onClick={onRun} disabled={!canRun}>⚡ Run Analysis</button>
    </div>
  );
  const t = tier(data.ats_score);
  return (
    <div style={{ animation: "fadeUp 0.4s ease" }}>
      <div className="ph"><div className="ph-ey">Tool 01</div><div className="ph-title">ATS Score</div></div>
      <div className="sh" style={{ "--rc": `${sc(data.ats_score)}11` }}>
        <div className="sh-bg" />
        <Ring score={data.ats_score} />
        <div className="sm">
          <div className={`s-tier ${t.c}`}>{t.e} {t.l}</div>
          <h2>Score: {data.ats_score} / 100</h2>
          <p>{data.summary}</p>
        </div>
      </div>
      <div className="bkd">
        {Object.entries(data.breakdown || {}).map(([k, v]) => (
          <div className="bk" key={k}>
            <div className="bk-v" style={{ color: sc(v) }}>{v}</div>
            <div className="bk-l">{k.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}</div>
            <div className="bk-bar"><div className="bk-bf" style={{ width: `${v}%`, background: sc(v) }} /></div>
          </div>
        ))}
      </div>
      <button className="ab g" onClick={onRun}>↺ Re-analyze</button>
    </div>
  );
}

function KeywordPanel({ data, loading, error, onRun, canRun }) {
  if (loading) return <div className="ls"><div className="lr" /><p>Finding keyword gaps...</p></div>;
  if (!data) return (
    <div style={{ animation: "fadeUp 0.4s ease" }}>
      <div className="ph"><div className="ph-ey">Tool 02</div><div className="ph-title">Keyword Gap</div><div className="ph-sub">Find missing keywords and get exact phrases to add them naturally.</div></div>
      {error && <div className="err">⚠ {error}</div>}
      <button className="ab p" onClick={onRun} disabled={!canRun}>🔍 Find Gaps</button>
    </div>
  );
  return (
    <div style={{ animation: "fadeUp 0.4s ease" }}>
      <div className="ph"><div className="ph-ey">Tool 02</div><div className="ph-title">Keyword Gap</div></div>
      <div className="kwr">
        <div className="kb"><div className="kb-t">✅ Already have</div><div className="tags">{(data.matched || []).map(k => <span className="tag tgg" key={k}>{k}</span>)}</div></div>
        <div className="kb"><div className="kb-t">❌ Missing</div><div className="tags">{(data.missing || []).map(k => <span className="tag tgr" key={k}>{k}</span>)}</div></div>
      </div>
      {(data.additions || []).length > 0 && <>
        <div className="gap-title">💡 Exactly how to add them</div>
        <div className="gap-list">
          {data.additions.map((a, i) => (
            <div className="gap-c" key={i}>
              <div className="gap-kw">+ {a.keyword}</div>
              <div className="gap-txt">"{a.suggestion}"</div>
              <div className="gap-where">→ Add to: {a.section}</div>
            </div>
          ))}
        </div>
      </>}
      <button className="ab g" style={{ marginTop: "1rem" }} onClick={onRun}>↺ Refresh</button>
    </div>
  );
}

function RewriterPanel({ data, loading, error, onRun, canRun }) {
  if (loading) return <div className="ls"><div className="lr" /><p>Enhancing your resume...</p></div>;
  if (!data) return (
    <div style={{ animation: "fadeUp 0.4s ease" }}>
      <div className="ph"><div className="ph-ey">Tool 03</div><div className="ph-title">Resume Enhancer</div><div className="ph-sub">Every bullet rewritten with action verbs, metrics, and ATS keywords.</div></div>
      {error && <div className="err">⚠ {error}</div>}
      <button className="ab p" onClick={onRun} disabled={!canRun}>✏️ Enhance Resume</button>
    </div>
  );
  return (
    <div style={{ animation: "fadeUp 0.4s ease" }}>
      <div className="ph"><div className="ph-ey">Tool 03</div><div className="ph-title">Resume Enhancer</div></div>
      {(data.sections || []).map((sec, si) => (
        <div key={si} style={{ marginBottom: "1.5rem" }}>
          <div className="sec-badge">{sec.section}</div>
          {(sec.bullets || []).map((b, bi) => (
            <div className="rw-blk" key={bi}>
              <div className="rw-h"><span className="rw-hl">Bullet {bi + 1}</span><CopyBtn text={b.rewritten} /></div>
              <div className="rw-cols">
                <div className="rw-col"><div className="rw-lbl">Original</div>{b.original}</div>
                <div className="rw-col en"><div className="rw-lbl">✦ Enhanced</div>{b.rewritten}</div>
              </div>
            </div>
          ))}
        </div>
      ))}
      <button className="ab g" onClick={onRun}>↺ Re-enhance</button>
    </div>
  );
}

function CoverPanel({ data, loading, error, onRun, canRun }) {
  if (loading) return <div className="ls"><div className="lr" /><p>Writing your cover letter...</p></div>;
  if (!data) return (
    <div style={{ animation: "fadeUp 0.4s ease" }}>
      <div className="ph"><div className="ph-ey">Tool 04</div><div className="ph-title">Cover Letter</div><div className="ph-sub">Personalized letter using your experience and the job's keywords.</div></div>
      {error && <div className="err">⚠ {error}</div>}
      <button className="ab p" onClick={onRun} disabled={!canRun}>📝 Generate Letter</button>
    </div>
  );
  return (
    <div style={{ animation: "fadeUp 0.4s ease" }}>
      <div className="ph"><div className="ph-ey">Tool 04</div><div className="ph-title">Cover Letter</div></div>
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", flexWrap: "wrap" }}>
        <CopyBtn text={data} />
        <button className="ab g" onClick={onRun}>↺ Regenerate</button>
      </div>
      <div className="cl">{data}</div>
    </div>
  );
}

function InterviewPanel({ data, loading, error, onRun, canRun }) {
  const [open, setOpen] = useState(null);
  if (loading) return <div className="ls"><div className="lr" /><p>Predicting interview questions...</p></div>;
  if (!data) return (
    <div style={{ animation: "fadeUp 0.4s ease" }}>
      <div className="ph"><div className="ph-ey">Tool 05</div><div className="ph-title">Interview Prep</div><div className="ph-sub">10 predicted questions with model STAR answers tailored to your background.</div></div>
      {error && <div className="err">⚠ {error}</div>}
      <button className="ab p" onClick={onRun} disabled={!canRun}>🎯 Predict Questions</button>
    </div>
  );
  const tc = t => t === "behavioral" ? "iq-beh" : t === "technical" ? "iq-tech" : "iq-sit";
  return (
    <div style={{ animation: "fadeUp 0.4s ease" }}>
      <div className="ph"><div className="ph-ey">Tool 05</div><div className="ph-title">Interview Prep</div><div className="ph-sub">Click a question to reveal the model answer.</div></div>
      {(data || []).map((q, i) => (
        <div className="iq" key={i}>
          <div className="iq-q" onClick={() => setOpen(open === i ? null : i)}>
            <span className="iq-n">{i + 1}</span>
            <span className="iq-t">{q.question}</span>
            <span className={`iq-tb ${tc(q.type)}`}>{q.type}</span>
            <span className={`iq-chev${open === i ? " o" : ""}`}>▼</span>
          </div>
          {open === i && <div className="iq-ans"><strong style={{ color: "var(--cyan)", fontFamily: "'Fira Code',monospace", fontSize: "0.68rem" }}>MODEL ANSWER</strong><br /><br />{q.answer}</div>}
        </div>
      ))}
      <button className="ab g" style={{ marginTop: "0.75rem" }} onClick={onRun}>↺ Refresh</button>
    </div>
  );
}

/* ─── OVERVIEW ────────────────────────────── */
const TOOLS = [
  { id: "ats",       icon: "📊", name: "ATS Score",       desc: "Full 6-dimension score",       color: "#00d4aa" },
  { id: "keywords",  icon: "🔍", name: "Keyword Gap",      desc: "Find & add what's missing",    color: "#4f8ef7" },
  { id: "rewriter",  icon: "✏️", name: "Resume Enhancer",  desc: "Rewrite every bullet point",   color: "#ffa040" },
  { id: "cover",     icon: "📝", name: "Cover Letter",     desc: "One-click tailored letter",    color: "#f5c842" },
  { id: "interview", icon: "🎯", name: "Interview Prep",   desc: "Questions + model answers",    color: "#ff5f7e" },
];

function Overview({ results, onNav, onRunAll, running }) {
  const done = Object.keys(results).length;
  return (
    <div style={{ animation: "fadeUp 0.4s ease" }}>
      <div className="ph">
        <div className="ph-ey">Dashboard</div>
        <div className="ph-title">Your Job Suite</div>
        <div className="ph-sub">5 AI-powered tools — completely free for everyone, forever.</div>
      </div>
      <button className="run-all" onClick={onRunAll} disabled={running}>
        <div>
          <div className="ra-lbl">{running ? "Running all tools…" : "⚡ Run All 5 Tools At Once"}</div>
          <div className="ra-sub">{running ? "Takes ~30 seconds" : `${5 - done} remaining · Runs in parallel`}</div>
        </div>
        <div className="ra-ico">{running ? <span className="sp dark" /> : "→"}</div>
      </button>
      <div className="tg">
        {TOOLS.map(t => (
          <div className={`tt${results[t.id] ? " done" : ""}`} key={t.id} style={{ "--ta": t.color }} onClick={() => onNav(t.id)}>
            <div className="tt-h">
              <div className="tt-i">{t.icon}</div>
              {results[t.id] && <div className="tt-chk">✓</div>}
            </div>
            <div className="tt-name">{t.name}</div>
            <div className="tt-desc">{t.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── UPLOAD SCREEN ───────────────────────── */
function UploadScreen({ onDone }) {
  const [b64, setB64] = useState(null);
  const [file, setFile] = useState(null);
  const [jd, setJd] = useState("");
  const [drag, setDrag] = useState(false);
  const ref = useRef();

  const load = useCallback(f => {
    if (!f || f.type !== "application/pdf") return;
    setFile(f);
    const r = new FileReader();
    r.onload = e => setB64(e.target.result.split(",")[1]);
    r.readAsDataURL(f);
  }, []);

  return (
    <div className="upload-screen">
      <div className="ub-bg" /><div className="ub-grid" />
      <div className="ub-card">
        <div className="hero-badge">✦ 100% Free — No sign up ever</div>
        <div className="hero-title">Land your dream job with AI</div>
        <div className="hero-sub">ATS score · keyword gaps · resume rewriter · cover letter · interview prep. No subscription. No API key. No credit card. Just upload and go.</div>

        <div className="free-strip">
          <span className="strip-tag">✅ No account needed</span>
          <span className="strip-tag">✅ No credit card</span>
          <span className="strip-tag">✅ No API key</span>
          <span className="strip-tag">✅ Instant results</span>
        </div>

        <label className="field-lbl">Your Resume (PDF)</label>
        <div className={`dropzone${drag ? " over" : ""}`}
          onClick={() => ref.current?.click()}
          onDragOver={e => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={e => { e.preventDefault(); setDrag(false); load(e.dataTransfer.files[0]); }}>
          <input ref={ref} type="file" accept=".pdf" onChange={e => load(e.target.files[0])} onClick={e => e.stopPropagation()} />
          <span className="dz-em">📄</span>
          <div className="dz-main"><strong>Click to upload</strong> or drag & drop</div>
          <div className="dz-hint">PDF only · Max 10MB</div>
        </div>
        {file && (
          <div className="file-ok">
            <span>✅</span>
            <span className="fo-name">{file.name}</span>
            <button className="fo-rm" onClick={() => { setFile(null); setB64(null); }}>✕</button>
          </div>
        )}

        <label className="field-lbl" style={{ display: "block", marginTop: "1.25rem", marginBottom: "0.5rem" }}>Job Description</label>
        <textarea className="jd" rows={5}
          placeholder="Paste the full job description — requirements, responsibilities, skills..."
          value={jd} onChange={e => setJd(e.target.value)} />

        <button className="btn-launch" disabled={!b64 || !jd.trim()} onClick={() => onDone(b64, file.name, jd)}>
          Analyze My Resume — It's Free →
        </button>
      </div>
    </div>
  );
}

/* ─── ROOT ────────────────────────────────── */
export default function App() {
  const [ready, setReady] = useState(false);
  const [b64, setB64] = useState(null);
  const [fname, setFname] = useState("");
  const [jd, setJd] = useState("");
  const [tab, setTab] = useState("overview");
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState({});
  const [errors, setErrors] = useState({});
  const [runningAll, setRunningAll] = useState(false);

  const setR = (id, v) => setResults(r => ({ ...r, [id]: v }));
  const setL = (id, v) => setLoading(l => ({ ...l, [id]: v }));
  const setE = (id, v) => setErrors(e => ({ ...e, [id]: v }));

  const run = async (id, parse = true) => {
    if (!b64 || !jd) return;
    setL(id, true); setE(id, null);
    try {
      const t = await callAPI(id, b64, jd);
      setR(id, parse ? parseJ(t) : t);
    } catch (e) { setE(id, e.message); }
    finally { setL(id, false); }
  };

  const runAll = async () => {
    setRunningAll(true);
    await Promise.all([
      run("ats"), run("keywords"), run("rewriter"),
      run("cover", false), run("interview")
    ]);
    setRunningAll(false);
  };

  const canRun = !!b64 && !!jd;

  const NAV = [
    { id: "overview",   icon: "◈",  label: "Overview" },
    { id: "ats",        icon: "📊", label: "ATS Score",    done: !!results.ats },
    { id: "keywords",   icon: "🔍", label: "Keywords",     done: !!results.keywords },
    { id: "rewriter",   icon: "✏️", label: "Enhancer",     done: !!results.rewriter },
    { id: "cover",      icon: "📝", label: "Cover Letter", done: !!results.cover },
    { id: "interview",  icon: "🎯", label: "Interview",    done: !!results.interview },
  ];

  if (!ready) return (
    <><style>{CSS}</style>
      <UploadScreen onDone={(b, n, j) => { setB64(b); setFname(n); setJd(j); setReady(true); }} />
    </>
  );

  return (
    <>
      <style>{CSS}</style>
      <div className="shell">
        <aside className="sidebar">
          <div className="sb-glow" />
          <div className="sb-top">
            <div className="sb-brand">
              <div className="sb-ico">💼</div>
              <span className="sb-name">JobCraft</span>
            </div>
            <div className="sb-tagline">Free AI Job Suite</div>
            <div className="sb-free">100% Free</div>
          </div>
          <nav className="sb-nav">
            <div className="sb-sec">Tools</div>
            {NAV.map(n => (
              <div key={n.id} className={`ni${tab === n.id ? " active" : ""}`} onClick={() => setTab(n.id)}>
                <div className="ni-icon">{n.icon}</div>
                <span className="ni-lbl">{n.label}</span>
                {n.id === "overview" && <span className="ni-badge">{Object.keys(results).length}/5</span>}
                {n.done && <div className="ni-check">✓</div>}
              </div>
            ))}
          </nav>
          <div className="sb-foot">
            <div className="sb-file">
              <div className="sf-dot" />
              <span className="sf-name">{fname}</span>
              <button className="sf-change" onClick={() => { setReady(false); setResults({}); setTab("overview"); }}>Change</button>
            </div>
          </div>
        </aside>

        <main className="main">
          <div className="main-bg" />
          <div className="main-inner">
            {tab === "overview"  && <Overview results={results} onNav={setTab} onRunAll={runAll} running={runningAll} />}
            {tab === "ats"       && <ATSPanel       data={results.ats}       loading={loading.ats}       error={errors.ats}       onRun={() => run("ats")}           canRun={canRun} />}
            {tab === "keywords"  && <KeywordPanel   data={results.keywords}  loading={loading.keywords}  error={errors.keywords}  onRun={() => run("keywords")}      canRun={canRun} />}
            {tab === "rewriter"  && <RewriterPanel  data={results.rewriter}  loading={loading.rewriter}  error={errors.rewriter}  onRun={() => run("rewriter")}      canRun={canRun} />}
            {tab === "cover"     && <CoverPanel     data={results.cover}     loading={loading.cover}     error={errors.cover}     onRun={() => run("cover", false)}  canRun={canRun} />}
            {tab === "interview" && <InterviewPanel data={results.interview} loading={loading.interview} error={errors.interview} onRun={() => run("interview")}     canRun={canRun} />}
          </div>
        </main>
      </div>
    </>
  );
}
