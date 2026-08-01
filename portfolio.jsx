import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Home, User, Code2, Briefcase, GraduationCap, Award, FolderGit2, Mail,
  Github, Linkedin, Download, Send, Sun, Moon, ArrowUp, Menu, X,
  MapPin, Phone, ExternalLink, CheckCircle2, Sparkles, Twitter,
  Instagram, Loader2
} from "lucide-react";

/* -------------------------------------------------------------------- */
/*  Data                                                                 */
/* -------------------------------------------------------------------- */

const NAV_ITEMS = [
  { id: "home", label: "Home", icon: Home },
  { id: "about", label: "About", icon: User },
  { id: "skills", label: "Skills", icon: Code2 },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "certificates", label: "Certificates", icon: Award },
  { id: "projects", label: "Projects", icon: FolderGit2 },
  { id: "contact", label: "Contact", icon: Mail },
];

const ROLES = [
  "Computer Science Student",
  "Java Developer",
  "Python Programmer",
  "AI Enthusiast",
  "Web Developer",
];

const PROGRAMMING_SKILLS = [
  { name: "Java", level: 85 },
  { name: "Python", level: 90 },
  { name: "HTML", level: 92 },
  { name: "CSS", level: 88 },
  { name: "JavaScript", level: 80 },
];

const OTHER_SKILLS = [
  { name: "Artificial Intelligence", level: 82 },
  { name: "UI/UX Design", level: 78 },
  { name: "Problem Solving", level: 90 },
  { name: "Communication", level: 85 },
  { name: "Teamwork", level: 88 },
  { name: "Leadership", level: 75 },
  { name: "Creativity", level: 86 },
  { name: "Adaptability", level: 89 },
];

const COUNTERS = [
  { label: "Projects Built", value: 3 },
  { label: "Certificates", value: 4 },
  { label: "Technologies", value: 10 },
  { label: "Internships", value: 1 },
];

const CERTIFICATES = [
  { title: "Python Programming", issuer: "Certification", year: "2025", color: "from-blue-500 to-cyan-400" },
  { title: "UI/UX Design", issuer: "Certification", year: "2025", color: "from-purple-500 to-pink-400" },
  { title: "Java Programming", issuer: "Certification", year: "2026", color: "from-indigo-500 to-blue-400" },
  { title: "AI Internship", issuer: "1M1B Certificate", year: "2026", color: "from-violet-500 to-purple-400" },
];

const PROJECTS = [
  {
    title: "AI Attendance System",
    description: "A facial-recognition based attendance system that automates student check-ins using real-time detection and identity matching.",
    tech: ["Python", "OpenCV", "Face Recognition"],
    github: "#",
    live: "#",
  },
  {
    title: "Student Portfolio Website",
    description: "A sleek, responsive personal portfolio built to showcase academic projects, skills, and achievements to recruiters.",
    tech: ["React", "Tailwind CSS"],
    github: "#",
    live: "#",
  },
  {
    title: "Smart Women Safety Alert System",
    description: "A real-time safety application that sends instant location alerts to emergency contacts at the press of a button.",
    tech: ["React", "JavaScript", "Firebase"],
    github: "#",
    live: "#",
  },
];

const SOCIALS = [
  { icon: Github, href: "#", label: "GitHub" },
  { icon: Linkedin, href: "https://linkedin.com/in/janani-s-664916386", label: "LinkedIn" },
  { icon: Mail, href: "mailto:jananishanmugam2007@gmail.com", label: "Email" },
];

/* -------------------------------------------------------------------- */
/*  Small reusable hooks                                                 */
/* -------------------------------------------------------------------- */

function useInView(options = { threshold: 0.2 }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.unobserve(node);
      }
    }, options);
    observer.observe(node);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [ref, inView];
}

function useCountUp(target, inView, duration = 1500) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = null;
    let raf;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) raf = requestAnimationFrame(step);
      else setCount(target);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, duration]);
  return count;
}

/* -------------------------------------------------------------------- */
/*  Reveal wrapper                                                       */
/* -------------------------------------------------------------------- */

function Reveal({ children, delay = 0, className = "" }) {
  const [ref, inView] = useInView({ threshold: 0.15 });
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${className} ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------- */
/*  Main component                                                       */
/* -------------------------------------------------------------------- */

export default function Portfolio() {
  const [loading, setLoading] = useState(true);
  const [dark, setDark] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState("home");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showTop, setShowTop] = useState(false);
  const [cursor, setCursor] = useState({ x: 0, y: 0, visible: false });
  const [roleIndex, setRoleIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [deleting, setDeleting] = useState(false);

  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  /* ---- loading screen ---- */
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1600);
    return () => clearTimeout(t);
  }, []);

  /* ---- scroll progress + active section + back-to-top ---- */
  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const scrollTop = window.scrollY;
      const height = doc.scrollHeight - doc.clientHeight;
      setScrollProgress(height > 0 ? (scrollTop / height) * 100 : 0);
      setShowTop(scrollTop > 500);

      let current = "home";
      for (const item of NAV_ITEMS) {
        const el = document.getElementById(item.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 140) current = item.id;
        }
      }
      setActive(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ---- cursor glow (desktop only) ---- */
  useEffect(() => {
    const move = (e) => setCursor({ x: e.clientX, y: e.clientY, visible: true });
    const leave = () => setCursor((c) => ({ ...c, visible: false }));
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseleave", leave);
    };
  }, []);

  /* ---- typing animation ---- */
  useEffect(() => {
    const current = ROLES[roleIndex];
    let timeout;
    if (!deleting && typedText.length < current.length) {
      timeout = setTimeout(() => setTypedText(current.slice(0, typedText.length + 1)), 55);
    } else if (!deleting && typedText.length === current.length) {
      timeout = setTimeout(() => setDeleting(true), 1400);
    } else if (deleting && typedText.length > 0) {
      timeout = setTimeout(() => setTypedText(current.slice(0, typedText.length - 1)), 28);
    } else if (deleting && typedText.length === 0) {
      setDeleting(false);
      setRoleIndex((i) => (i + 1) % ROLES.length);
    }
    return () => clearTimeout(timeout);
  }, [typedText, deleting, roleIndex]);

  const scrollTo = useCallback((id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setMobileOpen(false);
  }, []);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Please enter your name.";
    if (!form.email.trim()) errs.email = "Please enter your email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Enter a valid email address.";
    if (!form.message.trim()) errs.message = "Please enter a message.";
    else if (form.message.trim().length < 10) errs.message = "Message should be at least 10 characters.";
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setSent(true);
      setForm({ name: "", email: "", message: "" });
      setTimeout(() => setSent(false), 4000);
    }
  };

  const theme = dark
    ? {
        bg: "bg-[#070714]",
        text: "text-slate-100",
        sub: "text-slate-400",
        card: "bg-white/5 border-white/10",
        navBg: "bg-[#070714]/70",
      }
    : {
        bg: "bg-slate-50",
        text: "text-slate-900",
        sub: "text-slate-600",
        card: "bg-white/70 border-slate-200",
        navBg: "bg-white/70",
      };

  return (
    <div className={`relative min-h-screen ${theme.bg} ${theme.text} font-[Inter,sans-serif] overflow-x-hidden selection:bg-purple-500/40`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700;800&family=Inter:wght@400;500;600&display=swap');
        .font-poppins { font-family: 'Poppins', sans-serif; }
        html { scroll-behavior: smooth; }
        @keyframes floatY { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-18px); } }
        @keyframes floatX { 0%,100% { transform: translateX(0px); } 50% { transform: translateX(14px); } }
        @keyframes pulseSlow { 0%,100% { opacity: .35; } 50% { opacity: .7; } }
        @keyframes spinSlow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes particleUp { 0% { transform: translateY(0) translateX(0); opacity: 0; } 10% { opacity: .8; } 90% { opacity: .5; } 100% { transform: translateY(-1000px) translateX(60px); opacity: 0; } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        .particle { position: absolute; border-radius: 9999px; background: radial-gradient(circle, rgba(139,92,246,0.9), rgba(59,130,246,0.1)); animation: particleUp linear infinite; }
        .glass { backdrop-filter: blur(16px) saturate(160%); -webkit-backdrop-filter: blur(16px) saturate(160%); }
        .grad-text { background: linear-gradient(90deg,#60a5fa,#a78bfa,#f472b6); -webkit-background-clip: text; background-clip: text; color: transparent; background-size: 200% auto; animation: shimmer 6s linear infinite; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: linear-gradient(#3b82f6,#8b5cf6); border-radius: 8px; }
        .skill-bar-fill { transition: width 1.4s cubic-bezier(.16,1,.3,1); }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: 0.001ms !important; animation-iteration-count: 1 !important; transition-duration: 0.001ms !important; }
        }
      `}</style>

      {/* ---------------- Loading screen ---------------- */}
      {loading && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#070714]">
          <div className="relative w-20 h-20 mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-blue-500/20" />
            <div className="absolute inset-0 rounded-full border-4 border-t-blue-400 border-r-purple-400 border-b-transparent border-l-transparent animate-spin" />
            <Sparkles className="absolute inset-0 m-auto text-purple-300" size={24} />
          </div>
          <p className="font-poppins text-slate-300 tracking-widest text-sm uppercase">Loading Portfolio</p>
        </div>
      )}

      {/* ---------------- Cursor glow ---------------- */}
      <div
        className="pointer-events-none fixed z-[60] w-64 h-64 rounded-full hidden md:block"
        style={{
          left: cursor.x - 128,
          top: cursor.y - 128,
          background: "radial-gradient(circle, rgba(139,92,246,0.15), transparent 70%)",
          opacity: cursor.visible ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      />

      {/* ---------------- Scroll progress ---------------- */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-transparent">
        <div
          className="h-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"
          style={{ width: `${scrollProgress}%`, transition: "width 0.1s linear" }}
        />
      </div>

      {/* ---------------- Ambient background ---------------- */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className={`absolute inset-0 ${dark ? "bg-[#070714]" : "bg-slate-50"}`} />
        <div
          className="absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full opacity-40 blur-3xl"
          style={{ background: "radial-gradient(circle, #3b82f6, transparent 70%)", animation: "floatY 9s ease-in-out infinite" }}
        />
        <div
          className="absolute top-1/3 -right-40 w-[560px] h-[560px] rounded-full opacity-30 blur-3xl"
          style={{ background: "radial-gradient(circle, #8b5cf6, transparent 70%)", animation: "floatX 11s ease-in-out infinite" }}
        />
        <div
          className="absolute bottom-0 left-1/4 w-[420px] h-[420px] rounded-full opacity-30 blur-3xl"
          style={{ background: "radial-gradient(circle, #ec4899, transparent 70%)", animation: "pulseSlow 7s ease-in-out infinite" }}
        />
        {dark &&
          Array.from({ length: 26 }).map((_, i) => (
            <span
              key={i}
              className="particle"
              style={{
                left: `${(i * 37) % 100}%`,
                bottom: `-20px`,
                width: `${3 + (i % 4)}px`,
                height: `${3 + (i % 4)}px`,
                animationDuration: `${9 + (i % 10)}s`,
                animationDelay: `${(i % 8) * 1.1}s`,
              }}
            />
          ))}
      </div>

      {/* ---------------- Navbar ---------------- */}
      <nav className={`fixed top-0 inset-x-0 z-40 ${theme.navBg} glass border-b ${dark ? "border-white/10" : "border-slate-200"}`}>
        <div className="max-w-7xl mx-auto px-5 md:px-8 flex items-center justify-between h-16">
          <button onClick={() => scrollTo("home")} className="font-poppins font-bold text-lg tracking-tight">
            <span className="grad-text">Janani S</span>
          </button>

          <div className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`px-3.5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  active === item.id
                    ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 shadow-[0_0_18px_rgba(139,92,246,0.25)]"
                    : `${theme.sub} hover:text-blue-300 hover:bg-white/5`
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              aria-label="Toggle theme"
              onClick={() => setDark((d) => !d)}
              className={`p-2 rounded-full border ${dark ? "border-white/10 hover:bg-white/10" : "border-slate-200 hover:bg-slate-200"} transition`}
            >
              {dark ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <button
              aria-label="Open menu"
              onClick={() => setMobileOpen((o) => !o)}
              className={`lg:hidden p-2 rounded-full border ${dark ? "border-white/10 hover:bg-white/10" : "border-slate-200 hover:bg-slate-200"} transition`}
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className={`lg:hidden glass border-t ${dark ? "border-white/10 bg-[#070714]/95" : "border-slate-200 bg-white/95"} px-5 py-4 flex flex-col gap-1`}>
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-left ${
                  active === item.id ? "bg-white/10 text-blue-300" : theme.sub
                }`}
              >
                <item.icon size={16} /> {item.label}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* ---------------- Hero ---------------- */}
      <section id="home" className="relative min-h-screen flex items-center pt-24 pb-16 px-5 md:px-8">
        <div className="max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-14 items-center">
          <div className="order-2 md:order-1 text-center md:text-left">
            <Reveal>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium border border-purple-400/30 bg-purple-500/10 text-purple-300 mb-6">
                <Sparkles size={13} /> Open to Internship Opportunities
              </span>
            </Reveal>
            <Reveal delay={100}>
              <h1 className="font-poppins font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-[1.1] mb-4">
                Hi, I'm <span className="grad-text">Janani S</span>
              </h1>
            </Reveal>
            <Reveal delay={200}>
              <div className="h-9 mb-6 font-poppins text-lg sm:text-xl text-blue-300 font-semibold">
                {typedText}
                <span className="inline-block w-[2px] h-5 bg-blue-300 ml-1 align-middle" style={{ animation: "blink 1s step-end infinite" }} />
              </div>
            </Reveal>
            <Reveal delay={300}>
              <p className={`max-w-xl mx-auto md:mx-0 ${theme.sub} leading-relaxed mb-8`}>
                Motivated and enthusiastic Computer Science student passionate about Java, Python,
                Artificial Intelligence, and Web Development. I enjoy building innovative solutions
                while continuously learning new technologies.
              </p>
            </Reveal>
            <Reveal delay={400}>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-10">
                <a
                  href="#"
                  download
                  className="group inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm bg-gradient-to-r from-blue-500 to-purple-500 shadow-[0_0_25px_rgba(99,102,241,0.4)] hover:shadow-[0_0_35px_rgba(139,92,246,0.6)] hover:-translate-y-0.5 transition-all duration-300"
                >
                  <Download size={16} className="group-hover:animate-bounce" /> Download Resume
                </a>
                <button
                  onClick={() => scrollTo("contact")}
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm border ${dark ? "border-white/20 hover:bg-white/10" : "border-slate-300 hover:bg-slate-200"} hover:-translate-y-0.5 transition-all duration-300`}
                >
                  <Mail size={16} /> Contact Me
                </button>
              </div>
            </Reveal>
            <Reveal delay={500}>
              <div className="flex items-center justify-center md:justify-start gap-3">
                {SOCIALS.map((s, i) => (
                  <a
                    key={i}
                    href={s.href}
                    aria-label={s.label}
                    className={`p-2.5 rounded-full border ${dark ? "border-white/10 hover:border-purple-400/50 hover:bg-purple-500/10" : "border-slate-200 hover:bg-slate-200"} transition-all duration-300 hover:-translate-y-1`}
                  >
                    <s.icon size={16} />
                  </a>
                ))}
              </div>
            </Reveal>
          </div>

          <div className="order-1 md:order-2 flex justify-center">
            <div className="relative">
              <div
                className="absolute -inset-6 rounded-full opacity-60 blur-2xl"
                style={{ background: "conic-gradient(from 0deg, #3b82f6, #8b5cf6, #ec4899, #3b82f6)", animation: "spinSlow 8s linear infinite" }}
              />
              <div className="relative w-56 h-56 sm:w-72 sm:h-72 rounded-full p-[3px] bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400">
                <div className="w-full h-full rounded-full overflow-hidden border-4 border-[#070714]">
                  <img
                    src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&h=600&fit=crop&crop=faces&q=80"
                    alt="Janani S profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 sm:bottom-2 sm:right-2 px-4 py-2 rounded-2xl glass border border-white/10 bg-white/5" style={{ animation: "floatY 5s ease-in-out infinite" }}>
                <p className="text-xs font-semibold text-blue-300">CSE Student</p>
              </div>
              <div className="absolute -top-2 -left-6 sm:top-4 sm:-left-8 px-3 py-2 rounded-2xl glass border border-white/10 bg-white/5" style={{ animation: "floatX 6s ease-in-out infinite" }}>
                <p className="text-xs font-semibold text-purple-300">AI • Java • Python</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- About ---------------- */}
      <Section id="about" title="About Me" eyebrow="Get To Know Me" dark={dark}>
        <div className="grid md:grid-cols-5 gap-8 items-start">
          <Reveal className="md:col-span-3">
            <div className={`rounded-2xl border ${theme.card} glass p-7 sm:p-8`}>
              <p className={`${theme.sub} leading-relaxed mb-6`}>
                I'm a Computer Science undergraduate passionate about crafting reliable software and
                exploring the frontier of artificial intelligence. From writing clean Java and Python
                code to designing intuitive web interfaces, I love turning ideas into working products
                — and I'm currently looking for internship opportunities to grow further.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <InfoRow icon={GraduationCap} label="Degree" value="Bachelor of Computer Science" dark={dark} />
                <InfoRow icon={Award} label="University" value="Takshashila University" dark={dark} />
                <InfoRow icon={MapPin} label="Location" value="India" dark={dark} />
                <InfoRow icon={Sparkles} label="Focus" value="Software, AI & Web Development" dark={dark} />
              </div>
              <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-green-500/10 text-green-300 border border-green-400/20">
                <CheckCircle2 size={14} /> Available for Internship Opportunities
              </div>
            </div>
          </Reveal>

          <div className="md:col-span-2 grid grid-cols-2 gap-4">
            {COUNTERS.map((c, i) => (
              <Reveal key={c.label} delay={i * 100}>
                <CounterCard value={c.value} label={c.label} dark={dark} card={theme.card} />
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* ---------------- Skills ---------------- */}
      <Section id="skills" title="Skills" eyebrow="What I Bring" dark={dark}>
        <div className="grid lg:grid-cols-2 gap-8">
          <Reveal>
            <SkillGroup title="Programming Languages" skills={PROGRAMMING_SKILLS} dark={dark} card={theme.card} sub={theme.sub} />
          </Reveal>
          <Reveal delay={150}>
            <SkillGroup title="Core &amp; Soft Skills" skills={OTHER_SKILLS} dark={dark} card={theme.card} sub={theme.sub} compact />
          </Reveal>
        </div>
      </Section>

      {/* ---------------- Experience ---------------- */}
      <Section id="experience" title="Experience" eyebrow="Where I've Worked" dark={dark}>
        <Reveal>
          <div className={`relative rounded-2xl border ${theme.card} glass p-7 sm:p-8 max-w-3xl mx-auto`}>
            <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
              <div>
                <h3 className="font-poppins font-bold text-xl">AI Intern</h3>
                <p className="text-blue-300 font-medium text-sm">1M1B</p>
              </div>
              <span className="text-xs px-3 py-1.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-400/20 whitespace-nowrap">
                May 2026 – June 2026
              </span>
            </div>
            <ul className={`space-y-2.5 ${theme.sub} text-sm leading-relaxed`}>
              <li className="flex gap-2"><span className="text-blue-400 mt-1">▸</span>Worked on AI-related learning activities.</li>
              <li className="flex gap-2"><span className="text-blue-400 mt-1">▸</span>Completed sustainability-based AI internship.</li>
              <li className="flex gap-2"><span className="text-blue-400 mt-1">▸</span>Collaborated on project development.</li>
              <li className="flex gap-2"><span className="text-blue-400 mt-1">▸</span>Learned practical AI concepts.</li>
            </ul>
          </div>
        </Reveal>
      </Section>

      {/* ---------------- Education ---------------- */}
      <Section id="education" title="Education" eyebrow="My Academic Journey" dark={dark}>
        <Reveal>
          <div className="max-w-3xl mx-auto relative pl-10">
            <div className="absolute left-[11px] top-2 bottom-2 w-[2px] bg-gradient-to-b from-blue-400 via-purple-400 to-pink-400" />
            <div className="relative">
              <span className="absolute -left-10 top-1 w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.6)]">
                <GraduationCap size={13} className="text-white" />
              </span>
              <div className={`rounded-2xl border ${theme.card} glass p-6`}>
                <span className="text-xs px-3 py-1 rounded-full bg-blue-500/10 text-blue-300 border border-blue-400/20">2025 – Present</span>
                <h3 className="font-poppins font-bold text-lg mt-3">Bachelor of Computer Science</h3>
                <p className={`text-sm ${theme.sub} mt-1`}>Takshashila University</p>
              </div>
            </div>
          </div>
        </Reveal>
      </Section>

      {/* ---------------- Certificates ---------------- */}
      <Section id="certificates" title="Certificates" eyebrow="Recognitions & Learning" dark={dark}>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CERTIFICATES.map((c, i) => (
            <Reveal key={c.title} delay={i * 100}>
              <div className={`group relative rounded-2xl border ${theme.card} glass p-6 h-full overflow-hidden hover:-translate-y-2 transition-all duration-300 hover:shadow-[0_15px_40px_rgba(139,92,246,0.2)]`}>
                <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${c.color}`} />
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Award size={20} className="text-white" />
                </div>
                <h3 className="font-poppins font-semibold text-base mb-1">{c.title}</h3>
                <p className={`text-xs ${theme.sub} mb-4`}>{c.issuer}</p>
                <span className="text-xs font-semibold text-purple-300">{c.year}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ---------------- Projects ---------------- */}
      <Section id="projects" title="Projects" eyebrow="Things I've Built" dark={dark}>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROJECTS.map((p, i) => (
            <Reveal key={p.title} delay={i * 120}>
              <div className={`group relative rounded-2xl border ${theme.card} glass p-6 h-full flex flex-col hover:-translate-y-2 transition-all duration-300 hover:shadow-[0_20px_45px_rgba(59,130,246,0.2)]`}>
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mb-4 group-hover:rotate-6 transition-transform duration-300">
                  <FolderGit2 size={18} className="text-white" />
                </div>
                <h3 className="font-poppins font-semibold text-lg mb-2">{p.title}</h3>
                <p className={`text-sm ${theme.sub} leading-relaxed mb-4 flex-1`}>{p.description}</p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {p.tech.map((t) => (
                    <span key={t} className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-300 border border-blue-400/20">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="flex gap-3">
                  <a href={p.github} className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border ${dark ? "border-white/15 hover:bg-white/10" : "border-slate-300 hover:bg-slate-200"} transition`}>
                    <Github size={14} /> GitHub
                  </a>
                  <a href={p.live} className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-blue-500 to-purple-500 hover:shadow-[0_0_20px_rgba(139,92,246,0.5)] transition">
                    <ExternalLink size={14} /> Live Demo
                  </a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ---------------- Contact ---------------- */}
      <Section id="contact" title="Contact Me" eyebrow="Let's Connect" dark={dark}>
        <div className="grid md:grid-cols-5 gap-8">
          <Reveal className="md:col-span-2 space-y-4">
            <ContactRow icon={Mail} label="Email" value="jananishanmugam2007@gmail.com" href="mailto:jananishanmugam2007@gmail.com" dark={dark} card={theme.card} />
            <ContactRow icon={Phone} label="Phone" value="+91 7995037638" href="tel:+917995037638" dark={dark} card={theme.card} />
            <ContactRow icon={MapPin} label="Location" value="Villupuram, Tamil Nadu, India" dark={dark} card={theme.card} />
            <ContactRow icon={Linkedin} label="LinkedIn" value="janani-s-664916386" href="https://linkedin.com/in/janani-s-664916386" dark={dark} card={theme.card} />
          </Reveal>

          <Reveal delay={150} className="md:col-span-3">
            <form onSubmit={handleSubmit} noValidate className={`rounded-2xl border ${theme.card} glass p-6 sm:p-8 space-y-5`}>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1.5 block">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-lg bg-transparent border ${errors.name ? "border-red-400" : dark ? "border-white/15 focus:border-purple-400" : "border-slate-300 focus:border-purple-500"} outline-none transition text-sm`}
                  placeholder="Your full name"
                />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1.5 block">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-lg bg-transparent border ${errors.email ? "border-red-400" : dark ? "border-white/15 focus:border-purple-400" : "border-slate-300 focus:border-purple-500"} outline-none transition text-sm`}
                  placeholder="you@example.com"
                />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1.5 block">Message</label>
                <textarea
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-lg bg-transparent border ${errors.message ? "border-red-400" : dark ? "border-white/15 focus:border-purple-400" : "border-slate-300 focus:border-purple-500"} outline-none transition text-sm resize-none`}
                  placeholder="Tell me about the opportunity or say hello..."
                />
                {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message}</p>}
              </div>
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm bg-gradient-to-r from-blue-500 to-purple-500 hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] hover:-translate-y-0.5 transition-all duration-300"
              >
                <Send size={15} /> Send Message
              </button>
              {sent && (
                <p className="flex items-center gap-2 text-sm text-green-300 bg-green-500/10 border border-green-400/20 rounded-lg px-4 py-2.5">
                  <CheckCircle2 size={15} /> Message sent successfully! I'll get back to you soon.
                </p>
              )}
            </form>
          </Reveal>
        </div>
      </Section>

      {/* ---------------- Footer ---------------- */}
      <footer className={`border-t ${dark ? "border-white/10" : "border-slate-200"} py-8 px-5 mt-10`}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className={`text-sm ${theme.sub}`}>© 2026 Janani S. All Rights Reserved.</p>
          <div className="flex items-center gap-3">
            {SOCIALS.map((s, i) => (
              <a key={i} href={s.href} aria-label={s.label} className={`p-2 rounded-full border ${dark ? "border-white/10 hover:bg-white/10" : "border-slate-200 hover:bg-slate-200"} transition hover:-translate-y-1`}>
                <s.icon size={15} />
              </a>
            ))}
          </div>
        </div>
      </footer>

      {/* ---------------- Floating social icons (desktop) ---------------- */}
      <div className="hidden xl:flex flex-col gap-3 fixed left-6 bottom-24 z-30">
        {SOCIALS.map((s, i) => (
          <a
            key={i}
            href={s.href}
            aria-label={s.label}
            className={`p-2.5 rounded-full border ${dark ? "border-white/10 bg-white/5 hover:bg-purple-500/20 hover:border-purple-400/50" : "border-slate-200 bg-white hover:bg-slate-200"} glass transition-all duration-300 hover:-translate-x-1`}
          >
            <s.icon size={15} />
          </a>
        ))}
        <div className={`w-px h-14 mx-auto ${dark ? "bg-white/15" : "bg-slate-300"}`} />
      </div>

      {/* ---------------- Back to top ---------------- */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
        className={`fixed right-5 bottom-6 z-40 p-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg transition-all duration-300 hover:shadow-[0_0_25px_rgba(139,92,246,0.6)] hover:-translate-y-1 ${
          showTop ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-6 pointer-events-none"
        }`}
      >
        <ArrowUp size={17} className="text-white" />
      </button>
    </div>
  );
}

/* -------------------------------------------------------------------- */
/*  Sub components                                                       */
/* -------------------------------------------------------------------- */

function Section({ id, title, eyebrow, dark, children }) {
  return (
    <section id={id} className="relative py-20 md:py-24 px-5 md:px-8 scroll-mt-16">
      <div className="max-w-7xl mx-auto">
        <Reveal className="text-center mb-14">
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-purple-300">{eyebrow}</span>
          <h2 className="font-poppins font-bold text-3xl sm:text-4xl mt-2">
            <span className={dark ? "text-white" : "text-slate-900"}>{title}</span>
          </h2>
          <div className="w-16 h-1 mx-auto mt-4 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
        </Reveal>
        {children}
      </div>
    </section>
  );
}

function InfoRow({ icon: Icon, label, value, dark }) {
  return (
    <div className="flex items-start gap-3">
      <div className={`p-2 rounded-lg ${dark ? "bg-blue-500/10" : "bg-blue-500/10"} text-blue-300 shrink-0`}>
        <Icon size={15} />
      </div>
      <div>
        <p className="text-[11px] uppercase tracking-wide text-slate-400 font-semibold">{label}</p>
        <p className="text-sm font-medium mt-0.5">{value}</p>
      </div>
    </div>
  );
}

function CounterCard({ value, label, dark, card }) {
  const [ref, inView] = useInView({ threshold: 0.4 });
  const count = useCountUp(value, inView);
  return (
    <div ref={ref} className={`rounded-2xl border ${card} glass p-5 text-center hover:-translate-y-1 transition-transform duration-300`}>
      <p className="font-poppins font-extrabold text-3xl grad-text">{count}+</p>
      <p className={`text-xs mt-1 ${dark ? "text-slate-400" : "text-slate-600"}`}>{label}</p>
    </div>
  );
}

function SkillGroup({ title, skills, dark, card, sub, compact }) {
  const [ref, inView] = useInView({ threshold: 0.2 });
  return (
    <div ref={ref} className={`rounded-2xl border ${card} glass p-7`}>
      <h3 className="font-poppins font-semibold text-lg mb-6">{title}</h3>
      <div className={compact ? "grid sm:grid-cols-2 gap-x-6 gap-y-5" : "space-y-5"}>
        {skills.map((s) => (
          <div key={s.name}>
            <div className="flex justify-between text-sm mb-1.5">
              <span className="font-medium">{s.name}</span>
              <span className={sub}>{s.level}%</span>
            </div>
            <div className={`h-2 rounded-full overflow-hidden ${dark ? "bg-white/10" : "bg-slate-200"}`}>
              <div
                className="skill-bar-fill h-full rounded-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"
                style={{ width: inView ? `${s.level}%` : "0%" }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContactRow({ icon: Icon, label, value, href, dark, card }) {
  const content = (
    <div className={`flex items-center gap-4 rounded-2xl border ${card} glass p-5 hover:-translate-y-1 hover:border-purple-400/40 transition-all duration-300`}>
      <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 text-white shrink-0">
        <Icon size={16} />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-wide text-slate-400 font-semibold">{label}</p>
        <p className="text-sm font-medium mt-0.5 truncate">{value}</p>
      </div>
    </div>
  );
  return href ? <a href={href} className="block">{content}</a> : content;
}
