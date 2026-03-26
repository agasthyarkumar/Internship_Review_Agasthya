import { useState, useEffect, useRef } from "react";

const slides = [
  { id: 1, type: "cover" },
  { id: 2, type: "toc" },
  { id: 3, type: "overview" },
  { id: 4, type: "introduction" },
  { id: 5, type: "problem" },
  { id: 6, type: "methodology" },
  { id: 7, type: "experimentation" },
  { id: 8, type: "results1" },
  { id: 9, type: "results2" },
];

const ACCENT = "#C8A96E";
const DARK = "#0D1B2A";
const MID = "#1A2E42";
const LIGHT_TEXT = "#E8E8E8";
const MUTED = "#8A9BB0";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Source+Sans+3:wght@300;400;500;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Source Sans 3', sans-serif;
    background: ${DARK};
    color: ${LIGHT_TEXT};
    overflow-x: hidden;
  }

  .nav {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 40px;
    background: rgba(13,27,42,0.92);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(200,169,110,0.15);
  }

  .nav-logo {
    font-family: 'Playfair Display', serif;
    font-size: 13px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: ${ACCENT};
  }

  .nav-dots {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .nav-dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    background: ${MUTED};
    cursor: pointer;
    transition: all 0.3s;
    border: none;
    padding: 0;
  }

  .nav-dot.active {
    background: ${ACCENT};
    transform: scale(1.4);
  }

  .nav-counter {
    font-size: 12px;
    color: ${MUTED};
    letter-spacing: 1px;
  }

  .slide-container {
    scroll-snap-type: y mandatory;
    overflow-y: scroll;
    height: 100vh;
  }

  .slide {
    scroll-snap-align: start;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 100px 80px 60px;
    position: relative;
    overflow: hidden;
  }

  .slide-label {
    font-size: 11px;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: ${ACCENT};
    margin-bottom: 16px;
    font-weight: 600;
  }

  .slide-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2rem, 4vw, 3.2rem);
    font-weight: 700;
    line-height: 1.15;
    color: #fff;
    margin-bottom: 32px;
  }

  .slide-body {
    font-size: 16px;
    line-height: 1.75;
    color: ${LIGHT_TEXT};
    max-width: 820px;
  }

  /* Decorative corner */
  .corner-deco {
    position: absolute;
    top: 80px; right: 80px;
    width: 120px; height: 120px;
    border-top: 2px solid rgba(200,169,110,0.25);
    border-right: 2px solid rgba(200,169,110,0.25);
  }

  /* Footer */
  .slide-footer {
    position: absolute;
    bottom: 28px; left: 80px; right: 80px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 11px;
    color: ${MUTED};
    letter-spacing: 1px;
    border-top: 1px solid rgba(255,255,255,0.06);
    padding-top: 16px;
  }

  /* ── COVER ── */
  .cover {
    background: ${DARK};
    align-items: center;
    text-align: center;
  }

  .cover-badge {
    display: inline-block;
    border: 1px solid ${ACCENT};
    color: ${ACCENT};
    font-size: 11px;
    letter-spacing: 3px;
    text-transform: uppercase;
    padding: 6px 20px;
    margin-bottom: 28px;
  }

  .cover-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2.4rem, 5vw, 4rem);
    font-weight: 700;
    line-height: 1.1;
    color: #fff;
    margin-bottom: 12px;
  }

  .cover-sub {
    font-size: 15px;
    color: ${ACCENT};
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-bottom: 48px;
  }

  .cover-divider {
    width: 60px;
    height: 2px;
    background: ${ACCENT};
    margin: 0 auto 36px;
  }

  .cover-meta {
    font-size: 14px;
    color: ${MUTED};
    line-height: 2;
  }

  .cover-meta strong {
    color: ${LIGHT_TEXT};
    font-weight: 500;
  }

  .cover-grid-bg {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(200,169,110,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(200,169,110,0.04) 1px, transparent 1px);
    background-size: 60px 60px;
    pointer-events: none;
  }

  .cover-vignette {
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at center, transparent 40%, ${DARK} 100%);
    pointer-events: none;
  }

  /* ── TOC ── */
  .toc-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin-top: 16px;
    max-width: 900px;
  }

  .toc-item {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-left: 3px solid ${ACCENT};
    padding: 20px 22px;
    transition: background 0.2s;
  }

  .toc-num {
    font-size: 28px;
    font-family: 'Playfair Display', serif;
    color: rgba(200,169,110,0.35);
    font-weight: 700;
    line-height: 1;
    margin-bottom: 8px;
  }

  .toc-name {
    font-size: 14px;
    font-weight: 600;
    color: ${LIGHT_TEXT};
    letter-spacing: 0.5px;
  }

  /* ── TABLE ── */
  .info-table {
    width: 100%;
    max-width: 740px;
    border-collapse: collapse;
    margin-top: 8px;
  }

  .info-table tr {
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }

  .info-table td {
    padding: 16px 20px;
    font-size: 15px;
    vertical-align: top;
  }

  .info-table td:first-child {
    width: 200px;
    font-size: 11px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: ${ACCENT};
    font-weight: 600;
    padding-left: 0;
  }

  .info-table td:last-child {
    color: ${LIGHT_TEXT};
  }

  /* ── BULLET LIST ── */
  .bullet-list {
    list-style: none;
    max-width: 800px;
  }

  .bullet-list li {
    display: flex;
    gap: 16px;
    align-items: flex-start;
    padding: 14px 0;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    font-size: 15.5px;
    color: ${LIGHT_TEXT};
    line-height: 1.65;
  }

  .bullet-list li::before {
    content: '';
    display: block;
    min-width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${ACCENT};
    margin-top: 9px;
  }

  /* ── PROBLEM ── */
  .problem-cards {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 28px;
    max-width: 900px;
    margin-top: 8px;
  }

  .problem-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    padding: 32px 28px;
    position: relative;
  }

  .problem-card.solution {
    border-color: rgba(200,169,110,0.3);
    background: rgba(200,169,110,0.04);
  }

  .problem-card-label {
    font-size: 10px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: ${ACCENT};
    margin-bottom: 16px;
    font-weight: 600;
  }

  .problem-card p {
    font-size: 15px;
    line-height: 1.75;
    color: ${LIGHT_TEXT};
  }

  /* ── METHODOLOGY ── */
  .method-steps {
    display: flex;
    flex-direction: column;
    gap: 0;
    max-width: 720px;
    margin-top: 8px;
  }

  .method-step {
    display: flex;
    gap: 24px;
    align-items: flex-start;
    padding: 20px 0;
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }

  .step-num {
    font-family: 'Playfair Display', serif;
    font-size: 32px;
    color: rgba(200,169,110,0.3);
    font-weight: 700;
    line-height: 1;
    min-width: 40px;
    margin-top: 2px;
  }

  .step-content strong {
    display: block;
    font-size: 15px;
    font-weight: 600;
    color: #fff;
    margin-bottom: 4px;
  }

  .step-content span {
    font-size: 14px;
    color: ${MUTED};
    line-height: 1.6;
  }

  /* ── RESULTS ── */
  .results-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    max-width: 900px;
    margin-top: 8px;
  }

  .result-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    padding: 0;
    overflow: hidden;
  }

  .result-img {
    width: 100%;
    height: 220px;
    object-fit: cover;
    display: block;
    background: ${MID};
  }

  .result-img-placeholder {
    width: 100%;
    height: 220px;
    background: linear-gradient(135deg, ${MID} 0%, rgba(200,169,110,0.08) 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 10px;
    color: ${MUTED};
    font-size: 13px;
    letter-spacing: 1px;
  }

  .result-img-placeholder svg {
    opacity: 0.35;
  }

  .result-caption {
    padding: 16px 20px;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.5px;
    color: ${ACCENT};
    text-transform: uppercase;
    letter-spacing: 1.5px;
    font-size: 11px;
  }

  .full-result {
    max-width: 680px;
    margin-top: 8px;
  }

  .full-result .result-card {
    height: auto;
  }

  .full-result .result-img-placeholder {
    height: 320px;
  }
`;

function Footer({ label }) {
  return (
    <div className="slide-footer">
      <span>Dept of CSE (AI &amp; ML), SOE — Dayananda Sagar University</span>
      <span>{label}</span>
    </div>
  );
}

function CoverSlide() {
  return (
    <div className="slide cover">
      <div className="cover-grid-bg" />
      <div className="cover-vignette" />
      <div className="cover-badge">Internship Review 1</div>
      <div className="cover-title">
        Taneira<br />
        <span style={{ color: ACCENT }}>Supply Chain</span><br />
        Management
      </div>
      <div className="cover-sub">AI-Powered Data Processing System</div>
      <div className="cover-divider" />
      <div className="cover-meta">
        <div><strong>Presented By:</strong> Agasthya R Kumar (ENG22AM0001)</div>
        <div><strong>External Guide:</strong> Vaideeswaran Seethuraman</div>
        <div><strong>Internal Guide:</strong> Dr. Jayavrinda Vrindavanam V</div>
        <div style={{ marginTop: 8 }}>Dayananda Sagar University · School of Engineering</div>
        <div>Department of Computer Science &amp; Engineering (AI &amp; ML)</div>
      </div>
    </div>
  );
}

function TocSlide() {
  const items = [
    { num: "01", name: "Internship Overview" },
    { num: "02", name: "Introduction" },
    { num: "03", name: "Problem Definition" },
    { num: "04", name: "Methodology" },
    { num: "05", name: "Experimentation" },
    { num: "06", name: "Results" },
  ];
  return (
    <div className="slide">
      <div className="corner-deco" />
      <div className="slide-label">Navigation</div>
      <div className="slide-title">Table of Contents</div>
      <div className="toc-grid">
        {items.map((i) => (
          <div className="toc-item" key={i.num}>
            <div className="toc-num">{i.num}</div>
            <div className="toc-name">{i.name}</div>
          </div>
        ))}
      </div>
      <Footer label="02 / 09" />
    </div>
  );
}

function OverviewSlide() {
  const rows = [
    ["Company Name", "Divum Corporate Services Pvt Ltd"],
    ["Duration", "12 Months"],
    ["Project Name", "Taneira"],
    ["Tech Stack", "MERN · Python-FastAPI · Agentic AI · RAG"],
    ["External Guide", "Vaideeswaran Seethuraman"],
  ];
  return (
    <div className="slide">
      <div className="corner-deco" />
      <div className="slide-label">01 — Internship Overview</div>
      <div className="slide-title">Project at a Glance</div>
      <table className="info-table">
        <tbody>
          {rows.map(([k, v]) => (
            <tr key={k}>
              <td>{k}</td>
              <td>{v}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Footer label="03 / 09" />
    </div>
  );
}

function IntroSlide() {
  const bullets = [
    "Application Developer at Divum Corporate Services Pvt Ltd, focused on full-stack development and data-driven systems.",
    "Experience building enterprise dashboards, mobile/web applications, and backend data services.",
    "Work involves data analytics pipelines, reporting systems, and API integrations.",
    "Regularly troubleshoot and optimize database queries, data aggregation pipelines, and backend services.",
    "Involved in automation of data processing workflows and reporting tools for business insights.",
  ];
  return (
    <div className="slide">
      <div className="corner-deco" />
      <div className="slide-label">02 — Introduction</div>
      <div className="slide-title">Role &amp; Responsibilities</div>
      <ul className="bullet-list">
        {bullets.map((b, i) => <li key={i}>{b}</li>)}
      </ul>
      <Footer label="04 / 09" />
    </div>
  );
}

function ProblemSlide() {
  return (
    <div className="slide">
      <div className="corner-deco" />
      <div className="slide-label">03 — Problem Definition</div>
      <div className="slide-title">Challenge &amp; Solution</div>
      <div className="problem-cards">
        <div className="problem-card">
          <div className="problem-card-label">Problem</div>
          <p>
            Organizations generate large amounts of data, but inefficient data processing and complex database queries make it difficult to extract meaningful insights quickly.
          </p>
        </div>
        <div className="problem-card solution">
          <div className="problem-card-label">Solution</div>
          <p>
            Develop automated data processing systems and optimized queries to generate accurate reports and dashboards, enabling faster and more efficient decision-making.
          </p>
        </div>
      </div>
      <Footer label="05 / 09" />
    </div>
  );
}

function MethodSlide() {
  const steps = [
    { title: "Data Ingestion", desc: "Raw supply chain data collected from Taneira's MongoDB database." },
    { title: "Query Optimization", desc: "Complex Mongo queries designed and optimized for aggregation and reporting." },
    { title: "Pipeline Automation", desc: "FastAPI + Python Pandas pipelines replace manual data workflows." },
    { title: "Dashboard Generation", desc: "High-level insights surfaced via interactive dashboards for stakeholders." },
    { title: "Mobile Application", desc: "Weaver & Quality apps built in React Native for end-user access." },
  ];
  return (
    <div className="slide">
      <div className="corner-deco" />
      <div className="slide-label">04 — Methodology</div>
      <div className="slide-title">Workflow &amp; Approach</div>
      <div className="method-steps">
        {steps.map((s, i) => (
          <div className="method-step" key={i}>
            <div className="step-num">0{i + 1}</div>
            <div className="step-content">
              <strong>{s.title}</strong>
              <span>{s.desc}</span>
            </div>
          </div>
        ))}
      </div>
      <Footer label="06 / 09" />
    </div>
  );
}

function ExperimentSlide() {
  const bullets = [
    "The complete workflow was initially built using Agentic AI — Param's AI Studio.",
    "Due to complexity in data and MongoDB queries, the project was migrated to Python Pandas and FastAPI.",
    "The same workflow was used to create dashboards with high-level business insights.",
    "End-user applications (Weaver & Quality) were developed using React Native.",
  ];
  return (
    <div className="slide">
      <div className="corner-deco" />
      <div className="slide-label">05 — Experimentation</div>
      <div className="slide-title">Iterations &amp; Findings</div>
      <ul className="bullet-list">
        {bullets.map((b, i) => <li key={i}>{b}</li>)}
      </ul>
      <Footer label="07 / 09" />
    </div>
  );
}

function ImagePlaceholder({ label, path }) {
  return (
    <div className="result-img-placeholder">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="M21 15l-5-5L5 21" />
      </svg>
      <span>Place image here:</span>
      <span style={{ fontSize: 11, opacity: 0.6 }}>{path}</span>
    </div>
  );
}

function Results1Slide() {
  return (
    <div className="slide">
      <div className="corner-deco" />
      <div className="slide-label">06 — Results</div>
      <div className="slide-title">Dashboard Outputs</div>
      <div className="results-grid">
        <div className="result-card">
          <ImagePlaceholder label="Document Count Dashboard" path="src/assets/images/doc-count-dashboard.png" />
          <div className="result-caption">Document Count Dashboard</div>
        </div>
        <div className="result-card">
          <ImagePlaceholder label="PO Wise Dashboard" path="src/assets/images/po-wise-dashboard.png" />
          <div className="result-caption">PO Wise Dashboard</div>
        </div>
      </div>
      <Footer label="08 / 09" />
    </div>
  );
}

function Results2Slide() {
  return (
    <div className="slide">
      <div className="corner-deco" />
      <div className="slide-label">06 — Results</div>
      <div className="slide-title">Param's AI Studio</div>
      <div className="full-result">
        <div className="result-card">
          <ImagePlaceholder label="Param's AI Studio" path="src/assets/images/params-ai-studio.png" />
          <div className="result-caption">Agentic AI — Param's AI Studio Interface</div>
        </div>
      </div>
      <Footer label="09 / 09" />
    </div>
  );
}

const SLIDE_COMPONENTS = [
  CoverSlide,
  TocSlide,
  OverviewSlide,
  IntroSlide,
  ProblemSlide,
  MethodSlide,
  ExperimentSlide,
  Results1Slide,
  Results2Slide,
];

export default function Presentation() {
  const [active, setActive] = useState(0);
  const containerRef = useRef(null);
  const slideRefs = useRef([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const height = container.clientHeight;
      const idx = Math.round(scrollTop / height);
      setActive(Math.min(Math.max(idx, 0), SLIDE_COMPONENTS.length - 1));
    };
    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const goTo = (i) => {
    const container = containerRef.current;
    if (!container) return;
    container.scrollTo({ top: i * container.clientHeight, behavior: "smooth" });
  };

  return (
    <>
      <style>{styles}</style>
      <nav className="nav">
        <div className="nav-logo">Taneira · SCM</div>
        <div className="nav-dots">
          {SLIDE_COMPONENTS.map((_, i) => (
            <button
              key={i}
              className={`nav-dot${active === i ? " active" : ""}`}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
        <div className="nav-counter">{String(active + 1).padStart(2, "0")} / {String(SLIDE_COMPONENTS.length).padStart(2, "0")}</div>
      </nav>

      <div className="slide-container" ref={containerRef}>
        {SLIDE_COMPONENTS.map((SlideComp, i) => (
          <div key={i} ref={(el) => (slideRefs.current[i] = el)}>
            <SlideComp />
          </div>
        ))}
      </div>
    </>
  );
}