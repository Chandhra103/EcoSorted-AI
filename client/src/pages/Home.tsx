import { useMemo, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BatteryWarning,
  BookOpenText,
  Camera,
  Check,
  ChevronDown,
  CircleHelp,
  ClipboardCheck,
  Cloud,
  Cpu,
  Droplets,
  ExternalLink,
  FileText,
  ImagePlus,
  Leaf,
  LockKeyhole,
  Menu,
  Recycle,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  TriangleAlert,
  UsersRound,
  Wind,
  Upload,
  X,
  Zap,
} from "lucide-react";
import {
  categoryGuides,
  categoryMeta,
  classifyWaste,
  classifyGuidedWaste,
  classifyImageFilename,
  quickQueries,
  type GuidedCondition,
  type GuidedMaterial,
  type ClassificationResult,
  type WasteCategory,
} from "@/lib/classifier";

const iconForCategory: Record<WasteCategory, typeof Leaf> = {
  Wet: Leaf,
  Dry: Recycle,
  "E-Waste": Cpu,
  Hazardous: TriangleAlert,
};

const navItems = [
  { label: "Classify", href: "#classify" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Impact", href: "#impact" },
];

function LogoMark() {
  return (
    <div className="logo-mark" aria-hidden="true">
      <Leaf size={21} strokeWidth={2.3} />
      <span />
    </div>
  );
}

function Pill({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "green" | "orange" }) {
  return <span className={`pill pill-${tone}`}>{children}</span>;
}

function CategoryBadge({ category }: { category: WasteCategory }) {
  const meta = categoryMeta[category];
  const Icon = iconForCategory[category];
  return (
    <span className="category-badge" style={{ color: meta.color, background: meta.soft }}>
      <Icon size={14} strokeWidth={2.2} />
      {meta.label}
    </span>
  );
}

function ResultCard({ result, onReset }: { result: ClassificationResult; onReset: () => void }) {
  const meta = categoryMeta[result.category];
  const Icon = iconForCategory[result.category];
  return (
    <section className="result-card" style={{ "--result-color": meta.color, "--result-soft": meta.soft } as React.CSSProperties} aria-live="polite">
      <div className="result-topline">
        <span className="eyebrow"><span className="pulse-dot" /> Classification ready</span>
        <button className="text-button" onClick={onReset}>Clear <X size={14} /></button>
      </div>
      <div className="result-heading">
        <div className="result-icon"><Icon size={30} strokeWidth={1.9} /></div>
        <div>
          <div className="result-label"><span>Best match</span><CategoryBadge category={result.category} /></div>
          <h2>{result.title}</h2>
          <p>{result.summary}</p>
        </div>
        <div className="confidence">
          <strong>{result.confidence}%</strong>
          <span>confidence</span>
        </div>
      </div>
      <div className="confidence-track" aria-label={`${result.confidence}% confidence`}><span style={{ width: `${result.confidence}%` }} /></div>
      <div className="result-grid">
        <div className="result-block">
          <div className="block-heading"><span className="step-number">01</span><div><span>Prep it</span><strong>Two simple steps</strong></div></div>
          <ol className="step-list">
            {result.steps.map((step) => <li key={step}><span><Check size={14} /></span>{step}</li>)}
          </ol>
        </div>
        <div className="result-block safety-block">
          <div className="block-heading"><span className="step-number safety">!</span><div><span>Keep it safe</span><strong>Before you drop it off</strong></div></div>
          <p>{result.safety}</p>
          <div className="dropoff"><ExternalLink size={14} /><span>{result.dropoff}</span></div>
        </div>
      </div>
      <div className="result-footer"><span>Matched to <strong>{result.matched}</strong> in the local rules library</span><span className="privacy-note"><LockKeyhole size={13} /> no query stored</span></div>
    </section>
  );
}

function ArchitectureDiagram() {
  const nodes = [
    { icon: Search, title: "Your item", body: "Text or quick select", tone: "mint" },
    { icon: BookOpenText, title: "Rules library", body: "25+ local matches", tone: "sky" },
    { icon: Cpu, title: "AI classifier", body: "Prompt + confidence", tone: "lilac" },
    { icon: ShieldCheck, title: "Safety filter", body: "Guardrails first", tone: "peach" },
  ];
  return (
    <div className="architecture-wrap">
      <div className="architecture-label"><span className="live-line" /> real-time flow</div>
      <div className="architecture-flow">
        {nodes.map((node, index) => {
          const Icon = node.icon;
          return <div className="flow-step" key={node.title}>
            <div className={`flow-icon ${node.tone}`}><Icon size={21} /></div>
            <div><strong>{node.title}</strong><span>{node.body}</span></div>
            {index < nodes.length - 1 && <ArrowRight className="flow-arrow" size={17} />}
          </div>;
        })}
      </div>
      <div className="architecture-output"><Sparkles size={16} /><span>Clear answer with category, 2-step prep & practical drop-off advice</span></div>
    </div>
  );
}

function GuidedWizard({ onClose, onComplete }: { onClose: () => void; onComplete: (result: ClassificationResult, label: string) => void }) {
  const [step, setStep] = useState<1 | 2>(1);
  const [material, setMaterial] = useState<GuidedMaterial | null>(null);
  const materialOptions: Array<{ value: GuidedMaterial; icon: typeof Leaf; label: string; hint: string }> = [
    { value: "organic", icon: Leaf, label: "Organic / food", hint: "Peels, scraps, garden matter" },
    { value: "packaging", icon: Recycle, label: "Plastic / paper", hint: "Bottles, boxes, wrappers" },
    { value: "electronic", icon: Cpu, label: "Electronic / metal", hint: "Devices, cables, batteries" },
  ];
  const conditionOptions: Array<{ value: GuidedCondition; icon: typeof Leaf; label: string; hint: string }> = [
    { value: "clean", icon: Sparkles, label: "Clean / dry", hint: "Ready to recover or reuse" },
    { value: "wet", icon: Droplets, label: "Greasy / wet", hint: "Food or liquid residue" },
    { value: "dangerous", icon: BatteryWarning, label: "Dangerous / battery-powered", hint: "Sharp, toxic, hot, or powered" },
  ];
  function chooseCondition(condition: GuidedCondition) {
    if (!material) return;
    onComplete(classifyGuidedWaste(material, condition), `${material} · ${condition}`);
  }
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="wizard-modal" role="dialog" aria-modal="true" aria-labelledby="wizard-title">
        <div className="wizard-topline"><span className="eyebrow"><CircleHelp size={14} /> Guided identification</span><button className="icon-button" onClick={onClose} aria-label="Close wizard"><X size={18} /></button></div>
        <div className="wizard-progress"><span className={step >= 1 ? "active" : ""} /><span className={step >= 2 ? "active" : ""} /></div>
        <div className="wizard-copy"><span>Question {step} of 2</span><h2 id="wizard-title">{step === 1 ? "What is it mostly made of?" : "What condition is it in?"}</h2><p>{step === 1 ? "No item name needed — just choose the closest material family." : "This helps us route it to the safest stream."}</p></div>
        <div className="wizard-options">
          {(step === 1 ? materialOptions : conditionOptions).map((option) => {
            const Icon = option.icon;
            return <button className="wizard-option" key={option.value} onClick={() => step === 1 ? (setMaterial(option.value as GuidedMaterial), setStep(2)) : chooseCondition(option.value as GuidedCondition)}><span className="wizard-option-icon"><Icon size={20} /></span><span><strong>{option.label}</strong><small>{option.hint}</small></span><ArrowRight size={16} /></button>;
          })}
        </div>
        {step === 2 && <button className="wizard-back" onClick={() => setStep(1)}>← Change material</button>}
        <div className="wizard-foot"><LockKeyhole size={13} /> Your answers stay in this browser session.</div>
      </div>
    </div>
  );
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageName, setImageName] = useState("");
  const [imageScanning, setImageScanning] = useState(false);

  const queryLabel = useMemo(() => query.trim() ? `Classify “${query.trim()}”` : "Classify my item", [query]);

  function submitQuery(value = query) {
    const classification = classifyWaste(value);
    setQuery(value);
    setResult(classification);
    window.setTimeout(() => document.getElementById("result")?.scrollIntoView({ behavior: "smooth", block: "center" }), 30);
  }

  function handleImage(file?: File) {
    if (!file) return;
    setImageName(file.name);
    setImagePreview(URL.createObjectURL(file));
    setImageScanning(true);
    window.setTimeout(() => {
      setImageScanning(false);
      const classification = classifyImageFilename(file.name);
      setQuery(file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "));
      setResult(classification);
      window.setTimeout(() => document.getElementById("result")?.scrollIntoView({ behavior: "smooth", block: "center" }), 30);
    }, 650);
  }

  function handleGuidedResult(guidedResult: ClassificationResult, label: string) {
    setWizardOpen(false);
    setQuery(`Guided sort: ${label}`);
    setResult(guidedResult);
    window.setTimeout(() => document.getElementById("result")?.scrollIntoView({ behavior: "smooth", block: "center" }), 30);
  }

  function clearResult() {
    setQuery("");
    setResult(null);
    setImagePreview(null);
    setImageName("");
  }

  function copyResult() {
    if (!result) return;
    navigator.clipboard?.writeText(`${result.title} — ${categoryMeta[result.category].label}. ${result.summary} ${result.safety}`);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="EcoSorted AI home"><LogoMark /><span>EcoSorted <em>AI</em></span></a>
        <nav className={`site-nav ${menuOpen ? "is-open" : ""}`}>
          {navItems.map((item) => <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>{item.label}</a>)}
          <a href="#guides" onClick={() => setMenuOpen(false)}>Waste guide <ArrowUpRight size={14} /></a>
        </nav>
        <div className="header-actions">
          <span className="program-badge"><span className="ibm-dot" /> IBM SkillsBuild</span>
          <a className="impact-link" href="#impact">Our impact <ArrowUpRight size={14} /></a>
          <button className="mobile-menu" aria-label={menuOpen ? "Close menu" : "Open menu"} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={19} /> : <Menu size={19} />}</button>
        </div>
      </header>

      <main id="top">
        <section className="hero-section">
          <div className="hero-noise" />
          <div className="hero-content">
            <div className="hero-copy">
              <Pill tone="green"><span className="pill-spark"><Sparkles size={12} /></span> Made for everyday decisions</Pill>
              <h1>Waste less.<br /><span>Sort smarter.</span></h1>
              <p className="hero-lede">Confused by a battery, a greasy pizza box, or an old phone? Ask EcoSorted and get a clear next step in seconds.</p>
              <div className="hero-proof"><div className="avatar-stack"><span>AK</span><span>RM</span><span>JD</span><span>+</span></div><span>Built for households, campuses & communities</span></div>
            </div>
            <div className="hero-art" aria-hidden="true">
              <div className="orbit orbit-one" /><div className="orbit orbit-two" />
              <div className="floating-leaf leaf-one"><Leaf size={20} /></div>
              <div className="floating-leaf leaf-two"><Leaf size={13} /></div>
              <div className="hero-orb"><div className="orb-inner"><Recycle size={50} strokeWidth={1.25} /><span>12</span><small>SDG</small></div></div>
              <div className="art-caption caption-one"><strong>4 streams</strong><span>one clearer system</span></div>
              <div className="art-caption caption-two"><span className="mini-line" /> simple by design</div>
            </div>
          </div>
          <div className="hero-scroll"><span>Scroll to explore</span><ChevronDown size={16} /></div>
        </section>

        <section className="classifier-section section-shell" id="classify">
          <div className="section-kicker"><span>01</span><span className="kicker-line" /><span>Ask the sorter</span></div>
          <div className="section-intro split-intro">
            <div><h2>What are you trying<br /><i>to sort today?</i></h2></div>
            <p>Describe an item in your own words. Our lightweight local AI matches it to a waste rule, then gives you the safest next step.</p>
          </div>
          <div className="query-card">
            <div className="input-method-label"><span>Choose how you want to identify it</span><span className="privacy-note"><LockKeyhole size={13} /> browser-only prototype</span></div>
            <div className="input-methods-grid">
              <div className="text-method">
                <div className="query-input-wrap"><Search size={20} /><input value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => event.key === "Enter" && submitQuery()} placeholder="Try “old smartphone” or “soiled pizza box”" aria-label="Describe an item to classify" /><span className="input-hint">↵</span></div>
                <button className="classify-button" onClick={() => submitQuery()}>{queryLabel}<ArrowRight size={17} /></button>
              </div>
              <label className={`image-dropzone ${imageScanning ? "is-scanning" : ""}`} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); handleImage(event.dataTransfer.files[0]); }}>
                <input type="file" accept="image/*" capture="environment" onChange={(event) => handleImage(event.target.files?.[0])} />
                {imagePreview ? <img src={imagePreview} alt="Selected waste item preview" /> : <span className="image-drop-icon"><Camera size={21} /></span>}
                <span><strong>{imageScanning ? "Scanning visual clues…" : imageName || "Upload image / take photo"}</strong><small>{imageScanning ? "Matching object hints to the rules library" : "Drag & drop or tap to scan an item"}</small></span>
                <Upload size={16} className="image-upload-arrow" />
              </label>
            </div>
            <div className="input-divider"><span>or choose without typing</span></div>
            <div className="quick-inputs">
              <button className="wizard-launch" onClick={() => setWizardOpen(true)}><CircleHelp size={17} /><span><strong>Help me identify</strong><small>2-question guided wizard</small></span><ArrowRight size={16} /></button>
              <div className="quick-chip-list">{[
                { label: "Greasy pizza box", query: "greasy pizza box", icon: FileText },
                { label: "Old battery", query: "broken lithium battery", icon: BatteryWarning },
                { label: "Broken phone", query: "old smartphone", icon: Cpu },
                { label: "Food scraps", query: "food scraps", icon: Leaf },
                { label: "Plastic bottle", query: "plastic bottle", icon: Droplets },
              ].map((chip) => { const Icon = chip.icon; return <button className="quick-chip" key={chip.label} onClick={() => submitQuery(chip.query)}><Icon size={15} /><span>{chip.label}</span></button>; })}</div>
            </div>
          </div>
          {result && <div id="result" className="result-anchor"><ResultCard result={result} onReset={clearResult} /><button className="share-result" onClick={copyResult}>{copied ? <><Check size={14} /> Copied to clipboard</> : <><ClipboardCheck size={14} /> Copy this guidance</>}</button></div>}
          {!result && <div className="empty-hint"><div className="empty-icon"><Target size={17} /></div><span>Start with a tricky item. We’ll do the sorting work for you.</span><span className="empty-rule" /></div>}
        </section>

        <section className="guides-section section-shell" id="guides">
          <div className="section-kicker"><span>02</span><span className="kicker-line" /><span>The four streams</span></div>
          <div className="section-intro"><h2>A place for <i>everything.</i></h2><p>When waste is sorted at the source, more of it becomes a resource. Start with the stream, then check the local rules.</p></div>
          <div className="guide-grid">
            {categoryGuides.map((guide, index) => {
              const Icon = iconForCategory[guide.category];
              const meta = categoryMeta[guide.category];
              return <button className="guide-card" key={guide.category} onClick={() => submitQuery(guide.examples[0])} style={{ "--guide-color": meta.color, "--guide-soft": meta.soft } as React.CSSProperties}>
                <div className="guide-top"><span className="guide-index">0{index + 1}</span><div className="guide-icon"><Icon size={20} /></div><ArrowUpRight className="guide-arrow" size={17} /></div>
                <div className="guide-body"><span className="guide-eyebrow">{guide.eyebrow}</span><h3>{meta.label}</h3><p>{guide.description}</p></div>
                <div className="guide-examples">{guide.examples.map((example) => <span key={example}>{example}</span>)}</div>
              </button>;
            })}
          </div>
        </section>

        <section className="workflow-section section-shell" id="how-it-works">
          <div className="section-kicker"><span>03</span><span className="kicker-line" /><span>Behind the answer</span></div>
          <div className="workflow-layout">
            <div className="workflow-copy"><Pill tone="green"><Zap size={12} /> Prompt + retrieval</Pill><h2>Simple on the surface.<br /><i>Thoughtful underneath.</i></h2><p>EcoSorted pairs a deterministic rules library with a safety-first prompt structure. No black-box confidence theatre — just the right category and an action you can take.</p><a href="#ethics" className="text-link">See our responsible AI principles <ArrowRight size={15} /></a></div>
            <ArchitectureDiagram />
          </div>
        </section>

        <section className="ethics-section section-shell" id="ethics">
          <div className="section-kicker light"><span>04</span><span className="kicker-line" /><span>Built with care</span></div>
          <div className="ethics-layout">
            <div className="ethics-heading"><span className="eyebrow light-text">Responsible AI by default</span><h2>Useful is good.<br /><i>Trustworthy is better.</i></h2><p>A decision-support tool should make people feel more capable, never more confused.</p></div>
            <div className="ethics-list">
              <div className="ethics-item"><div className="ethics-number">01</div><div className="ethics-icon"><ShieldCheck size={21} /></div><div><h3>Safety & guardrails</h3><p>Hazardous items are flagged clearly with handling advice — because a wrong bin can be a real risk.</p></div></div>
              <div className="ethics-item"><div className="ethics-number">02</div><div className="ethics-icon"><LockKeyhole size={21} /></div><div><h3>Privacy first</h3><p>Queries are classified locally in this prototype. We collect no personal data and save no item history.</p></div></div>
              <div className="ethics-item"><div className="ethics-number">03</div><div className="ethics-icon"><UsersRound size={21} /></div><div><h3>Fair & accessible</h3><p>Plain language and four clear streams keep the experience useful across ages, contexts, and confidence levels.</p></div></div>
            </div>
          </div>
        </section>

        <section className="impact-section section-shell" id="impact">
          <div className="section-kicker"><span>05</span><span className="kicker-line" /><span>Small actions, shared impact</span></div>
          <div className="impact-layout">
            <div className="impact-heading"><h2>Every better sort<br /><i>adds up.</i></h2><p>EcoSorted is a small decision layer for a much bigger community habit: keeping useful material in circulation.</p><a className="text-link" href="#classify">Make a sort <ArrowRight size={15} /></a></div>
            <div className="impact-dashboard">
              <div className="impact-primary"><span className="impact-label"><Leaf size={14} /> Community pulse</span><strong>12,480</strong><span>items sorted with more clarity</span><div className="impact-chart"><span style={{ height: "42%" }} /><span style={{ height: "58%" }} /><span style={{ height: "49%" }} /><span style={{ height: "74%" }} /><span style={{ height: "66%" }} /><span style={{ height: "88%" }} /><span style={{ height: "100%" }} /></div><div className="chart-foot"><span>last 7 days</span><strong>+18.4%</strong></div></div>
              <div className="impact-metrics"><div><span>SDG alignment</span><strong>12 <small>/ 11</small></strong><em>Responsible production · Sustainable cities</em></div><div><span>Estimated contamination reduction</span><strong>24<span>%</span></strong><em>when prep steps are followed</em></div></div>
            </div>
          </div>
        </section>

        <section className="cta-section section-shell">
          <div className="cta-card"><div className="cta-orbit" /><div><span className="eyebrow">One clearer habit</span><h2>Ready to sort<br /><i>smarter?</i></h2></div><a href="#classify" className="cta-button">Classify an item <ArrowUpRight size={17} /></a></div>
        </section>
      </main>

      <footer className="site-footer section-shell"><div className="footer-brand"><LogoMark /><span>EcoSorted <em>AI</em></span><p>A responsible AI prototype for<br />SDG 12 · Responsible Consumption</p></div><div className="footer-links"><div><span>Explore</span><a href="#classify">Classify an item</a><a href="#guides">Waste guide</a><a href="#how-it-works">How it works</a></div><div><span>Principles</span><a href="#ethics">Safety & guardrails</a><a href="#ethics">Privacy first</a><a href="#impact">Community impact</a></div></div><div className="footer-end"><span>Built for 1M1B × IBM SkillsBuild</span><span>Prototype · 2024</span></div></footer>
      {wizardOpen && <GuidedWizard onClose={() => setWizardOpen(false)} onComplete={handleGuidedResult} />}
    </div>
  );
}
