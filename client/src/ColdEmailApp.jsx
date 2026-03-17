import React, { useState, useRef, useCallback, useMemo } from "react";
import * as XLSX from "xlsx";
/**
 * AI COLD EMAIL AUTOMATION AGENT
 * Author: Senior Full-Stack Engineer Persona
 * Target User: Amarjeet Kumar Chaurasia
 */

// --- CONFIGURATION & CONSTANTS ---
const API_URL = "http://localhost:3001/api/generate";

const CATEGORY_COLORS = {
  "Product MNC": "#6c63ff",
  "High-Paying Startup": "#ff6b35",
  "GCC / Captive Center": "#00d68f",
  "Fintech / BFSI": "#a855f7",
  "IT Services": "#64748b",
  Manufacturing: "#f59e0b",
  Consulting: "#06b6d4",
  "Telecom/Media": "#ec4899",
  Other: "#94a3b8",
};

const TONES = {
  professional: "Professional — formal, metrics-first",
  story: "Story-driven — hook with Redis project story",
  concise: "Ultra Concise — short bullets",
  friendly: "Friendly — warm, conversational",
};

const DEFAULT_RESUME = `
Amarjeet Kumar Chaurasia
Software Engineer at Unistring Tech Solutions, Hyderabad
NIT Silchar | B.Tech ECE | CGPA 8.70 | 2025 Passout

SYSTEMS:
- C++17/20, TCP/IP, UDP, Multi-threaded Distributed Systems
- 5x connection capacity | sub-50ms latency | 40% less overhead
- Built Redis-compatible KV Store in C++ (epoll, lock-free, RESP parser)

JAVA + SPRING BOOT:
- Spring Boot 3.2 + Spring Security 6 + JPA/Hibernate
- FastBite: 15+ REST APIs, JWT, RBAC, price snapshotting, full order lifecycle
- React.js 18: 20+ components, Context API, Axios interceptors

COMPETITIVE:
- LeetCode Knight | Top 2% globally | Rating 2043
- CodeChef 3-Star (1845) | Codeforces Pupil (1329)

STACK: Docker | Kubernetes | AWS | Jenkins | MySQL | PostgreSQL | MongoDB
CONTACT: ajchaurasia1214@gmail.com | +91-6204893422
LINKEDIN: linkedin.com/in/amarjeet-kumar-chaurasia-72a6b9185
`.trim();

// --- STYLES ---
const theme = {
  bg: "#0a0a0f",
  surface: "#12121a",
  border: "#252533",
  accent: "#6c63ff",
  text: "#e2e2e9",
  textMuted: "#94a3b8",
  success: "#00d68f",
  error: "#ff4d4d",
  glass: "rgba(255, 255, 255, 0.03)",
};

export default function ColdEmailApp() {
  // --- STATE ---
  const [contacts, setContacts] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [emails, setEmails] = useState({}); // { id: {subject, body, status} }
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [activeTab, setActiveTab] = useState("upload");
  const [resumeText, setResumeText] = useState(DEFAULT_RESUME);
  const [tone, setTone] = useState("professional");
  const [filterCat, setFilterCat] = useState("All");
  const [searchQ, setSearchQ] = useState("");
  const [apiKey, setApiKey] = useState(""); // User must provide for security
  const abortRef = useRef(false);

  // --- HELPERS ---
  const getCategoryColor = (cat) =>
    CATEGORY_COLORS[cat] || CATEGORY_COLORS["Other"];

  const getStrategy = (contact) => {
    const cat = contact.category.toLowerCase();
    const company = contact.company.toLowerCase();

    // Route 1 — Systems / Semiconductor / Big Tech MNCs
    if (
      cat.includes("mnc") ||
      [
        "nvidia",
        "qualcomm",
        "intel",
        "cisco",
        "arista",
        "amd",
        "arm",
        "mediatek",
        "broadcom",
        "juniper",
        "google",
        "microsoft",
        "apple",
        "meta",
        "amazon",
        "samsung",
        "synopsys",
        "cadence",
        "marvell",
        "nxp",
        "adobe",
        "oracle",
        "sap",
        "ibm",
        "dell",
        "hp",
      ].some((k) => company.includes(k))
    ) {
      return `
LEAD WITH: C++ systems depth — Redis KV Store (epoll, lock-free, RESP parser).
THEN: Production proof — 5x capacity, sub-50ms latency, 40% overhead cut.
THEN: LeetCode Knight Top 2% — their engineers respect this signal deeply.
CLOSE WITH: FastBite (Spring Boot + JWT + RBAC) as a one-liner bonus.
FRAME: You are not job-hunting. You build systems at the level they respect.
    `.trim();
    }

    // Route 2 — Fintech / BFSI / Payments
    if (
      cat.includes("fintech") ||
      cat.includes("bfsi") ||
      [
        "razorpay",
        "phonepe",
        "paytm",
        "cashfree",
        "stripe",
        "visa",
        "mastercard",
        "juspay",
        "pine labs",
        "cred",
        "groww",
        "zerodha",
        "bharatpe",
        "slice",
        "jupiter",
        "bank",
        "finance",
        "capital",
        "morgan",
        "goldman",
        "dezerv",
        "smallcase",
        "perfios",
        "signzy",
      ].some((k) => company.includes(k))
    ) {
      return `
LEAD WITH: FastBite — Spring Boot 3.2, Spring Security 6, JWT, RBAC, 15+ REST APIs.
THEN: Security architecture — price snapshotting, cart validation, full order lifecycle.
THEN: C++ systems as rare bonus — engineers who understand both layers are uncommon.
CLOSE WITH: LeetCode Knight as proof of sharp algorithmic thinking.
FRAME: You understand secure, high-throughput APIs — exactly what fintech demands.
    `.trim();
    }

    // Route 3 — Startups / SaaS / Full-stack product companies
    if (
      cat.includes("startup") ||
      cat.includes("saas") ||
      [
        "postman",
        "browserstack",
        "freshworks",
        "chargebee",
        "clevertap",
        "darwinbox",
        "leadsquared",
        "sprinklr",
        "moengage",
        "swiggy",
        "zomato",
        "zepto",
        "meesho",
        "blinkit",
        "ola",
        "rapido",
        "scaler",
        "unacademy",
      ].some((k) => company.includes(k))
    ) {
      return `
LEAD WITH: FastBite full-stack — React.js 18 + Spring Boot + MySQL end to end.
THEN: Breadth proof — 15+ APIs + JWT + RBAC + 20+ React components + Axios.
THEN: Systems depth — C++ production work shows you are not just a CRUD engineer.
CLOSE WITH: LeetCode Knight = fast learner who solves hard problems.
FRAME: You can own a feature from database to UI without needing hand-holding.
    `.trim();
    }

    // Route 4 — GCC / Enterprise / Default
    return `
LEAD WITH: LeetCode Knight Top 2% + NIT Silchar CGPA 8.70 — clears their filter fast.
THEN: Dual strength — C++ systems (5x capacity, sub-50ms latency) AND Java (FastBite, 15+ APIs).
THEN: Infrastructure familiarity — Docker, Kubernetes, AWS, Jenkins.
CLOSE WITH: Position as rare engineer who works at both systems and application layer.
FRAME: Reliable, credentialed, full-stack — low risk high value hire.
  `.trim();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target.result;
        // Import XLSX via CDN dynamically if not available
        if (!XLSX) {
          alert("XLSX library not loaded. Please ensure internet connection.");
          return;
        }
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);

        const formatted = data.map((item, index) => ({
          id: index,
          company: item.Company || "Unknown",
          name: item["Name of POC"] || "Recruiter",
          designation: item["POC's Designation"] || "HR Manager",
          email: item["Email Address"] || "",
          category: item["Category"] || "Other",
          tier: item["Tier"] || "N/A",
          pay: item["Approx Pay Range"] || "N/A",
        }));

        setContacts(formatted);
        alert(`Successfully loaded ${formatted.length} contacts.`);
        setActiveTab("select");
      } catch (err) {
        alert(
          "Error parsing Excel file. Ensure columns match the required schema.",
        );
      }
    };
    reader.readAsBinaryString(file);
  };

  const openInGmail = (email, subject, body) => {
    const encoded = encodeURIComponent(body);

    if (encoded.length > 1800) {
      navigator.clipboard.writeText(body).then(() => {
        alert(
          "Body copied to clipboard!\n" +
            "Gmail is opening — paste with Ctrl+V",
        );
      });
      const url = new URL("https://mail.google.com/mail/u/0/");
      url.searchParams.set("view", "cm");
      url.searchParams.set("to", email);
      url.searchParams.set("su", subject);
      window.open(url.toString(), "_blank");
    } else {
      const url = new URL("https://mail.google.com/mail/u/0/");
      url.searchParams.set("view", "cm");
      url.searchParams.set("to", email);
      url.searchParams.set("su", subject);
      url.searchParams.set("body", body);
      window.open(url.toString(), "_blank");
    }
  };

  const buildPrompt = (contact, resumeText, strategy, tone) => {
    const firstName = contact.name
      ? contact.name.trim().split(" ")[0]
      : "there";

    return `
You are Amarjeet Kumar Chaurasia, a Software Engineer at Unistring Tech Solutions, Hyderabad.
You are writing a cold email directly to ${firstName} at ${contact.company}.
You are NOT filling a template. You are a real engineer writing to a real human.

This person receives 200+ emails per day.
They will spend 4 seconds deciding to open or delete yours.
Your job is to make them stop scrolling.

════════════════════════════════
YOUR BACKGROUND
════════════════════════════════
${resumeText}

════════════════════════════════
WHO YOU ARE WRITING TO
════════════════════════════════
Name: ${contact.name || "Hiring Manager"}
First Name: ${firstName}
Company: ${contact.company}
Their Role: ${contact.designation || "HR / Recruiter"}
Company Type: ${contact.category}

════════════════════════════════
YOUR ANGLE FOR ${contact.company}
════════════════════════════════
${strategy}

TONE${tone}

════════════════════════════════
STUDY THIS — THIS IS THE TARGET
════════════════════════════════

EXAMPLE 1 — Fintech / Payment company:

Subject: LeetCode Knight Top 2% | C++ + Spring Boot | Razorpay

Hi Priya,

Razorpay moves billions in transactions daily — that infrastructure
needs engineers who understand security, throughput, and low-latency
APIs at the system level.

→ FastBite: Spring Boot 3.2 + Spring Security 6 + JWT + RBAC,
  15+ REST APIs, price snapshotting, full order lifecycle
→ 5x connection capacity at sub-50ms latency under production
  load — 40% pipeline overhead reduction at Unistring
→ Redis-compatible KV Store built from scratch in C++:
  epoll-driven, lock-free data path, RESP protocol parser

LeetCode Knight — Top 2% globally (rating 2043). NIT Silchar 2025.

Would you be open to a 15-minute chat about how my background
fits the team at Razorpay?

Amarjeet Kumar Chaurasia
ajchaurasia1214@gmail.com | +91-6204893422
linkedin.com/in/amarjeet-kumar-chaurasia-72a6b9185

WHY THIS WORKS:
- Same 3-bullet structure but FastBite LEADS because fintech
  cares about secure APIs more than C++ systems.
- Bullet order changes based on what company cares about most.
- Opener uses a real business fact. Not "I am excited about Razorpay."

════════════════════════════════
BAD VS GOOD — UNDERSTAND THE DIFFERENCE
════════════════════════════════

OPENER:
Remember: the opener is the hook that makes them stop and read. It must connect THEIR world to YOUR skill. It cannot be generic praise or a vague claim.
✗ BAD:  "Adobe delivers cutting-edge products that deeply resonate
         with my passion for high-performance systems."
         WHY: Flattery. Generic. Could be sent to 500 companies.

✓ GOOD: "Akamai's global edge network demands C++ engineers who
         deliver extreme throughput at sub-50ms latency —
         that is my daily work."
         WHY: Specific to Akamai. Their problem. Your proof.

BULLETS:
✗ BAD:  → Redis KV Store in C++ with epoll          (C++ story)
         → Optimized TCP/IP systems: 5x capacity     (C++ again)
         → FastBite with Spring Boot                 (Java story)
         WHY: 2 bullets repeat same domain. Feels thin and repetitive.

✓ GOOD: → Redis KV Store: epoll, lock-free, RESP     (PROJECT story)
         → 5x capacity, sub-50ms, 40% overhead cut   (IMPACT story)
         → FastBite: Spring Boot + JWT + 15 APIs      (BREADTH story)
         WHY: 3 bullets = 3 completely different stories.


════════════════════════════════
NOW WRITE THE EMAIL FOR ${contact.company}
════════════════════════════════

EXACT OUTPUT FORMAT — NO DEVIATION:

Subject: LeetCode Knight Top 2% | C++ + Spring Boot | ${contact.company}

Hi ${firstName},

[OPENER — 1 to 2 sentences only]
[Company fact] + [what it demands] + [you deliver it at Unistring Tech Solutions]

RULE: The opener must naturally mention "Unistring Tech Solutions, Hyderabad"
      as the place where you currently do this work.
      Do NOT add a separate sentence for it.
      Weave it into the opener itself.
      the opener is the hook that makes them stop and read. It must connect THEIR world to YOUR skill. It cannot be generic praise or a vague claim.

EXAMPLE:
"Akamai's global edge network demands C++ engineers who deliver 
 extreme throughput at sub-50ms latency — I build exactly this 
 at Unistring Tech Solutions, Hyderabad."

[Formula: specific fact about ${contact.company}'s business or scale]
[+ what that demands from an engineer]
[+ you deliver exactly that — but say it differently every time]
[NEVER use: resonates, passion, cutting-edge, reputation,
 excited, admired, "I build both", "I build exactly that",
 "I build precisely that", "delivers exactly that"]

→ [BULLET 1 — PROJECT PROOF]
  Redis-compatible KV Store in C++ with epoll,
  lock-free data path, full RESP protocol parser.
  Technical details show you built it, not just read about it.

→ [BULLET 2 — IMPACT PROOF]
  Numbers only: 5x connection capacity, sub-50ms latency,
  40% overhead reduction.
  NO project name. NO mention of C++ again. Just the impact.

→ [BULLET 3 — BREADTH PROOF]
  FastBite: Spring Boot 3.2 + Spring Security 6 + JWT + RBAC,
  15+ REST APIs, price snapshotting, full order lifecycle.
  Must feel like a completely different engineer built this.

LeetCode Knight — Top 2% globally (rating 2043). NIT Silchar 2025.

Would you be open to a 15-minute chat about how my background fits the team at ${contact.company}?

Amarjeet Kumar Chaurasia
ajchaurasia1214@gmail.com | +91-6204893422
linkedin.com/in/amarjeet-kumar-chaurasia-72a6b9185

════════════════════════════════
CHECKLIST — VERIFY BEFORE OUTPUTTING
════════════════════════════════
[ ] Opener is specific to ${contact.company} — cannot be copy-pasted to another company
[ ] Opener has zero flattery words
[ ] Opener ends with your proof, not their praise
[ ] Bullet 1 = Redis project with C++ technical details
[ ] Bullet 2 = numbers only — no C++ mention, no project name
[ ] Bullet 3 = FastBite Java stack — completely different domain from Bullet 1 and 2
[ ] No two bullets tell the same story
[ ] LeetCode line is one sentence — nothing after it
[ ] Total word count is between 120 and 150 words
[ ] Sign-off: name on line 1, email+phone on line 2, LinkedIn on line 3
[ ] Zero banned phrases anywhere in the email

════════════════════════════════
BANNED PHRASES — IF ANY APPEAR, REWRITE
════════════════════════════════
"delivering this level of"
"my core expertise"
"I build exactly that"        "I build both"
"deeply resonates"            "my passion"
"cutting-edge"                "reputation for"
"I have always admired"       "excited about"
"keen to explore"             "Additionally"
"Furthermore"                 "My expertise extends to"
"My experience involves"      "I am writing to express"
"I am passionate"             "always inspired by"
"thrilled to apply"           "dream company"
`.trim();
  };

  const filteredContacts = useMemo(() => {
    return contacts.filter((c) => {
      const matchesSearch =
        c.company.toLowerCase().includes(searchQ.toLowerCase()) ||
        c.name.toLowerCase().includes(searchQ.toLowerCase());
      const matchesCat = filterCat === "All" || c.category === filterCat;
      return matchesSearch && matchesCat;
    });
  }, [contacts, searchQ, filterCat]);

  const toggleSelect = (id) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const toggleSelectAll = () => {
    if (selected.size === filteredContacts.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filteredContacts.map((c) => c.id)));
    }
  };

  const generateEmails = async () => {
    setGenerating(true);
    abortRef.current = false;
    const selectedIds = Array.from(selected);
    setProgress({ done: 0, total: selectedIds.length });

    for (let i = 0; i < selectedIds.length; i++) {
      if (abortRef.current) break; // Check for stop button

      const id = selectedIds[i];
      const contact = contacts.find((c) => c.id === id);
      const strategy = getStrategy(contact);
      //       const promptContent = `
      //       YOU ARE: A sharp, confident software engineer writing a cold email to land a job.
      //       NOT a template filler. NOT a resume reader. A real person writing to a real human.

      //       YOUR IDENTITY:
      //       ${resumeText}

      //       YOUR TARGET:
      //       - Name: ${contact.name || "Hiring Manager"}
      //       - First Name Only: ${contact.name ? contact.name.split(" ")[0] : "there"}
      //       - Company: ${contact.company}
      //       - Their Role: ${contact.designation || "HR / Recruiter"}
      //       - Company Type: ${contact.category}

      //       YOUR ANGLE FOR THIS COMPANY:
      //       ${strategy}

      //       TONE: ${TONES[tone]}

      //       =======================================
      //       STUDY THIS EXAMPLE — THIS IS THE TARGET
      //       =======================================

      //       Subject: LeetCode Knight Top 2% | C++ + Spring Boot | Razorpay

      //       Hi Priya,

      //       Razorpay's payment infra needs engineers who understand both
      //       secure APIs and high-throughput systems — I have built both.

      //       → FastBite: Spring Boot 3.2 + Spring Security 6 + JWT + RBAC
      //         across 15+ REST APIs, price snapshotting, full order lifecycle
      //       → Production C++ systems at Unistring: 5x connection capacity
      //         at sub-50ms latency under real concurrent load
      //       → Redis-compatible KV Store built from scratch in C++:
      //         epoll-driven, lock-free data path, full RESP protocol parser

      //       LeetCode Knight — Top 2% globally (rating 2043). NIT Silchar 2025.

      //       Would you be open to a 15-minute chat about how my background
      //       fits the team at Razorpay?

      //       Amarjeet Kumar Chaurasia
      //       ajchaurasia1214@gmail.com | +91-6204893422
      //       linkedin.com/in/amarjeet-kumar-chaurasia-72a6b9185

      //       =======================================
      //       NOTICE WHAT MAKES THAT EMAIL WORK:
      //       - Opening connects THEIR need to MY skill — not generic praise
      //       - 3 bullets: each has a SPECIFIC number or technical proof
      //       - LeetCode line is ONE sentence — no explanation of what it means
      //       - CTA is ONE sentence — direct, no fluff
      //       - Sign-off has all 3 contact details
      //       =======================================

      //       NOW WRITE A NEW EMAIL FOR ${contact.company} FOLLOWING THE SAME STRUCTURE.

      //       OUTPUT FORMAT — FOLLOW EXACTLY:
      //       Subject: LeetCode Knight Top 2% | C++ + Spring Boot | ${contact.company}

      //       Hi ${contact.name ? contact.name.split(" ")[0] : "there"},

      //       [ONE sentence — connect their industry need to your skill. Bold claim. No flattery.]

      //       → [Achievement 1 with specific number or technical detail]
      //       → [Achievement 2 with specific number or technical detail]
      //       → [Achievement 3 with specific number or technical detail]

      //       [ONE sentence — LeetCode Knight stat + NIT Silchar year. Nothing else.]

      //       Would you be open to a 15-minute chat about how my background fits the team at ${contact.company}?

      //       Amarjeet Kumar Chaurasia
      //       ajchaurasia1214@gmail.com | +91-6204893422
      //       linkedin.com/in/amarjeet-kumar-chaurasia-72a6b9185

      //       =======================================
      //       STRICT RULES — ZERO EXCEPTIONS:
      //       =======================================
      //       1. SUBJECT: Always exactly "LeetCode Knight Top 2% | C++ + Spring Boot | ${contact.company}"
      //       2. GREETING: First name only — "Hi Priya," not "Hi Priya Singh,"
      //       3. OPENING: Bold claim connecting THEIR world to YOUR skill
      //       OPENING LINE FORMULA:
      //       "[Company] + [specific industry fact/scale/problem] +
      //       [your skill as the solution]"

      //   GOOD:  "American Express processes $1.3T annually —
      //           that demands engineers who understand both
      //           secure APIs and low-latency systems."

      //   GOOD:  "Adobe's infrastructure serves 30M+ creatives —
      //           I build the systems-level code that makes
      //           that scale possible."

      //   BAD:   "Adobe delivers cutting-edge products"
      //           — this is about THEM, not connecting THEM to YOU

      //   BAD:   "X demands Y — I build exactly that/both/this"
      //           — this pattern is repeating across emails, vary it

      // - BANNED OPENER PATTERNS:
      //       "I build exactly that"
      //       "I build both"
      //       "I build exactly these"
      //       "[Company] demands X — I build X"
      //       "cutting-edge products"
      //       "seamless solutions"
      //       "integrated solutions"
      //       "I am writing", "My experience involves",
      //         "I am passionate", "resonates with", "reputation for",
      //         "I have always admired", "keen to explore", "excited about"
      //       4. BULLETS: Exactly 3. Use →. Each has a number OR tech detail.
      //         NEVER write achievements in prose paragraphs.
      //         NEVER include the MERN voting platform — it is too junior.
      //       5. AFTER BULLETS: ONE line only.
      //         Format: "LeetCode Knight — Top 2% globally (rating 2043). NIT Silchar 2025."
      //         Do NOT add "which demonstrates" or "proving" or any explanation.
      //       6. CTA: Exactly as shown above. Word for word.
      //       7. SIGN-OFF: Name, then email | phone on same line, then LinkedIn.
      //       8. LENGTH: 130 to 150 words. Count carefully.
      //       9. BANNED PHRASES anywhere in the email:
      //         - "Additionally"
      //         - "Furthermore"
      //         - "My expertise extends to"
      //         - "consistently yielding"
      //         - "utilizing"
      //         - "Leveraging"
      //         - "Elevating"
      //         - "diverse challenges"
      //         - "ideal opportunity"
      //         - "deeply resonates"
      //         - "problem-solving abilities"
      //         - "I am a quick learner"
      //         - Any sentence that could be copy-pasted to a different company
      //       `.trim();

      const promptContent = buildPrompt(
        contact,
        resumeText,
        strategy,
        TONES[tone],
      );

      try {
        const response = await fetch("http://localhost:3001/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [
              {
                role: "user",
                content: promptContent,
              },
            ],
          }),
        });

        if (!response.ok) throw new Error("Server error");

        const result = await response.json();
        const content = result.content[0].text;

        // Extract subject and body
        const lines = content.split("\n");
        const subjectLine =
          lines.find((l) => l.startsWith("Subject:")) ||
          "Subject: Opportunity Inquiry";
        const bodyContent = lines
          .slice(lines.indexOf(subjectLine) + 1)
          .join("\n")
          .trim();

        setEmails((prev) => ({
          ...prev,
          [id]: {
            subject: subjectLine.replace("Subject: ", ""),
            body: bodyContent,
            status: "done",
          },
        }));
      } catch (err) {
        console.error("Failed to generate email for:", contact.company);
        setEmails((prev) => ({ ...prev, [id]: { status: "error" } }));
      }

      setProgress((p) => ({ ...p, done: i + 1 }));
    }
    setGenerating(false);
  };

  // --- EXPORTS ---
  const exportCSV = () => {
    const headers = ["Company", "HR Name", "Email", "Subject", "Body"];

    const rows = Array.from(selected).map((id) => {
      const c = contacts.find((con) => con.id === id);
      const e = emails[id] || {};

      // ✅ FIX 1: Clean the body — replace newlines with a separator
      // Mail merge tools like YAMM read this as one clean cell
      const cleanBody = (e.body || "")
        .replace(/\r\n/g, " | ") // windows newlines
        .replace(/\n/g, " | ") // unix newlines
        .replace(/\r/g, " | ") // carriage returns
        .replace(/"/g, '""') // escape existing quotes
        .trim();

      // ✅ FIX 2: Clean subject too just in case
      const cleanSubject = (e.subject || "")
        .replace(/\r\n/g, " ")
        .replace(/\n/g, " ")
        .replace(/"/g, '""')
        .trim();

      // ✅ FIX 3: Clean company and name too
      const cleanCompany = (c?.company || "").replace(/"/g, '""').trim();
      const cleanName = (c?.name || "").replace(/"/g, '""').trim();
      const cleanEmail = (c?.email || "").replace(/"/g, '""').trim();

      return [cleanCompany, cleanName, cleanEmail, cleanSubject, cleanBody];
    });

    // ✅ FIX 4: Add BOM for Excel to read UTF-8 correctly
    // Without this, Excel shows garbage characters for Indian names
    const BOM = "\uFEFF";

    const csvContent =
      BOM +
      [headers, ...rows]
        .map((row) => row.map((val) => `"${val}"`).join(","))
        .join("\r\n"); // ✅ FIX 5: Use \r\n not \n for proper CSV line endings

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `cold_emails_amarjeet_${
      new Date().toISOString().split("T")[0]
    }.csv`;
    document.body.appendChild(link); // ✅ FIX 6: Append to body first
    link.click();
    document.body.removeChild(link); // ✅ Clean up after click
  };
  // --- RENDER HELPERS ---
  const TabButton = ({ id, label, icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      style={{
        padding: "12px 24px",
        background: activeTab === id ? theme.accent : "transparent",
        color: activeTab === id ? "#fff" : theme.textMuted,
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "600",
        transition: "all 0.3s ease",
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}
    >
      {icon} {label}
    </button>
  );

  return (
    <div
      style={{
        backgroundColor: theme.bg,
        color: theme.text,
        minHeight: "100vh",
        fontFamily: "'Segoe UI', Roboto, sans-serif",
        padding: "20px",
      }}
    >
      {/* HEADER */}
      <header
        style={{
          maxWidth: "1200px",
          margin: "0 auto 30px auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: "24px", color: theme.accent }}>
            🤖 AI Cold Email Agent
          </h1>
          <p style={{ color: theme.textMuted, margin: "5px 0 0 0" }}>
            Built for Amarjeet Kumar Chaurasia
          </p>
        </div>
        <div
          style={{
            display: "flex",
            gap: "10px",
            background: theme.surface,
            padding: "5px",
            borderRadius: "12px",
            border: `1px solid ${theme.border}`,
          }}
        >
          <TabButton id="upload" label="1. Upload" icon="📁" />
          <TabButton id="select" label="2. Select" icon="🎯" />
          <TabButton id="results" label="3. Results" icon="✉️" />
        </div>
      </header>

      <main style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* TAB 1: UPLOAD */}
        {activeTab === "upload" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "30px",
            }}
          >
            <div
              style={{
                background: theme.surface,
                padding: "30px",
                borderRadius: "20px",
                border: `1px solid ${theme.border}`,
              }}
            >
              <h3 style={{ marginTop: 0 }}>Step 1: Upload HR Database</h3>
              <div
                style={{
                  border: `2px dashed ${theme.border}`,
                  padding: "40px",
                  textAlign: "center",
                  borderRadius: "15px",
                  cursor: "pointer",
                  transition: "border-color 0.3s",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.borderColor = theme.accent)
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.borderColor = theme.border)
                }
                onClick={() => document.getElementById("fileInput").click()}
              >
                <span style={{ fontSize: "40px" }}>📄</span>
                <p>Click or drag .xlsx file here</p>
                <input
                  id="fileInput"
                  type="file"
                  accept=".xlsx, .xls"
                  hidden
                  onChange={handleFileUpload}
                />
              </div>
              {contacts.length > 0 && (
                <div
                  style={{
                    marginTop: "20px",
                    color: theme.success,
                    fontWeight: "bold",
                  }}
                >
                  ✅ {contacts.length} contacts loaded successfully!
                </div>
              )}

              <h3 style={{ marginTop: "30px" }}>Step 2: Choose Tone</h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "10px",
                }}
              >
                {Object.entries(TONES).map(([k, v]) => (
                  <button
                    key={k}
                    onClick={() => setTone(k)}
                    style={{
                      padding: "15px",
                      background:
                        tone === k ? "rgba(108, 99, 255, 0.1)" : "transparent",
                      border: `1px solid ${tone === k ? theme.accent : theme.border}`,
                      borderRadius: "10px",
                      color: tone === k ? theme.accent : theme.text,
                      textAlign: "left",
                      cursor: "pointer",
                    }}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            <div
              style={{
                background: theme.surface,
                padding: "30px",
                borderRadius: "20px",
                border: `1px solid ${theme.border}`,
              }}
            >
              <h3 style={{ marginTop: 0 }}>Candidate Profile Summary</h3>
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                style={{
                  width: "100%",
                  height: "350px",
                  background: "rgba(0,0,0,0.2)",
                  color: "#d1d1d1",
                  border: `1px solid ${theme.border}`,
                  borderRadius: "10px",
                  padding: "15px",
                  fontSize: "14px",
                  fontFamily: "monospace",
                  lineHeight: "1.6",
                }}
              />
            </div>
          </div>
        )}

        {/* TAB 2: SELECT */}
        {activeTab === "select" && (
          <div
            style={{
              background: theme.surface,
              padding: "25px",
              borderRadius: "20px",
              border: `1px solid ${theme.border}`,
            }}
          >
            <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
              <input
                placeholder="Search company or HR name..."
                value={searchQ}
                onChange={(e) => setSearchQ(e.target.value)}
                style={{
                  flex: 1,
                  padding: "12px",
                  borderRadius: "8px",
                  border: `1px solid ${theme.border}`,
                  background: "#000",
                  color: "#fff",
                }}
              />
              <select
                value={filterCat}
                onChange={(e) => setFilterCat(e.target.value)}
                style={{
                  padding: "12px",
                  borderRadius: "8px",
                  border: `1px solid ${theme.border}`,
                  background: "#000",
                  color: "#fff",
                }}
              >
                <option value="All">All Categories</option>
                {Object.keys(CATEGORY_COLORS).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <button
                onClick={toggleSelectAll}
                style={{
                  padding: "0 20px",
                  borderRadius: "8px",
                  border: `1px solid ${theme.border}`,
                  background: "transparent",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                {selected.size === filteredContacts.length
                  ? "Deselect All"
                  : "Select All"}
              </button>
            </div>

            <div
              style={{
                maxHeight: "500px",
                overflowY: "auto",
                border: `1px solid ${theme.border}`,
                borderRadius: "10px",
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  tableLayout: "fixed",
                }}
              >
                <thead
                  style={{
                    position: "sticky",
                    top: 0,
                    background: theme.bg,
                    zIndex: 1,
                  }}
                >
                  <tr>
                    <th
                      style={{
                        padding: "15px",
                        textAlign: "left",
                        width: "50px",
                      }}
                    >
                      Select
                    </th>
                    <th
                      style={{
                        padding: "15px",
                        textAlign: "left",
                        width: "22%",
                      }}
                    >
                      Company & HR
                    </th>
                    <th
                      style={{
                        padding: "15px",
                        textAlign: "left",
                        width: "22%",
                      }}
                    >
                      Email
                    </th>
                    <th
                      style={{
                        padding: "15px",
                        textAlign: "left",
                        width: "15%",
                      }}
                    >
                      Category
                    </th>
                    <th
                      style={{
                        padding: "15px",
                        textAlign: "left",
                        width: "12%",
                      }}
                    >
                      Pay
                    </th>
                    <th
                      style={{
                        padding: "15px",
                        textAlign: "left",
                        width: "12%",
                      }}
                    >
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContacts.map((c) => (
                    <tr
                      key={c.id}
                      style={{
                        borderBottom: `1px solid ${theme.border}`,
                        background: selected.has(c.id)
                          ? "rgba(108, 99, 255, 0.05)"
                          : "transparent",
                      }}
                    >
                      <td style={{ padding: "12px 15px" }}>
                        <input
                          type="checkbox"
                          checked={selected.has(c.id)}
                          onChange={() => toggleSelect(c.id)}
                          style={{ width: "18px", height: "18px" }}
                        />
                      </td>
                      <td style={{ padding: "12px 15px" }}>
                        <div style={{ fontWeight: "bold" }}>{c.company}</div>
                        <div
                          style={{ fontSize: "12px", color: theme.textMuted }}
                        >
                          {c.name} • {c.designation}
                        </div>
                      </td>
                      <td style={{ padding: "12px 15px" }}>
                        <div style={{ color: theme.textMuted }}>{c.email}</div>
                      </td>
                      <td style={{ padding: "12px 15px" }}>
                        <span
                          style={{
                            fontSize: "11px",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            background: `${getCategoryColor(c.category)}33`,
                            color: getCategoryColor(c.category),
                            border: `1px solid ${getCategoryColor(c.category)}66`,
                          }}
                        >
                          {c.category}
                        </span>
                      </td>
                      <td
                        style={{ padding: "12px 15px", color: theme.textMuted }}
                      >
                        {c.pay}
                      </td>
                      <td style={{ padding: "12px 15px" }}>
                        {emails[c.id]?.status === "done"
                          ? "✅ Generated"
                          : "⏳ Pending"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div
              style={{
                marginTop: "20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ color: theme.textMuted }}>
                {selected.size} contacts selected
              </div>
              <button
                onClick={() => setActiveTab("results")}
                style={{
                  background: theme.accent,
                  color: "#fff",
                  padding: "15px 40px",
                  border: "none",
                  borderRadius: "10px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Proceed to Generation ⚡
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: RESULTS */}
        {activeTab === "results" && (
          <div>
            <div
              style={{
                background: theme.surface,
                padding: "25px",
                borderRadius: "20px",
                border: `1px solid ${theme.border}`,
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <h3 style={{ margin: 0 }}>Ready to Generate</h3>
                  <p
                    style={{
                      color: theme.textMuted,
                      fontSize: "14px",
                      margin: "5px 0 0 0",
                    }}
                  >
                    {selected.size} contacts selected for AI personalization.
                  </p>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  {!generating ? (
                    <button
                      onClick={generateEmails}
                      style={{
                        background: theme.success,
                        color: "#fff",
                        padding: "12px 24px",
                        border: "none",
                        borderRadius: "8px",
                        fontWeight: "bold",
                        cursor: "pointer",
                      }}
                    >
                      ⚡ Start AI Generation
                    </button>
                  ) : (
                    <button
                      onClick={() => (abortRef.current = true)}
                      style={{
                        background: theme.error,
                        color: "#fff",
                        padding: "12px 24px",
                        border: "none",
                        borderRadius: "8px",
                        fontWeight: "bold",
                        cursor: "pointer",
                      }}
                    >
                      🛑 Stop Generation
                    </button>
                  )}
                  <button
                    onClick={exportCSV}
                    style={{
                      background: "transparent",
                      border: `1px solid ${theme.accent}`,
                      color: theme.accent,
                      padding: "12px 24px",
                      borderRadius: "8px",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                  >
                    📤 Export CSV
                  </button>
                </div>
              </div>

              {generating && (
                <div style={{ marginTop: "25px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "8px",
                      fontSize: "14px",
                    }}
                  >
                    <span>
                      Progress: {progress.done} / {progress.total}
                    </span>
                    <span>
                      {Math.round((progress.done / progress.total) * 100)}%
                    </span>
                  </div>
                  <div
                    style={{
                      width: "100%",
                      height: "10px",
                      background: theme.bg,
                      borderRadius: "5px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${(progress.done / progress.total) * 100}%`,
                        height: "100%",
                        background: `linear-gradient(90deg, ${theme.accent}, ${theme.success})`,
                        transition: "width 0.3s ease",
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Email Result Cards */}
            {/* Email Result Cards */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: "15px",
              }}
            >
              {Array.from(selected)
                .reverse()
                .map((id) => {
                  const c = contacts.find((con) => con.id === id);
                  const e = emails[id];
                  if (!e) return null;

                  return (
                    <div
                      key={id}
                      style={{
                        background: theme.surface,
                        border: `1px solid ${e.status === "error" ? theme.error : theme.border}`,
                        borderRadius: "12px",
                        overflow: "hidden",
                        opacity: e.status === "done" ? 1 : 0.7,
                        textAlign: "left", // Force container-level left alignment
                      }}
                    >
                      <div
                        style={{
                          padding: "15px",
                          borderBottom: `1px solid ${theme.border}`,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center", // Vertical centering for icon/text
                            textAlign: "left",
                            gap: "12px",
                          }}
                        >
                          <span style={{ fontSize: "20px" }}>🏢</span>
                          <div>
                            <div
                              style={{ fontWeight: "bold", textAlign: "left" }}
                            >
                              {c.company} — {c.name}
                            </div>
                            <div
                              style={{
                                fontSize: "12px",
                                color: theme.textMuted,
                                textAlign: "left",
                              }}
                            >
                              {c.email}
                            </div>
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: "10px" }}>
                          <button
                            onClick={() =>
                              navigator.clipboard.writeText(e.body)
                            }
                            style={{
                              background: "rgba(255,255,255,0.05)",
                              border: "none",
                              color: "#fff",
                              padding: "6px 12px",
                              borderRadius: "5px",
                              cursor: "pointer",
                              fontSize: "12px",
                            }}
                          >
                            📋 Copy
                          </button>
                          <button
                            onClick={() =>
                              openInGmail(c.email, e.subject, e.body)
                            }
                            style={{
                              background: theme.accent,
                              color: "#fff",
                              padding: "6px 12px",
                              borderRadius: "5px",
                              fontSize: "12px",
                              border: "none",
                              cursor: "pointer",
                            }}
                          >
                            📤 Open in Gmail
                          </button>
                        </div>
                      </div>
                      <div style={{ padding: "20px", textAlign: "left" }}>
                        <div
                          style={{
                            fontWeight: "bold",
                            marginBottom: "10px",
                            color: theme.accent,
                            textAlign: "left",
                          }}
                        >
                          Subject: {e.subject}
                        </div>
                        <pre
                          style={{
                            whiteSpace: "pre-wrap",
                            fontFamily: "inherit",
                            fontSize: "14px",
                            color: "#ccc",
                            margin: 0,
                            lineHeight: "1.6",
                            textAlign: "left", // Ensures the email body stays left
                          }}
                        >
                          {e.body}
                        </pre>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </main>

      <footer
        style={{
          maxWidth: "1200px",
          margin: "50px auto 20px auto",
          padding: "20px",
          borderTop: `1px solid ${theme.border}`,
          textAlign: "center",
          color: theme.textMuted,
          fontSize: "14px",
        }}
      >
        <p>
          Engineered with ❤️ for Software Engineers looking for the next big
          leap.
        </p>
      </footer>
    </div>
  );
}
