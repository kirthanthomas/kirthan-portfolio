import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useDragControls, useScroll, useSpring, useTransform, useMotionValue, animate } from "framer-motion";
import {
  Terminal, LayoutGrid, Zap, Skull, Copy, Check, Cpu, Database, Code2, Globe,
  GitBranch, Shield, Cloud, Brain, Briefcase, FolderGit2, GraduationCap, Award,
  Mail, Phone, MapPin, ChevronDown, ChevronUp, RotateCcw, Activity,
  ChevronLeft, ChevronRight, X, ExternalLink, Monitor, Server, HardDrive, Keyboard, Binary, Braces, CircuitBoard,
} from "lucide-react";

/* ───────── DATA (edit freely) ───────── */
const P = {
  name: "Kirthan Thomas",
  title: "MCA Student & Full-Stack Web Developer",
  email: "kirthan.thomas@mca.christuniversity.in",
  phone: "+91 8073508820",
  loc: "Bengaluru, Karnataka",
  school: "CHRIST (Deemed to be University), Bengaluru",
  about:
    "MCA student at CHRIST (Deemed to be University), Bengaluru and BCA graduate with hands-on experience in full-stack web development through an NGO internship. Strong foundation in Java, JavaScript, HTML, CSS, SQL, DBMS and object-oriented programming. Interested in building web applications, integrating APIs and applying software engineering concepts to real-world problems.",
};
// NOTE: the bar percentages are illustrative. Set them to what you honestly want to show.
const SKILLS = [
  { g: "Programming", I: Code2, s: [["Java", 80], ["JavaScript", 85], ["Python", 70]] },
  { g: "Web Development", I: Globe, s: [["HTML", 90], ["CSS", 85], ["Responsive Web Design", 85], ["Full Stack Development", 75]] },
  { g: "Database", I: Database, s: [["SQL", 80], ["DBMS", 80], ["Database Design", 75]] },
  { g: "Software Concepts", I: Cpu, s: [["OOPS", 85], ["CS Fundamentals", 80], ["API & Function Integration", 75]] },
  { g: "AI & Emerging Tech", I: Brain, s: [["RAG Fundamentals", 60]] },
  { g: "Tools", I: GitBranch, s: [["VS Code", 90], ["Git", 75]] },
];
const EXP = {
  role: "Full Stack Development Intern",
  org: "Yeshwanth Rural Development Society (NGO Internship)",
  b: [
    "Developed a full-stack website for Yeshwanth Rural Development Society as part of the internship project.",
    "Designed and implemented responsive web pages to present the organisation's information, activities and services.",
    "Worked on front-end and back-end components and integrated application functionality.",
    "Applied database and API concepts while developing and connecting application components.",
    "Collaborated with the team to understand requirements, implement features and test the application.",
  ],
};
// NOTE: tags are placeholders. Use DEPLOYED / R&D / whatever is true for each project.
const PROJ = [
  {
    t: "University Student Waste Management System", sub: "Full Stack Web Application", tag: "R&D",
    b: [
      "Full-stack web app to improve waste management and promote responsible disposal within a university.",
      "User-friendly interface for students and university users to access waste management services.",
      "Centralized platform to organize and manage waste activities, connecting front end and back end.",
    ],
  },
  {
    t: "Yeshwanth Rural Development Society Website", sub: "Internship Project", tag: "DEPLOYED",
    b: [
      "Responsive pages presenting the organisation's information, activities and services.",
      "Front-end and back-end components with database and API integration.",
    ],
  },
  {
    t: "Cyber-Kernel Portfolio", sub: "React + Tailwind + Framer Motion", tag: "LIVE",
    b: [
      "Interactive portfolio with a terminal mode and a draggable GUI dashboard, built from my resume.",
      "Includes a turbo mode, live uptime counter and animated visuals.",
    ],
  },
];
const EDU = [
  ["Master of Computer Applications (MCA)", "CHRIST (Deemed to be University), Bengaluru", "2026 - Present"],
  ["Bachelor of Computer Applications (BCA)", "St. Joseph's University, Bengaluru", "Completed | SGPA 7.00/10 | Cybernetics Association"],
  ["Science (PCMB)", "Aloysius PU College, Davangere", "80.00%"],
];
const CERTS = [
  ["Applied Database Systems using Oracle AI Database", "Oracle Database Academy | 2026 | Graph Databases, NoSQL", Database],
  ["AWS Academy Cloud Foundations", "AWS Academy Graduate | 2025", Cloud],
  ["Cyber Security Foundation", "Infosys Springboard | 2025", Shield],
  ["Responsive Web Design", "freeCodeCamp | 2025", Code2],
  ["Artificial Intelligence", "Infosys Springboard", Brain],
  ["E-Business", "NPTEL", Briefcase],
  ["Developing Soft Skill and Personality", "NPTEL", Award],
  ["Creative Thinking Techniques and Tools for Success", "", Zap],
];
const QUICK = ["help", "about", "skills", "exp", "projects", "edu", "certs", "contact", "github", "email", "turbo", "clear"];
const BOOT = "CYBER-KERNEL v2.6 booting...\n[ OK ] loading resume.dat\n[ OK ] mounting /skills /projects /exp\nType 'help' for commands, or tap a button above.";

const ASCII = `██╗  ██╗██╗██████╗ ████████╗██╗  ██╗ █████╗ ███╗   ██╗
██║ ██╔╝██║██╔══██╗╚══██╔══╝██║  ██║██╔══██╗████╗  ██║
█████╔╝ ██║██████╔╝   ██║   ███████║███████║██╔██╗ ██║
██╔═██╗ ██║██╔══██╗   ██║   ██╔══██║██╔══██║██║╚██╗██║
██║  ██╗██║██║  ██║   ██║   ██║  ██║██║  ██║██║ ╚████║
╚═╝  ╚═╝╚═╝╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝`;

/* Theme variables + effects Tailwind can't express inline. Turbo flips --a / --b. */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Orbitron:wght@600;800;900&display=swap');
.cy{--a:#b66dff;--b:#ff6ad5;--c:#67e8f9;font-family:'JetBrains Mono',ui-monospace,monospace}.cy{--cta:#a7f3d0;--ctaglow:rgba(167,243,208,.55)}.cy.turbo{--a:#ff2e63;--b:#ffb300;--cta:#ff4d6d;--ctaglow:rgba(255,77,109,.65)}
.ta{color:var(--a)}.tb{color:var(--b)}.ba{border-color:var(--a)}.bga{background:var(--a)}
.glow{box-shadow:0 0 15px color-mix(in srgb,var(--a) 30%,transparent)}
.tglow{text-shadow:0 0 8px var(--a)}
.hv{transition:.2s}.hv:hover{border-color:var(--a);box-shadow:0 0 18px color-mix(in srgb,var(--a) 35%,transparent)}
.grid-bg{background-image:linear-gradient(color-mix(in srgb,var(--a) 8%,transparent) 1px,transparent 1px),linear-gradient(90deg,color-mix(in srgb,var(--a) 8%,transparent) 1px,transparent 1px);background-size:40px 40px;animation:gp 6s linear infinite}
@keyframes gp{to{background-position:40px 40px}}
.crt{overflow:hidden;background:radial-gradient(transparent 60%,rgba(0,0,0,.6)),repeating-linear-gradient(0deg,rgba(0,0,0,.1) 0 1px,transparent 1px 3px)}
.crt::after{content:"";position:absolute;left:0;right:0;top:-120px;height:120px;background:linear-gradient(transparent,color-mix(in srgb,var(--a) 8%,transparent),transparent);animation:scan 6s linear infinite}
.turbo .crt::after{animation-duration:1.5s}
@keyframes scan{to{transform:translateY(calc(100vh + 240px))}}
.glitch{position:relative;display:inline-block}
.glitch::before,.glitch::after{content:attr(data-t);position:absolute;inset:0;pointer-events:none}
.glitch::before{color:var(--b);clip-path:inset(0 0 55% 0);animation:g 2.4s steps(1) infinite}
.glitch::after{color:#ff2e63;clip-path:inset(55% 0 0 0);animation:g 3.1s steps(1) infinite reverse}
.turbo .glitch::before,.turbo .glitch::after{animation-duration:.4s}
@keyframes g{0%,88%,100%{transform:none}90%{transform:translate(-3px,1px)}94%{transform:translate(3px,-1px)}}
.blink{animation:bl 1s steps(2) infinite}@keyframes bl{50%{opacity:0}}
.mq{animation:mq 35s linear infinite}.turbo .mq{animation-duration:8s}
@keyframes mq{to{transform:translateX(-50%)}}
.turbo .shake{animation:sh .12s infinite}@keyframes sh{25%{transform:translate(1px,0)}75%{transform:translate(-1px,0)}}
:root{color-scheme:dark}
html,body{background:#07050d;margin:0}
body{display:block!important}
.cy{background:#07050d;color:#f3ecff;width:100%}
.bn-f{color:#fbf5ff;text-shadow:0 0 4px var(--a),0 0 14px var(--a),0 0 34px color-mix(in srgb,var(--a) 70%,transparent)}
.bn-s{color:var(--b);opacity:.9;text-shadow:0 0 8px var(--b)}
.hv:hover{transform:translateY(-3px)}
@keyframes sl{from{background-position:0 0}to{background-position:100% 0}}
.shine{background:linear-gradient(100deg,#fff 0 40%,var(--a) 48%,var(--b) 52%,#fff 60% 100%);background-size:250% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:sl 3.5s linear infinite;filter:drop-shadow(0 0 18px color-mix(in srgb,var(--a) 60%,transparent))}
.float{animation:fl 5s ease-in-out infinite}@keyframes fl{50%{transform:translateY(-10px)}}
.sl2{position:absolute;left:0;right:0;height:30%;background:linear-gradient(transparent,rgba(255,255,255,.1),transparent);animation:s2 3s linear infinite}@keyframes s2{from{top:-30%}to{top:100%}}
.stage{background:radial-gradient(70% 60% at 50% 48%,#10031d 0,transparent 75%),linear-gradient(160deg,#c084fc,#7c3aed 38%,#3b0f6e 68%,#e879f9)}
.cta{background:var(--cta);color:#06170f;transition:.2s;animation:pl 2.4s ease-in-out infinite}.turbo .cta{color:#2b0009}.cta:hover{filter:brightness(1.15);box-shadow:0 0 28px var(--cta)}
@keyframes pl{50%{box-shadow:0 0 22px var(--ctaglow)}}
.thumb,.arrow{border:1px solid rgba(255,255,255,.15);background:rgba(255,255,255,.04);transition:.2s;font-size:12px}
.thumb{border-radius:10px;padding:.55rem 1rem}.arrow{display:grid;place-items:center;width:38px;height:38px;border-radius:999px}
.thumb:hover,.arrow:hover,.thumb.on{border-color:var(--a);box-shadow:0 0 14px color-mix(in srgb,var(--a) 40%,transparent);color:#fff}
.spot{background:radial-gradient(520px at var(--mx,50%) var(--my,30%),color-mix(in srgb,var(--a) 16%,transparent),transparent 70%)}
html{scroll-behavior:smooth}
.pbar{background:linear-gradient(90deg,var(--a),var(--b),var(--c));box-shadow:0 0 12px var(--b)}
.cur-dot,.cur-ring{position:fixed;left:0;top:0;z-index:70;pointer-events:none;border-radius:50%;translate:-50% -50%}
.cur-dot{width:6px;height:6px;background:var(--a);box-shadow:0 0 10px var(--a)}
.cur-ring{width:34px;height:34px;border:1.5px solid var(--b);box-shadow:0 0 14px color-mix(in srgb,var(--b) 50%,transparent)}
@media (pointer:coarse){.cur-dot,.cur-ring{display:none}}
@media (pointer:fine){.cy,.cy *{cursor:none!important}}
.stack{display:flex;flex-direction:column;gap:24px}
.turbo .stage{background:radial-gradient(70% 60% at 50% 48%,#1d0308 0,transparent 75%),linear-gradient(160deg,#ff5470,#c0123a 38%,#5a0a1c 68%,#ffb300)}
.stage{position:relative;overflow:hidden;border-radius:16px;margin-top:16px;padding:40px 24px 30px}
.stage-pill{position:absolute;left:16px;bottom:16px;border-radius:999px;background:rgba(255,255,255,.2);backdrop-filter:blur(6px);color:#fff;font-size:13px;padding:6px 16px}
.lap{width:min(88%,600px);margin:0 auto}
.lap-lid{position:relative;background:#0a0a10;border:3px solid #34344a;border-radius:14px 14px 4px 4px;padding:10px 10px 14px;box-shadow:0 0 60px color-mix(in srgb,var(--a) 55%,transparent),inset 0 0 0 1px #4a4a63}
.lap-lid::before{content:"";position:absolute;top:4px;left:50%;width:5px;height:5px;margin-left:-2px;border-radius:50%;background:#1d1d2a;box-shadow:0 0 0 1px #3d3d52}
.lap-screen{position:relative;width:100%;padding-top:62.5%;border-radius:6px;overflow:hidden;background:radial-gradient(circle at 50% 40%,#2a0f4d,#07050d 70%)}
.turbo .lap-screen{background:radial-gradient(circle at 50% 40%,#4d0f1d,#0d0507 70%)}
.lap-screen::after{content:"";position:absolute;inset:0;pointer-events:none;background:linear-gradient(115deg,rgba(255,255,255,.14),transparent 35%)}
.lap-in{position:absolute;inset:0}
.lap-log{position:absolute;left:12px;top:8px;font-size:11px;line-height:1.5;color:rgba(255,255,255,.72)}
.lap-word{position:absolute;inset:0;display:grid;place-items:center;font-size:clamp(2rem,7vw,4.2rem);font-weight:900}
.lap-hinge{height:9px;width:92%;margin:0 auto;border-radius:0 0 8px 8px;background:linear-gradient(#040408,#34344a)}
.lap-deckwrap{perspective:900px;margin-bottom:-80px}
.lap-deck{transform:rotateX(48deg);transform-origin:top center;padding:14px 16px 16px;border-radius:6px 6px 22px 22px;border-top:1px solid rgba(255,255,255,.3);background:linear-gradient(#4a4566,#26223a);box-shadow:0 30px 40px rgba(0,0,0,.6)}
.keys{display:flex;flex-direction:column;gap:5px;padding:8px;border-radius:6px;background:#0d0b14}
.krow{display:flex;gap:5px;justify-content:center}
.key{flex:1;height:20px;border:0;border-radius:4px;display:grid;place-items:center;font:inherit;font-size:8px;color:#a79fd0;background:linear-gradient(#2a2640,#1a1728);box-shadow:0 2px 0 #06050a}
.key.wide{flex:6;font-size:10px;font-weight:700;cursor:pointer}
.lap-pad{width:36%;height:34px;margin:10px auto 0;border-radius:6px;background:linear-gradient(#5a5478,#3a3554);box-shadow:inset 0 0 0 1px rgba(0,0,0,.35)}
.rail{position:fixed;right:14px;top:50%;transform:translateY(-50%);z-index:55;height:58vh;display:flex;flex-direction:column;align-items:center;gap:10px;pointer-events:none}
.rail-track{position:relative;flex:1;width:2px;border-radius:2px;background:rgba(255,255,255,.15)}
.rail-fill{position:absolute;left:0;top:0;width:2px;background:linear-gradient(var(--a),var(--b));box-shadow:0 0 10px var(--a)}
.rail-node{position:absolute;left:50%;translate:-50% -50%;display:grid;place-items:center;width:26px;height:26px;border-radius:7px;background:#0b0614;border:1.5px solid var(--a);color:var(--a);box-shadow:0 0 14px var(--a)}
.rail-node::after{content:"";position:absolute;inset:-6px;border-radius:10px;border:1px solid var(--a);animation:ping 1.6s ease-out infinite}
@keyframes ping{from{opacity:.8;transform:scale(.7)}to{opacity:0;transform:scale(1.5)}}
.tick{position:absolute;left:-6px;width:14px;height:1px;background:rgba(255,255,255,.25)}
.tick.on{background:var(--b);box-shadow:0 0 6px var(--b)}
.rail-pct{font-size:13px;font-weight:800;color:#fff;text-shadow:0 0 8px var(--a)}
.rail-left{font-size:9px;letter-spacing:.2em;writing-mode:vertical-rl;color:var(--b)}
@media (max-width:640px){.rail{display:none}}
.char{position:relative;width:100%;height:clamp(300px,50vw,500px)}
.char canvas{position:absolute;inset:0;display:block}
.stage.room{padding:0;background:radial-gradient(80% 70% at 62% 45%,#2a1a6e 0,#120a33 45%,#07050d 100%)}
.turbo .stage.room{background:radial-gradient(80% 70% at 62% 45%,#6e1a2a 0,#33090f 45%,#0d0507 100%)}
.stage-cta{position:absolute;right:16px;bottom:16px;z-index:2;border:0;border-radius:12px;padding:12px 20px;font:inherit;font-size:13px;font-weight:700;cursor:pointer}
.stage.holo{height:clamp(240px,34vw,360px);display:grid;place-items:center}
.holo-word{font-size:clamp(2.6rem,10vw,6.5rem);font-weight:900}
.holo-log{position:absolute;left:18px;top:14px;font-size:12px;line-height:1.6;color:rgba(255,255,255,.75)}
.dock{align-self:flex-start;border:1px dashed var(--a);color:var(--a);padding:6px 14px;border-radius:8px;font-size:12px;background:rgba(0,0,0,.4)}
.holo-card{position:relative;width:128px;height:150px;flex:none;border:1px solid var(--a);border-radius:12px;overflow:hidden;color:var(--a);background:radial-gradient(circle at 50% 35%,color-mix(in srgb,var(--a) 22%,#05030a),#05030a 75%);animation:hp 2.4s ease-in-out infinite}
@keyframes hp{50%{box-shadow:0 0 26px color-mix(in srgb,var(--a) 60%,transparent)}}
.holo-card svg{position:absolute;inset:0;width:100%;height:100%;filter:drop-shadow(0 0 4px var(--a));animation:hj 4s steps(1) infinite}
@keyframes hj{0%,92%,100%{transform:none}94%{transform:translate(-3px,0) skewX(4deg)}97%{transform:translate(3px,0)}}
.holo-card::after{content:"";position:absolute;inset:0;pointer-events:none;background:repeating-linear-gradient(0deg,transparent 0 3px,rgba(255,255,255,.08) 3px 4px)}
.holo-bar{position:absolute;left:0;right:0;height:22px;background:linear-gradient(transparent,color-mix(in srgb,var(--b) 45%,transparent),transparent);animation:hb 2.2s linear infinite}
@keyframes hb{from{top:-22px}to{top:100%}}
.turbo .holo-bar{animation-duration:.6s}
.holo-tag{position:absolute;left:6px;bottom:4px;font-size:9px;letter-spacing:.15em;color:var(--b)}
.vz{fill:var(--b);filter:drop-shadow(0 0 6px var(--b));animation:vz 2.4s ease-in-out infinite}@keyframes vz{50%{opacity:.55}}
.git{display:grid;gap:18px;grid-template-columns:1.1fr 1fr}
@media (max-width:760px){.git{grid-template-columns:1fr}}
.gst{font-size:13px;line-height:1.9;list-style:none;padding:0}.gst b{color:var(--a)}.gst .ok{color:#00ff9d;text-shadow:0 0 8px #00ff9d}
.gnode{animation:gn 2s ease-in-out infinite}@keyframes gn{50%{r:7;opacity:.5}}
.dash{animation:dash 1s linear infinite}@keyframes dash{to{stroke-dashoffset:-20}}
.gterm{overflow:hidden;border:1px solid var(--a);border-radius:10px;background:#05030a;padding:12px 14px;font-size:13px;box-shadow:0 0 22px color-mix(in srgb,var(--a) 35%,transparent)}
.gbtn{display:inline-flex;align-items:center;justify-content:center;gap:6px;border:0;border-radius:10px;padding:10px 16px;font:inherit;font-size:12px;font-weight:700;cursor:pointer;text-decoration:none}
.radar{position:fixed;left:14px;bottom:54px;z-index:55;width:104px;height:104px;border-radius:50%;pointer-events:none;overflow:hidden;border:1px solid var(--a);background:repeating-radial-gradient(circle,transparent 0 12px,color-mix(in srgb,var(--a) 30%,transparent) 12px 13px),rgba(0,0,0,.5);box-shadow:0 0 18px color-mix(in srgb,var(--a) 40%,transparent)}
.radar::before{content:"";position:absolute;inset:0;background:conic-gradient(transparent 0 300deg,color-mix(in srgb,var(--a) 75%,transparent) 360deg);animation:sweep 3s linear infinite}
.radar::after{content:"";position:absolute;inset:0;border-radius:50%;border:1px solid var(--a);animation:ping 2s ease-out infinite}
.radar i{position:absolute;width:5px;height:5px;border-radius:50%;background:var(--b);box-shadow:0 0 8px var(--b);animation:blip 3s infinite}
@keyframes sweep{to{transform:rotate(360deg)}}@keyframes blip{0%,100%{opacity:0}10%{opacity:1}}
.turbo .radar::before{animation-duration:.8s}
@media (max-width:640px){.radar{display:none}}
.turbo .ca{animation:ab .3s steps(2) infinite}
@keyframes ab{0%{text-shadow:2px 0 rgba(255,23,68,.8),-2px 0 rgba(0,229,255,.8)}50%{text-shadow:-2px 1px rgba(255,23,68,.8),2px -1px rgba(0,229,255,.8)}}
.turbo .grid-bg{animation-duration:1s}
.alert{position:fixed;inset:0;z-index:80;pointer-events:none;display:flex;flex-direction:column;justify-content:space-between;background:radial-gradient(transparent 40%,rgba(255,23,68,.45))}
.alert-bar{height:34px;background:repeating-linear-gradient(45deg,#ffcc00 0 18px,#111 18px 36px);background-size:51px 51px;animation:hz .5s linear infinite}
@keyframes hz{to{background-position:51px 0}}
.alert-txt{text-align:center;color:#fff;text-shadow:2px 0 #ff1744,-2px 0 #00e5ff;animation:fb .2s steps(2) infinite}
.alert-txt span{display:block;font-size:14px;letter-spacing:.5em;color:#ffcc00}
.alert-txt b{display:block;font-size:clamp(1.6rem,6vw,4rem);font-weight:900}
.alert-txt i{display:block;font-size:12px;letter-spacing:.3em;font-style:normal}
@keyframes fb{50%{opacity:.6}}
.bn-f{animation:flick 6s infinite}
@keyframes flick{0%,18%,22%,60%,64%,100%{opacity:1}20%{opacity:.45}62%{opacity:.6}}
.aurora{animation:au 14s ease-in-out infinite alternate}@keyframes au{to{transform:translate(-3%,2%) scale(1.1)}}
.bar-fill{position:relative;overflow:hidden}
.bar-fill::after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(255,255,255,.6),transparent);transform:translateX(-100%);animation:bs 2.2s linear infinite}
@keyframes bs{to{transform:translateX(100%)}}
.win::before,.win::after{animation:cb 2s ease-in-out infinite}@keyframes cb{50%{width:24px;height:24px}}
.pre-in{animation:pin .3s ease-out}@keyframes pin{from{opacity:0;transform:translateX(-10px)}}
.mq:hover{animation-play-state:paused}
.cert{position:relative;overflow:hidden}
.cert::after{content:"";position:absolute;inset:0;pointer-events:none;background:linear-gradient(100deg,transparent 30%,rgba(255,255,255,.18),transparent 70%);transform:translateX(-120%)}
.cert:hover::after{transition:transform .8s;transform:translateX(120%)}
.ecg{stroke:var(--b);stroke-dasharray:60 200;animation:ecg 2s linear infinite}@keyframes ecg{from{stroke-dashoffset:260}to{stroke-dashoffset:0}}
.stats{display:flex;gap:10px;margin-top:12px}
.stats div{flex:1;border:1px solid rgba(255,255,255,.15);border-radius:8px;padding:6px 8px;text-align:center;background:rgba(255,255,255,.03)}
.stats b{display:block;font-size:20px;color:var(--a);text-shadow:0 0 10px var(--a)}
.stats span{font-size:10px;letter-spacing:.15em;color:var(--b)}
.boot{position:fixed;inset:0;z-index:90;background:#05030a;color:#00ff9d;padding:28px;font-size:14px;line-height:1.7;overflow:hidden;cursor:pointer}
.boot-skip{margin-top:18px;color:#6b6290;font-size:11px}
.holo-card{width:140px;height:auto;aspect-ratio:815/988}
.holo-par,.holo-br{position:absolute;inset:0}
.holo-br{animation:br 5s ease-in-out infinite}
@keyframes br{0%,100%{transform:scale(1.07)}50%{transform:scale(1.11)}}
.holo-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;user-select:none;pointer-events:none}
.holo-img.base{animation:hj 4s steps(1) infinite}
.turbo .holo-img.base{filter:hue-rotate(90deg) saturate(1.3)}
.gh{mix-blend-mode:screen;opacity:0}
.g1{filter:hue-rotate(150deg) saturate(2.5);animation:g1 3.2s steps(1) infinite}
.g2{filter:hue-rotate(-120deg) saturate(2.5);animation:g2 3.2s steps(1) infinite}
@keyframes g1{0%,88%,100%{opacity:0;transform:none}90%{opacity:.7;transform:translate(-4px,1px)}94%{opacity:.7;transform:translate(3px,-1px)}}
@keyframes g2{0%,88%,100%{opacity:0;transform:none}91%{opacity:.7;transform:translate(4px,-1px)}95%{opacity:.7;transform:translate(-3px,1px)}}
.turbo .gh{animation-duration:.6s}
.visor{position:absolute;left:32%;width:34%;top:37%;height:5%;background:var(--b);filter:blur(9px);mix-blend-mode:screen;opacity:.35;animation:vg 1.6s ease-in-out infinite}
@keyframes vg{50%{opacity:.9}}
.visor.sweep{width:7%;background:#fff;filter:blur(5px);animation:vs 1.8s ease-in-out infinite alternate}
@keyframes vs{from{left:32%;opacity:.2}to{left:59%;opacity:.8}}
.fd{font-family:'Orbitron','JetBrains Mono',sans-serif}
.cy pre,.cy input{font-family:inherit}
.cy ::selection{background:var(--a);color:#000}
.cy ::-webkit-scrollbar{width:8px;height:8px}.cy ::-webkit-scrollbar-thumb{background:color-mix(in srgb,var(--a) 50%,transparent);border-radius:4px}
.aurora{background:radial-gradient(60% 50% at 12% 0%,color-mix(in srgb,var(--a) 16%,transparent),transparent),radial-gradient(50% 45% at 92% 18%,color-mix(in srgb,var(--c) 14%,transparent),transparent),radial-gradient(60% 50% at 50% 115%,color-mix(in srgb,var(--b) 16%,transparent),transparent)}
.grid-bg{-webkit-mask-image:radial-gradient(ellipse at 50% 25%,#000 20%,transparent 75%);mask-image:radial-gradient(ellipse at 50% 25%,#000 20%,transparent 75%)}
.bar-fill{background:linear-gradient(90deg,var(--a),var(--b));box-shadow:0 0 10px var(--a)}
.win{position:relative;border-radius:12px;border:1px solid color-mix(in srgb,var(--a) 40%,transparent);background:linear-gradient(160deg,rgba(24,13,40,.94),rgba(9,5,17,.94));backdrop-filter:blur(10px);box-shadow:0 10px 40px rgba(0,0,0,.6),0 0 22px color-mix(in srgb,var(--a) 18%,transparent)}
.win::before,.win::after{content:"";position:absolute;width:14px;height:14px;pointer-events:none;border:2px solid var(--a)}
.win::before{top:-1px;left:-1px;border-right:0;border-bottom:0;border-top-left-radius:12px}
.win::after{bottom:-1px;right:-1px;border-left:0;border-top:0;border-bottom-right-radius:12px}
.wbar{background:linear-gradient(90deg,color-mix(in srgb,var(--a) 20%,transparent),transparent 70%)}
@media (prefers-reduced-motion:reduce){.cy *,.cy *::before,.cy *::after{animation:none!important}}
`;

/* ───────── SMALL PIECES ───────── */
const pad = (n) => String(n).padStart(2, "0");
function useUptime() {
  const [s, setS] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setS((x) => x + 1), 1000);
    return () => clearInterval(id);
  }, []);
  return `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}`;
}

function Particles({ turbo }) {
  const dots = useMemo(
    () => Array.from({ length: 30 }, (_, i) => ({ i, x: Math.random() * 100, y: 20 + Math.random() * 80, s: 2 + Math.random() * 3, d: 4 + Math.random() * 6 })),
    []
  );
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {dots.map((d) => (
        <motion.span
          key={`${d.i}-${turbo}`}
          className="bga absolute rounded-full"
          style={{ left: `${d.x}%`, top: `${d.y}%`, width: d.s, height: d.s, boxShadow: "0 0 8px var(--a)" }}
          animate={{ y: [0, -200], opacity: [0, 1, 0] }}
          transition={{ duration: turbo ? d.d / 5 : d.d, repeat: Infinity, ease: "linear" }}
        />
      ))}
    </div>
  );
}

const Btn = ({ on, children, ...p }) => (
  <motion.button
    {...p}
    whileHover={{ y: -2, scale: 1.03 }}
    whileTap={{ scale: 0.96 }}
    transition={{ type: "spring", stiffness: 400, damping: 24 }}
    className={`flex items-center gap-1.5 rounded-md border ba px-3 py-2 text-[12px] font-bold tracking-wider transition ${on ? "bga text-black shadow-[0_0_20px_var(--a)]" : "ta bg-black/40 hover:bg-white/10"}`}
  >
    {children}
  </motion.button>
);
const Tag = ({ children }) => <span className="ta whitespace-nowrap rounded border ba px-1.5 py-0.5 text-[11px] font-bold">{children}</span>;
const listVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } };
const listItemVariants = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } };

const Bar = ({ n, v }) => (
  <div className="mb-1.5">
    <div className="flex justify-between text-[13px]"><span>{n}</span><span className="tb">{v}%</span></div>
    <div className="h-2 rounded bg-white/10">
      <motion.div className="bar-fill h-full rounded" initial={{ width: 0 }} whileInView={{ width: `${v}%` }} viewport={{ once: true }} transition={{ duration: 1.2, ease: "easeOut" }} />
    </div>
  </div>
);

/* Draggable + collapsible window. Drag by the title bar. */
function Win({ title, Icon, children, className = "" }) {
  const dc = useDragControls();
  const [open, setOpen] = useState(true);
  const [shown, setShown] = useState(true);
  const stop = (e) => e.stopPropagation();
  return (
    <>
      <AnimatePresence>
        {shown && (
          <motion.section
            key="w" drag dragControls={dc} dragListener={false} dragMomentum={false}
            whileDrag={{ scale: 1.02, zIndex: 30 }}
            initial={{ opacity: 0, y: 90, scale: 0.92 }} whileInView={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, y: 40, transition: { duration: 0.3 } }}
            viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className={`win ${className}`}
          >
            <div onPointerDown={(e) => { if (e.pointerType === "mouse") dc.start(e); }} className="wbar flex cursor-grab touch-pan-y select-none items-center gap-2 border-b border-white/10 px-4 py-2.5 active:cursor-grabbing">
              <Icon size={14} className="ta" />
              <span className="fd ta tglow text-[11px] font-bold tracking-[0.2em]"><Scr text={title} /></span>
              <button aria-label="Toggle window" onPointerDown={stop} onClick={() => setOpen(!open)} className="ml-auto text-zinc-300 hover:text-white">
                {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              <button aria-label="Close window" onPointerDown={stop} onClick={() => setShown(false)} className="text-zinc-300 hover:text-white"><X size={14} /></button>
            </div>
            <AnimatePresence initial={false}>
              {open && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <div className="p-4">{children}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>
        )}
      </AnimatePresence>
      {!shown && <button className="dock" onClick={() => setShown(true)}>+ RESTORE {title}</button>}
    </>
  );
}

/* ───────── GUI / CYBER DECK ───────── */
function Gui({ copy, copied }) {
  const li = "flex items-start gap-2";
  return (
    <div className="stack">
      <Win title="PROJECTS.sh" Icon={FolderGit2} className="lg:col-span-3"><Showcase copy={copy} copied={copied} /></Win>
      <Win title="SYS_INFO.exe" Icon={Cpu}>
        <div className="flex flex-wrap items-center gap-4"><Hacker /><div><h1 data-t={P.name} className="glitch fd bn-f text-3xl font-black">{P.name}</h1>
        <p className="tb mt-1 text-[13px]">{P.title}</p></div></div>
        <p className="mt-2 text-[13px] leading-relaxed text-zinc-300">{P.about}</p>
        <motion.ul initial="hidden" whileInView="visible" viewport={{ once: true }} variants={listVariants} className="mt-3 space-y-1 text-[13px]">
          <motion.li variants={listItemVariants} className={li}><Mail size={12} className="ta mt-0.5 shrink-0" /><span className="break-all">{P.email}</span></motion.li>
          <motion.li variants={listItemVariants} className={li}><Phone size={12} className="ta mt-0.5 shrink-0" />{P.phone}</motion.li>
          <motion.li variants={listItemVariants} className={li}><MapPin size={12} className="ta mt-0.5 shrink-0" />{P.loc}</motion.li>
          <motion.li variants={listItemVariants} className={li}><GraduationCap size={12} className="ta mt-0.5 shrink-0" />{P.school}</motion.li>
          <motion.li variants={listItemVariants} className={li}><GitBranch size={12} className="ta mt-0.5 shrink-0" /><a href={GH} target="_blank" rel="noreferrer" className="break-all underline">github.com/kirthanthomas</a></motion.li>
        </motion.ul>
        <div className="mt-3"><Tag><Activity size={10} className="mr-1 inline" />&gt; status: ACTIVE</Tag></div>
        <div className="stats">
          {[["CERTS", CERTS.length], ["PROJECTS", PROJ.length], ["INTERNSHIP", 1]].map(([l, n]) => (
            <div key={l}><b className="fd"><Count to={n} /></b><span>{l}</span></div>
          ))}
        </div>
      </Win>

      <Win title="GITHUB_CORE.git" Icon={GitBranch} className="lg:col-span-3"><GitHubNode /></Win>
      <Win title="SKILLS.db" Icon={Database} className="lg:col-span-2">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SKILLS.map(({ g, I, s }) => (
            <div key={g}>
              <div className="mb-2 flex items-center gap-2 text-[13px]"><I size={14} className="tb" /><b>{g}</b><span className="ta ml-auto">&gt; ACTIVE</span></div>
              {s.map(([n, v]) => <Bar key={n} n={n} v={v} />)}
            </div>
          ))}
        </div>
      </Win>

      <Win title="EXPERIENCE.log" Icon={Briefcase} className="lg:col-span-2">
        <p className="tb font-bold">{EXP.role}</p>
        <p className="text-[13px] text-zinc-300">{EXP.org}</p>
        <motion.ul initial="hidden" whileInView="visible" viewport={{ once: true }} variants={listVariants} className="mt-3 space-y-1.5 text-[13px] leading-relaxed">
          {EXP.b.map((x) => <motion.li key={x} variants={listItemVariants}><span className="ta">&gt;</span> {x}</motion.li>)}
        </motion.ul>
      </Win>

      <Win title="EDUCATION.cfg" Icon={GraduationCap}>
        <motion.ul initial="hidden" whileInView="visible" viewport={{ once: true }} variants={listVariants} className="space-y-3 text-[13px]">
          {EDU.map(([d, i, n]) => (
            <motion.li key={d} variants={listItemVariants}><p className="tb font-bold">{d}</p><p>{i}</p><p className="text-zinc-400">{n}</p></motion.li>
          ))}
        </motion.ul>
      </Win>


      <Win title="CERTS.pkg" Icon={Award} className="lg:col-span-3">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {CERTS.map(([n, i, I], idx) => (
            <motion.div key={n} className="hv cert flex gap-2 rounded border border-white/10 p-3 text-[13px]" initial={{ opacity: 0, y: 24, rotateX: -25, transformPerspective: 600 }} whileInView={{ opacity: 1, y: 0, rotateX: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.08, duration: 0.5 }}>
              <I size={16} className="ta shrink-0" />
              <div><p className="font-bold">{n}</p>{i && <p className="text-zinc-400">{i}</p>}</div>
            </motion.div>
          ))}
        </div>
      </Win>
    </div>
  );
}

/* ───────── TERMINAL / CLI ───────── */
function Cli({ turbo, setTurbo, copy, toGui }) {
  const [lines, setLines] = useState([{ k: "o", s: BOOT }]);
  const [v, setV] = useState("");
  const box = useRef(null);
  const inp = useRef(null);
  useEffect(() => { box.current.scrollTop = box.current.scrollHeight; }, [lines]);

  const CMD = {
    help: () => "about    skills    exp    projects    edu    certs    contact    github\nemail    copy my email to clipboard\nturbo    toggle turbo / self-destruct mode\ngui      switch to the dashboard\nwhoami   clear",
    about: () => P.about,
    skills: () => SKILLS.map(({ g, s }) => `[${g}] ${s.map((x) => x[0]).join(", ")}`).join("\n"),
    exp: () => `${EXP.role} @ ${EXP.org}\n` + EXP.b.map((x) => `  > ${x}`).join("\n"),
    projects: () => PROJ.map((p) => `[${p.tag}] ${p.t} (${p.sub})\n` + p.b.map((x) => `  > ${x}`).join("\n")).join("\n\n"),
    edu: () => EDU.map(([d, i, n]) => `${d}\n  ${i} | ${n}`).join("\n"),
    certs: () => CERTS.map(([n, i]) => `  [*] ${n}${i ? ` - ${i}` : ""}`).join("\n"),
    github: () => `> GITHUB_NODE: ONLINE\n> GIT_BRANCH: main\n> LAST_COMMIT: SYNCED\n> LINK: ${GH}`,
    clone: () => { navigator.clipboard?.writeText(`git clone ${GH}.git`); return `COPIED TO CLIPBOARD: git clone ${GH}.git`; },
    contact: () => `email: ${P.email}\nphone: ${P.phone}\nloc:   ${P.loc}`,
    whoami: () => `${P.name} :: ${P.title}`,
    email: () => { copy(); return `COPIED TO CLIPBOARD: ${P.email}`; },
    turbo: () => { setTurbo(!turbo); return turbo ? "turbo disengaged." : "!! TURBO ENGAGED !! particles at max velocity."; },
    gui: () => { toGui(); return ""; },
  };

  const exec = (raw) => {
    const c = raw.trim().toLowerCase();
    if (!c) return;
    if (c === "clear") return setLines([]);
    const out = c.startsWith("sudo")
      ? "kirthan is not in the sudoers file. This incident will be reported."
      : Object.hasOwn(CMD, c) ? CMD[c]() : `command not found: ${c} (try 'help')`;
    setLines((l) => [...l, { k: "i", s: c }, { k: "o", s: out }]);
  };
  const submit = (e) => { e.preventDefault(); exec(v); setV(""); };

  return (
    <div onClick={() => inp.current?.focus()} className="win">
      <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2 text-[13px]">
        <span className="h-2.5 w-2.5 rounded-full bg-red-500" /><span className="h-2.5 w-2.5 rounded-full bg-yellow-400" /><span className="h-2.5 w-2.5 rounded-full bg-green-500" />
        <span className="ta ml-2">kirthan@cyber-kernel:~</span>
      </div>
      <div className="flex flex-wrap gap-2 border-b border-white/10 p-2">
        {QUICK.map((c) => (
          <button key={c} onClick={(e) => { e.stopPropagation(); exec(c); }} className="hv rounded border border-white/20 px-2 py-0.5 text-[13px]">{c}</button>
        ))}
      </div>
      <div ref={box} className="h-[58vh] overflow-y-auto p-4 text-[14px] leading-7">
        {lines.map((l, i) =>
          l.k === "i"
            ? <div key={i}><span className="ta">kirthan@kernel:~$</span> {l.s}</div>
            : <pre key={i} className="pre-in mb-2 whitespace-pre-wrap text-zinc-100">{l.s}</pre>
        )}
        <form onSubmit={submit} className="flex items-center gap-2">
          <span className="ta">kirthan@kernel:~$</span>
          <input
            ref={inp} value={v} onChange={(e) => setV(e.target.value)} autoFocus spellCheck={false} autoComplete="off"
            aria-label="Terminal input" style={{ caretColor: "var(--a)" }}
            className="min-w-0 flex-1 bg-transparent text-white outline-none"
          />
        </form>
      </div>
    </div>
  );
}

/* ───────── ROOT ───────── */
const WORDS = ["WASTE", "NGO", "KERNEL"];
const LINES = [
  ["$ npm run dev", "> student portal online", "> logging waste activity..."],
  ["$ git commit -m 'ngo site'", "> pages: info / activities / services", "> api + database connected"],
  ["$ help", "> about skills exp projects", "> turbo: standing by"],
];

const GH = "https://github.com/kirthanthomas";
const SC = "!<>-_/[]{}=+*^?#";

/* Header text that decodes/scrambles on hover (and once on load) */
function Scr({ text }) {
  const [v, setV] = useState(text);
  const id = useRef(0);
  const run = () => {
    clearInterval(id.current);
    let i = 0;
    id.current = setInterval(() => {
      setV([...text].map((c, j) => (j < i || c === " " ? c : SC[(Math.random() * SC.length) | 0])).join(""));
      if (++i > text.length) { clearInterval(id.current); setV(text); }
    }, 40);
  };
  useEffect(() => { run(); return () => clearInterval(id.current); }, []);
  return <span onMouseEnter={run}>{v}</span>;
}

/* Holo-hacker card: neon wireframe operator with HUD visor, scan bar, 3D tilt */
function Hacker() {
  const rx = useSpring(0, { stiffness: 150, damping: 14 });
  const ry = useSpring(0, { stiffness: 150, damping: 14 });
  const px = useTransform(ry, [-18, 18], [5, -5]);
  const py = useTransform(rx, [-18, 18], [-5, 5]);
  const move = (e) => {
    const b = e.currentTarget.getBoundingClientRect();
    ry.set(((e.clientX - b.left) / b.width - 0.5) * 36);
    rx.set(-((e.clientY - b.top) / b.height - 0.5) * 36);
  };
  return (
    <div style={{ perspective: 600 }} onMouseMove={move} onMouseLeave={() => { rx.set(0); ry.set(0); }}>
      <motion.div className="holo-card" style={{ rotateX: rx, rotateY: ry }}>
        <motion.div className="holo-par" style={{ x: px, y: py }}>
          <div className="holo-br">
            <img className="holo-img base" src={OP_IMG} alt="Cyber operator portrait" draggable="false" />
            <img className="holo-img gh g1" src={OP_IMG} alt="" aria-hidden="true" draggable="false" />
            <img className="holo-img gh g2" src={OP_IMG} alt="" aria-hidden="true" draggable="false" />
            <i className="visor" />
            <i className="visor sweep" />
          </div>
        </motion.div>
        <div className="holo-bar" />
        
      </motion.div>
    </div>
  );
}

/* GitHub connector: simulated status, commit graph, hover terminal with clone command */
function GitHubNode() {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const cmd = `git clone ${GH}.git`;
  const cp = async () => {
    try { await navigator.clipboard.writeText(cmd); } catch { /* clipboard blocked */ }
    setDone(true);
    setTimeout(() => setDone(false), 2000);
  };
  return (
    <div onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <div className="git">
        <div>
          <h3 data-t="QUANTUM GIT REPOSITORY CONNECTOR" className="glitch fd ta tglow text-lg font-black">QUANTUM GIT REPOSITORY CONNECTOR</h3>
          <ul className="gst mt-3">
            <li>&gt; GITHUB_NODE: <span className="ok blink">ONLINE</span></li>
            <li>&gt; GIT_BRANCH: <b>main</b></li>
            <li>&gt; LAST_COMMIT: <b>SYNCED</b></li>
            <li>&gt; LINK: <a href={GH} target="_blank" rel="noreferrer" className="tb underline">github.com/kirthanthomas</a></li>
          </ul>
          <svg viewBox="0 0 300 50" className="ta mt-3 w-full" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M10 35H290" />
            <path className="dash" d="M70 35C85 35 90 12 110 12H190C210 12 215 35 230 35" strokeDasharray="4 6" />
            {[[10, 35], [70, 35], [110, 12], [150, 12], [190, 12], [230, 35], [290, 35]].map(([x, y], i) => (
              <circle key={i} className="gnode" cx={x} cy={y} r="5" fill="currentColor" stroke="none" style={{ animationDelay: `${i * 0.25}s` }} />
            ))}
          </svg>
        </div>
        <div className="flex flex-col justify-center gap-3">
          <a href={GH} target="_blank" rel="noreferrer" className="cta gbtn"><ExternalLink size={14} /> INITIALIZE LINK</a>
          <button onClick={() => setOpen(!open)} className="thumb">{open ? "HIDE TERMINAL" : "SHOW CLONE COMMAND"}</button>
          <AnimatePresence>
            {open && (
              <motion.div className="gterm" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                <p className="ta">kirthan@git-node:~$</p>
                <p className="break-all text-white">{cmd}<span className="blink">█</span></p>
                <button onClick={cp} className="cta gbtn mt-2">{done ? "COPIED TO CLIPBOARD" : "COPY CLONE COMMAND"}</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* Full-screen warning flash when turbo is engaged */
function Alert({ turbo }) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (!turbo) return;
    setOn(true);
    const id = setTimeout(() => setOn(false), 2200);
    return () => clearTimeout(id);
  }, [turbo]);
  return (
    <AnimatePresence>
      {on && (
        <motion.div className="alert" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.1 }}>
          <div className="alert-bar" />
          <div className="alert-txt fd"><span>WARNING</span><b>OVERCLOCK ENGAGED</b><i>SELF-DESTRUCT SEQUENCE ARMED</i></div>
          <div className="alert-bar" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* Number that counts up when it appears */
function Count({ to }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    const a = animate(0, to, { duration: 1.6, ease: "easeOut", onUpdate: (x) => setV(Math.round(x)) });
    return () => a.stop();
  }, [to]);
  return <>{v}</>;
}

/* Boot sequence shown on load (click to skip) */
const BOOT_LINES = ["BIOS v2.6 :: POST OK", "mounting /dev/portfolio ... [ OK ]", "loading resume.dat ... [ OK ]", "linking github node ... [ OK ]", "calibrating neon matrix ... [ OK ]", "ACCESS GRANTED"];
function Boot() {
  const [n, setN] = useState(0);
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (done) return;
    const lineTimer = setInterval(() => setN((current) => Math.min(current + 1, BOOT_LINES.length)), 280);
    const dismissTimer = setTimeout(() => setDone(true), 280 * (BOOT_LINES.length + 2));
    return () => {
      clearInterval(lineTimer);
      clearTimeout(dismissTimer);
    };
  }, [done]);
  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="boot"
          onClick={() => setDone(true)}
          initial={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 1.06, filter: "blur(8px)" }}
          transition={{ duration: 0.5 }}
        >
          {BOOT_LINES.slice(0, n).map((l) => <p key={l}>&gt; {l}</p>)}
          <p className="blink">█</p>
          <p className="boot-skip">click to skip</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* Project window: holo display, thumbnails, arrows */
function Showcase({ copy, copied }) {
  const [k, setK] = useState(0);
  const p = PROJ[k];
  const go = (d) => setK((k + d + PROJ.length) % PROJ.length);
  return (
    <div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={p.t}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
        >
          <h2 className="fd text-xl font-bold text-white sm:text-2xl">{p.t}</h2>
          <p className="mt-1 max-w-2xl text-[13px] text-zinc-300">{p.sub}. {p.b[0]}</p>
        </motion.div>
      </AnimatePresence>
      <div className="stage room holo">
        <div className="holo-log">{LINES[k].map((l) => <p key={l}>{l}</p>)}<span className="blink ta">█</span></div>
        <motion.div key={k} initial={{ opacity: 0, y: 30, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="fd shine holo-word">{WORDS[k]}</motion.div>
        <div className="sl2" />
        <span className="stage-pill">[{p.tag}] {p.sub}</span>
        <button onClick={copy} className="cta stage-cta">{copied ? "COPIED TO CLIPBOARD" : "COPY EMAIL"}</button>
      </div>
      <div className="mt-3 flex items-center gap-2">
        {PROJ.map((q, i) => <button key={q.t} onClick={() => setK(i)} className={`thumb ${i === k ? "on" : ""}`}>{WORDS[i]}</button>)}
        <span className="ml-auto" />
        <button aria-label="Previous project" onClick={() => go(-1)} className="arrow"><ChevronLeft size={16} /></button>
        <button aria-label="Next project" onClick={() => go(1)} className="arrow"><ChevronRight size={16} /></button>
      </div>
      <ul className="mt-3 space-y-1 text-[13px]">{p.b.map((x) => <li key={x}><span className="ta">&gt;</span> {x}</li>)}</ul>
    </div>
  );
}

/* Scroll tracker: a packet (CPU chip) travels down a rail with a live % readout */
function ScrollRail() {
  const { scrollYProgress } = useScroll();
  const sp = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });
  const pos = useTransform(sp, [0, 1], ["0%", "100%"]);
  const [pct, setPct] = useState(0);
  useEffect(() => sp.on("change", (v) => setPct(Math.round(Math.min(Math.max(v, 0), 1) * 100))), [sp]);
  return (
    <div className="rail" aria-hidden="true">
      <span className="rail-pct fd">{pct}%</span>
      <div className="rail-track">
        {Array.from({ length: 11 }, (_, i) => <i key={i} className={`tick ${pct >= i * 10 ? "on" : ""}`} style={{ top: `${i * 10}%` }} />)}
        <motion.div className="rail-fill" style={{ height: pos }} />
        <motion.div className="rail-node" style={{ top: pos }}><Cpu size={14} /></motion.div>
      </div>
      <span className="rail-left">{100 - pct}% LEFT</span>
    </div>
  );
}

function Progress() {
  const { scrollYProgress } = useScroll();
  const sx = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });
  return <motion.div style={{ scaleX: sx }} className="pbar fixed inset-x-0 top-0 z-[60] h-1 origin-left" />;
}

/* Neon dot + trailing ring; the ring swells over buttons */
function Cursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 260, damping: 26 });
  const sy = useSpring(y, { stiffness: 260, damping: 26 });
  const [hot, setHot] = useState(false);
  useEffect(() => {
    const m = (e) => { x.set(e.clientX); y.set(e.clientY); setHot(!!e.target.closest?.("button,a,input")); };
    addEventListener("mousemove", m);
    return () => removeEventListener("mousemove", m);
  }, [x, y]);
  return (
    <>
      <motion.div className="cur-dot" style={{ x, y }} />
      <motion.div className="cur-ring" animate={{ scale: hot ? 1.8 : 1 }} style={{ x: sx, y: sy }} />
    </>
  );
}

/* Drifting computer icons in the background */
const FI = [Monitor, Server, HardDrive, Keyboard, Binary, Braces, CircuitBoard, Cpu, Code2, Terminal, Database, Globe];
function FloatIcons({ turbo }) {
  const { scrollY } = useScroll();
  const py = useTransform(scrollY, [0, 3000], [0, -600]);
  const items = useMemo(() => FI.map((I, i) => ({ I, x: 4 + ((i * 83) % 90), y: 8 + ((i * 47) % 80), s: 26 + (i % 4) * 8, d: 6 + (i % 5) * 2 })), []);
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <motion.div style={{ y: py }} className="absolute inset-x-0 top-0 h-[150%]">
      {items.map(({ I, x, y, s, d }, i) => (
        <motion.div key={`${i}-${turbo}`} className="ta absolute opacity-20" style={{ left: `${x}%`, top: `${y}%` }}
          animate={{ y: [0, -24, 0], rotate: [0, 12, -12, 0] }} transition={{ duration: turbo ? d / 4 : d, repeat: Infinity, ease: "easeInOut" }}>
          <I size={s} />
        </motion.div>
      ))}
      </motion.div>
    </div>
  );
}

/* Neon block banner: solid letters glow, the 3D shadow strokes stay cyan */
function Banner() {
  return (
    <pre aria-label={P.name} className="shake overflow-x-auto text-[7px] leading-none sm:text-[12px] lg:text-[17px]">
      {ASCII.split("\n").map((ln, i) => (
        <motion.div key={i} initial={{ opacity: 0, x: -60 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 2.4 + i * 0.1, duration: 0.5 }}>{ln.split(/(█+)/).map((t, j) => <span key={j} className={j % 2 ? "bn-f" : "bn-s"}>{t}</span>)}</motion.div>
      ))}
    </pre>
  );
}

/* Matrix rain backdrop (reads --a, so turbo recolours it) */
function Rain({ turbo }) {
  const ref = useRef(null);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const c = ref.current, x = c.getContext("2d"), size = 16;
    const col = getComputedStyle(c).getPropertyValue("--a").trim() || "#b66dff";
    const chars = "01{}<>/;=$#&ABCDEF";
    let drops = [], raf;
    const fit = () => { c.width = innerWidth; c.height = innerHeight; drops = Array.from({ length: Math.ceil(c.width / size) }, () => Math.random() * -40); };
    fit();
    addEventListener("resize", fit);
    const tick = () => {
      x.fillStyle = "rgba(7,5,13,.14)";
      x.fillRect(0, 0, c.width, c.height);
      x.fillStyle = col;
      x.font = `${size}px 'JetBrains Mono', monospace`;
      drops.forEach((y, i) => {
        x.fillStyle = Math.random() < 0.12 ? "#00ff9d" : col;
        x.fillText(chars[(Math.random() * chars.length) | 0], i * size, y * size);
        drops[i] = y * size > c.height && Math.random() > 0.975 ? 0 : y + (turbo ? 2 : 0.45);
      });
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => { cancelAnimationFrame(raf); removeEventListener("resize", fit); };
  }, [turbo]);
  return <canvas ref={ref} className="pointer-events-none fixed inset-0 opacity-25" />;
}

const ROLES = ["MCA Student @ CHRIST", "Full-Stack Web Developer", "Java / JavaScript / SQL", "AWS Cloud / Cyber Security Foundations"];
function Typed() {
  const [i, setI] = useState(0);
  const [n, setN] = useState(0);
  const [del, setDel] = useState(false);
  useEffect(() => {
    const t = ROLES[i];
    const id = setTimeout(() => {
      if (!del && n < t.length) setN(n + 1);
      else if (!del) setDel(true);
      else if (n > 0) setN(n - 1);
      else { setDel(false); setI((i + 1) % ROLES.length); }
    }, !del && n === t.length ? 1400 : del ? 35 : 70);
    return () => clearTimeout(id);
  }, [n, del, i]);
  return <span className="fd tb tglow">{ROLES[i].slice(0, n)}<span className="blink">█</span></span>;
}

/* Simulated system gauges (decorative) */
function Hud({ turbo }) {
  const [v, setV] = useState([12, 34]);
  useEffect(() => {
    const id = setInterval(() => setV([turbo ? 95 + Math.random() * 5 : 8 + Math.random() * 25, turbo ? 99 : 30 + Math.random() * 15]), 900);
    return () => clearInterval(id);
  }, [turbo]);
  return ["CPU", "MEM"].map((k, i) => (
    <span key={k} className="flex items-center gap-1.5 rounded-md border border-white/15 bg-black/40 px-2.5 py-2 text-[12px]">
      <Cpu size={12} className="tb" />{k} <b className="ta">{v[i].toFixed(0)}%</b>
    </span>
  ));
}

export default function Portfolio() {
  const [mode, setMode] = useState("gui");
  const [turbo, setTurbo] = useState(false);
  const [copied, setCopied] = useState(false);
  const [rk, setRk] = useState(0); // bump to reset dragged windows
  const up = useUptime();

  const copy = async () => {
    try { await navigator.clipboard.writeText(P.email); } catch { /* clipboard blocked */ }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div onMouseMove={(e) => { e.currentTarget.style.setProperty("--mx", e.clientX + "px"); e.currentTarget.style.setProperty("--my", e.clientY + "px"); }} className={`cy ${turbo ? "turbo" : ""} relative min-h-screen overflow-x-hidden bg-[#07050d] text-[15px] text-zinc-100`}>
      <style>{CSS}</style>
      <Cursor />
      <Progress />
      <ScrollRail />
      <div className="radar" aria-hidden="true">{[[62, 24, 0], [30, 60, 1], [70, 68, 2]].map(([l, t, d]) => <i key={d} style={{ left: `${l}%`, top: `${t}%`, animationDelay: `${d}s` }} />)}</div>
      <Alert turbo={turbo} />
      <Boot />
      <Rain turbo={turbo} />
      <div className="aurora pointer-events-none fixed inset-0" />
      <div className="spot pointer-events-none fixed inset-0" />
      <div className="grid-bg pointer-events-none fixed inset-0" />
      <FloatIcons turbo={turbo} />
      <Particles turbo={turbo} />
      <div className="crt pointer-events-none fixed inset-0 z-50" />

      <div style={{ paddingRight: "clamp(1rem, 4.5vw, 4rem)" }} className="ca relative z-10 mx-auto max-w-6xl p-4 pb-20 sm:p-6">
        <header className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <Banner />
            <p className="mt-4 text-[15px]"><span className="ta">root@kirthan-kernel:~$</span> <Typed /></p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 rounded border border-white/20 px-2 py-1.5 text-[13px]"><Activity size={12} className="tb" />UPTIME {up}</span>
            <Hud turbo={turbo} />
            <Btn on={mode === "gui"} onClick={() => setMode("gui")}><LayoutGrid size={14} />GUI</Btn>
            <Btn on={mode === "cli"} onClick={() => setMode("cli")}><Terminal size={14} />TERMINAL</Btn>
            <Btn on={turbo} onClick={() => setTurbo(!turbo)}>
              {turbo ? <Skull size={14} /> : <Zap size={14} />}{turbo ? "ABORT TURBO" : "SELF-DESTRUCT / TURBO"}
            </Btn>
            <Btn on={copied} onClick={copy}>
              {copied ? <Check size={14} /> : <Copy size={14} />}{copied ? "COPIED TO CLIPBOARD" : "COPY EMAIL"}
            </Btn>
            {mode === "gui" && <Btn onClick={() => setRk(rk + 1)}><RotateCcw size={14} />RESET</Btn>}
          </div>
        </header>

        {turbo && (
          <div className="blink ta ba mb-4 rounded border p-2 text-center text-[13px]">
            !! SELF-DESTRUCT SEQUENCE ARMED. JUST KIDDING. PARTICLES AT MAX VELOCITY !!
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.main key={mode} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            {mode === "gui"
              ? <Gui key={rk} copy={copy} copied={copied} />
              : <Cli turbo={turbo} setTurbo={setTurbo} copy={copy} toGui={() => setMode("gui")} />}
          </motion.main>
        </AnimatePresence>
      </div>

      {/* certification marquee */}
      <div className="ba relative z-20 mt-6 w-full overflow-hidden border-y bg-black/85 py-2 text-[13px]">
        <div className="mq flex w-max gap-10 whitespace-nowrap">
          {[...CERTS, ...CERTS].map(([n], i) => (
            <span key={i} className="tb flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-0.5"><Award size={12} />{n}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* Operator portrait (embedded, so the component stays a single file) */
const OP_IMG = "data:image/webp;base64,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";
